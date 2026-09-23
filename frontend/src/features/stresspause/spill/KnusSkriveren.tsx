import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { useFerdig } from '../lib/useFerdig';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useNedtelling } from '../lib/useNedtelling';
import type { MiniSpillProps } from '../types/stresspause.types';
import classes from './spill.module.css';

const SEKUNDER = SPILLTID_SEKUNDER;
const MÅL = 60;
const DELER = ['🔩', '⚙️', '📄', '🧻', '💥', '🪛', '📄', '🔧'];
const ANSIKT = [
  { terskel: 0, fjes: '😏', replikk: 'PAPIRSTOPP I SKUFF 2' },
  { terskel: 10, fjes: '😐', replikk: 'Toner lav. Toner alltid lav.' },
  { terskel: 22, fjes: '😟', replikk: 'Vent, vi kan snakke om dette' },
  { terskel: 35, fjes: '😰', replikk: 'Jeg skal skrive ut! JEG LOVER!' },
  { terskel: 48, fjes: '😵', replikk: 'Pcl-feil... 49.4c02...' },
  { terskel: 60, fjes: '💀', replikk: '*siste pip*' },
];

type Del = { id: number; emoji: string; x: number; y: number; dx: number; dy: number; rot: number };

export function KnusSkriveren({ onFerdig }: MiniSpillProps) {
  const ferdig = useFerdig(onFerdig);
  const [slag, setSlag] = useState(0);
  const [deler, setDeler] = useState<Del[]>([]);
  const [rist, setRist] = useState(0);
  const slagRef = useRef(0);
  const flate = useRef<HTMLDivElement>(null);
  const neste = useRef(0);

  const igjen = useNedtelling(SEKUNDER, () => ferdig(slagRef.current / MÅL));

  const slå = useCallback((x?: number, y?: number) => {
    slagRef.current += 1;
    setSlag(slagRef.current);
    if (slagRef.current >= MÅL) setTimeout(() => ferdig(1), 700);
    setRist((r) => r + 1);
    lyd.knas();
    const boks = flate.current?.getBoundingClientRect();
    const px = x !== undefined && boks ? x - boks.left : (boks?.width ?? 400) / 2;
    const py = y !== undefined && boks ? y - boks.top : (boks?.height ?? 300) / 2;
    const nye = Array.from({ length: 3 }, () => ({
      id: neste.current++,
      emoji: DELER[Math.floor(Math.random() * DELER.length)],
      x: px,
      y: py,
      dx: (Math.random() - 0.5) * 420,
      dy: -120 - Math.random() * 220,
      rot: (Math.random() - 0.5) * 720,
    }));
    setDeler((d) => [...d.slice(-40), ...nye]);
  }, [ferdig]);

  useEffect(() => {
    const tast = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        slå();
      }
    };
    window.addEventListener('keydown', tast);
    return () => window.removeEventListener('keydown', tast);
  }, [slå]);

  const tilstand = [...ANSIKT].reverse().find((a) => slag >= a.terskel) ?? ANSIKT[0];
  const skade = Math.min(1, slag / MÅL);

  return (
    <SpillRamme igjen={igjen} total={SEKUNDER} status={`Slag: ${slag} · Skade: ${Math.round(skade * 100)} %`}>
      <div ref={flate} className={classes.knuseflate} onPointerDown={(e: ReactPointerEvent) => slå(e.clientX, e.clientY)}>
        <div className={classes.skriverBoble}>{tilstand.replikk}</div>
        <div
          key={rist}
          className={classes.skriver}
          style={{ filter: `grayscale(${skade}) brightness(${1 - skade * 0.35})`, rotate: `${skade * 12}deg` }}
        >
          <span style={{ fontSize: 150 }}>🖨️</span>
          <span className={classes.skriverFjes}>{tilstand.fjes}</span>
          {skade > 0.3 && <span className={classes.sprekk} style={{ left: '20%', top: '30%' }}>⚡</span>}
          {skade > 0.6 && <span className={classes.sprekk} style={{ left: '65%', top: '55%' }}>💢</span>}
          {skade > 0.85 && <span className={classes.royk}>💨</span>}
        </div>
        {deler.map((d) => (
          <span
            key={d.id}
            className={classes.del}
            style={{ left: d.x, top: d.y, '--dx': `${d.dx}px`, '--dy': `${d.dy}px`, '--rot': `${d.rot}deg` } as CSSProperties}
          >
            {d.emoji}
          </span>
        ))}
      </div>
      <p className={classes.hint}>Klikk (eller hamre på mellomrom) så fort du orker. Ingen skrivere ble skadet i virkeligheten.</p>
    </SpillRamme>
  );
}
