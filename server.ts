import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';

const REGION = process.env.AWS_REGION?.trim();
const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID?.trim();
const MODEL_ARN = process.env.MODEL_ARN?.trim();
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID?.trim();
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY?.trim();
const AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN?.trim();

if (!REGION || !KNOWLEDGE_BASE_ID || !MODEL_ARN) {
  console.error('Missing required env vars. Check .env for AWS_REGION, KNOWLEDGE_BASE_ID, MODEL_ARN');
  process.exit(1);
}

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error('Missing AWS credentials. Check .env for AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
  process.exit(1);
}

const client = new BedrockAgentRuntimeClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
  },
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'question is required' });
    }

    console.log('Question:', question);

    const command = new RetrieveAndGenerateCommand({
      input: { text: question.trim() },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: KNOWLEDGE_BASE_ID,
          modelArn: MODEL_ARN,
        },
      },
    });

    const response = await client.send(command);

    const answer = response.output?.text ?? '';
    const citations =
      response.citations?.flatMap((c) =>
        (c.retrievedReferences ?? []).map((ref) => ({
          location: ref.location,
          metadata: ref.metadata,
        })),
      ) ?? [];

    console.log('Answer:', answer.substring(0, 100) + '...');

    res.json({ answer, citations });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`Region: ${REGION}`);
  console.log(`Knowledge Base ID: ${KNOWLEDGE_BASE_ID}`);
  console.log(`Access Key: ${AWS_ACCESS_KEY_ID?.substring(0, 10)}...`);
  console.log(`✅ Using credentials from .env file`);
});
