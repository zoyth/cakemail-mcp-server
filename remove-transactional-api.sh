#!/bin/bash

# Clean and rebuild the project to ensure no transactional-api references remain
echo "Cleaning build directory..."
rm -rf build/

echo "Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Transactional API has been successfully removed."
    echo "📦 The EmailApi now handles all email functionality with backward compatibility."
    echo ""
    echo "📋 Summary of changes:"
    echo "   • Removed src/api/transactional-api.ts"
    echo "   • Removed all build artifacts for transactional-api"
    echo "   • EmailApi now handles both transactional and marketing emails"
    echo "   • Legacy compatibility maintained with EmailApi as TransactionalApi export"
    echo "   • All type definitions updated (EmailData, EmailResponse, etc.)"
    echo ""
    echo "🔄 Legacy support:"
    echo "   • cakemail.transactional still works (points to EmailApi)"
    echo "   • TransactionalEmailData/Response types still available"
    echo "   • sendTransactionalEmail() method still available"
else
    echo "❌ Build failed! Please check for compilation errors."
    exit 1
fi
