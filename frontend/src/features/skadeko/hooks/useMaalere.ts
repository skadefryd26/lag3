import { useCallback, useEffect, useRef, useState } from 'react';
import { MAALERE, MAALER_ETTER_ID, STARTVERDIER } from '../data/maalere';
import type { MaalerId, Maalere } from '../types/skadeko.types';

/**
 * Holder styr på Energi, Blære og Stress.
 *
 * Målerne drifter sakte mens du spiller, og står stille når spillet er pauset
 * — for eksempel mens et tiltak er åpent.
 *
 * Minispillene finnes ikke ennå. Når de kommer, kaller de `paavirk(id, n)` med
 * hvor mange prosentpoeng spilleren fortjente. Det er hele sømmen.
 */
export function useMaalere(aktiv: boolean) {
  const [maalere, setMaalere] = useState<Maalere>({ ...STARTVERDIER });
  const sist = useRef(0);
  const frame = useRef(0);

  const nullstill = useCallback(() => {
    setMaalere({ ...STARTVERDIER });
    sist.current = 0;
  }, []);

  /**
   * Flytter én måler i retning «bra». Positiv `endring` er alltid til
   * spillerens fordel, uansett om måleren tappes eller fylles.
   */
  const paavirk = useCallback((id: MaalerId, endring: number) => {
    const konfig = MAALER_ETTER_ID[id];
    setMaalere((forrige) => {
      const retning = konfig.retning === 'tappes' ? 1 : -1;
      const ny = forrige[id] + endring * retning;
      return { ...forrige, [id]: klem(ny) };
    });
  }, []);

  // Driften. Én loop for alle tre.
  useEffect(() => {
    if (!aktiv) {
      cancelAnimationFrame(frame.current);
      sist.current = 0;
      return;
    }

    const tick = (na: number) => {
      if (sist.current === 0) sist.current = na;
      const sekunder = (na - sist.current) / 1000;
      sist.current = na;

      if (sekunder > 0) {
        setMaalere((forrige) => {
          const neste = { ...forrige };
          for (const konfig of MAALERE) {
            const retning = konfig.retning === 'tappes' ? -1 : 1;
            neste[konfig.id] = klem(
              forrige[konfig.id] + konfig.driftPerSekund * sekunder * retning,
            );
          }
          return neste;
        });
      }

      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [aktiv]);

  return { maalere, paavirk, nullstill };
}

function klem(verdi: number): number {
  return Math.max(0, Math.min(100, verdi));
}
