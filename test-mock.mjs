// Quick test runner to check if our mocking is working
import { jest } from '@jest/globals';

console.log('Testing mock setup...');

// Set up mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Test that fetch is mocked
mockFetch.mockResolvedValueOnce({
  ok: true,
  status: 200,
  statusText: 'OK',
  headers: {
    get: (key) => key === 'content-type' ? 'application/json' : null
  },
  json: async () => ({ data: 'test' }),
  text: async () => JSON.stringify({ data: 'test' })
});

// Test the mock
async function testMock() {
  try {
    const response = await fetch('https://test.com');
    const data = await response.json();
    console.log('Mock test successful:', data);
    console.log('Fetch was called:', mockFetch.mock.calls.length, 'times');
  } catch (error) {
    console.error('Mock test failed:', error);
  }
}

testMock();
