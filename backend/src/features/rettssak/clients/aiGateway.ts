const ENDPOINT = "https://genai.gjensidige.io/openai/v1/responses";
const MODEL = "gpt-5.6-luna";

export class GatewayError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type ResponsesApiResponse = {
  output?: { type: string; content?: { type: string; text?: string }[] }[];
};

export async function askGateway(instructions: string, input: string): Promise<string> {
  const token = process.env.AI_GATEWAY_TOKEN;
  if (!token) {
    throw new GatewayError("AI_GATEWAY_TOKEN mangler i .env.local", 500);
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ model: MODEL, instructions, input, stream: false }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`AI-gateway svarte ${res.status}: ${body.slice(0, 300)}`);
    throw new GatewayError(`AI-gateway svarte ${res.status}`, res.status === 401 ? 401 : 502);
  }

  const data = (await res.json()) as ResponsesApiResponse;
  const text = (data.output ?? [])
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text" && c.text)
    .map((c) => c.text)
    .join("\n")
    .trim();

  if (!text) throw new GatewayError("Tomt svar fra AI-gateway", 502);
  return text;
}
