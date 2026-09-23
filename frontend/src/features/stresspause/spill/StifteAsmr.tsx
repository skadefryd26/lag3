import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { useFerdig } from '../lib/useFerdig';
import type { MiniSpillProps } from '../types/stresspause.types';
import classes from './spill.module.css';

const TAKT_MS = 600;
const OPPTELLING = 3;
/** Tre fraser à fire stift. Første frase er oppvarming, så skifter tempoet. */
const FRASER = 3;
const TEMPO_MS = [700, 520, 420, 620, 360];
/** Hvor mange millisekunder av sporet som er synlig fra høyre kant til treffstreken. */
const SYNLIG_MS = 2200;

/** Lager tidspunktene (ms fra start) for hver stift. Maks ca. 9,8 s totalt. */
function lagSlag(): { tider: number[]; tempo: { fra: number; ms: number }[] } {
  const tider: number[] = [];
  const tempo: { fra: number; ms: number }[] = [];
  const stokket = [...TEMPO_MS].sort(() => Math.random() - 0.5);
  let tid = OPPTELLING * TAKT_MS;
  for (let frase = 0; frase < FRASER; frase++) {
    const ms = frase === 0 ? TAKT_MS : stokket[frase - 1];
    tempo.push({ fra: tid, ms });
    // Én frase får en dobbeltstift midt i: to raske slag på halv takt.
    const dobbel = frase === 2 ? 1 + Math.floor(Math.random() * 2) : -1;
    for (let i = 0; i < 4; i++) {
      tider.push(tid);
      if (i === dobbel) {
        tider.push(tid + ms / 2);
      }
      tid += ms;
    }
  }
  return { tider, tempo };
}

type Dom = { tekst: string; farge: string };

function vurder(avvik: number): { poeng: number; dom: Dom } | null {
  if (avvik < 60) return { poeng: 1, dom: { tekst: 'PERFEKT KA-CHUNK', farge: '#5eead4' } };
  if (avvik < 120) return { poeng: 0.7, dom: { tekst: 'Fin stift', farge: '#a3e635' } };
  if (avvik < 200) return { poeng: 0.35, dom: { tekst: 'Litt skjev', farge: '#fbbf24' } };
  return null;
}

export function StifteAsmr({ onFerdig }: MiniSpillProps) {
  const ferdig = useFerdig(onFerdig);
  const { tider, tempo } = useMemo(lagSlag, []);
  const antallSlag = tider.length;
  const totalMs = tider[antallSlag - 1] + 700;
  const [nå, setNå] = useState(0);
  const [poeng, setPoeng] = useState(0);
  const [bunke, setBunke] = useState(0);
  const [dom, setDom] = useState<Dom | null>(null);
  const [trykket, setTrykket] = useState(false);
  const start = useRef(performance.now());
  const truffet = useRef(new Set<number>());
  const poengRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    let sisteTikk = -1;
    const loop = () => {
      const t = performance.now() - start.current;
      setNå(t);
      const takt = Math.floor(t / TAKT_MS);
      if (takt !== sisteTikk && takt < OPPTELLING) {
        sisteTikk = takt;
        lyd.pop();
      }
      if (t > totalMs) {
        ferdig(poengRef.current / antallSlag);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ferdig, antallSlag, totalMs]);

  const stift = useCallback(() => {
    lyd.stift();
    setTrykket(true);
    setTimeout(() => setTrykket(false), 90);
    const t = performance.now() - start.current;
    let nærmest = -1;
    let minAvvik = Infinity;
    for (let i = 0; i < antallSlag; i++) {
      if (truffet.current.has(i)) continue;
      const avvik = Math.abs(t - tider[i]);
      if (avvik < minAvvik) {
        minAvvik = avvik;
        nærmest = i;
      }
    }
    const res = nærmest >= 0 ? vurder(minAvvik) : null;
    if (res) {
      truffet.current.add(nærmest);
      poengRef.current += res.poeng;
      setPoeng(poengRef.current);
      setBunke((b) => b + 1);
      setDom(res.dom);
      if (poengRef.current >= antallSlag) setTimeout(() => ferdig(1), 600);
    } else {
      setDom({ tekst: 'Stiftet luft', farge: '#94a3b8' });
    }
  }, [antallSlag, tider, ferdig]);

  useEffect(() => {
    const tast = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        stift();
      }
    };
    window.addEventListener('keydown', tast);
    return () => window.removeEventListener('keydown', tast);
  }, [stift]);

  const opptelling = nå < OPPTELLING * TAKT_MS ? OPPTELLING - Math.floor(nå / TAKT_MS) : null;
  const igjen = Math.max(0, (totalMs - nå) / 1000);
  const aktivtTempo = [...tempo].reverse().find((f) => nå >= f.fra - 900);
  const forrigeTempo = aktivtTempo ? tempo[tempo.indexOf(aktivtTempo) - 1] : undefined;
  const tempoMelding =
    aktivtTempo && forrigeTempo && nå < aktivtTempo.fra + 600
      ? aktivtTempo.ms < forrigeTempo.ms
        ? 'Tempo opp! ⏩'
        : 'Roligere… 🐢'
      : null;

  return (
    <SpillRamme igjen={igjen} total={totalMs / 1000} status={`Stifter: ${Math.round((poeng / antallSlag) * 100)} % rytme`}>
      <div className={classes.spor}>
        <div className={classes.treffstrek} />
        {Array.from({ length: antallSlag }, (_, i) => {
          const tid = tider[i];
          const fram = (tid - nå) / SYNLIG_MS;
          if (fram > 1.05 || fram < -0.15 || truffet.current.has(i)) return null;
          return (
            <span key={i} className={classes.note} style={{ left: `calc(12% + ${fram * 85}%)` }}>
              📄
            </span>
          );
        })}
        {opptelling !== null && <span className={classes.opptelling}>{opptelling}</span>}
        {tempoMelding && (
          <span key={tempoMelding + aktivtTempo?.fra} className={classes.tempo}>
            {tempoMelding}
          </span>
        )}
      </div>

      <div className={classes.stifteRad}>
        <div className={classes.bunke} aria-label={`${bunke} stiftede ark`}>
          {Array.from({ length: bunke }, (_, i) => (
            <div key={i} className={classes.ark} style={{ transform: `rotate(${((i * 37) % 7) - 3}deg)` }} />
          ))}
        </div>
        <button type="button" className={classes.stifter} data-trykket={trykket || undefined} onPointerDown={stift}>
          <span className={classes.stifterTopp} />
          <span className={classes.stifterBunn} />
        </button>
        <div className={classes.dom} style={{ color: dom?.farge }} key={bunke + (dom?.tekst ?? '')}>
          {dom?.tekst}
        </div>
      </div>
      <p className={classes.hint}>Trykk mellomrom (eller stifteren) akkurat når arket treffer streken. Følg med — tempoet skifter.</p>
    </SpillRamme>
  );
}
