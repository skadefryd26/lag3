import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ETTERNAVN,
  FORNAVN,
  SKADESAKER,
  TAPSMELDINGER,
  finnTittel,
  plukk,
} from '../data/saker';
import type { Dagsresultat, Sak, Spilltilstand } from '../types/skadeko.types';

const POENG_PER_SAK = 10;
const MAKS_SAKER_PA_SKRIVEBORDET = 12;
const LIV = 3;

/** Sakene kommer gradvis raskere. */
const spawnIntervall = (antallSpawnet: number) =>
  Math.max(650, 2600 * Math.pow(0.96, antallSpawnet));

/** ...og fristene blir kortere. */
const sakensVarighet = (antallSpawnet: number) =>
  Math.max(3800, 9000 - antallSpawnet * 110);

/**
 * Hele spill-loopen. Kjører på requestAnimationFrame og pauser når fanen
 * ikke er synlig, slik at saker ikke utløper mens du sjekker Teams.
 */
export function useSkadeko() {
  const [tilstand, setTilstand] = useState<Spilltilstand>('ikke-startet');
  const [saker, setSaker] = useState<Sak[]>([]);
  const [poeng, setPoeng] = useState(0);
  const [behandlet, setBehandlet] = useState(0);
  const [tapt, setTapt] = useState(0);
  const [tapsmelding, setTapsmelding] = useState<string | null>(null);
  const [resultat, setResultat] = useState<Dagsresultat | null>(null);

  // Alt som endrer seg hver frame ligger i refs — ikke i state.
  const sakerRef = useRef<Sak[]>([]);
  const nesteId = useRef(0);
  const spawnet = useRef(0);
  const nesteSpawn = useRef(0);
  const startetPa = useRef(0);
  const pausetPa = useRef(0);
  const frame = useRef(0);
  const poengRef = useRef(0);
  const behandletRef = useRef(0);
  const taptRef = useRef(0);
  const tapteSaker = useRef<string[]>([]);
  const kjorer = useRef(false);

  const avsluttDagen = useCallback(() => {
    kjorer.current = false;
    cancelAnimationFrame(frame.current);
    const sekunder = Math.round((performance.now() - startetPa.current) / 1000);
    setResultat({
      poeng: poengRef.current,
      behandlet: behandletRef.current,
      tapt: taptRef.current,
      tittel: finnTittel(poengRef.current),
      tapteSaker: [...tapteSaker.current],
      sekunderSpilt: sekunder,
    });
    setTilstand('ferdig');
  }, []);

  const lagSak = useCallback((na: number): Sak => {
    const [emoji, tittel] = plukk(SKADESAKER);
    const varighet = sakensVarighet(spawnet.current);
    spawnet.current += 1;
    return {
      id: nesteId.current++,
      emoji,
      tittel,
      kunde: `${plukk(FORNAVN)} ${plukk(ETTERNAVN)}`,
      frist: na + varighet,
      varighet,
      igjen: 1,
    };
  }, []);

  const tick = useCallback(
    (na: number) => {
      if (!kjorer.current) return;

      const overlevende: Sak[] = [];
      let mistet = 0;
      let sisteTap: string | null = null;

      for (const sak of sakerRef.current) {
        const igjen = (sak.frist - na) / sak.varighet;
        if (igjen <= 0) {
          mistet += 1;
          tapteSaker.current.push(`${sak.tittel} (${sak.kunde})`);
          sisteTap = plukk(TAPSMELDINGER);
        } else {
          overlevende.push({ ...sak, igjen });
        }
      }

      if (na >= nesteSpawn.current && overlevende.length < MAKS_SAKER_PA_SKRIVEBORDET) {
        overlevende.push(lagSak(na));
        nesteSpawn.current = na + spawnIntervall(spawnet.current);
      } else if (na >= nesteSpawn.current) {
        nesteSpawn.current = na + spawnIntervall(spawnet.current);
      }

      sakerRef.current = overlevende;
      setSaker(overlevende);

      if (mistet > 0) {
        taptRef.current += mistet;
        setTapt(taptRef.current);
        setTapsmelding(sisteTap);
        if (taptRef.current >= LIV) {
          avsluttDagen();
          return;
        }
      }

      frame.current = requestAnimationFrame(tick);
    },
    [avsluttDagen, lagSak],
  );

  const behandleSak = useCallback((id: number) => {
    if (!kjorer.current) return;
    if (!sakerRef.current.some((s) => s.id === id)) return;

    sakerRef.current = sakerRef.current.filter((s) => s.id !== id);
    setSaker(sakerRef.current);
    behandletRef.current += 1;
    poengRef.current += POENG_PER_SAK;
    setBehandlet(behandletRef.current);
    setPoeng(poengRef.current);
  }, []);

  const startDagen = useCallback(() => {
    cancelAnimationFrame(frame.current);
    sakerRef.current = [];
    tapteSaker.current = [];
    nesteId.current = 0;
    spawnet.current = 0;
    poengRef.current = 0;
    behandletRef.current = 0;
    taptRef.current = 0;

    setSaker([]);
    setPoeng(0);
    setBehandlet(0);
    setTapt(0);
    setTapsmelding(null);
    setResultat(null);
    setTilstand('spiller');

    const na = performance.now();
    startetPa.current = na;
    nesteSpawn.current = na + 600;
    kjorer.current = true;
    frame.current = requestAnimationFrame(tick);
  }, [tick]);

  // Pause nedtellingen når fanen ikke er synlig.
  useEffect(() => {
    const vedBytte = () => {
      if (!kjorer.current) return;
      if (document.hidden) {
        pausetPa.current = performance.now();
        cancelAnimationFrame(frame.current);
      } else {
        const borte = performance.now() - pausetPa.current;
        sakerRef.current = sakerRef.current.map((s) => ({ ...s, frist: s.frist + borte }));
        nesteSpawn.current += borte;
        frame.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', vedBytte);
    return () => document.removeEventListener('visibilitychange', vedBytte);
  }, [tick]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return {
    tilstand,
    saker,
    poeng,
    behandlet,
    tapt,
    tapsmelding,
    resultat,
    startDagen,
    behandleSak,
    liv: LIV,
  };
}
