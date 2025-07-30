import { http, HttpResponse } from 'msw';

export const handlers = [
  // Health check endpoint
  http.get('http://localhost/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: Date.now(),
      version: '1.0.0',
    });
  }),

  // User profile endpoint
  http.get('http://localhost/api/user/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id: Number(id),
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
  }),

  // Error simulation endpoint
  http.get('http://localhost/api/error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),
];