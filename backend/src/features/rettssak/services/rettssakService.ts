import { askGateway } from "../clients/aiGateway.js";
import { aktorPrompt, dommerPrompt, forsvarerPrompt } from "../prompts/prompts.js";
import type { RettssakResponse } from "../types/rettssak.js";

const MIN_BOLLER = 8;
const MAX_BOLLER = 100;
const begrens = (n: number) => Math.min(MAX_BOLLER, Math.max(MIN_BOLLER, n));

function parseDom(raw: string): RettssakResponse["dom"] {
  const cleaned = raw.replace(/```(json)?/g, "").trim();
  try {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    const json = JSON.parse(cleaned.slice(start, end + 1)) as { boller?: unknown; begrunnelse?: unknown };
    const boller = Math.round(Number(json.boller));
    if (Number.isFinite(boller) && typeof json.begrunnelse === "string") {
      return { boller: begrens(boller), begrunnelse: json.begrunnelse };
    }
  } catch {
    // faller tilbake under
  }
  const tall = cleaned.match(/\d+/);
  return { boller: tall ? begrens(Number(tall[0])) : 42, begrunnelse: cleaned };
}

export async function holdRettssak(unnskyldning: string): Promise<RettssakResponse> {
  const sak = `Synderens unnskyldning for å ha gått fra PC-en ulåst:\n"""${unnskyldning}"""`;

  const [aktor, forsvarer] = await Promise.all([
    askGateway(aktorPrompt, sak),
    askGateway(forsvarerPrompt, sak),
  ]);

  const dommerInput = `${sak}\n\nAktors innlegg:\n${aktor}\n\nForsvarers innlegg:\n${forsvarer}\n\nAvsi din dom.`;
  const dom = parseDom(await askGateway(dommerPrompt, dommerInput));

  return { aktor, forsvarer, dom };
}
