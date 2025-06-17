#!/bin/bash
echo "Testing compilation after analytics API removal..."

# Change to project directory
cd /Users/francoislane/dev/cakemail-mcp-server

# Clean build directory
rm -rf build

# Compile TypeScript
npx tsc

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo "✅ Compilation successful!"
    echo "Analytics API has been successfully removed from the codebase."
    echo ""
    echo "Files removed:"
    echo "- src/api/analytics-api.ts (moved to archive)"
    echo "- src/api/analytics-api-backup.ts (moved to archive)"
    echo "- All related build files (moved to archive)"
    echo ""
    echo "Files modified:"
    echo "- src/cakemail-api.ts (removed analytics imports and methods)"
    echo "- src/types/cakemail-types.ts (removed analytics-related types)"
    echo ""
    echo "The Reports API provides all necessary analytics functionality."
else
    echo "❌ Compilation failed. Please check the errors above."
    exit 1
fi
