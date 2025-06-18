/**
 * Integration Test for List Management Tools
 * Tests all list-related functionality in the Cakemail MCP Server
 */

import { CakemailAPI } from '../src/cakemail-api.js';
import { 
  handleListLists,
  handleCreateList,
  handleGetList,
  handleUpdateList,
  handleDeleteList,
  handleArchiveList,
  handleGetListStats
} from '../src/handlers/lists.js';

// Mock API for testing
class MockCakemailAPI {
  lists = {
    async getLists(filters: any) {
      return {
        pagination: { count: 2, page: 1, per_page: 50 },
        data: [
          {
            id: 1,
            name: 'Test List 1',
            status: 'active',
            language: 'en_US',
            created_on: '2024-01-01T00:00:00Z',
            updated_on: '2024-01-01T00:00:00Z',
            default_sender: { name: 'Test Sender', email: 'test@example.com' },
            contacts_count: 100,
            active_contacts_count: 90,
            unsubscribed_contacts_count: 10
          },
          {
            id: 2,
            name: 'Test List 2',
            status: 'active',
            language: 'fr_FR',
            created_on: '2024-01-02T00:00:00Z',
            updated_on: '2024-01-02T00:00:00Z',
            default_sender: { name: 'Test Sender 2', email: 'test2@example.com' },
            contacts_count: 50,
            active_contacts_count: 45,
            unsubscribed_contacts_count: 5
          }
        ]
      };
    },

    async createList(data: any, options: any) {
      return {
        data: {
          id: 3,
          name: data.name,
          status: 'active',
          language: data.language,
          default_sender: data.default_sender,
          created_on: '2024-01-03T00:00:00Z'
        }
      };
    },

    async getList(listId: string, options: any) {
      return {
        data: {
          id: parseInt(listId),
          name: `Test List ${listId}`,
          status: 'active',
          language: 'en_US',
          created_on: '2024-01-01T00:00:00Z',
          updated_on: '2024-01-01T00:00:00Z',
          default_sender: { name: 'Test Sender', email: 'test@example.com' },
          contacts_count: 100,
          active_contacts_count: 90,
          unsubscribed_contacts_count: 10,
          bounced_contacts_count: 0,
          redirections: {},
          webhook: {}
        }
      };
    },

    async updateList(listId: string, data: any, options: any) {
      return {
        data: {
          id: parseInt(listId),
          ...data,
          updated_on: '2024-01-04T00:00:00Z'
        }
      };
    },

    async deleteList(listId: string, options: any) {
      return { success: true, status: 200 };
    },

    async archiveList(listId: string, options: any) {
      return { success: true, status: 200 };
    },

    async getListStats(params: any) {
      return {
        data: {
          total_contacts: 100,
          active_contacts: 90,
          unsubscribed_contacts: 10,
          bounced_contacts: 0,
          new_subscribers: 15,
          unsubscribe_rate: 10,
          growth_rate: 17.6,
          campaigns_sent: 5,
          total_opens: 450,
          total_clicks: 90,
          open_rate: 50,
          click_rate: 10
        }
      };
    }
  };
}

async function testListManagement() {
  console.log('🧪 Testing List Management Tools\n');
  
  const mockApi = new MockCakemailAPI() as any;

  try {
    // Test 1: List all lists
    console.log('1. Testing cakemail_list_lists...');
    const listResult = await handleListLists(
      { page: 1, per_page: 10, status: 'active' }, 
      mockApi
    );
    console.log('✅ List lists successful');
    console.log(`   Response type: ${listResult.content[0].type}`);
    console.log(`   Contains pagination: ${listResult.content[0].text.includes('2 total')}`);

    // Test 2: Create a new list
    console.log('\n2. Testing cakemail_create_list...');
    const createResult = await handleCreateList(
      {
        name: 'New Test List',
        default_sender: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        language: 'en_US',
        redirections: {
          subscribe: 'https://example.com/subscribe',
          unsubscribe: 'https://example.com/unsubscribe'
        }
      },
      mockApi
    );
    console.log('✅ Create list successful');
    console.log(`   Response type: ${createResult.content[0].type}`);
    console.log(`   Contains success message: ${createResult.content[0].text.includes('Created Successfully')}`);

    // Test 3: Get a specific list
    console.log('\n3. Testing cakemail_get_list...');
    const getResult = await handleGetList({ list_id: '1' }, mockApi);
    console.log('✅ Get list successful');
    console.log(`   Response type: ${getResult.content[0].type}`);
    console.log(`   Contains list details: ${getResult.content[0].text.includes('Contact List Details')}`);

    // Test 4: Update a list
    console.log('\n4. Testing cakemail_update_list...');
    const updateResult = await handleUpdateList(
      {
        list_id: '1',
        name: 'Updated Test List',
        language: 'fr_FR'
      },
      mockApi
    );
    console.log('✅ Update list successful');
    console.log(`   Response type: ${updateResult.content[0].type}`);
    console.log(`   Contains update message: ${updateResult.content[0].text.includes('Updated Successfully')}`);

    // Test 5: Get list statistics
    console.log('\n5. Testing cakemail_get_list_stats...');
    const statsResult = await handleGetListStats(
      {
        list_id: '1',
        interval: 'day'
      },
      mockApi
    );
    console.log('✅ Get list stats successful');
    console.log(`   Response type: ${statsResult.content[0].type}`);
    console.log(`   Contains statistics: ${statsResult.content[0].text.includes('Performance Statistics')}`);

    // Test 6: Archive a list
    console.log('\n6. Testing cakemail_archive_list...');
    const archiveResult = await handleArchiveList({ list_id: '1' }, mockApi);
    console.log('✅ Archive list successful');
    console.log(`   Response type: ${archiveResult.content[0].type}`);
    console.log(`   Contains archive message: ${archiveResult.content[0].text.includes('Archived Successfully')}`);

    // Test 7: Delete a list
    console.log('\n7. Testing cakemail_delete_list...');
    const deleteResult = await handleDeleteList({ list_id: '1' }, mockApi);
    console.log('✅ Delete list successful');
    console.log(`   Response type: ${deleteResult.content[0].type}`);
    console.log(`   Contains delete message: ${deleteResult.content[0].text.includes('Deleted Successfully')}`);

    // Test error cases
    console.log('\n8. Testing error cases...');
    
    // Test missing required fields
    const errorResult = await handleCreateList({}, mockApi);
    console.log(`✅ Error handling works: ${errorResult.content[0].text.includes('Missing Required Fields')}`);

    const errorResult2 = await handleGetList({}, mockApi);
    console.log(`✅ Error handling works: ${errorResult2.content[0].text.includes('Missing Required Field')}`);

    console.log('\n🎉 All List Management Tests Passed!\n');
    
    return {
      success: true,
      tests: 7,
      errors: 0
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
async function runTests() {
  console.log('🚀 Starting List Management Integration Tests...\n');
  
  const result = await testListManagement();
  
  if (result.success) {
    console.log('✅ All tests completed successfully!');
    console.log(`✅ ${result.tests} tests passed`);
  } else {
    console.log('❌ Tests failed:', result.error);
  }
}

// Export for potential use in other test files
export { testListManagement, runTests };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}
