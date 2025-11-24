import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || 'us-west-2', // change to your region
});

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const SESSION_TOKEN = process.env.SESSION_TOKEN;

const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID!;
const MODEL_ARN = process.env.MODEL_ARN!; 
// e.g. arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v1:0

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const question = (body.question || '').trim();

    if (!question) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'question is required' }),
      };
    }

    const command = new RetrieveAndGenerateCommand({
      input: { text: question },
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        // enable CORS for your frontend origin:
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ answer, citations }),
    };
  } catch (err) {
    console.error('Error in Lambda:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
