#!/bin/bash
cd /Users/francoislane/dev/cakemail-mcp-server
echo "Cleaning build directory..."
rm -rf build
echo "Running TypeScript compilation..."
npx tsc
echo "Making index.js executable..."
chmod +x build/index.js
echo "Build complete!"
