import { describe, it, expect } from 'vitest';
import { server } from './mocks/server';

describe('MSW Integration Test', () => {
  it('should mock API responses correctly', async () => {
    // Test that our MSW server is running
    expect(server).toBeDefined();
    
    // Test a basic fetch request that should be intercepted by MSW
    const response = await fetch('/api/health');
    const data = await response.json();
    
    expect(response.ok).toBe(true);
    expect(data.status).toBe('ok');
    expect(data.version).toBe('1.0.0');
    expect(typeof data.timestamp).toBe('number');
  });

  it('should handle error responses', async () => {
    const response = await fetch('/api/error');
    const data = await response.json();
    
    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should validate TypeScript types', async () => {
    // Test TypeScript integration
    const response = await fetch('/api/user/123');
    const user = await response.json();
    
    expect(response.ok).toBe(true);
    expect(user.id).toBe(123);
    expect(typeof user.name).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(user.role).toBe('user');
    expect(typeof user.createdAt).toBe('string');
  });
});