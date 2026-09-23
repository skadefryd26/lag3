import { useCallback, useEffect, useRef, useState } from 'react';
import { plukk } from '../data/saker';
import { AVSENDERE, PAMINNELSER, TEAMSMELDINGER } from '../data/teamsmeldinger';

export type Teamsmelding = {
  id: number;
  avsender: (typeof AVSENDERE)[number];
  linjer: string[];
};

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
 */
export function useTeamsForstyrrelser(aktiv: boolean) {
  const [meldinger, setMeldinger] = useState<Teamsmelding[]>([]);
  const nesteId = useRef(0);

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
          setMeldinger((naa) =>
            naa.length >= MAKS_SAMTIDIG
              ? naa
              : [
                  ...naa,
                  {
                    id: nesteId.current++,
                    avsender: plukk([...AVSENDERE]),
                    linjer: [plukk([...TEAMSMELDINGER])],
                  },
                ],
          );
        }
        planlegg(false);
      }, venteTid(forste));
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
                ? { ...x, linjer: [...x.linjer, plukk([...PAMINNELSER])] }
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
