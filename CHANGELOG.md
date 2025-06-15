# Changelog

All notable changes to the Cakemail MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-15

### 🎯 Major Improvements - API Alignment

This release brings the Cakemail MCP server into full compliance with the official Cakemail API documentation, fixing critical inconsistencies and adding extensive new functionality.

### ✅ Fixed

#### **Critical API Structure Issues**
- **Campaign Creation**: Fixed data structure to use flat format instead of nested (aligns with API docs)
- **List ID Handling**: Fixed `list_id` parameter to remain as string (not converted to integer)
- **Transactional Email**: Simplified structure to match documented API format
- **Campaign Update**: Unified structure between create and update operations

#### **Authentication & Security**
- **Refresh Token Support**: Added proper OAuth 2.0 refresh token handling
- **Token Management**: Improved token expiry detection and automatic renewal
- **Error Handling**: Enhanced error messages with actual API response details
- **Security**: Removed static key risks with proper token rotation

#### **Input Validation**
- **Email Validation**: Added comprehensive email format checking
- **Date Validation**: Enforced YYYY-MM-DD format for date parameters
- **Pagination Limits**: Added API limit enforcement (max 50 campaigns per page)
- **Parameter Validation**: Type checking and format validation before API calls

### 🚀 Added

#### **New API Categories**
- **Template Management**: Complete CRUD operations for email templates
- **Enhanced Analytics**: Campaign, list, account, and transactional analytics
- **Automation Workflows**: Create, manage, and control automation sequences
- **Extended Sender Management**: Full sender lifecycle management
- **Enhanced List Management**: Complete list CRUD operations
- **Advanced Contact Management**: Extended contact handling capabilities

#### **New Tools (20+ additions)**

**Health Monitoring:**
- `cakemail_health_check` - API connectivity and authentication status

**Template Management:**
- `cakemail_get_templates` - List all email templates
- `cakemail_get_template` - Get specific template details
- `cakemail_create_template` - Create new email template
- `cakemail_update_template` - Update existing template
- `cakemail_delete_template` - Delete template

**Enhanced Sender Management:**
- `cakemail_get_sender` - Get specific sender details
- `cakemail_update_sender` - Update sender information
- `cakemail_delete_sender` - Delete sender

**Enhanced List Management:**
- `cakemail_get_list` - Get specific list details
- `cakemail_update_list` - Update list information
- `cakemail_delete_list` - Delete contact list

**Advanced Contact Management:**
- `cakemail_get_contact` - Get specific contact details
- `cakemail_update_contact` - Update contact information
- `cakemail_delete_contact` - Delete contact

**Enhanced Analytics:**
- `cakemail_get_campaign_analytics` - Detailed campaign performance metrics
- `cakemail_get_transactional_analytics` - Transactional email analytics
- `cakemail_get_list_analytics` - List performance and growth metrics
- `cakemail_get_account_analytics` - Account-wide analytics and insights

**Automation Workflows:**
- `cakemail_get_automations` - List automation workflows
- `cakemail_get_automation` - Get specific automation details
- `cakemail_create_automation` - Create new automation workflow
- `cakemail_start_automation` - Start automation workflow
- `cakemail_stop_automation` - Stop automation workflow

### 🔧 Enhanced

#### **Error Handling**
- **Detailed Messages**: API errors now show specific Cakemail error descriptions
- **Validation Errors**: Clear client-side validation messages before API calls
- **HTTP Status Codes**: Proper status code handling and reporting
- **Empty Response Handling**: Better handling of DELETE and other operations

#### **Response Quality**
- **Structured Responses**: Consistent and informative success messages
- **Verification Details**: Campaign creation now shows detailed verification info
- **Parameter Echoing**: Applied filters and parameters shown in responses
- **Count Information**: Pagination and total count information where available

#### **Code Quality**
- **TypeScript**: Full type safety throughout the codebase
- **Input Sanitization**: Automatic cleanup of undefined parameters
- **Consistent Patterns**: Unified approach across all API operations
- **Error Boundaries**: Comprehensive try-catch with detailed error reporting

### 🧪 Testing & Validation

#### **New Testing Infrastructure**
- **Integration Tests**: Automated testing script for core functionality
- **Health Checks**: API connectivity and authentication validation
- **Tool Discovery**: Verification of all available tools
- **Environment Validation**: Credential and setup checking

#### **New Scripts**
- `npm run test` - Run full integration test suite
- `npm run test:integration` - Run integration tests specifically
- `npm run validate` - Build and inspect server
- `npm run rebuild` - Clean build process

### 📚 Documentation

#### **Migration Support**
- **Migration Guide**: Step-by-step upgrade instructions
- **Breaking Changes**: Detailed list of changes and fixes required
- **Testing Instructions**: How to validate the migration
- **Rollback Plan**: Safe rollback procedures if needed

#### **API Documentation**
- **Tool Reference**: Complete documentation of all 30+ tools
- **Parameter Validation**: Input requirements and format specifications
- **Error Handling**: Common errors and troubleshooting
- **Best Practices**: Recommended usage patterns

### 🔄 Backward Compatibility

#### **Maintained Compatibility**
- **Existing Tools**: All original tools continue to work unchanged
- **Claude Desktop**: No configuration changes required
- **Authentication**: Same credential requirements
- **Response Formats**: Enhanced but compatible response structures

#### **Seamless Migration**
- **Zero Downtime**: Replace files and rebuild
- **No Config Changes**: Same environment variables and setup
- **Enhanced Functionality**: Immediate access to new features
- **Same Interface**: Existing Claude Desktop integrations work unchanged

### 🐛 Bug Fixes

- Fixed campaign creation data structure inconsistency
- Fixed transactional email parameter formatting
- Fixed pagination limit validation
- Fixed date format validation
- Fixed error message propagation
- Fixed token refresh logic
- Fixed undefined parameter handling
- Fixed response parsing for DELETE operations

### 🔐 Security Improvements

- Enhanced OAuth 2.0 flow with refresh token support
- Removed static authentication key risks
- Added input validation to prevent injection attacks
- Improved error handling to avoid information leakage
- Better token expiry management

### 📈 Performance Improvements

- Reduced unnecessary API calls through better token management
- Faster error detection with client-side validation
- Optimized request structures for better API performance
- Improved response parsing and handling

### 🎨 Developer Experience

- Better error messages for faster debugging
- Comprehensive input validation with helpful error messages
- Consistent API patterns across all operations
- Enhanced logging and debugging capabilities
- Complete TypeScript support for better development experience

---

## [1.0.0] - 2024-12-01

### Added
- Initial release of Cakemail MCP Server
- Basic campaign management (create, list, send, delete)
- Contact management (create, list)
- List management (create, list)
- Sender management (create, list)
- Transactional email sending
- OAuth 2.0 authentication
- Claude Desktop integration
- Basic error handling

### Features
- 14 core tools for Cakemail API integration
- MCP protocol compliance
- Environment-based configuration
- TypeScript implementation
- npm package structure

---

## Migration Notes

### From 1.0.0 to 1.1.0

**This is a backward-compatible upgrade** that enhances existing functionality while adding extensive new features.

**What's Changed:**
- Campaign data structure now matches official API documentation
- Better error messages and validation
- 20+ new tools for extended functionality
- Enhanced security with refresh token support

**Migration Steps:**
1. Replace source files with new versions
2. Run `npm run rebuild`
3. Test with `npm run test` (optional)
4. All existing integrations continue to work unchanged

**New Capabilities Available:**
- Complete template management
- Advanced analytics and reporting
- Automation workflow control
- Enhanced CRUD operations for all resources
- Health monitoring and diagnostics

**No Breaking Changes:**
- All existing tools maintain the same interface
- No Claude Desktop configuration changes needed
- Same authentication requirements
- Enhanced but compatible responses
