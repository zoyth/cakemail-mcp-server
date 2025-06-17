// Simple mock utilities for testing
export const createMockResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: async () => data,
  text: async () => JSON.stringify(data),
  headers: new Map([['content-type', 'application/json']]),
});

// Mock Cakemail API responses
export const mockCakemailResponses = {
  healthCheck: { status: 'healthy', timestamp: new Date().toISOString() },
  senders: {
    data: [
      { id: '1', name: 'Test Sender', email: 'test@example.com' }
    ]
  },
  campaigns: {
    data: [
      { id: '1', name: 'Test Campaign', status: 'draft' }
    ]
  },
  email: {
    id: 'email-123',
    status: 'queued',
    created_at: new Date().toISOString()
  }
};
