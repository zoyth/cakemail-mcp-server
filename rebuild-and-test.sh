#!/bin/bash

echo "🔧 Rebuilding Cakemail MCP Server..."

# Navigate to the project directory
cd /Users/francoislane/dev/cakemail-mcp-server

# Build the project
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🧪 Testing with circuit breaker disabled..."
    echo "You can now run the logs query again to see the actual API error."
    echo ""
    echo "Test command suggestions:"
    echo "1. Try basic campaign logs without filters"
    echo "2. Try with type=click filter to see the real error"
    echo "3. Check if the endpoints actually exist"
else
    echo "❌ Build failed!"
    exit 1
fi
