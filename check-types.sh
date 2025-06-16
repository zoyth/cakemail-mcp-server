#!/bin/bash

echo "Testing TypeScript compilation..."

# Check if we can compile the main files
echo "Checking event-taxonomy.ts..."
npx tsc --noEmit src/types/event-taxonomy.ts

echo "Checking logs-api.ts..."
npx tsc --noEmit src/api/logs-api.ts

echo "Checking index.ts..."
npx tsc --noEmit src/index.ts

echo "TypeScript check complete!"
