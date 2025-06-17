# Advanced Features & Production Configuration

This document covers the advanced features and production-ready capabilities of the Cakemail MCP Server, including error handling, retry logic, rate limiting, and security configurations.

## 🚀 Production Features Overview

The Cakemail MCP Server includes enterprise-grade features for production deployments:

- **Retry Logic**: Exponential backoff with jitter
- **Rate Limiting**: Token bucket algorithm with burst capability
- **Circuit Breaker**: Automatic failure detection and recovery
- **Error Handling**: Comprehensive error types with detailed messages
- **Security**: OAuth 2.0 with refresh tokens and input validation
- **Monitoring**: Health checks and performance diagnostics

---

## 🔄 Retry Logic & Rate Limiting

### Configuration

```typescript
import { CakemailAPI, EnhancedCakemailConfig } from 'cakemail-mcp-server';

const config: EnhancedCakemailConfig = {
  username: 'your-username',
  password: 'your-password',
  
  // Retry configuration
  retry: {
    maxRetries: 3,           // Maximum retry attempts
    baseDelay: 1000,         // Base delay in milliseconds
    maxDelay: 30000,         // Maximum delay cap
    exponentialBase: 2,      // Exponential backoff multiplier
    jitter: true            // Add randomization to delays
  },
  
  // Rate limiting
  rateLimit: {
    enabled: true,
    maxRequestsPerSecond: 10,  // Requests per second limit
    burstLimit: 20,           // Maximum burst capacity
    respectServerLimits: true  // Respect server Retry-After headers
  },
  
  // Request timeout
  timeout: 30000,  // 30 seconds
  
  // Concurrency control
  maxConcurrentRequests: 5,
  
  // Circuit breaker
  circuitBreaker: {
    enabled: true,
    failureThreshold: 5,    // Failures before opening circuit
    resetTimeout: 60000     // Time before attempting recovery
  }
};

const api = new CakemailAPI(config);
```

### Preset Configurations

#### High Throughput (Batch Operations)
```typescript
const highThroughputConfig: EnhancedCakemailConfig = {
  username: process.env.CAKEMAIL_USERNAME!,
  password: process.env.CAKEMAIL_PASSWORD!,
  
  retry: {
    maxRetries: 5,
    baseDelay: 500,
    maxDelay: 10000,
    exponentialBase: 1.5,
    jitter: true
  },
  
  rateLimit: {
    enabled: true,
    maxRequestsPerSecond: 20,
    burstLimit: 50
  },
  
  timeout: 15000,
  maxConcurrentRequests: 10
};
```

#### Conservative (Critical Operations)
```typescript
const conservativeConfig: EnhancedCakemailConfig = {
  username: process.env.CAKEMAIL_USERNAME!,
  password: process.env.CAKEMAIL_PASSWORD!,
  
  retry: {
    maxRetries: 7,
    baseDelay: 2000,
    maxDelay: 60000,
    exponentialBase: 2.5,
    jitter: true
  },
  
  rateLimit: {
    enabled: true,
    maxRequestsPerSecond: 5,
    burstLimit: 10
  },
  
  timeout: 60000,
  maxConcurrentRequests: 3
};
```

### MCP Tools for Configuration

- **`cakemail_get_retry_config`** - View current retry settings
- **`cakemail_get_circuit_breaker_status`** - Monitor circuit breaker state
- **`cakemail_get_request_queue_stats`** - View request queue statistics

---

## 🛡️ Comprehensive Error Handling

### Error Types

All Cakemail API errors extend the base `CakemailError` class:

- **`CakemailAuthenticationError`** (401) - Authentication failed
- **`CakemailBadRequestError`** (400) - Bad request with detailed message
- **`CakemailValidationError`** (422) - Validation failed with field-specific errors
- **`CakemailForbiddenError`** (403) - Insufficient permissions
- **`CakemailNotFoundError`** (404) - Resource not found
- **`CakemailConflictError`** (409) - Resource conflict
- **`CakemailRateLimitError`** (429) - Rate limit exceeded with retry information
- **`CakemailServerError`** (500+) - Server-side errors
- **`CakemailNetworkError`** (0) - Network connectivity issues

### Error Handling Examples

#### Basic Error Handling
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

#### Rate Limit Handling with Retry
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

### MCP Server Error Responses

The MCP server provides enhanced error messages:

- 🔐 **Authentication Error** - Check credentials
- ❌ **Validation Error** - Lists specific field issues
- 🔍 **Not Found** - Verify resource IDs
- ⏱️ **Rate Limit** - Includes retry timing
- ❌ **API Error** - Shows status code and details

---

## 🔐 Security Features

### OAuth 2.0 Authentication

- **Automatic token refresh**: Seamless renewal of expired tokens
- **Secure storage**: Tokens stored securely in memory
- **Error handling**: Clear authentication error messages
- **Credential validation**: Input validation for usernames and passwords

### Input Validation & Sanitization

- **Email validation**: RFC-compliant email format checking
- **Parameter validation**: Type checking and format validation
- **SQL injection prevention**: Input sanitization for all parameters
- **XSS protection**: Output encoding for displayed data

### Security Best Practices

```typescript
// Secure configuration
const secureConfig = {
  username: process.env.CAKEMAIL_USERNAME,  // Use environment variables
  password: process.env.CAKEMAIL_PASSWORD,  // Never hardcode credentials
  
  // Enable all security features
  validateInput: true,
  sanitizeOutput: true,
  enableRateLimiting: true,
  respectServerLimits: true
};
```

---

## 📊 Monitoring & Diagnostics

### Health Monitoring

```typescript
// Check API health
const health = await api.healthCheck();
console.log(`Status: ${health.status}`);
console.log(`Authenticated: ${health.authenticated}`);

// Monitor circuit breaker
const circuitState = api.getCircuitBreakerState();
console.log(`Circuit: ${circuitState.state}`);
console.log(`Failures: ${circuitState.failures}`);

// Monitor request queue
const queueStats = api.getRequestQueueStats();
console.log(`Active: ${queueStats.active}`);
console.log(`Queued: ${queueStats.queued}`);
```

### Performance Monitoring

- **Response times**: Track API response times
- **Success rates**: Monitor request success/failure rates
- **Queue depth**: Monitor request queue for bottlenecks
- **Circuit breaker state**: Track service availability
- **Retry patterns**: Monitor retry attempts and success rates

---

## 🏭 Production Deployment

### Environment Configuration

```bash
# Required environment variables
CAKEMAIL_USERNAME=your-email@example.com
CAKEMAIL_PASSWORD=your-secure-password
CAKEMAIL_BASE_URL=https://api.cakemail.dev

# Optional production settings
CAKEMAIL_MAX_RETRIES=5
CAKEMAIL_RATE_LIMIT=10
CAKEMAIL_TIMEOUT=30000
CAKEMAIL_MAX_CONCURRENT=5
```

### Performance Optimization

#### Scaling Guidelines
- **Adjust `maxConcurrentRequests`** based on server capacity
- **Set `maxRequestsPerSecond`** to stay within API limits
- **Configure `circuitBreaker.failureThreshold`** for error tolerance
- **Use conservative settings** for critical operations

#### Cost Optimization
- **Balance retry attempts** with cost implications
- **Use rate limiting** to avoid quota overruns
- **Monitor actual request patterns** to optimize settings
- **Implement request batching** where possible

### High Availability Setup

```typescript
const haConfig: EnhancedCakemailConfig = {
  // Aggressive retry for high availability
  retry: {
    maxRetries: 7,
    baseDelay: 1000,
    maxDelay: 60000,
    exponentialBase: 2,
    jitter: true
  },
  
  // Conservative rate limiting
  rateLimit: {
    enabled: true,
    maxRequestsPerSecond: 8,
    burstLimit: 15,
    respectServerLimits: true
  },
  
  // Circuit breaker for failover
  circuitBreaker: {
    enabled: true,
    failureThreshold: 3,
    resetTimeout: 30000
  },
  
  // Extended timeout for reliability
  timeout: 45000,
  maxConcurrentRequests: 3
};
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Authentication Errors
```bash
# Check credentials
"Check my Cakemail API health status"

# Verify environment variables
echo $CAKEMAIL_USERNAME
echo $CAKEMAIL_PASSWORD
```

#### Rate Limiting Issues
```typescript
// Monitor rate limiting
const queueStats = api.getRequestQueueStats();
if (queueStats.queued > 10) {
  console.log('High queue depth - consider reducing request rate');
}
```

#### Circuit Breaker Activation
```typescript
// Check circuit breaker status
const circuitState = api.getCircuitBreakerState();
if (circuitState.state === 'OPEN') {
  console.log('Circuit breaker open - service temporarily unavailable');
  console.log(`Wait ${circuitState.resetTimeout}ms before retry`);
}
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=mcp:* npm start

# Test with MCP inspector
npm run inspector

# Validate configuration
npm run validate
```

### Performance Debugging

```typescript
// Monitor performance
setInterval(() => {
  const stats = api.getRequestQueueStats();
  const circuit = api.getCircuitBreakerState();
  
  console.log(`Queue: ${stats.active} active, ${stats.queued} queued`);
  console.log(`Circuit: ${circuit.state}, failures: ${circuit.failures}`);
}, 5000);
```

---

## 📚 Best Practices

### Configuration Guidelines

1. **Start conservative**: Begin with lower rates and increase as needed
2. **Monitor metrics**: Track success rates and response times
3. **Test under load**: Validate configuration with realistic traffic
4. **Plan for failures**: Configure appropriate retry and circuit breaker settings
5. **Security first**: Always use environment variables for credentials

### Error Handling Best Practices

1. **Catch specific errors**: Handle different error types appropriately
2. **Log comprehensively**: Include context and error details in logs
3. **Fail gracefully**: Provide meaningful fallbacks for users
4. **Monitor patterns**: Track error rates and types over time
5. **Alert appropriately**: Set up monitoring for critical failures

### Performance Best Practices

1. **Batch operations**: Group multiple requests when possible
2. **Use pagination**: Handle large datasets efficiently
3. **Cache strategically**: Cache frequently accessed, slow-changing data
4. **Monitor queues**: Watch for bottlenecks and adjust accordingly
5. **Plan capacity**: Size concurrent requests based on infrastructure

This advanced configuration enables the Cakemail MCP Server to handle production workloads with enterprise-grade reliability, security, and performance.
