import { http, HttpResponse } from 'msw';

/**
 * MSW Request Handlers
 * 
 * Mock API endpoints for testing and development.
 * This file contains mock responses for HTTP requests made during tests.
 * 
 * Version: MSW 2.8.1
 */

export const handlers = [
  // Health check endpoint
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: Date.now(),
      version: '1.0.0',
    });
  }),

  // User authentication endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock successful login
    return HttpResponse.json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: body.email,
        name: 'Test User',
      },
    });
  }),

  // User profile endpoint
  http.get('/api/user/:id', ({ params }) => {
    const { id } = params;
    
    return HttpResponse.json({
      id: Number(id),
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
  }),

  // Generic data endpoint for testing
  http.get('/api/data', () => {
    return HttpResponse.json({
      items: [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 },
      ],
      total: 3,
    });
  }),

  // POST endpoint for data creation
  http.post('/api/data', async ({ request }) => {
    const body = await request.json() as { name: string; value: number };
    
    return HttpResponse.json({
      id: Math.random(),
      name: body.name,
      value: body.value,
      createdAt: new Date().toISOString(),
    }, { status: 201 });
  }),

  // Error simulation endpoint
  http.get('/api/error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),
];