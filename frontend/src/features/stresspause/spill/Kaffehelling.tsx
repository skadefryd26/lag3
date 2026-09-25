import { useEffect, useMemo, useRef, useState } from 'react';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useFerdig } from '../lib/useFerdig';
import { useNedtelling } from '../lib/useNedtelling';
import type { MiniSpillProps } from '../types/stresspause.types';
import { tekst, useSprak } from '../../../sprak';
import classes from './spill.module.css';

const KOPP = { bredde: 130, høyde: 150 };
/** Andel av koppen per sekund når du begynner å helle. */
const FART = 0.3;
/** Strålen tar seg opp jo lenger du holder — det er det som gjør det vanskelig. */
const AKSELERASJON = 0.6;
/** Etter at du slipper, drypper det litt i så mange sekunder. */
const DRYPP = 0.2;
/** Så langt fra streken (andel av koppen) gir 0 poeng. */
const TOLERANSE = 0.15;

type Fase = 'klar' | 'heller' | 'drypper' | 'vurdert';

function treff(nivå: number, strek: number) {
  if (nivå > 1) return 0;
  return Math.max(0, 1 - Math.abs(nivå - strek) / TOLERANSE);
}

function vurdering(nivå: number, strek: number): string {
  const avvik = nivå - strek;
  if (nivå > 1) return tekst('SØL! ☕💦 Bjarne later som han ikke så det.', 'SPILL! ☕💦 Bjarne pretends he didn\'t see that.');
  if (Math.abs(avvik) < 0.015) return tekst('PERFEKT! ✨ Barista-nivå.', 'PERFECT! ✨ Barista level.');
  if (Math.abs(avvik) < 0.05) return avvik > 0 ? tekst('Et hårstrå over. Godkjent.', 'A hair over. Approved.') : tekst('Et hårstrå under. Godkjent.', 'A hair under. Approved.');
  return avvik > 0 ? tekst('Litt mye. Bjarne tar skummet.', 'A bit much. Bjarne takes the froth.') : tekst('Litt snaut. Det er nesten en espresso.', 'A bit short. It\'s almost an espresso.');
}

export function Kaffehelling({ onFerdig }: MiniSpillProps) {
  const { t } = useSprak();
  const ferdig = useFerdig(onFerdig);
  const strek = useMemo(() => 0.6 + Math.random() * 0.28, []);
  const [nivå, setNivå] = useState(0);
  const [fase, setFase] = useState<Fase>('klar');
  const [kommentar, setKommentar] = useState<string | null>(null);

  const s = useRef({ nivå: 0, fase: 'klar' as Fase, holdt: 0, slippFart: 0, drypp: 0 });

  // Tida ute: koppen teller der den står.
  const igjen = useNedtelling(SPILLTID_SEKUNDER, () => ferdig(treff(s.current.nivå, strek)));

  function settFase(f: Fase) {
    s.current.fase = f;
    setFase(f);
  }

  function vurder() {
    const st = s.current;
    const p = treff(st.nivå, strek);
    setKommentar(vurdering(st.nivå, strek));
    settFase('vurdert');
    if (p > 0.85) lyd.riktig();
    else if (st.nivå > 1) lyd.knas();
    else lyd.pop();
    setTimeout(() => ferdig(p), 900);
  }

  useEffect(() => {
    let raf = 0;
    let forrige = performance.now();
    const loop = (nå: number) => {
      const dt = Math.min(0.05, (nå - forrige) / 1000);
      forrige = nå;
      const st = s.current;
      if (st.fase === 'heller') {
        st.holdt += dt;
        st.nivå += FART * (1 + st.holdt * AKSELERASJON) * dt;
        setNivå(st.nivå);
      } else if (st.fase === 'drypper') {
        st.drypp += dt;
        st.nivå += st.slippFart * Math.max(0, 1 - st.drypp / DRYPP) * dt;
        setNivå(st.nivå);
        if (st.drypp >= DRYPP) vurder();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function start() {
    if (s.current.fase !== 'klar') return;
    s.current.holdt = 0;
    settFase('heller');
    lyd.swish();
  }

  function slipp() {
    const st = s.current;
    if (st.fase !== 'heller') return;
    st.slippFart = FART * (1 + st.holdt * AKSELERASJON);
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

  const vist = Math.min(nivå, 1);
  const søl = nivå > 1;
  const heller = fase === 'heller' || fase === 'drypper';

  return (
    <SpillRamme igjen={igjen} total={SPILLTID_SEKUNDER} status={t('Hell til streken', 'Pour to the line')}>
      <div className={classes.hellflate}>
        <div className={classes.hellScene}>
          <div className={classes.kanne} data-heller={heller || undefined}>
            <span>🫖</span>
          </div>
          {fase === 'heller' && (
            <div
              className={classes.straale}
              style={{ height: `calc(100% - 64px - 24px - ${KOPP.høyde * vist}px)` }}
            />
          )}
          <div className={classes.kopp} style={{ width: KOPP.bredde, height: KOPP.høyde }}>
            <div className={classes.koppStrek} style={{ bottom: `${strek * 100}%` }}>
              <span>{t('strek', 'line')}</span>
            </div>
            <div className={classes.kaffe} style={{ height: `${vist * 100}%` }} />
            {søl && <div className={classes.sol} style={{ width: `${KOPP.bredde + (nivå - 1) * 500}px` }} />}
          </div>
        </div>

        <div className={classes.kaffeKommentar}>{kommentar ?? ' '}</div>

        <button
          type="button"
          className={classes.kaffeKnapp}
          data-holder={fase === 'heller' || undefined}
          disabled={fase === 'vurdert' || fase === 'drypper'}
          onPointerDown={start}
        >
          {fase === 'heller' ? t('Heller… ☕', 'Pouring… ☕') : t('Hold for å helle', 'Hold to pour')}
        </button>
      </div>
    </SpillRamme>
  );
}
