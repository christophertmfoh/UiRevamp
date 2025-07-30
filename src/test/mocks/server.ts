import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * MSW Server Setup for Node.js Test Environment
 *
 * This creates a mock server that intercepts HTTP requests during tests.
 * The server uses the handlers defined in handlers.ts to provide mock responses.
 *
 * Usage: Import { server } from './mocks/server' in test setup files.
 */
export const server = setupServer(...handlers);