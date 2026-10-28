import { askGateway } from "../clients/aiGateway.js";
import { aktorPrompt, dommerPrompt, forsvarerPrompt } from "../prompts/prompts.js";
import type { RettssakResponse } from "../types/rettssak.js";

function parseDom(raw: string): RettssakResponse["dom"] {
  const cleaned = raw.replace(/```(json)?/g, "").trim();
  try {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    const json = JSON.parse(cleaned.slice(start, end + 1)) as { boller?: unknown; begrunnelse?: unknown };
    const boller = Math.round(Number(json.boller));
    if (Number.isFinite(boller) && typeof json.begrunnelse === "string") {
      return { boller: Math.min(100, Math.max(1, boller)), begrunnelse: json.begrunnelse };
    }
  } catch {
    // faller tilbake under
  }
  const tall = cleaned.match(/\d+/);
  return { boller: tall ? Math.min(100, Math.max(1, Number(tall[0]))) : 42, begrunnelse: cleaned };
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
