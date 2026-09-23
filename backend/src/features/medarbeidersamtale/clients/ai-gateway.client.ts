import type {
  AIGatewayBody,
  ResponsesApiResponse,
} from '../types/medarbeidersamtale.types.js';

const ENDEPUNKT = 'https://genai.gjensidige.io/openai/v1/responses';
const MODELL = 'gpt-5.6-luna';

/** Kastes når AI_GATEWAY_TOKEN ikke finnes. Ruta oversetter den til 503. */
export class ManglerTokenFeil extends Error {
  constructor() {
    super('AI_GATEWAY_TOKEN mangler i .env.local');
    this.name = 'ManglerTokenFeil';
  }
}

/** Kastes når gatewayen svarer med noe annet enn 200. */
export class GatewayFeil extends Error {
  constructor(
    public readonly status: number,
    detaljer: string,
  ) {
    super(`AI-gatewayen svarte ${status}: ${detaljer}`);
    this.name = 'GatewayFeil';
  }
}

/**
 * Eneste stedet i prosjektet som snakker med AI-gatewayen.
 * Tokenet leses her og forlater aldri backend.
 */
export async function kallGateway(
  instructions: string,
  input: string,
): Promise<string> {
  const token = process.env.AI_GATEWAY_TOKEN;
  if (!token) throw new ManglerTokenFeil();

  const body: AIGatewayBody = {
    model: MODELL,
    instructions,
    input,
    stream: false,
  };

  const svar = await fetch(ENDEPUNKT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!svar.ok) {
    const tekst = await svar.text();
    throw new GatewayFeil(svar.status, tekst.slice(0, 300));
  }

  const data = (await svar.json()) as ResponsesApiResponse;
  return plukkUtTekst(data);
}

function plukkUtTekst(data: ResponsesApiResponse): string {
  const tekst = (data.output ?? [])
    .flatMap((del) => del.content ?? [])
    .map((bit) => bit.text ?? '')
    .join('')
    .trim();

  if (!tekst) throw new GatewayFeil(200, 'tomt svar fra modellen');
  return tekst;
}
