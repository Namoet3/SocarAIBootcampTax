#!/bin/bash
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building Lambda function..."
npx esbuild handler.ts --bundle --platform=node --target=node20 --outfile=dist/handler.js --external:@aws-sdk/*

echo "📦 Creating deployment package..."
cd dist
zip -r function.zip handler.js
cd ..

echo "✅ Deployment package ready at dist/function.zip"
echo ""
echo "Next steps:"
echo "1. Go to AWS Lambda Console"
echo "2. Create a new function (Node.js 20.x runtime)"
echo "3. Upload dist/function.zip"
echo "4. Set handler to: handler.handler"
echo "5. Add environment variables from .env"
echo "6. Create Function URL or API Gateway"
echo "7. Copy the URL to Frontend/.env"
