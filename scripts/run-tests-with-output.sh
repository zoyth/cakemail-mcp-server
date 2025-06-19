#!/bin/bash

cd /Users/francoislane/dev/cakemail-mcp-server

echo "Running tests..."
npm run test:coverage 2>&1 | tee test-results/test-output.txt

echo "Test run complete. Check test-results/test-output.txt for results."
