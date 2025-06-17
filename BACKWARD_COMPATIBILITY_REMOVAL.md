# Backward Compatibility Removal Plan

This document outlines the removal of all backward compatibility code from cakemail-mcp-server as requested for pre-release version.

## Overview

The codebase currently contains several layers of backward compatibility:
1. Legacy Email API format support
2. Method proxy layer in main API class
3. Legacy type definitions
4. Legacy field mappings in MCP tool handlers

## Files to Modify

### 1. `src/api/email-api.ts`
**Remove:**
- `normalizeEmailData()` method
- `sendTransactionalEmail()` method
- `sendLegacyEmail()` method  
- `sendMarketingEmail()` method
- Legacy format handling in `sendEmail()` method
- All `LegacyEmailData` references

**Keep:**
- Core v2 API functionality
- `sendEmail()` method (simplified to only accept `EmailData`)
- All other non-legacy methods

### 2. `src/cakemail-api.ts`
**Remove:**
- Legacy property getter: `get transactional()`
- All method proxy functions (lines ~37-166+)
- Legacy export: `export { EmailApi as TransactionalApi }`

**Keep:**
- Sub-API properties (campaigns, contacts, etc.)
- Constructor and initialization
- Core API structure

### 3. `src/types/cakemail-types.ts`
**Remove:**
- `LegacyEmailData` interface
- `TransactionalEmailResponse` type alias
- `TransactionalEmailData` type alias
- Legacy compatibility comments
- Any other "backward compatibility" marked types

**Keep:**
- All current v2 API types
- Core interfaces needed for functionality

### 4. `src/index.ts`
**Remove:**
- Legacy field support in email tool handler
- Legacy field mappings and anyOf schema
- Backward compatibility validation logic

**Update:**
- Simplify email tool to only accept v2 format
- Remove legacy field descriptions and schema

## Benefits of Removal

1. **Simplified Codebase**: Removes ~500+ lines of compatibility code
2. **Better Performance**: No format conversion overhead
3. **Cleaner API**: Single consistent interface
4. **Easier Maintenance**: Less code paths to test and maintain
5. **Future-Ready**: Clean foundation for new features

## Migration Impact

Since this is pre-release:
- No existing users to migrate
- Fresh, clean API from launch
- Documentation can focus on single format
- Testing simplified

## Implementation Steps

1. Remove legacy types from `cakemail-types.ts`
2. Clean up `email-api.ts` to remove legacy support
3. Remove method proxies from `cakemail-api.ts`
4. Update `index.ts` tool handlers
5. Update documentation
6. Test all functionality
7. Update version and changelog

## Files Estimated for Changes
- `src/types/cakemail-types.ts` (-150 lines)
- `src/api/email-api.ts` (-200 lines)  
- `src/cakemail-api.ts` (-300 lines)
- `src/index.ts` (-100 lines)
- **Total: ~750 lines removed**

This cleanup will result in a significantly cleaner, more maintainable codebase optimized for the current v2 API without legacy baggage.
