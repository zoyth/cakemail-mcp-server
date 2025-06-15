# Error Handling Guide

The Cakemail MCP Server implements comprehensive error handling that matches the OpenAPI specification, providing detailed error information and type-safe error handling.

## Error Types

All Cakemail API errors extend the base `CakemailError` class and include specific error types for different HTTP status codes:

### Base Error Class
- **`CakemailError`** - Base class for all Cakemail API errors
  - Properties: `statusCode`, `message`, `response`

### Specific Error Types

- **`CakemailAuthenticationError`** (401) - Authentication failed
- **`CakemailBadRequestError`** (400) - Bad request with detailed error message
- **`CakemailValidationError`** (422) - Validation failed with field-specific errors
- **`CakemailForbiddenError`** (403) - Insufficient permissions
- **`CakemailNotFoundError`** (404) - Resource not found
- **`CakemailConflictError`** (409) - Resource conflict
- **`CakemailRateLimitError`** (429) - Rate limit exceeded with retry information
- **`CakemailServerError`** (500+) - Server-side errors
- **`CakemailNetworkError`** (0) - Network connectivity issues

## MCP Server Error Responses

The MCP server provides enhanced error messages with emojis and helpful guidance:

- 🔐 **Authentication Error** - Check credentials
- ❌ **Validation Error** - Lists specific field issues
- 🔍 **Not Found** - Verify resource IDs
- ⏱️ **Rate Limit** - Includes retry timing
- ❌ **API Error** - Shows status code and details

## Error Handling Examples

### Basic Error Handling
```typescript
try {
  const campaign = await api.createCampaign(campaignData);
  console.log('Success:', campaign.data);
} catch (error) {
  if (error instanceof CakemailValidationError) {
    // Handle validation errors
    error.validationErrors.forEach(err => {
      console.error(`${err.loc.join('.')}: ${err.msg}`);
    });
  } else if (error instanceof CakemailRateLimitError) {
    // Handle rate limiting
    console.log(`Retry after ${error.retryAfter} seconds`);
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

### Validation Error Handling
```typescript
try {
  await api.createContact(contactData);
} catch (error) {
  if (error instanceof CakemailValidationError) {
    // Get all email field errors
    const emailErrors = error.getFieldErrors('email');
    if (emailErrors.length > 0) {
      console.log('Email validation issues:', emailErrors);
    }
    
    // Get all validation errors formatted
    console.log('All validation errors:', error.validationErrors);
  }
}
```

### Rate Limit Handling with Retry
```typescript
async function createWithRetry(data: any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await api.createCampaign(data);
    } catch (error) {
      if (error instanceof CakemailRateLimitError && attempt < maxRetries) {
        const delay = error.retryAfter || Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // Re-throw if not rate limit or max retries reached
    }
  }
}
```

### Authentication Error Handling
```typescript
try {
  const result = await api.healthCheck();
} catch (error) {
  if (error instanceof CakemailAuthenticationError) {
    console.error('Please check your CAKEMAIL_USERNAME and CAKEMAIL_PASSWORD');
    console.error('Error details:', error.message);
  }
}
```

## Benefits

1. **Type Safety** - Catch specific error types with TypeScript
2. **Detailed Information** - Access structured error data
3. **Better UX** - User-friendly error messages in MCP tools
4. **OpenAPI Compliance** - Matches API specification exactly
5. **Production Ready** - Proper error handling for production apps

## Migration from Generic Errors

If you were previously using generic error handling:

```typescript
// Before (generic)
try {
  await api.createCampaign(data);
} catch (error) {
  console.error('Error:', error.message);
}

// After (type-safe)
try {
  await api.createCampaign(data);
} catch (error) {
  if (error instanceof CakemailValidationError) {
    // Handle validation specifically
  } else if (error instanceof CakemailRateLimitError) {
    // Handle rate limits specifically
  } else if (error instanceof CakemailError) {
    // Handle other API errors
    console.error(`API Error ${error.statusCode}: ${error.message}`);
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

The new error handling is backward compatible - existing code will continue to work, but you can now opt into more specific error handling for better user experience.
