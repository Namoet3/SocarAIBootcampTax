import 'dotenv/config';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';

const REGION = process.env.AWS_REGION;
const KNOWLEDGE_BASE_ID = process.env.KNOWLEDGE_BASE_ID;
const MODEL_ARN = process.env.MODEL_ARN;

if (!REGION || !KNOWLEDGE_BASE_ID || !MODEL_ARN) {
  console.error('Missing required env vars. Check .env for AWS_REGION, KNOWLEDGE_BASE_ID, MODEL_ARN');
  process.exit(1);
}

// Client will automatically use AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_SESSION_TOKEN from env
const client = new BedrockAgentRuntimeClient({
  region: REGION,
});

async function main() {
  // Take the question from CLI args, or use a default test question
  const questionFromArgs = process.argv.slice(2).join(' ');
  const question =
    questionFromArgs ||
    'Örnek test sorusu: yurt dışından alınan danışmanlık hizmetinde KDV durumu nedir?';

  console.log('=== Asking KB ===');
  console.log('Question:', question);
  console.log('Region:', REGION);
  console.log('KnowledgeBaseId:', KNOWLEDGE_BASE_ID);
  console.log('ModelArn:', MODEL_ARN);
  console.log('-----------------------------\n');

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

  console.log('=== RAW RESPONSE (truncated) ===');
  console.dir(
    {
      output: response.output,
      citations: response.citations,
    },
    { depth: 5 },
  );

  console.log('\n=== ANSWER TEXT ===');
  console.log(response.output?.text ?? '(no answer text)');

  console.log('\n=== CITATIONS ===');
  if (!response.citations || response.citations.length === 0) {
    console.log('(no citations)');
  } else {
    for (const [i, citation] of response.citations.entries()) {
      console.log(`Citation #${i + 1}:`);
      for (const ref of citation.retrievedReferences ?? []) {
        console.log(
          JSON.stringify(
            {
              location: ref.location,
              metadata: ref.metadata,
              // score removed – type doesn't define it
            },
            null,
            2,
          ),
        );
      }
      console.log('-----------------------------');
    }
  }
}

main().catch((err) => {
  console.error('\n=== ERROR CALLING BEDROCK ===');
  console.error(err);
  process.exit(1);
});
