import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { hentUkensHighscores, lagreHighscore, ukestart, type Highscore } from '../api/highscores.api';
import type { VanskelighetsgradId } from '../data/vanskelighetsgrader';

export type { Highscore };

export const ANTALL_PLASSER = 10;
const NOKKEL = ['highscores'];

/** Topp 10 for én grad, best først. */
const toppFor = (liste: Highscore[], grad: VanskelighetsgradId) =>
  liste.filter((h) => h.grad === grad).sort((a, b) => b.poeng - a.poeng).slice(0, ANTALL_PLASSER);

/**
 * Ukens topp 10 per vanskelighetsgrad, delt mellom alle som spiller.
 * Ligger i Firestore og starter på nytt hver mandag.
 */
export function useHighscores() {
  const klient = useQueryClient();
  const { data: liste = [], isError, isPending } = useQuery({
    queryKey: NOKKEL,
    queryFn: hentUkensHighscores,
    staleTime: 30_000,
  });

  /** Kommer poengsummen inn på lista for graden? Er lista ikke full, holder det med mer enn 0. */
  const kvalifiserer = useCallback(
    (poeng: number, grad: VanskelighetsgradId) => {
      if (poeng <= 0) return false;
      const naa = toppFor(liste, grad);
      if (naa.length < ANTALL_PLASSER) return true;
      return poeng > naa[naa.length - 1].poeng;
    },
    [liste],
  );

  /** Lagrer i Firestore og henter lista på nytt. Kaster hvis det ikke gikk. */
  const leggTil = useCallback(
    async (navn: string, poeng: number, grad: VanskelighetsgradId) => {
      await lagreHighscore({ navn, poeng, grad });
      await klient.invalidateQueries({ queryKey: NOKKEL });
    },
    [klient],
  );

  /** Henter ferske tall, f.eks. når tavla åpnes eller en dag er over. */
  const oppdater = useCallback(() => klient.invalidateQueries({ queryKey: NOKKEL }), [klient]);

  const listeFor = useCallback((grad: VanskelighetsgradId) => toppFor(liste, grad), [liste]);

  const nullstillesPa = ukestart();
  nullstillesPa.setDate(nullstillesPa.getDate() + 7);

  return { listeFor, kvalifiserer, leggTil, oppdater, nullstillesPa, laster: isPending, feil: isError };
}
