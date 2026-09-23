import { kallGateway } from '../clients/ai-gateway.client.js';
import { BJARNE_SYSTEMPROMPT } from '../prompts/bjarne.js';
import type { MedarbeidersamtaleRequest } from '../types/medarbeidersamtale.types.js';

/** Gjør dagens tall om til en rapport Bjarne kan bli uimponert av. */
export function byggRapport(stats: MedarbeidersamtaleRequest): string {
  const minutter = Math.floor(stats.sekunderSpilt / 60);
  const sekunder = stats.sekunderSpilt % 60;
  const varighet = minutter > 0 ? `${minutter} min ${sekunder} sek` : `${sekunder} sekunder`;

  const snitt =
    stats.behandlet > 0
      ? `${(stats.sekunderSpilt / stats.behandlet).toFixed(1)} sekunder per sak`
      : 'ingen saker behandlet, så ingen saksbehandlingstid å måle';

  const tapte =
    stats.tapteSaker.length > 0
      ? stats.tapteSaker.map((sak) => `- ${sak}`).join('\n')
      : '- ingen (kunden rakk aldri å gå lei)';

  return `Dagsrapport fra skadekøen:

Arbeidsdagens lengde: ${varighet}
Saker behandlet: ${stats.behandlet}
Poeng: ${stats.poeng}
Kunder tapt: ${stats.tapt}
Gjennomsnittlig saksbehandlingstid: ${snitt}
Systemets automatiske tittel: ${stats.tittel}

Saker som gikk ut på tid:
${tapte}

Skriv medarbeidersamtalen.`;
}

export async function hentMedarbeidersamtale(
  stats: MedarbeidersamtaleRequest,
): Promise<string> {
  return kallGateway(BJARNE_SYSTEMPROMPT, byggRapport(stats));
}
