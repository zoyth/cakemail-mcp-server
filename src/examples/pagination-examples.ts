// Example usage of the unified pagination system in the Cakemail API

import { CakemailAPI } from '../cakemail-api.js';
import type { UnifiedPaginationOptions, IteratorOptions } from '../utils/pagination/index.js';

// Example configuration
const config = {
  username: 'your-username',
  password: 'your-password',
  debug: true
};

const api = new CakemailAPI(config);

// EXAMPLE 1: Manual pagination with next/previous page handling
async function manualPaginationExample() {
  console.log('=== Manual Pagination Example ===');
  
  // Get first page of campaigns
  let campaignsResult = await api.campaigns.getCampaignsPaginated(
    { page: 1, per_page: 10 },
    { status: 'sent' }
  );
  
  console.log(`Found ${campaignsResult.data.length} campaigns on page ${campaignsResult.pagination.page}`);
  
  // Check if there are more pages
  if (campaignsResult.pagination.has_more) {
    // Get next page using the pagination manager
    const manager = api.campaigns.createManager('campaigns');
    const nextPageOptions = manager.getNextPageOptions(campaignsResult);
    
    if (nextPageOptions) {
      campaignsResult = await api.campaigns.getCampaignsPaginated(
        nextPageOptions,
        { status: 'sent' }
      );
      console.log(`Next page has ${campaignsResult.data.length} campaigns`);
    }
  }
}

// EXAMPLE 2: Automatic iteration through all items
async function automaticIterationExample() {
  console.log('\\n=== Automatic Iteration Example ===');
  
  // Iterate through all contacts in a list
  const contactsIterator = api.contacts.getContactsIterator('123', { per_page: 50 });
  
  let count = 0;
  for await (const contact of contactsIterator) {
    count++;
    console.log(`Contact ${count}: ${contact.email}`);
    
    // Break after first 10 for demo
    if (count >= 10) break;
  }
  
  console.log(`Total contacts processed: ${count}`);
}

// EXAMPLE 3: Collect all items with limit
async function collectAllWithLimitExample() {
  console.log('\\n=== Collect All with Limit Example ===');
  
  // Get all campaigns but limit to 100
  const allCampaigns = await api.campaigns.getAllCampaigns(
    { maxResults: 100 },
    { sort: 'created_on', order: 'desc' }
  );
  
  console.log(`Retrieved ${allCampaigns.length} campaigns total`);
}

// EXAMPLE 4: Batch processing
async function batchProcessingExample() {
  console.log('\\n=== Batch Processing Example ===');
  
  await api.contacts.processContactsInBatches(
    '123', // list ID
    async (contacts) => {
      console.log(`Processing batch of ${contacts.length} contacts`);
      
      // Process batch here (e.g., update database, send emails, etc.)
      for (const contact of contacts) {
        // Simulate processing
        console.log(`  Processing: ${contact.email}`);
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 100));
    },
    { per_page: 25 }
  );
}

// EXAMPLE 5: Error handling and robust iteration
async function robustIterationExample() {
  console.log('\\n=== Robust Iteration with Error Handling ===');
  
  const iterator = api.campaigns.getCampaignsIterator(
    {
      retryAttempts: 3,
      per_page: 20
    },
    { status: 'sent' }
  );
  
  try {
    let campaignCount = 0;
    for await (const campaign of iterator) {
      campaignCount++;
      console.log(`Campaign ${campaignCount}: ${campaign.name} (${campaign.status})`);
      
      if (campaignCount >= 5) break; // Just show first 5 for demo
    }
  } catch (error) {
    console.error('Error during iteration:', error);
  }
}

// EXAMPLE 6: Working with batches and manual iteration
async function manualBatchIterationExample() {
  console.log('\\n=== Manual Batch Iteration Example ===');
  
  const listsIterator = api.contacts.getListsIterator({ per_page: 10 });
  
  for await (const batch of listsIterator.batches()) {
    console.log(`Processing ${batch.length} lists:`);
    batch.forEach((list, index) => {
      console.log(`  ${index + 1}. ${list.name} (${list.status})`);
    });
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// EXAMPLE 7: Advanced filtering and searching
async function advancedFilteringExample() {
  console.log('\\n=== Advanced Filtering Example ===');
  
  // Search for campaigns with specific criteria
  const searchResults = await api.campaigns.getCampaignsPaginated(
    { page: 1, per_page: 20 },
    {
      status: 'sent',
      type: 'regular',
      sort: 'created_on',
      order: 'desc'
    }
  );
  
  console.log(`Found ${searchResults.data.length} matching campaigns`);
  console.log(`Total available: ${searchResults.pagination.total_count || 'unknown'}`);
}

// EXAMPLE 8: Concurrent processing
async function concurrentProcessingExample() {
  console.log('\\n=== Concurrent Processing Example ===');
  
  // Process multiple lists concurrently
  const listIds = ['123', '456', '789'];
  const iterators = listIds.map(listId => 
    api.contacts.getContactsIterator(listId, { per_page: 50 })
  );
  
  // Process all iterators concurrently with controlled concurrency
  const results = await Promise.all(
    iterators.map(async (iterator, index) => {
      const contacts = await iterator.toArray();
      console.log(`List ${listIds[index]}: ${contacts.length} contacts`);
      return { listId: listIds[index], count: contacts.length };
    })
  );
  
  const totalContacts = results.reduce((sum, result) => sum + result.count, 0);
  console.log(`Total contacts across all lists: ${totalContacts}`);
}

// EXAMPLE 9: Memory-efficient processing for large datasets
async function memoryEfficientProcessingExample() {
  console.log('\\n=== Memory-Efficient Processing Example ===');
  
  const iterator = api.contacts.getContactsIterator('123', { per_page: 100 });
  
  // Process items one by one to avoid memory issues
  let processedCount = 0;
  for await (const contact of iterator) {
    try {
      // Process each contact individually
      await processContact(contact);
      processedCount++;
      
      if (processedCount % 100 === 0) {
        console.log(`Processed ${processedCount} contacts so far...`);
      }
    } catch (error) {
      console.error(`Failed to process contact ${contact.id}:`, error);
      // Continue processing other contacts
    }
  }
  
  console.log(`Finished processing ${processedCount} contacts`);
}

async function processContact(contact: any): Promise<void> {
  // Simulate contact processing
  await new Promise(resolve => setTimeout(resolve, 10));
}

// EXAMPLE 10: Statistics and monitoring
async function statisticsExample() {
  console.log('\\n=== Statistics and Monitoring Example ===');
  
  const iterator = api.campaigns.getCampaignsIterator({ per_page: 25 });
  
  // Get statistics about the iteration
  const stats = await iterator.getStats();
  console.log('Pagination Statistics:', {
    totalItems: stats.totalItems,
    totalBatches: stats.totalBatches,
    averageBatchSize: stats.averageBatchSize,
    strategy: stats.strategy
  });
}

// EXAMPLE 11: Custom validation and error recovery
async function customValidationExample() {
  console.log('\\n=== Custom Validation Example ===');
  
  const iterator = api.contacts.getContactsIterator(
    '123',
    {
      retryAttempts: 3,
      per_page: 50
    }
  );
  
  // Use built-in validation and error handling
  try {
    const contacts = await iterator.filter(async (contact) => {
      // Only include contacts with valid email format
      return contact.email && contact.email.includes('@');
    });
    
    console.log(`Found ${contacts.length} contacts with valid emails`);
  } catch (error) {
    console.error('Validation failed:', error);
  }
}

// EXAMPLE 12: Backward compatibility with legacy methods
async function backwardCompatibilityExample() {
  console.log('\\n=== Backward Compatibility Example ===');
  
  // Old method still works (deprecated but functional)
  const legacyResult = await api.campaigns.getCampaigns({
    page: 1,
    per_page: 10,
    sort: 'created_on',
    order: 'desc'
  });
  
  console.log(`Legacy method returned ${legacyResult.data?.length || 0} campaigns`);
  
  // New method with equivalent functionality
  const newResult = await api.campaigns.getCampaignsPaginated(
    { page: 1, per_page: 10 },
    { sort: 'created_on', order: 'desc' }
  );
  
  console.log(`New method returned ${newResult.data.length} campaigns`);
  console.log(`Has more pages: ${newResult.pagination.has_more}`);
}

// Main execution function
async function runAllExamples() {
  try {
    await manualPaginationExample();
    await automaticIterationExample();
    await collectAllWithLimitExample();
    await batchProcessingExample();
    await robustIterationExample();
    await manualBatchIterationExample();
    await advancedFilteringExample();
    await concurrentProcessingExample();
    await memoryEfficientProcessingExample();
    await statisticsExample();
    await customValidationExample();
    await backwardCompatibilityExample();
    
    console.log('\\n=== All Examples Completed Successfully ===');
  } catch (error) {
    console.error('Example execution failed:', error);
  }
}

// Export for use in other files
export {
  manualPaginationExample,
  automaticIterationExample,
  collectAllWithLimitExample,
  batchProcessingExample,
  robustIterationExample,
  memoryEfficientProcessingExample,
  runAllExamples
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}
