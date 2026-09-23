import { useEffect, useMemo, useRef, useState } from 'react';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useFerdig } from '../lib/useFerdig';
import { useNedtelling } from '../lib/useNedtelling';
import type { MiniSpillProps } from '../types/stresspause.types';
import classes from './spill.module.css';

type Kopp = { navn: string; bredde: number; høyde: number; /** Andel av koppen per sekund ved start. */ fart: number };

const KOPPER: Kopp[] = [
  { navn: 'Krus', bredde: 130, høyde: 150, fart: 0.26 },
  { navn: 'Espressokopp', bredde: 90, høyde: 80, fart: 0.42 },
  { navn: 'Pappbeger', bredde: 110, høyde: 175, fart: 0.22 },
];

/** Strålen tar seg opp jo lenger du holder — det er det som gjør det vanskelig. */
const AKSELERASJON = 0.6;
/** Etter at du slipper, drypper det litt i så mange sekunder. */
const DRYPP = 0.2;
/** Så langt fra streken (andel av koppen) gir 0 poeng. */
const TOLERANSE = 0.2;

type Fase = 'klar' | 'heller' | 'drypper' | 'vurdert';

function vurdering(nivå: number, strek: number): string {
  const avvik = nivå - strek;
  if (nivå > 1) return 'SØL! ☕💦 Bjarne later som han ikke så det.';
  if (Math.abs(avvik) < 0.015) return 'PERFEKT! ✨ Barista-nivå.';
  if (Math.abs(avvik) < 0.05) return avvik > 0 ? 'Et hårstrå over. Godkjent.' : 'Et hårstrå under. Godkjent.';
  return avvik > 0 ? 'Litt mye. Bjarne tar skummet.' : 'Litt snaut. Det er nesten en espresso.';
}

export function Kaffehelling({ onFerdig }: MiniSpillProps) {
  const ferdig = useFerdig(onFerdig);
  const streker = useMemo(() => KOPPER.map(() => 0.6 + Math.random() * 0.28), []);
  const [indeks, setIndeks] = useState(0);
  const [nivå, setNivå] = useState(0);
  const [fase, setFase] = useState<Fase>('klar');
  const [kommentar, setKommentar] = useState<string | null>(null);
  const [poengListe, setPoengListe] = useState<number[]>([]);

  const s = useRef({ indeks: 0, nivå: 0, fase: 'klar' as Fase, holdt: 0, slippFart: 0, drypp: 0, poeng: [] as number[] });

  const snitt = (p: number[]) => p.reduce((a, b) => a + b, 0) / KOPPER.length;
  const igjen = useNedtelling(SPILLTID_SEKUNDER, () => {
    const st = s.current;
    // Koppen du holder på med teller der den står.
    if (st.fase !== 'vurdert' && st.nivå > 0) st.poeng.push(treff(st.nivå, streker[st.indeks]));
    ferdig(snitt(st.poeng));
  });

  function treff(n: number, strek: number) {
    if (n > 1) return 0;
    return Math.max(0, 1 - Math.abs(n - strek) / TOLERANSE);
  }

  useEffect(() => {
    let raf = 0;
    let forrige = performance.now();
    const loop = (nå: number) => {
      const dt = Math.min(0.05, (nå - forrige) / 1000);
      forrige = nå;
      const st = s.current;
      const kopp = KOPPER[st.indeks];

      if (st.fase === 'heller') {
        st.holdt += dt;
        st.nivå += kopp.fart * (1 + st.holdt * AKSELERASJON) * dt;
        setNivå(st.nivå);
      } else if (st.fase === 'drypper') {
        st.drypp += dt;
        const andel = Math.max(0, 1 - st.drypp / DRYPP);
        st.nivå += st.slippFart * andel * dt;
        setNivå(st.nivå);
        if (st.drypp >= DRYPP) vurder();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function settFase(f: Fase) {
    s.current.fase = f;
    setFase(f);
  }

  function vurder() {
    const st = s.current;
    const p = treff(st.nivå, streker[st.indeks]);
    st.poeng.push(p);
    setPoengListe([...st.poeng]);
    setKommentar(vurdering(st.nivå, streker[st.indeks]));
    settFase('vurdert');
    if (p > 0.85) lyd.riktig();
    else if (st.nivå > 1) lyd.knas();
    else lyd.pop();

    setTimeout(() => {
      if (st.indeks + 1 >= KOPPER.length) {
        ferdig(snitt(st.poeng));
        return;
      }
      st.indeks += 1;
      st.nivå = 0;
      st.holdt = 0;
      st.drypp = 0;
      setIndeks(st.indeks);
      setNivå(0);
      setKommentar(null);
      settFase('klar');
    }, 1100);
  }

  function start() {
    if (s.current.fase !== 'klar') return;
    s.current.holdt = 0;
    settFase('heller');
    lyd.swish();
  }

  function slipp() {
    const st = s.current;
    if (st.fase !== 'heller') return;
    st.slippFart = KOPPER[st.indeks].fart * (1 + st.holdt * AKSELERASJON);
    st.drypp = 0;
    settFase('drypper');
  }

  useEffect(() => {
    const ned = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (!e.repeat) start();
    };
    const opp = (e: KeyboardEvent) => e.code === 'Space' && slipp();
    window.addEventListener('keydown', ned);
    window.addEventListener('keyup', opp);
    window.addEventListener('pointerup', slipp);
    return () => {
      window.removeEventListener('keydown', ned);
      window.removeEventListener('keyup', opp);
      window.removeEventListener('pointerup', slipp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kopp = KOPPER[indeks];
  const strek = streker[indeks];
  const vist = Math.min(nivå, 1);
  const søl = nivå > 1;
  const heller = fase === 'heller' || fase === 'drypper';
  const overflate = kopp.høyde * vist;

  return (
    <SpillRamme
      igjen={igjen}
      total={SPILLTID_SEKUNDER}
      status={`Kopp ${indeks + 1} av ${KOPPER.length}: ${kopp.navn}`}
    >
      <div className={classes.hellflate}>
        <div className={classes.koppRad}>
          {KOPPER.map((k, i) => (
            <span key={k.navn} className={classes.koppPrikk} data-status={i < poengListe.length ? (poengListe[i] > 0.85 ? 'perfekt' : 'ok') : i === indeks ? 'aktiv' : undefined}>
              {i < poengListe.length ? `${Math.round(poengListe[i] * 100)} %` : '☕'}
            </span>
          ))}
        </div>

        <div className={classes.hellScene}>
          <div className={classes.kanne} data-heller={heller || undefined}>
            <span>🫖</span>
          </div>
          {fase === 'heller' && (
            <div className={classes.straale} style={{ height: `calc(100% - 64px - 24px - ${overflate}px)` }} />
          )}
          <div className={classes.kopp} key={indeks} style={{ width: kopp.bredde, height: kopp.høyde }}>
            <div className={classes.koppStrek} style={{ bottom: `${strek * 100}%` }}>
              <span>strek</span>
            </div>
            <div className={classes.kaffe} style={{ height: `${vist * 100}%` }} />
            {søl && <div className={classes.sol} style={{ width: `${kopp.bredde + (nivå - 1) * 500}px` }} />}
          </div>
        </div>

        <div className={classes.kaffeKommentar}>{kommentar ?? (fase === 'klar' ? 'Hold inne for å helle. Slipp på streken.' : ' ')}</div>

        <button
          type="button"
          className={classes.kaffeKnapp}
          data-holder={fase === 'heller' || undefined}
          disabled={fase === 'vurdert' || fase === 'drypper'}
          onPointerDown={start}
        >
          {fase === 'heller' ? 'Heller… ☕' : 'Hold for å helle'}
        </button>
      </div>
      <p className={classes.hint}>Hold inne museknappen eller mellomrom. Strålen blir raskere jo lenger du heller, og det drypper litt etter at du slipper.</p>
    </SpillRamme>
  );
}
