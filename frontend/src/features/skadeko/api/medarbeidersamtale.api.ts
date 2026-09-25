import type { Dagsresultat } from '../types/skadeko.types';
import { lokalMedarbeidersamtale } from './lokalBjarne';

type Svar = { samtale: string };
type Feil = { feil: string };

/** Bygget med `--mode firebase`: ingen backend, Bjarne svarer fra ferdigskrevne setninger. */
const UTEN_BACKEND = import.meta.env.MODE === 'firebase';

/**
 * Sender dagens tall til vår egen backend. Backend legger ved Bjarnes
 * systemprompt og snakker med AI-gatewayen — nettleseren ser aldri tokenet.
 * `sprak` bestemmer hvilket språk Bjarne svarer på.
 */
export async function hentMedarbeidersamtale(
  resultat: Dagsresultat,
  sprak: 'no' | 'en',
  sjef = false,
): Promise<string> {
  if (UTEN_BACKEND) {
    // Litt betenkningstid, så det føles som Bjarne leser rapporten.
    await new Promise((ferdig) => setTimeout(ferdig, 1200));
    return lokalMedarbeidersamtale(resultat);
  }

  const svar = await fetch('/api/medarbeidersamtale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...resultat, sprak, sjef }),
  });

  if (!svar.ok) {
    const data = (await svar.json().catch(() => null)) as Feil | null;
    throw new Error(
      data?.feil ??
        (sprak === 'en'
          ? 'Bjarne is not answering. Check that the backend is running, and try again.'
          : 'Bjarne svarer ikke. Sjekk at backend kjører, og prøv igjen.'),
    );
  }

  const data = (await svar.json()) as Svar;
  return data.samtale;
}
