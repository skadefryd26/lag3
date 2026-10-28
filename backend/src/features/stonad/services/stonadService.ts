import { askGateway } from "../../rettssak/clients/aiGateway.js";
import { geirPrompt } from "../prompts/stonadPrompts.js";
import type { StonadRequest, StonadResponse } from "../types/stonad.js";

/** Kardemommeby er nøye med saksnummer. Det er det eneste de er raske på. */
function saksnummer(): string {
  const aar = new Date().getFullYear();
  const nr = Math.floor(100000 + Math.random() * 900000);
  return `KB-${aar}/${nr}`;
}

function parseSvar(raw: string, omsoekt: number): { innvilget: number; svar: string } {
  const renset = raw.replace(/```(json)?/g, "").trim();
  try {
    const start = renset.indexOf("{");
    const slutt = renset.lastIndexOf("}");
    const json = JSON.parse(renset.slice(start, slutt + 1)) as { innvilget?: unknown; svar?: unknown };
    const innvilget = Math.round(Number(json.innvilget));
    if (Number.isFinite(innvilget) && typeof json.svar === "string") {
      return { innvilget: Math.min(Math.max(0, innvilget), omsoekt), svar: json.svar };
    }
  } catch {
    // faller tilbake under
  }
  return { innvilget: 0, svar: renset };
}

export async function behandleStonad(req: StonadRequest): Promise<StonadResponse> {
  const soknad = `Søknad om bollestønad.

Søker: ${req.navn}
Omsøkt beløp: ${req.beloep} kroner
Idømt straff i Bolle-retten: ${req.boller} boller
Søkerens forklaring i straffesaken: """${req.unnskyldning}"""

Behandle søknaden.`;

  const { innvilget, svar } = parseSvar(await askGateway(geirPrompt, soknad), req.beloep);
  return { innvilget, svar, saksnummer: saksnummer() };
}
