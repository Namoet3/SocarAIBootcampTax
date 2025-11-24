import boto3
import json

client = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-west-2",
)

prompt = "You are a helpful assistant. Say hello briefly."

body = {
    "anthropic_version": "bedrock-2023-05-31",
    "messages": [
        {
            "role": "user",
            "content": [{"type": "text", "text": prompt}],
        }
    ],
    "max_tokens": 128,
}

response = client.invoke_model(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    body=json.dumps(body),
)

resp_body = json.loads(response["body"].read())
print(resp_body["content"][0]["text"])
