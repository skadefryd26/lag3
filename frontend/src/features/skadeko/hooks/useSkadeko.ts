import { useCallback, useEffect, useRef, useState } from 'react';
import { TAPSMELDINGER, finnTittel, plukk } from '../data/saker';
import { KATEGORIER, SAKMALER } from '../data/skadesaker';
import type {
  Dagsresultat,
  Sak,
  Spilltilstand,
  Tilbakemelding,
} from '../types/skadeko.types';

const MAKS_SAKER_PA_SKRIVEBORDET = 8;
const LIV = 3;

/** Poeng du mister for feil svar. */
const TREKK_FEIL_SVAR = 10;
/** Tidsbonus: opptil denne andelen av sakens poeng, jo raskere jo mer. */
const TIDSBONUS_ANDEL = 0.5;
/** Combo: ekstra poeng per riktige svar på rad, fra og med det andre. */
const COMBO_PER_STEG = 5;

/*
 * Vanskelighetsgraden øker jevnt og uten tak — dagen tar slutt fordi du til
 * slutt ikke henger med, ikke fordi en klokke sier det. Myke kurver, ingen
 * plutselige hopp:
 *
 *   sak nr.         0     10     20     40     60
 *   ny sak hvert   12 s  7,5 s  5,5 s  3,5 s  2,6 s
 *   tid per sak    45 s   32 s   25 s   17 s   13 s  (× kategoriens tålmodighet)
 */
const spawnIntervall = (antallSpawnet: number) =>
  Math.max(1200, 12000 / (1 + antallSpawnet * 0.06));

const grunnVarighet = (antallSpawnet: number) =>
  Math.max(6000, 45000 / (1 + antallSpawnet * 0.04));

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
  const [combo, setCombo] = useState(0);
  const [tapsmelding, setTapsmelding] = useState<string | null>(null);
  const [tilbakemelding, setTilbakemelding] = useState<Tilbakemelding | null>(null);
  const [aapenId, setAapenId] = useState<number | null>(null);
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
  const comboRef = useRef(0);
  const tapteSaker = useRef<string[]>([]);
  const kjorer = useRef(false);

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
    const varighet = grunnVarighet(spawnet.current) * KATEGORIER[mal.kategori].talmodighet;
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

      if (na >= nesteSpawn.current && overlevende.length < MAKS_SAKER_PA_SKRIVEBORDET) {
        sakerRef.current = overlevende;
        overlevende.push(lagSak(na));
        nesteSpawn.current = na + spawnIntervall(spawnet.current);
      } else if (na >= nesteSpawn.current) {
        nesteSpawn.current = na + spawnIntervall(spawnet.current);
      }

      sakerRef.current = overlevende;
      setSaker(overlevende);

      if (mistet > 0) {
        taptRef.current += mistet;
        comboRef.current = 0;
        setCombo(0);
        setTapt(taptRef.current);
        setTapsmelding(sisteTap);
        if (taptRef.current >= LIV) {
          avsluttDagen(`${LIV} kunder gikk lei før du rakk å svare.`);
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
      setTilbakemelding({
        id: Date.now(),
        riktig: false,
        poeng: -TREKK_FEIL_SVAR,
        tekst: `Feil! −${TREKK_FEIL_SVAR}. Riktig svar var: ${sak.svar[sak.riktig]}`,
      });
    }

    setCombo(comboRef.current);
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
    comboRef.current = 0;

    setSaker([]);
    setPoeng(0);
    setBehandlet(0);
    setTapt(0);
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
  };
}
