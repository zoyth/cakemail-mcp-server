#!/bin/bash

cd /Users/francoislane/dev/cakemail-mcp-server

echo "Clearing Jest cache..."
npx jest --clearCache

echo "Running tests..."
npm run test:coverage
