// Example usage of the Cakemail API with proper error handling

import { 
  CakemailAPI, 
  CakemailError,
  CakemailAuthenticationError,
  CakemailValidationError,
  CakemailBadRequestError,
  CakemailNotFoundError,
  CakemailRateLimitError
} from '../cakemail-api.js';

const api = new CakemailAPI({
  username: process.env.CAKEMAIL_USERNAME!,
  password: process.env.CAKEMAIL_PASSWORD!
});

// Example: Creating a campaign with proper error handling
async function createCampaignExample() {
  try {
    const campaign = await api.createCampaign({
      name: 'My Test Campaign',
      subject: 'Hello World',
      html_content: '<h1>Hello!</h1>',
      list_id: '123',
      sender_id: '456'
    });
    
    console.log('Campaign created:', campaign.data);
    
  } catch (error) {
    if (error instanceof CakemailValidationError) {
      console.error('Validation failed:');
      error.validationErrors.forEach(err => {
        console.error(`- ${err.loc.join('.')}: ${err.msg}`);
      });
      
      // Check for specific field errors
      const nameErrors = error.getFieldErrors('name');
      if (nameErrors.length > 0) {
        console.error('Name field issues:', nameErrors);
      }
      
    } else if (error instanceof CakemailAuthenticationError) {
      console.error('Authentication failed:', error.message);
      console.error('Check your credentials');
      
    } else if (error instanceof CakemailBadRequestError) {
      console.error('Bad request:', error.detail);
      
    } else if (error instanceof CakemailNotFoundError) {
      console.error('Resource not found:', error.message);
      
    } else if (error instanceof CakemailRateLimitError) {
      console.error('Rate limited:', error.message);
      if (error.retryAfter) {
        console.error(`Retry after ${error.retryAfter} seconds`);
      }
      
    } else if (error instanceof CakemailError) {
      console.error(`API Error (${error.statusCode}):`, error.message);
      
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Example: Handling rate limits with retry logic
async function createCampaignWithRetry() {
  const maxRetries = 3;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      const campaign = await api.createCampaign({
        name: 'My Test Campaign',
        subject: 'Hello World',
        html_content: '<h1>Hello!</h1>',
        list_id: '123',
        sender_id: '456'
      });
      
      return campaign.data;
      
    } catch (error) {
      if (error instanceof CakemailRateLimitError) {
        retryCount++;
        const delay = error.retryAfter || Math.pow(2, retryCount) * 1000; // Exponential backoff
        
        console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        if (retryCount >= maxRetries) {
          throw new Error(`Max retries exceeded. Last error: ${error.message}`);
        }
        
      } else {
        // Non-rate-limit error, don't retry
        throw error;
      }
    }
  }
}

export { createCampaignExample, createCampaignWithRetry };
