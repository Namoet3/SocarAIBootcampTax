# Tax AI Assistant

Local setup with Express backend and React frontend.

## Setup

### 1. Backend Setup

```bash
# Install dependencies
npm install

# Make sure .env file has your AWS credentials
# AWS_REGION, KNOWLEDGE_BASE_ID, MODEL_ARN, AWS_ACCESS_KEY_ID, etc.

# Start backend server
npm run dev
```

Backend will run on http://localhost:3001

### 2. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on http://localhost:5173

## Usage

1. Start backend: `npm run dev` (in root directory)
2. Start frontend: `cd Frontend && npm run dev`
3. Open http://localhost:5173
4. Ask questions about tax!

## Testing Backend Only

```bash
npm run test
```

This will test the Knowledge Base connection without starting the server.
