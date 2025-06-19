# Unified Pagination System for Cakemail API

## Overview

The unified pagination system solves the inconsistent pagination handling across different Cakemail API endpoints by providing a single, consistent interface that automatically adapts to different pagination strategies.

## Problem Solved

**Before**: Different endpoints used inconsistent pagination approaches:
- Some used `page`/`per_page` parameters (offset-based)
- Others used `cursor` parameters (cursor-based)
- No unified interface
- Code duplication across API clients

**After**: Single unified system that:
- ✅ Automatically detects pagination strategy per endpoint
- ✅ Provides consistent developer experience
- ✅ Supports automatic iteration through all pages
- ✅ Includes error handling and retry logic
- ✅ Memory-efficient streaming for large datasets
- ✅ Maintains backward compatibility

## Quick Start

### Basic Pagination

```typescript
import { CakemailAPI } from './cakemail-api.js';

const api = new CakemailAPI({ username: 'user', password: 'pass' });

// Get first page of campaigns
const result = await api.campaigns.getCampaignsPaginated(
  { page: 1, per_page: 20 },
  { status: 'sent' }
);

console.log(`Found ${result.data.length} campaigns`);
console.log(`Has more pages: ${result.pagination.has_more}`);
```

### Automatic Iteration

```typescript
// Iterate through all contacts automatically
const contactsIterator = api.contacts.getContactsIterator('123');

for await (const contact of contactsIterator) {
  console.log(`Processing: ${contact.email}`);
}
```

### Batch Processing

```typescript
// Process contacts in batches
await api.contacts.processContactsInBatches(
  '123', // list ID
  async (contacts) => {
    console.log(`Processing ${contacts.length} contacts`);
    // Your batch processing logic here
  },
  { per_page: 50 }
);
```

## API Reference

### New Methods Added to API Clients

#### Campaigns API
- `getCampaignsPaginated(options, filters)` - Get campaigns with unified pagination
- `getCampaignsIterator(options, filters)` - Iterator for automatic pagination
- `getAllCampaigns(options, filters)` - Get all campaigns with automatic pagination
- `processCampaignsInBatches(processor, options, filters)` - Process in batches

#### Contacts API
- `getContactsPaginated(listId, options, filters)` - Get contacts with unified pagination
- `getContactsIterator(listId, options, filters)` - Iterator for automatic pagination
- `getAllContacts(listId, options, filters)` - Get all contacts with automatic pagination
- `processContactsInBatches(listId, processor, options, filters)` - Process in batches

#### Lists API
- `getListsPaginated(options, filters)` - Get lists with unified pagination
- `getListsIterator(options, filters)` - Iterator for automatic pagination
- `getAllLists(options, filters)` - Get all lists with automatic pagination

### Options and Types

#### UnifiedPaginationOptions
```typescript
interface UnifiedPaginationOptions {
  // Offset-based pagination
  page?: number;
  per_page?: number;
  with_count?: boolean;
  
  // Cursor-based pagination
  cursor?: string;
  before?: string;
  after?: string;
  
  // Common options
  limit?: number;
  maxResults?: number;
}
```

#### IteratorOptions
```typescript
interface IteratorOptions extends UnifiedPaginationOptions {
  batchSize?: number;
  concurrency?: number;
  retryAttempts?: number;
}
```

## Advanced Usage

### Error Handling and Retries

```typescript
const iterator = api.campaigns.getCampaignsIterator(
  {
    retryAttempts: 3,
    per_page: 20
  },
  { status: 'sent' }
);

try {
  for await (const campaign of iterator) {
    // Process campaign
  }
} catch (error) {
  console.error('Pagination failed:', error);
}
```

### Memory-Efficient Processing

```typescript
// Process large datasets without loading everything into memory
const iterator = api.contacts.getContactsIterator('123', { per_page: 100 });

for await (const contact of iterator) {
  // Process one contact at a time
  await processContact(contact);
}
```

### Concurrent Processing

```typescript
// Process multiple lists concurrently
const listIds = ['123', '456', '789'];
const results = await Promise.all(
  listIds.map(async (listId) => {
    const contacts = await api.contacts.getAllContacts(listId);
    return { listId, count: contacts.length };
  })
);
```

### Custom Filtering and Validation

```typescript
const iterator = api.contacts.getContactsIterator('123');

// Filter contacts with custom logic
const validContacts = await iterator.filter(async (contact) => {
  return contact.email && contact.email.includes('@');
});

// Map to extract specific fields
const emails = await iterator.map(contact => contact.email);

// Find specific contact
const found = await iterator.find(contact => contact.name === 'John');
```

### Statistics and Monitoring

```typescript
const iterator = api.campaigns.getCampaignsIterator();
const stats = await iterator.getStats();

console.log('Pagination Statistics:', {
  totalItems: stats.totalItems,
  totalBatches: stats.totalBatches,
  averageBatchSize: stats.averageBatchSize,
  strategy: stats.strategy
});
```

## Migration Guide

### From Legacy Methods

**Old Way (still works but deprecated):**
```typescript
const campaigns = await api.campaigns.getCampaigns({
  page: 1,
  per_page: 10,
  sort: 'created_on',
  order: 'desc'
});
```

**New Way:**
```typescript
const campaigns = await api.campaigns.getCampaignsPaginated(
  { page: 1, per_page: 10 },
  { sort: 'created_on', order: 'desc' }
);
```

### Benefits of Migration

1. **Consistent Interface**: Same API across all endpoints
2. **Better Error Handling**: Built-in retry logic and validation
3. **Automatic Iteration**: No more manual pagination loops
4. **Memory Efficiency**: Stream large datasets without memory issues
5. **Type Safety**: Full TypeScript support with proper typing

## Configuration

### Endpoint Configuration

The system automatically detects the correct pagination strategy for each endpoint:

```typescript
// Offset-based (most endpoints)
- campaigns: page/per_page
- contacts: page/per_page  
- lists: page/per_page
- templates: page/per_page

// Cursor-based (logs endpoints)
- logs: cursor
- campaign_logs: cursor
```

### Custom Endpoint Registration

```typescript
import { PaginationFactory, PaginationStrategy } from './utils/pagination';

// Register a custom endpoint
PaginationFactory.registerEndpoint('custom_endpoint', {
  strategy: PaginationStrategy.CURSOR,
  default_limit: 25,
  max_limit: 100,
  cursor_param: 'next_cursor'
});
```

## Performance Considerations

### Memory Usage
- Iterators process items one by one or in small batches
- No need to load entire datasets into memory
- Configurable batch sizes for optimal performance

### API Rate Limiting
- Built-in retry logic with exponential backoff
- Respects API rate limits automatically
- Configurable retry attempts and delays

### Concurrency Control
- Supports concurrent processing of multiple iterators
- Configurable concurrency limits
- Automatic error isolation between concurrent operations

## Error Handling

### Built-in Retry Logic
```typescript
const iterator = api.contacts.getContactsIterator('123', {
  retryAttempts: 3 // Will retry failed requests up to 3 times
});
```

### Custom Error Handling
```typescript
const iterator = api.campaigns.getCampaignsIterator({
  onError: (error, attempt) => {
    console.warn(`Attempt ${attempt} failed:`, error.message);
  },
  validateResponse: (response) => {
    return response && Array.isArray(response.data);
  }
});
```

### Graceful Degradation
- Failed individual requests don't stop the entire iteration
- Partial results are still returned when possible
- Clear error messages with context

## Examples

See `src/examples/pagination-examples.ts` for comprehensive usage examples covering:
- Manual pagination with navigation
- Automatic iteration
- Batch processing
- Error handling
- Memory-efficient processing
- Concurrent operations
- Statistics and monitoring

## Testing

Run the pagination tests:
```bash
npm test -- tests/pagination.test.ts
```

The test suite covers:
- All pagination strategies (offset, cursor, token)
- Error handling and retry logic
- Iterator functionality
- Edge cases and malformed responses
- Integration with API clients

## Backward Compatibility

All existing methods continue to work unchanged. The new unified system is added alongside legacy methods, which are marked as deprecated but remain functional.

This allows for gradual migration:
1. Start using new methods for new code
2. Gradually migrate existing code when convenient
3. Eventually remove legacy methods in a future major version

## Future Enhancements

Planned improvements include:
- Rate limiting integration
- Response caching
- Real-time pagination updates
- GraphQL cursor pagination support
- Performance metrics and monitoring
- Parallel pagination for multiple endpoints
