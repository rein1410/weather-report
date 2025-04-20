import { vi } from 'vitest';

// Mock the fetch function globally
vi.stubGlobal('fetch', vi.fn());

// Mock the environment variables
vi.stubEnv('BACKEND_URL', 'http://localhost:8080');

// Mock the console.error to avoid cluttering test output
console.error = vi.fn(); 