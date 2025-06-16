# Changelog

## [1.6.0] - 2025-06-16

### Added - Complete Logs API Implementation
- **NEW LogsApi class**: Complete implementation of Cakemail `/logs/` endpoints
- **NEW cakemail_get_campaign_logs**: Detailed campaign activity tracking (opens, clicks, bounces, unsubscribes)
- **NEW cakemail_get_workflow_logs**: Complete workflow automation sequence logging
- **NEW cakemail_get_workflow_action_logs**: Action-level tracking for specific automation steps
- **NEW cakemail_get_transactional_email_logs**: Individual email delivery tracking and monitoring
- **NEW cakemail_debug_logs_access**: Debug and test logs API endpoint availability

### Enhanced
- **Full integration with CakemailAPI**: All log methods available through main API client
- **Comprehensive parameter support**: Pagination, sorting, filtering, time ranges
- **Time-based filtering**: Unix timestamp support for start_time and end_time
- **Type filtering**: Filter logs by activity type (opens, clicks, bounces, etc.)
- **Enhanced error handling**: Consistent error messages and validation
- **Debug capabilities**: Built-in testing for all log endpoints

### Technical Details
- **5 new MCP tools** with complete request handlers
- **TypeScript interfaces** for all log parameters and responses
- **Consistent API patterns** following existing server architecture
- **Comprehensive documentation** with usage examples
- **Version bump** to 1.6.0 across all files

### Breaking Changes
- None - All changes are additive and backward compatible

### Files Modified
- `src/api/logs-api.ts` (NEW) - Core logs functionality implementation
- `src/cakemail-api.ts` - Added LogsApi integration and proxy methods
- `src/index.ts` - Added 5 new MCP tools and handlers for logs functionality
- `package.json` - Version bump to 1.6.0
- `README.md` - Updated documentation with logs features

## [1.5.0] - Previous Version
- Complete Reports API integration with 12+ new tools
- Campaign performance statistics and analytics
- Export functionality for campaign reports
- Time-based reporting with custom date ranges

## [1.2.0] - Previous Version
- Enhanced UX with latest-first default sorting
- Production-ready retry and rate limiting
- Comprehensive error handling

## [1.1.0] - Previous Version
- Full API compliance with official documentation
- 30+ tools for complete Cakemail functionality
- Enhanced security with OAuth 2.0 refresh tokens
