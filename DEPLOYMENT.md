# Deployment Guide

## Backend Deployment (AWS Lambda)

### Option 1: Using AWS Console (Easiest)

1. **Build the Lambda package:**
   ```bash
   npm install
   npm run build
   cd dist && zip -r function.zip handler.js && cd ..
   ```

2. **Create Lambda Function:**
   - Go to [AWS Lambda Console](https://console.aws.amazon.com/lambda)
   - Click "Create function"
   - Choose "Author from scratch"
   - Function name: `tax-ai-assistant`
   - Runtime: `Node.js 20.x`
   - Click "Create function"

3. **Upload Code:**
   - In the function page, click "Upload from" → ".zip file"
   - Upload `dist/function.zip`
   - Click "Save"

4. **Configure Handler:**
   - In "Runtime settings", click "Edit"
   - Set Handler to: `handler.handler`
   - Click "Save"

5. **Set Environment Variables:**
   - Go to "Configuration" → "Environment variables"
   - Add these variables from your `.env` file:
     - `AWS_REGION`: `us-west-2`
     - `KNOWLEDGE_BASE_ID`: `HERXB9AYFQ`
     - `MODEL_ARN`: `arn:aws:bedrock:us-west-2:394952322097:inference-profile/global.anthropic.claude-sonnet-4-20250514-v1:0`

6. **Add IAM Permissions:**
   - Go to "Configuration" → "Permissions"
   - Click on the role name
   - Click "Add permissions" → "Attach policies"
   - Add: `AmazonBedrockFullAccess`

7. **Create Function URL:**
   - Go to "Configuration" → "Function URL"
   - Click "Create function URL"
   - Auth type: `NONE` (for public access)
   - Configure CORS:
     - Allow origin: `*`
     - Allow methods: `POST, OPTIONS`
     - Allow headers: `content-type`
   - Click "Save"
   - **Copy the Function URL** (e.g., `https://abc123.lambda-url.us-west-2.on.aws/`)

### Option 2: Using AWS CLI

```bash
# Build
npm run build
cd dist && zip -r function.zip handler.js && cd ..

# Create function
aws lambda create-function \
  --function-name tax-ai-assistant \
  --runtime nodejs20.x \
  --handler handler.handler \
  --zip-file fileb://dist/function.zip \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_LAMBDA_ROLE \
  --environment Variables="{AWS_REGION=us-west-2,KNOWLEDGE_BASE_ID=HERXB9AYFQ,MODEL_ARN=arn:aws:bedrock:us-west-2:394952322097:inference-profile/global.anthropic.claude-sonnet-4-20250514-v1:0}"

# Create Function URL
aws lambda create-function-url-config \
  --function-name tax-ai-assistant \
  --auth-type NONE \
  --cors AllowOrigins="*",AllowMethods="POST,OPTIONS",AllowHeaders="content-type"
```

## Frontend Configuration

1. **Create `.env` file in Frontend directory:**
   ```bash
   cd Frontend
   cp .env.example .env
   ```

2. **Edit `Frontend/.env`:**
   ```
   VITE_API_BASE_URL=https://YOUR-FUNCTION-URL.lambda-url.us-west-2.on.aws
   ```
   Replace with your actual Lambda Function URL from step 7 above.

3. **Run frontend:**
   ```bash
   npm install
   npm run dev
   ```

4. **Test the connection:**
   - Open http://localhost:5173
   - Ask a question
   - You should see the AI response

## Testing Backend Locally

Before deploying, test your backend:

```bash
npm run test
```

This will call your Knowledge Base and show the response.

## Troubleshooting

**CORS errors:**
- Make sure Function URL has CORS configured with `*` for origins
- Check that Lambda returns `Access-Control-Allow-Origin: *` header

**403 Forbidden:**
- Check Lambda IAM role has Bedrock permissions
- Verify KNOWLEDGE_BASE_ID and MODEL_ARN are correct

**Timeout:**
- Increase Lambda timeout to 30 seconds in Configuration → General configuration

**No response:**
- Check CloudWatch Logs in Lambda console
- Verify environment variables are set correctly
