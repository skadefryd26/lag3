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

Hvorfor dagen tok slutt: ${stats.aarsak}
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
  const rolleBytte = stats.sjef
    ? '\n\nVIKTIG ROLLEBYTTE: Spilleren har kjøpt en forfremmelse og er nå DIN sjef. Du, Bjarne, er degradert til vanlig skadebehandler. Skriv ikke en medarbeidersamtale – skriv i stedet en kort, sur og overdrevent underdanig rapport fra deg til din nye sjef om dagens tall, der du motvillig roser sjefen og klager over at du selv nå må behandle saker.'
    : '';
  const instruks =
    stats.sprak === 'en'
      ? `${BJARNE_SYSTEMPROMPT}${rolleBytte}\n\nIMPORTANT: Write the entire text in natural British English, not Norwegian. Keep the same tone and personality.`
      : `${BJARNE_SYSTEMPROMPT}${rolleBytte}`;
  return kallGateway(instruks, byggRapport(stats));
}
