import type { Dagsresultat } from '../types/skadeko.types';

type Svar = { samtale: string };
type Feil = { feil: string };

/**
 * Sender dagens tall til vår egen backend. Backend legger ved Bjarnes
 * systemprompt og snakker med AI-gatewayen — nettleseren ser aldri tokenet.
 */
export async function hentMedarbeidersamtale(
  resultat: Dagsresultat,
): Promise<string> {
  const svar = await fetch('/api/medarbeidersamtale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resultat),
  });

  if (!svar.ok) {
    const data = (await svar.json().catch(() => null)) as Feil | null;
    throw new Error(
      data?.feil ?? 'Bjarne svarer ikke. Sjekk at backend kjører, og prøv igjen.',
    );
  }

  const data = (await svar.json()) as Svar;
  return data.samtale;
}
