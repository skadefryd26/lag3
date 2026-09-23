import { useCallback, useState } from 'react';

export type Highscore = {
  navn: string;
  poeng: number;
  dato: string;
};

/** Det som ligger lagret: lista og når inneværende periode startet. */
type Lagret = {
  periodeStart: string;
  liste: Highscore[];
};

const NOKKEL = 'skadeko-highscores';
export const ANTALL_PLASSER = 10;
const PERIODE_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Leser lista. Har det gått 7 dager siden perioden startet, er lista nullstilt
 * og en ny periode starter nå.
 */
function les(): Lagret {
  const ny = (): Lagret => ({ periodeStart: new Date().toISOString(), liste: [] });
  try {
    const raa = localStorage.getItem(NOKKEL);
    if (!raa) return ny();
    const data = JSON.parse(raa) as Lagret | Highscore[];
    // Eldre format var bare en liste — start en ny periode for den.
    const lagret: Lagret = Array.isArray(data)
      ? { periodeStart: new Date().toISOString(), liste: data }
      : data;
    const start = Date.parse(lagret.periodeStart);
    if (!Array.isArray(lagret.liste) || Number.isNaN(start)) return ny();
    if (Date.now() - start >= PERIODE_MS) {
      const nullstilt = ny();
      localStorage.setItem(NOKKEL, JSON.stringify(nullstilt));
      return nullstilt;
    }
    return lagret;
  } catch {
    return ny();
  }
}

/** Topp 10, lagret i nettleseren på denne maskinen. Nullstilles hver 7. dag. */
export function useHighscores() {
  const [data, setData] = useState<Lagret>(les);
  const liste = data.liste;

  /** Kommer poengsummen inn på lista? Er lista ikke full, holder det med mer enn 0. */
  const kvalifiserer = useCallback(
    (poeng: number) => {
      if (poeng <= 0) return false;
      const naa = les().liste;
      if (naa.length < ANTALL_PLASSER) return true;
      return poeng > naa[naa.length - 1].poeng;
    },
    [liste],
  );

  const leggTil = useCallback((navn: string, poeng: number) => {
    const naa = les();
    const ny: Highscore = { navn: navn.trim().slice(0, 24), poeng, dato: new Date().toISOString() };
    const oppdatert: Lagret = {
      periodeStart: naa.periodeStart,
      liste: [...naa.liste, ny].sort((a, b) => b.poeng - a.poeng).slice(0, ANTALL_PLASSER),
    };
    localStorage.setItem(NOKKEL, JSON.stringify(oppdatert));
    setData(oppdatert);
  }, []);

  /** Leser på nytt, slik at en utløpt periode nullstilles når lista åpnes. */
  const oppdater = useCallback(() => setData(les()), []);

  const nullstillesPa = new Date(Date.parse(data.periodeStart) + PERIODE_MS);

  return { liste, kvalifiserer, leggTil, oppdater, nullstillesPa };
}
