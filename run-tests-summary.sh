#!/bin/bash
cd /Users/francoislane/dev/cakemail-mcp-server

# Run tests with coverage
echo "Running tests with coverage..."
npm run test:coverage 2>&1 | head -100

echo -e "\n\nTest Summary:"
npm run test:coverage 2>&1 | grep -E "(PASS|FAIL|Test Suites:|Tests:|Time:)" | tail -20
