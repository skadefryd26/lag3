import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useFerdig } from '../lib/useFerdig';
import { useNedtelling } from '../lib/useNedtelling';
import type { MiniSpillProps } from '../types/stresspause.types';
import { tekst, useSprak } from '../../../sprak';
import classes from './spill.module.css';

const B = 720;
const H = 400;
const BAKKE = 370;
const START = { x: 90, y: 300 };
/** Ca. 3 sekunder per kast (sikte + flytid + pause) → fem kast rekker seg innen tida. */
const KAST = 5;
const GRAVITASJON = 0.35;
const KRAFT = 0.16;
const MAKS_DRA = 140;
const BØTTE_B = 110;
const BØTTE_H = 90;

type Tilstand = {
  fase: 'sikter' | 'flyr' | 'pause' | 'ferdig';
  ball: { x: number; y: number; vx: number; vy: number };
  sikte: { x: number; y: number } | null;
  sikteStart: { x: number; y: number };
  bøtteX: number;
  kast: number;
  treff: number;
  melding: string;
  meldingTid: number;
};

function nyRunde(s: Tilstand) {
  s.fase = 'sikter';
  s.ball = { ...START, vx: 0, vy: 0 };
  s.bøtteX = 380 + Math.random() * 240;
}

export function Papirball({ onFerdig }: MiniSpillProps) {
  const { t } = useSprak();
  const ferdig = useFerdig(onFerdig);
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef<Tilstand>({
    fase: 'sikter',
    ball: { ...START, vx: 0, vy: 0 },
    sikte: null,
    sikteStart: { x: 0, y: 0 },
    bøtteX: 500,
    kast: 0,
    treff: 0,
    melding: '',
    meldingTid: 0,
  });
  const [hud, setHud] = useState({ kast: 0, treff: 0 });
  const igjen = useNedtelling(SPILLTID_SEKUNDER, () => {
    s.current.fase = 'ferdig';
    ferdig(s.current.treff / KAST);
  });

  useEffect(() => {
    nyRunde(s.current);
    const ctx = canvas.current!.getContext('2d')!;
    let raf = 0;

    const tegn = () => {
      const st = s.current;
      ctx.clearRect(0, 0, B, H);

      // Kontorgulv og vegg
      ctx.fillStyle = '#2d2f4f';
      ctx.fillRect(0, 0, B, BAKKE);
      ctx.fillStyle = '#4b3a2a';
      ctx.fillRect(0, BAKKE, B, H - BAKKE);

      ctx.textAlign = 'center';

      // Bøtte
      const bx = st.bøtteX;
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(bx - BØTTE_B / 2, BAKKE - BØTTE_H);
      ctx.lineTo(bx + BØTTE_B / 2, BAKKE - BØTTE_H);
      ctx.lineTo(bx + BØTTE_B / 2 - 8, BAKKE);
      ctx.lineTo(bx - BØTTE_B / 2 + 8, BAKKE);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - BØTTE_B / 2 - 3, BAKKE - BØTTE_H - 4, BØTTE_B + 6, 8);

      // Siktelinje
      if (st.fase === 'sikter' && st.sikte) {
        const { vx, vy } = hastighet(st.sikteStart, st.sikte);
        let x = START.x;
        let y = START.y;
        let dx = vx;
        let dy = vy;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 26; i++) {
          x += dx;
          y += dy;
          dy += GRAVITASJON;
          if (i % 3 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Ball
      ctx.font = '30px serif';
      ctx.fillText('🧻', st.ball.x, st.ball.y + 10);

      // Melding
      if (st.melding && performance.now() - st.meldingTid < 1200) {
        ctx.font = 'bold 34px system-ui';
        ctx.fillStyle = st.melding.startsWith('SWISH') ? '#5eead4' : '#fbbf24';
        ctx.fillText(st.melding, B / 2, H / 2 - 30);
      }
    };

    const oppdater = () => {
      const st = s.current;
      if (st.fase === 'flyr') {
        const b = st.ball;
        const forrigeY = b.y;
        b.vy += GRAVITASJON;
        b.x += b.vx;
        b.y += b.vy;

        const kant = BAKKE - BØTTE_H;
        const venstre = st.bøtteX - BØTTE_B / 2;
        const høyre = st.bøtteX + BØTTE_B / 2;
        if (forrigeY < kant && b.y >= kant && b.vy > 0) {
          if (b.x > venstre + 6 && b.x < høyre - 6) return avslutt(true);
          if (Math.abs(b.x - venstre) < 8 || Math.abs(b.x - høyre) < 8) {
            b.vy *= -0.5;
            b.vx *= 0.6;
            b.y = kant - 1;
          }
        }
        if (b.y > kant && b.x > venstre - 4 && b.x < høyre + 4) {
          b.vx = -b.vx * 0.5;
          b.x += b.vx > 0 ? 6 : -6;
        }
        if (b.y > BAKKE - 8 || b.x < -40 || b.x > B + 40) avslutt(false);
      }
    };

    const avslutt = (treff: boolean) => {
      const st = s.current;
      st.kast += 1;
      if (treff) {
        st.treff += 1;
        lyd.riktig();
      } else {
        lyd.pop();
      }
      st.melding = treff ? 'SWISH! 🏀' : tekst(['Nesten!', 'Bøtta flyttet seg', 'Teller ikke', 'Kunstnerisk bom'], ['So close!', 'The bin moved', 'Doesn\'t count', 'Artistic miss'])[Math.floor(Math.random() * 4)];
      st.meldingTid = performance.now();
      st.fase = 'pause';
      setHud({ kast: st.kast, treff: st.treff });
      setTimeout(() => {
        if (st.fase === 'ferdig') return;
        if (st.kast >= KAST) {
          st.fase = 'ferdig';
          ferdig(st.treff / KAST);
        } else nyRunde(st);
      }, 800);
    };

    const loop = () => {
      oppdater();
      tegn();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ferdig]);

  function punkt(e: ReactPointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * B, y: ((e.clientY - r.top) / r.height) * H };
  }

  function ned(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (s.current.fase !== 'sikter') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    s.current.sikteStart = punkt(e);
    s.current.sikte = s.current.sikteStart;
  }
  function flytt(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (s.current.sikte) s.current.sikte = punkt(e);
  }
  function opp() {
    const st = s.current;
    if (!st.sikte || st.fase !== 'sikter') return;
    const v = hastighet(st.sikteStart, st.sikte);
    st.sikte = null;
    if (Math.hypot(v.vx, v.vy) < 2) return;
    st.ball.vx = v.vx;
    st.ball.vy = v.vy;
    st.fase = 'flyr';
    lyd.swish();
  }

  return (
    <SpillRamme igjen={igjen} total={SPILLTID_SEKUNDER} status={`${t('Treff', 'Hits')}: ${hud.treff} / ${hud.kast} · ${'🧻'.repeat(KAST - hud.kast)}`}>
      <canvas
        ref={canvas}
        width={B}
        height={H}
        className={classes.canvas}
        onPointerDown={ned}
        onPointerMove={flytt}
        onPointerUp={opp}
      />
      <p className={classes.hint}>{t('Dra bakover fra hvor som helst (som en sprettert) og slipp.', 'Pull back from anywhere (like a slingshot) and let go.')}</p>
    </SpillRamme>
  );
}

/** Sprettert: dra bort fra ballen, slipp, og ballen flyr motsatt vei. */
function hastighet(fra: { x: number; y: number }, til: { x: number; y: number }) {
  let dx = fra.x - til.x;
  let dy = fra.y - til.y;
  const lengde = Math.hypot(dx, dy);
  if (lengde > MAKS_DRA) {
    dx = (dx / lengde) * MAKS_DRA;
    dy = (dy / lengde) * MAKS_DRA;
  }
  return { vx: dx * KRAFT, vy: dy * KRAFT };
}
