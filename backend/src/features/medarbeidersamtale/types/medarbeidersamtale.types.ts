/** Statistikken frontend sender inn når arbeidsdagen er over. */
export type MedarbeidersamtaleRequest = {
  poeng: number;
  behandlet: number;
  tapt: number;
  tittel: string;
  tapteSaker: string[];
  sekunderSpilt: number;
  /** Hvorfor arbeidsdagen tok slutt. */
  aarsak: string;
  /** Stillingen spilleren valgte: Vikar, Fulltid eller Senior. */
  stilling: string;
};

export type MedarbeidersamtaleResponse = {
  samtale: string;
};

export type FeilResponse = {
  feil: string;
};

/** Body-en AI-gatewayen forventer på /openai/v1/responses. */
export type AIGatewayBody = {
  model: string;
  instructions: string;
  input: string;
  stream: boolean;
};

export type ResponsesApiResponse = {
  id: string;
  model: string;
  output: {
    type: string;
    content?: { type: string; text?: string }[];
  }[];
};
