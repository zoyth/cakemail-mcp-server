// Example usage of Cakemail API with advanced retry and rate limiting

import { 
  CakemailAPI, 
  EnhancedCakemailConfig,
  CakemailRateLimitError,
  CakemailError,
  RetryConfig,
  RateLimitConfig
} from '../cakemail-api.js';

// Example 1: Basic configuration with retry and rate limiting
const basicConfig: EnhancedCakemailConfig = {
  username: process.env.CAKEMAIL_USERNAME!,
  password: process.env.CAKEMAIL_PASSWORD!,
  debug: true,
  
  // Retry configuration
  retry: {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    exponentialBase: 2,
    jitter: true
  },
  
  // Rate limiting configuration
  rateLimit: {
    enabled: true,
    maxRequestsPerSecond: 10,
    burstLimit: 20,
    respectServerLimits: true
  },
  
  // Request timeout
  timeout: 30000,
  
  // Maximum concurrent requests
  maxConcurrentRequests: 5,
  
  // Circuit breaker configuration
  circuitBreaker: {
    enabled: true,
    failureThreshold: 5,
    resetTimeout: 60000
  }
};

// Example 2: High-throughput configuration for batch operations
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
    burstLimit: 50,
    respectServerLimits: true
  },
  
  timeout: 15000,
  maxConcurrentRequests: 10,
  
  circuitBreaker: {
    enabled: true,
    failureThreshold: 10,
    resetTimeout: 30000
  }
};

// Example 3: Conservative configuration for critical operations
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
    burstLimit: 10,
    respectServerLimits: true
  },
  
  timeout: 60000,
  maxConcurrentRequests: 3,
  
  circuitBreaker: {
    enabled: true,
    failureThreshold: 3,
    resetTimeout: 120000
  }
};

// Example usage functions
export class CakemailExamples {
  private api: CakemailAPI;

  constructor(config: EnhancedCakemailConfig) {
    this.api = new CakemailAPI(config);
  }

  // Example: Robust campaign creation with automatic retry
  async createCampaignRobust(campaignData: any) {
    try {
      console.log('Creating campaign with automatic retry and rate limiting...');
      
      const campaign = await this.api.createCampaign(campaignData);
      console.log('✅ Campaign created successfully:', campaign.data.id);
      
      return campaign;
      
    } catch (error) {
      if (error instanceof CakemailRateLimitError) {
        console.log(`⏱️  Rate limited. The system automatically handled retries.`);
        console.log(`Retry after: ${error.retryAfter} seconds`);
      } else if (error instanceof CakemailError) {
        console.log(`❌ Campaign creation failed after retries: ${error.message}`);
        console.log(`Status code: ${error.statusCode}`);
      } else {
        console.log(`❌ Unexpected error: ${error}`);
      }
      throw error;
    }
  }

  // Example: Batch operations with monitoring
  async batchCreateContacts(contacts: any[], listId: string) {
    console.log(`📋 Starting batch creation of ${contacts.length} contacts...`);
    
    const results = [];
    const errors = [];
    
    for (let i = 0; i < contacts.length; i++) {
      try {
        console.log(`Processing contact ${i + 1}/${contacts.length}...`);
        
        // Monitor queue stats
        const queueStats = this.api.getRequestQueueStats();
        if (queueStats.queued > 10) {
          console.log(`⚠️  High queue load: ${queueStats.queued} queued, ${queueStats.active} active`);
        }
        
        const contact = await this.api.createContact({
          ...contacts[i],
          list_id: listId
        });
        
        results.push(contact);
        console.log(`✅ Contact ${i + 1} created: ${contact.data.email}`);
        
      } catch (error) {
        errors.push({ index: i, contact: contacts[i], error });
        console.log(`❌ Contact ${i + 1} failed: ${error instanceof Error ? error.message : error}`);
      }
    }
    
    console.log(`📊 Batch complete: ${results.length} created, ${errors.length} failed`);
    
    return { results, errors };
  }

  // Example: Health monitoring with detailed diagnostics
  async monitorHealth() {
    console.log('🔍 Checking API health with diagnostics...');
    
    try {
      const health = await this.api.healthCheck();
      
      console.log(`🟢 Health Status: ${health.status}`);
      console.log(`🔐 Authentication: ${health.authenticated ? 'Valid' : 'Invalid'}`);
      console.log(`🆔 Account ID: ${health.accountId}`);
      
      if (health.components) {
        console.log('\n📊 Component Status:');
        console.log(`• Retry Manager: ${JSON.stringify(health.components.retryManager, null, 2)}`);
        console.log(`• Rate Limiter: ${health.components.rateLimiter}`);
        console.log(`• Circuit Breaker: ${JSON.stringify(health.components.circuitBreaker, null, 2)}`);
        console.log(`• Request Queue: ${JSON.stringify(health.components.requestQueue, null, 2)}`);
        console.log(`• Timeout: ${health.components.timeout}ms`);
      }
      
      return health;
      
    } catch (error) {
      console.log(`🔴 Health check failed: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  // Example: Dynamic configuration updates
  async updateRetryConfigExample() {
    console.log('⚙️  Updating retry configuration...');
    
    // Get current config
    const currentConfig = this.api.getRetryConfig();
    console.log('Current config:', currentConfig);
    
    // Update for more aggressive retries
    this.api.updateRetryConfig({
      maxRetries: 5,
      baseDelay: 500,
      exponentialBase: 1.8
    });
    
    const newConfig = this.api.getRetryConfig();
    console.log('Updated config:', newConfig);
    
    return newConfig;
  }

  // Example: Circuit breaker monitoring
  async monitorCircuitBreaker() {
    const state = this.api.getCircuitBreakerState();
    
    if (!state) {
      console.log('⚪ Circuit breaker is disabled');
      return null;
    }
    
    const stateEmoji = {
      'CLOSED': '🟢',
      'OPEN': '🔴',
      'HALF_OPEN': '🟡'
    }[state.state] || '⚪';
    
    console.log(`${stateEmoji} Circuit Breaker State: ${state.state}`);
    console.log(`Failures: ${state.failures}`);
    
    if (state.lastFailureTime > 0) {
      console.log(`Last Failure: ${new Date(state.lastFailureTime).toLocaleString()}`);
    }
    
    return state;
  }

  // Example: Performance testing with metrics
  async performanceTest(iterations = 10) {
    console.log(`🚀 Starting performance test with ${iterations} iterations...`);
    
    const startTime = Date.now();
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      const iterationStart = Date.now();
      
      try {
        await this.api.healthCheck();
        const duration = Date.now() - iterationStart;
        results.push({ success: true, duration });
        console.log(`✅ Iteration ${i + 1}: ${duration}ms`);
        
      } catch (error) {
        const duration = Date.now() - iterationStart;
        results.push({ success: false, duration, error });
        console.log(`❌ Iteration ${i + 1}: ${duration}ms - ${error instanceof Error ? error.message : error}`);
      }
      
      // Monitor queue between iterations
      const queueStats = this.api.getRequestQueueStats();
      if (queueStats.queued > 0) {
        console.log(`📊 Queue: ${queueStats.active} active, ${queueStats.queued} queued`);
      }
    }
    
    const totalTime = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    
    console.log(`\n📈 Performance Test Results:`);
    console.log(`• Total Time: ${totalTime}ms`);
    console.log(`• Success Rate: ${successCount}/${iterations} (${(successCount/iterations*100).toFixed(1)}%)`);
    console.log(`• Average Duration: ${avgDuration.toFixed(1)}ms`);
    console.log(`• Requests/Second: ${(iterations * 1000 / totalTime).toFixed(2)}`);
    
    return {
      totalTime,
      successCount,
      iterations,
      avgDuration,
      requestsPerSecond: iterations * 1000 / totalTime,
      results
    };
  }
}

// Example usage
export async function runExamples() {
  // Use different configurations for different scenarios
  const api = new CakemailExamples(basicConfig);
  
  try {
    // Monitor health
    await api.monitorHealth();
    
    // Monitor circuit breaker
    await api.monitorCircuitBreaker();
    
    // Update retry configuration
    await api.updateRetryConfigExample();
    
    // Run performance test
    await api.performanceTest(5);
    
  } catch (error) {
    console.error('Example failed:', error);
  }
}

export { basicConfig, highThroughputConfig, conservativeConfig };
