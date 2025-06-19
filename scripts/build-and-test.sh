#!/bin/bash

cd /Users/francoislane/dev/cakemail-mcp-server

echo "Building project..."
npm run build

echo "Build complete. Now running tests..."
npm run test:coverage
