import { http, HttpResponse } from 'msw';

export const handlers = [
  // Add your API mock handlers here
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' });
  }),
];