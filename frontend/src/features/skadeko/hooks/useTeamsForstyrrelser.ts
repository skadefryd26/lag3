import { useCallback, useEffect, useRef, useState } from 'react';
import { plukk } from '../data/saker';
import {
  AVSENDERE,
  PAMINNELSER,
  PAMINNELSER_EN,
  TEAMSMELDINGER,
  TEAMSMELDINGER_EN,
} from '../data/teamsmeldinger';

export type Teamsmelding = {
  id: number;
  avsender: (typeof AVSENDERE)[number];
  linjer: string[];
  /** Engelske linjer, samme rekkefølge som `linjer`. */
  linjerEn: string[];
};

const tilfeldigIndeks = (lengde: number) => Math.floor(Math.random() * lengde);

/** Maks antall popuper som kan ligge oppå hverandre samtidig. */
const MAKS_SAMTIDIG = 2;
/** Lar du en melding ligge så lenge, kommer det en påminnelse. */
const PAMINNELSE_ETTER_MS = 6000;

/** Første forstyrrelse etter 4–7 s, deretter hvert 5.–11. sekund. */
const venteTid = (forste: boolean) =>
  forste ? 4000 + Math.random() * 3000 : 5000 + Math.random() * 6000;

/**
 * Sender tilfeldige Teams-meldinger mens spillet pågår. Meldingene er rent
 * forstyrrende: de må lukkes, og de dekker deler av skrivebordet.
 *
 * `frekvens` ganges med hvor ofte meldingene kommer (0.5 = halvparten så ofte).
 */
export function useTeamsForstyrrelser(aktiv: boolean, frekvens = 1) {
  const [meldinger, setMeldinger] = useState<Teamsmelding[]>([]);
  const nesteId = useRef(0);
  const frekvensRef = useRef(frekvens);
  frekvensRef.current = frekvens;

  useEffect(() => {
    if (!aktiv) {
      setMeldinger([]);
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const planlegg = (forste: boolean) => {
      timer = setTimeout(() => {
        // Ikke hop opp mens fanen er skjult — spillet står på pause da.
        if (!document.hidden) {
          const i = tilfeldigIndeks(TEAMSMELDINGER.length);
          setMeldinger((naa) =>
            naa.length >= MAKS_SAMTIDIG
              ? naa
              : [
                  ...naa,
                  {
                    id: nesteId.current++,
                    avsender: plukk([...AVSENDERE]),
                    linjer: [TEAMSMELDINGER[i]],
                    linjerEn: [TEAMSMELDINGER_EN[i]],
                  },
                ],
          );
        }
        planlegg(false);
      }, venteTid(forste) / frekvensRef.current);
    };
    planlegg(true);

    return () => clearTimeout(timer);
  }, [aktiv]);

  // Ignorerte meldinger får én påminnelse.
  useEffect(() => {
    const timere = meldinger
      .filter((m) => m.linjer.length === 1)
      .map((m) =>
        setTimeout(() => {
          setMeldinger((naa) =>
            naa.map((x) =>
              x.id === m.id && x.linjer.length === 1
                ? (() => {
                    const i = tilfeldigIndeks(PAMINNELSER.length);
                    return {
                      ...x,
                      linjer: [...x.linjer, PAMINNELSER[i]],
                      linjerEn: [...x.linjerEn, PAMINNELSER_EN[i]],
                    };
                  })()
                : x,
            ),
          );
        }, PAMINNELSE_ETTER_MS),
      );
    return () => timere.forEach(clearTimeout);
  }, [meldinger]);

  const lukk = useCallback((id: number) => {
    setMeldinger((naa) => naa.filter((m) => m.id !== id));
  }, []);

  return { meldinger, lukk };
}
