import { useCallback, useEffect, useRef, useState } from 'react';
import { TAPSMELDINGER, finnTittel, plukk } from '../data/saker';
import { KATEGORIER, SAKMALER } from '../data/skadesaker';
import { GRAD_ETTER_ID, STANDARD_GRAD, type VanskelighetsgradId } from '../data/vanskelighetsgrader';
import type {
  Dagsresultat,
  Sak,
  Spilltilstand,
  Tilbakemelding,
} from '../types/skadeko.types';

const MAKS_SAKER_PA_SKRIVEBORDET = 8;
/** Liv per dag. Du mister ett når en kunde går lei, og ett for hvert feil svar. */
const LIV = 3;

/** Poeng du mister for feil svar. */
const TREKK_FEIL_SVAR = 10;
/** Tidsbonus: opptil denne andelen av sakens poeng, jo raskere jo mer. */
const TIDSBONUS_ANDEL = 0.5;
/** Combo: ekstra poeng per riktige svar på rad, fra og med det andre. */
const COMBO_PER_STEG = 5;

/*
 * Vanskelighetsgraden følger aktiv spilletid (pauser teller ikke) og øker
 * jevnt uten tak — dagen tar slutt fordi du til slutt ikke henger med.
 * Level 10 nås etter 150 sekunder; etter det blir det fortsatt verre.
 *
 *   aktiv tid        0 s   37 s   75 s  112 s  150 s  (level 10)
 *   ny sak hvert   4,5 s   3,6 s  3,0 s  2,5 s  2,2 s
 *   tid per sak     36 s    28 s   23 s   19 s   17 s  (× kategoriens tålmodighet)
 *
 * Tallene over er Senior. Vikar og Fulltid ganger dem med faktorene i
 * `data/vanskelighetsgrader.ts`.
 */
export const MAKS_LEVEL = 10;
const TID_TIL_MAKS_LEVEL_MS = 150 * 1000;

/** 0 ved start, 1 ved level 10, og videre oppover. */
const framdrift = (aktivMs: number) => aktivMs / TID_TIL_MAKS_LEVEL_MS;

const spawnIntervall = (aktivMs: number) =>
  Math.max(1200, 4500 / (1 + 1.05 * framdrift(aktivMs)));

const grunnVarighet = (aktivMs: number) =>
  Math.max(6000, 36000 / (1 + 1.13 * framdrift(aktivMs)));

const levelFor = (aktivMs: number) =>
  Math.min(MAKS_LEVEL, 1 + Math.floor(framdrift(aktivMs) * (MAKS_LEVEL - 1)));

function tomForLivTekst(tapt: number, feil: number): string {
  const deler = [];
  if (tapt > 0) deler.push(`${tapt} ${tapt === 1 ? 'kunde gikk' : 'kunder gikk'} lei`);
  if (feil > 0) deler.push(`${feil} feil svar`);
  return `Tom for liv: ${deler.join(' og ')}.`;
}

function bland<T>(liste: T[]): T[] {
  const kopi = [...liste];
  for (let i = kopi.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopi[i], kopi[j]] = [kopi[j], kopi[i]];
  }
  return kopi;
}

/**
 * Hele spill-loopen. Kjører på requestAnimationFrame og pauser når fanen
 * ikke er synlig, slik at saker ikke utløper mens du sjekker Teams.
 */
export function useSkadeko() {
  const [tilstand, setTilstand] = useState<Spilltilstand>('ikke-startet');
  const [pauset, setPauset] = useState(false);
  const [saker, setSaker] = useState<Sak[]>([]);
  const [poeng, setPoeng] = useState(0);
  const [behandlet, setBehandlet] = useState(0);
  const [tapt, setTapt] = useState(0);
  const [feil, setFeil] = useState(0);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [tapsmelding, setTapsmelding] = useState<string | null>(null);
  const [tilbakemelding, setTilbakemelding] = useState<Tilbakemelding | null>(null);
  const [aapenId, setAapenId] = useState<number | null>(null);
  const [resultat, setResultat] = useState<Dagsresultat | null>(null);
  const [grad, setGrad] = useState<VanskelighetsgradId>(STANDARD_GRAD);

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
  const feilRef = useRef(0);
  const comboRef = useRef(0);
  const tapteSaker = useRef<string[]>([]);
  const kjorer = useRef(false);
  /** Samlet pausetid, så vanskeligheten bare følger tida du faktisk spiller. */
  const pauseTotal = useRef(0);
  const levelRef = useRef(1);
  const gradRef = useRef<VanskelighetsgradId>(STANDARD_GRAD);
  const aktivTid = (na: number) => na - startetPa.current - pauseTotal.current;

  const avsluttDagen = useCallback((aarsak: string) => {
    kjorer.current = false;
    pausetPa.current = 0;
    cancelAnimationFrame(frame.current);
    setPauset(false);
    setAapenId(null);
    const sekunder = Math.round((performance.now() - startetPa.current) / 1000);
    setResultat({
      poeng: poengRef.current,
      behandlet: behandletRef.current,
      tapt: taptRef.current,
      tittel: finnTittel(poengRef.current),
      tapteSaker: [...tapteSaker.current],
      sekunderSpilt: sekunder,
      aarsak,
      vanskelighetsgrad: gradRef.current,
    });
    setTilstand('ferdig');
  }, []);

  const lagSak = useCallback((na: number): Sak => {
    // Ikke legg samme sak på bordet to ganger samtidig.
    const paBordet = new Set(sakerRef.current.map((s) => s.beskrivelse));
    const ledige = SAKMALER.filter((m) => !paBordet.has(m.beskrivelse));
    const mal = plukk(ledige.length > 0 ? ledige : SAKMALER);

    const riktigTekst = mal.svar[mal.riktig];
    const svar = bland(mal.svar);
    const varighet =
      grunnVarighet(aktivTid(na)) *
      GRAD_ETTER_ID[gradRef.current].varighetFaktor *
      KATEGORIER[mal.kategori].talmodighet;
    spawnet.current += 1;

    return {
      ...mal,
      id: nesteId.current++,
      svar,
      riktig: svar.indexOf(riktigTekst),
      frist: na + varighet,
      varighet,
      igjen: 1,
    };
  }, []);

  const tick = useCallback(
    (na: number) => {
      if (!kjorer.current) return;

      const nyttLevel = levelFor(aktivTid(na));
      if (nyttLevel !== levelRef.current) {
        levelRef.current = nyttLevel;
        setLevel(nyttLevel);
      }

      const overlevende: Sak[] = [];
      let mistet = 0;
      let sisteTap: string | null = null;

      for (const sak of sakerRef.current) {
        const igjen = (sak.frist - na) / sak.varighet;
        if (igjen <= 0) {
          mistet += 1;
          tapteSaker.current.push(`Kunden gikk lei: ${sak.beskrivelse} (${sak.kunde})`);
          sisteTap = plukk(TAPSMELDINGER);
        } else {
          overlevende.push({ ...sak, igjen });
        }
      }

      if (na >= nesteSpawn.current) {
        if (overlevende.length < MAKS_SAKER_PA_SKRIVEBORDET) {
          sakerRef.current = overlevende;
          overlevende.push(lagSak(na));
        }
        nesteSpawn.current =
          na + spawnIntervall(aktivTid(na)) * GRAD_ETTER_ID[gradRef.current].spawnFaktor;
      }

      sakerRef.current = overlevende;
      setSaker(overlevende);

      if (mistet > 0) {
        taptRef.current += mistet;
        comboRef.current = 0;
        setCombo(0);
        setTapt(taptRef.current);
        setTapsmelding(sisteTap);
        if (taptRef.current + feilRef.current >= LIV) {
          avsluttDagen(tomForLivTekst(taptRef.current, feilRef.current));
          return;
        }
      }

      frame.current = requestAnimationFrame(tick);
    },
    [avsluttDagen, lagSak],
  );

  /** Dagen er tapt av noe annet enn saker — f.eks. at en måler nådde krisepunktet. */
  const tapDagen = useCallback(
    (aarsak: string) => {
      if (!kjorer.current) return;
      avsluttDagen(aarsak);
    },
    [avsluttDagen],
  );

  const apneSak = useCallback((id: number) => {
    if (!kjorer.current || pausetPa.current !== 0) return;
    setAapenId(id);
  }, []);

  const lukkSak = useCallback(() => setAapenId(null), []);

  /** Spilleren har valgt et svar på en sak. */
  const svarPaSak = useCallback((id: number, valg: number) => {
    if (!kjorer.current || pausetPa.current !== 0) return;
    const sak = sakerRef.current.find((s) => s.id === id);
    if (!sak) return;

    sakerRef.current = sakerRef.current.filter((s) => s.id !== id);
    setSaker(sakerRef.current);
    setAapenId(null);

    const kategori = KATEGORIER[sak.kategori];

    if (valg === sak.riktig) {
      comboRef.current += 1;
      const tidsbonus = Math.round(kategori.poeng * TIDSBONUS_ANDEL * sak.igjen);
      const combobonus = comboRef.current >= 2 ? (comboRef.current - 1) * COMBO_PER_STEG : 0;
      const sum = kategori.poeng + tidsbonus + combobonus;

      poengRef.current += sum;
      behandletRef.current += 1;

      const deler = [`${kategori.poeng} for saken`];
      if (tidsbonus > 0) deler.push(`${tidsbonus} i tidsbonus`);
      if (combobonus > 0) deler.push(`${combobonus} i combo (${comboRef.current} på rad)`);
      setTilbakemelding({
        id: Date.now(),
        riktig: true,
        poeng: sum,
        tekst: `Riktig! +${sum} (${deler.join(', ')})`,
      });
    } else {
      comboRef.current = 0;
      poengRef.current = Math.max(0, poengRef.current - TREKK_FEIL_SVAR);
      tapteSaker.current.push(
        `Feil svar: ${sak.beskrivelse} (${sak.kunde}) — svarte «${sak.svar[valg]}»`,
      );
      feilRef.current += 1;
      setFeil(feilRef.current);
      setTilbakemelding({
        id: Date.now(),
        riktig: false,
        poeng: -TREKK_FEIL_SVAR,
        tekst: `Feil! −${TREKK_FEIL_SVAR} og −1 liv. Riktig svar var: ${sak.svar[sak.riktig]}`,
      });
      if (taptRef.current + feilRef.current >= LIV) {
        avsluttDagen(tomForLivTekst(taptRef.current, feilRef.current));
        return;
      }
    }

    setCombo(comboRef.current);
    setBehandlet(behandletRef.current);
    setPoeng(poengRef.current);
  }, [avsluttDagen]);

  /** Starter en ny arbeidsdag på valgt vanskelighetsgrad. */
  const startDagen = useCallback((nyGrad: VanskelighetsgradId) => {
    cancelAnimationFrame(frame.current);
    sakerRef.current = [];
    tapteSaker.current = [];
    nesteId.current = 0;
    spawnet.current = 0;
    gradRef.current = nyGrad;
    setGrad(nyGrad);
    pauseTotal.current = 0;
    levelRef.current = 1;
    setLevel(1);
    poengRef.current = 0;
    behandletRef.current = 0;
    taptRef.current = 0;
    feilRef.current = 0;
    comboRef.current = 0;

    setSaker([]);
    setPoeng(0);
    setBehandlet(0);
    setTapt(0);
    setFeil(0);
    setCombo(0);
    setTapsmelding(null);
    setTilbakemelding(null);
    setAapenId(null);
    setResultat(null);
    setPauset(false);
    setTilstand('spiller');

    const na = performance.now();
    startetPa.current = na;
    nesteSpawn.current = na + 600;
    kjorer.current = true;
    frame.current = requestAnimationFrame(tick);
  }, [tick]);

  /**
   * Fryser skadekøen. Brukes når spilleren åpner et tiltak — fristene står
   * stille så lenge hen er borte fra skrivebordet.
   */
  const pause = useCallback(() => {
    if (!kjorer.current || pausetPa.current !== 0) return;
    pausetPa.current = performance.now();
    cancelAnimationFrame(frame.current);
    setAapenId(null);
    setPauset(true);
  }, []);

  /** Starter køen igjen og skyver alle frister like langt fram som pausen varte. */
  const fortsett = useCallback(() => {
    if (!kjorer.current || pausetPa.current === 0) return;
    const borte = performance.now() - pausetPa.current;
    pausetPa.current = 0;
    sakerRef.current = sakerRef.current.map((s) => ({ ...s, frist: s.frist + borte }));
    setSaker(sakerRef.current);
    nesteSpawn.current += borte;
    pauseTotal.current += borte;
    setPauset(false);
    frame.current = requestAnimationFrame(tick);
  }, [tick]);

  // Pause nedtellingen når fanen ikke er synlig.
  useEffect(() => {
    const vedBytte = () => {
      if (!kjorer.current) return;
      if (document.hidden) pause();
      else fortsett();
    };
    document.addEventListener('visibilitychange', vedBytte);
    return () => document.removeEventListener('visibilitychange', vedBytte);
  }, [pause, fortsett]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Utløper saken mens den er åpen, forsvinner den bare.
  const aapenSak = saker.find((s) => s.id === aapenId) ?? null;

  return {
    tilstand,
    pauset,
    saker,
    poeng,
    behandlet,
    tapt,
    combo,
    level,
    grad,
    tapsmelding,
    tilbakemelding,
    aapenSak,
    resultat,
    startDagen,
    tapDagen,
    apneSak,
    lukkSak,
    svarPaSak,
    pause,
    fortsett,
    liv: LIV,
    livIgjen: Math.max(0, LIV - tapt - feil),
  };
}
