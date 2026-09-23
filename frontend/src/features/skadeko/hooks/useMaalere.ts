import { useCallback, useEffect, useRef, useState } from 'react';
import { MAALERE, MAALER_ETTER_ID, STARTVERDIER } from '../data/maalere';
import type { MaalerId, Maalere } from '../types/skadeko.types';

/**
 * Holder styr på Energi, Blære og Stress.
 *
 * Målerne drifter sakte mens du spiller, og står stille når spillet er pauset
 * — for eksempel mens et tiltak er åpent. Unntaket er en måler som tømmes
 * (blæra på do): den går ned selv om resten står stille.
 *
 * Minispillene kaller `paavirk(id, n)` med hvor mange prosentpoeng spilleren
 * fortjente. Tiltak uten minispill (do-turen) bruker `startTomming(id)`.
 */
export function useMaalere(aktiv: boolean) {
  const [maalere, setMaalere] = useState<Maalere>({ ...STARTVERDIER });
  /** Målere som tømmes akkurat nå (f.eks. blæra mens du er på do). */
  const [tommes, setTommes] = useState<MaalerId[]>([]);
  const tommesRef = useRef<MaalerId[]>([]);
  tommesRef.current = tommes;
  const sist = useRef(0);
  /** Sekunder spilt (uten pauser). Målerne drifter gradvis raskere utover dagen. */
  const spilt = useRef(0);
  const frame = useRef(0);

  const nullstill = useCallback(() => {
    setMaalere({ ...STARTVERDIER });
    setTommes([]);
    sist.current = 0;
    spilt.current = 0;
  }, []);

  /**
   * Flytter én måler i retning «bra». Positiv `endring` er alltid til
   * spillerens fordel, uansett om måleren tappes eller fylles.
   */
  const paavirk = useCallback((id: MaalerId, endring: number) => {
    const konfig = MAALER_ETTER_ID[id];
    setMaalere((forrige) => {
      const retning = konfig.retning === 'tappes' ? 1 : -1;
      let ny = forrige[id] + endring * retning;
      // Tiltaket kan ikke løfte måleren over taket — men trekker den heller ikke ned.
      if (konfig.tiltakTak !== undefined && konfig.retning === 'tappes') {
        ny = Math.max(forrige[id], Math.min(konfig.tiltakTak, ny));
      }
      return { ...forrige, [id]: klem(ny) };
    });
  }, []);

  /** Starter tømming av en måler som har `tommingPerSekund`. Skadekøen går videre imens. */
  const startTomming = useCallback((id: MaalerId) => {
    setTommes((t) => (t.includes(id) ? t : [...t, id]));
  }, []);

  /** Avbryter tømmingen før den er i mål (f.eks. «løp tilbake til pulten»). */
  const stoppTomming = useCallback((id: MaalerId) => {
    setTommes((t) => t.filter((x) => x !== id));
  }, []);

  // Stopp tømmingen når måleren er i mål. Nøkkelen endres bare når en måler
  // når målet, ikke hver frame — ellers ville timeren aldri rukket å fyre.
  const iMaal = tommes
    .filter((id) => maalere[id] === (MAALER_ETTER_ID[id].retning === 'tappes' ? 100 : 0))
    .join(',');
  useEffect(() => {
    if (!iMaal) return;
    const ferdige = iMaal.split(',');
    // Litt pusterom i mål, så «ferdig» rekker å vises før modalen lukkes.
    const id = setTimeout(() => setTommes((t) => t.filter((m) => !ferdige.includes(m))), 900);
    return () => clearTimeout(id);
  }, [iMaal]);

  const aktivRef = useRef(aktiv);
  aktivRef.current = aktiv;
  // Loopen går også under en tømming, selv om spillet ellers er pauset.
  const kjor = aktiv || tommes.length > 0;

  // Driften. Én loop for alle tre.
  useEffect(() => {
    if (!kjor) {
      cancelAnimationFrame(frame.current);
      sist.current = 0;
      return;
    }

    const tick = (na: number) => {
      if (sist.current === 0) sist.current = na;
      const sekunder = (na - sist.current) / 1000;
      sist.current = na;

      if (sekunder > 0) {
        const iSpill = aktivRef.current;
        if (iSpill) spilt.current += sekunder;
        // Dobbelt så rask drift etter 4 minutter, tre ganger etter 8.
        const opptrapping = 1 + spilt.current / 240;
        setMaalere((forrige) => {
          const neste = { ...forrige };
          for (const konfig of MAALERE) {
            const retning = konfig.retning === 'tappes' ? -1 : 1;
            // Under tømming går måleren i spillerens favør i stedet for å drifte.
            // Mens spillet er pauset (f.eks. på do) står de andre målerne stille.
            const fart = tommesRef.current.includes(konfig.id)
              ? -(konfig.tommingPerSekund ?? 0)
              : iSpill
                ? konfig.driftPerSekund * opptrapping
                : 0;
            neste[konfig.id] = klem(forrige[konfig.id] + fart * sekunder * retning);
          }
          return neste;
        });
      }

      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [kjor]);

  return { maalere, paavirk, nullstill, tommes, startTomming, stoppTomming };
}

function klem(verdi: number): number {
  return Math.max(0, Math.min(100, verdi));
}
