import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Define request handlers for mocking API calls
const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      },
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      user: {
        id: '2',
        email: 'newuser@example.com',
        name: 'New User',
      },
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  // User endpoints
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      avatar: null,
      createdAt: '2024-01-01T00:00:00Z',
    });
  }),

  // Characters endpoints
  http.get('/api/characters', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Test Character',
        description: 'A character for testing',
        traits: ['brave', 'intelligent'],
        createdAt: '2024-01-01T00:00:00Z',
      },
    ]);
  }),

  http.post('/api/characters', () => {
    return HttpResponse.json({
      id: '2',
      name: 'New Character',
      description: 'A newly created character',
      traits: ['mysterious'],
      createdAt: new Date().toISOString(),
    });
  }),

  // Error handlers for testing error scenarios
  http.get('/api/error/500', () => {
    return new HttpResponse(null, { status: 500 });
  }),

  http.get('/api/error/404', () => {
    return new HttpResponse(null, { status: 404 });
  }),

  http.get('/api/error/401', () => {
    return new HttpResponse(null, { status: 401 });
  }),
];

// Setup MSW server
export const server = setupServer(...handlers);

// Helper functions for test scenarios
export const mockSuccessfulLogin = () => {
  server.use(
    http.post('/api/auth/login', () => {
      return HttpResponse.json({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
        token: 'mock-jwt-token',
      });
    })
  );
};

export const mockFailedLogin = () => {
  server.use(
    http.post('/api/auth/login', () => {
      return HttpResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    })
  );
};

export const mockNetworkError = () => {
  server.use(
    http.post('/api/auth/login', () => {
      return HttpResponse.error();
    })
  );
};

export const mockSlowResponse = (delay: number = 2000) => {
  server.use(
    http.get('/api/characters', async () => {
      await new Promise(resolve => setTimeout(resolve, delay));
      return HttpResponse.json([]);
    })
  );
};

// Export handlers for individual test customization
export { handlers };