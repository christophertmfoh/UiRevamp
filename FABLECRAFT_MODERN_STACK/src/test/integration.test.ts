import { describe, it, expect } from 'vitest';
import { server } from './mocks/server';

describe('Integration Test', () => {
  it('should import MSW server successfully', () => {
    expect(server).toBeDefined();
  });

  it('should perform basic calculations', () => {
    expect(2 + 2).toBe(4);
  });
});
