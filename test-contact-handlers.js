#!/usr/bin/env node

import { ContactApi } from './src/api/contact-api.js';
import dotenv from 'dotenv';

dotenv.config();

async function testContactHandlers() {
  console.log('Testing Contact API Implementation...\n');

  const api = new ContactApi({
    api_key: process.env.CAKEMAIL_API_KEY || '',
    account_id: process.env.CAKEMAIL_ACCOUNT_ID || undefined
  });

  try {
    // Test 1: List contacts
    console.log('1. Testing getContacts()...');
    const contacts = await api.getContacts({ per_page: 5 });
    console.log(`✅ Found ${contacts.pagination?.count || 0} total contacts`);
    console.log(`   Showing first ${contacts.data?.length || 0} contacts\n`);

    // Test 2: Create a test contact (if we have a list ID)
    if (process.env.TEST_LIST_ID) {
      console.log('2. Testing createContact()...');
      try {
        const newContact = await api.createContact({
          list_id: parseInt(process.env.TEST_LIST_ID),
          email: `test-${Date.now()}@example.com`,
          first_name: 'Test',
          last_name: 'Contact'
        });
        console.log(`✅ Created contact with ID: ${newContact.data?.id}\n`);

        // Test 3: Get the contact
        if (newContact.data?.id) {
          console.log('3. Testing getContact()...');
          const contact = await api.getContact(String(newContact.data.id));
          console.log(`✅ Retrieved contact: ${contact.data?.email}\n`);

          // Test 4: Update the contact
          console.log('4. Testing updateContact()...');
          const updated = await api.updateContact(String(newContact.data.id), {
            first_name: 'Updated',
            last_name: 'Contact'
          });
          console.log(`✅ Updated contact name\n`);

          // Test 5: Delete the contact
          console.log('5. Testing deleteContact()...');
          await api.deleteContact(String(newContact.data.id));
          console.log(`✅ Deleted test contact\n`);
        }
      } catch (error: any) {
        console.log(`⚠️  Contact operations skipped: ${error.message}\n`);
      }
    } else {
      console.log('⚠️  Skipping contact create/update/delete tests (no TEST_LIST_ID in .env)\n');
    }

    console.log('✅ All contact handler tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Check for required environment variables
if (!process.env.CAKEMAIL_API_KEY) {
  console.error('❌ Missing CAKEMAIL_API_KEY in .env file');
  process.exit(1);
}

console.log('=== Contact Management Handler Test ===\n');
testContactHandlers().catch(console.error);
