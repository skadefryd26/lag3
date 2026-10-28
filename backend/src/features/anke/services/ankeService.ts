import { askGateway } from "../../rettssak/clients/aiGateway.js";
import { hentInstans } from "../prompts/ankePrompts.js";
import type { AnkeRequest, AnkeResponse } from "../types/anke.js";

function parseDom(raw: string, minst: number): { boller: number; begrunnelse: string } {
  const cleaned = raw.replace(/```(json)?/g, "").trim();
  try {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    const json = JSON.parse(cleaned.slice(start, end + 1)) as { boller?: unknown; begrunnelse?: unknown };
    const boller = Math.round(Number(json.boller));
    if (Number.isFinite(boller) && typeof json.begrunnelse === "string") {
      return { boller: Math.max(minst, boller), begrunnelse: json.begrunnelse };
    }
  } catch {
    // faller tilbake under
  }
  const tall = cleaned.match(/\d+/);
  return { boller: Math.max(minst, tall ? Number(tall[0]) : minst), begrunnelse: cleaned };
}

export async function behandleAnke(req: AnkeRequest): Promise<AnkeResponse> {
  const { instans, dommer, prompt } = hentInstans(req.ankenivaa);

  // Anker man, blir det alltid verre. Minst dobbelt.
  const minst = Math.max(2, req.forrigeBoller * 2);

  const input = `Synderens opprinnelige forklaring for å ha gått fra PC-en ulåst:
"""${req.unnskyldning}"""

Forrige instans dømte synderen til ${req.forrigeBoller} boller, med denne begrunnelsen:
"""${req.forrigeBegrunnelse}"""

Synderen har anket. Dette er anke nummer ${req.ankenivaa}.
Du skjerper straffen. Den nye straffen skal være minst ${minst} boller.
Avsi din dom.`;

  const dom = parseDom(await askGateway(prompt, input), minst);

  return { instans, dommer, ...dom, kanAnkeVidere: true };
}
