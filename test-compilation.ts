// TypeScript compilation test
import { SubAccountApi } from './src/api/sub-account-api.js';
import { AccountApi } from './src/api/account-api.js';

// Test that the classes can be instantiated
const config = {
  username: 'test',
  password: 'test'
};

// This should compile without errors
const subAccountApi = new SubAccountApi(config);
const accountApi = new AccountApi(config);

console.log('✅ TypeScript syntax validation passed');
console.log('✅ All imports resolved correctly');
console.log('✅ Classes can be instantiated');
