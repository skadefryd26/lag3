import { useEffect, useReducer, useRef } from 'react';
import { Button, Group } from '@mantine/core';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { useFerdig } from '../lib/useFerdig';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useNedtelling } from '../lib/useNedtelling';
import type { MiniSpillProps } from '../types/stresspause.types';
import classes from './spill.module.css';

/** Smalt arkiv: seks kolonner gjør det mye lettere å fylle hele rader. */
const BREDDE = 6;
const HØYDE = 14;
const SEKUNDER = SPILLTID_SEKUNDER;
/** Full effekt: f.eks. én linje + 15 brikker, eller to linjer + 5 brikker. Brikker teller, så ingen går tomhendt. */
const MÅL = 2.5;

type Form = number[][];
type Brikke = { form: Form; farge: number; x: number; y: number };

const FORMER: Form[] = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 1, 0], [0, 1, 1]],
];
const FARGER = ['#38bdf8', '#fbbf24', '#a78bfa', '#60a5fa', '#fb923c', '#4ade80', '#f87171'];
const MERKELAPPER = ['Bil', 'Hus', 'Reise', 'Innbo', 'Båt', 'Dyr', 'Ting'];

type Brett = (number | null)[][];

type Tilstand = {
  brett: Brett;
  brikke: Brikke;
  neste: number;
  linjer: number;
  brikker: number;
  makulert: number;
  sisteHendelse: { type: 'linje' | 'makulert' | 'landet'; id: number } | null;
};

type Handling = { type: 'tikk' | 'venstre' | 'høyre' | 'roter' | 'ned' | 'slipp' };

const tomtBrett = (): Brett => Array.from({ length: HØYDE }, () => Array(BREDDE).fill(null));

function lagBrikke(type: number): Brikke {
  const form = FORMER[type];
  return { form, farge: type, x: Math.floor((BREDDE - form[0].length) / 2), y: 0 };
}

function kolliderer(brett: Brett, b: Brikke): boolean {
  return b.form.some((rad, dy) =>
    rad.some((c, dx) => {
      if (!c) return false;
      const x = b.x + dx;
      const y = b.y + dy;
      return x < 0 || x >= BREDDE || y >= HØYDE || (y >= 0 && brett[y][x] !== null);
    }),
  );
}

function roter(form: Form): Form {
  return form[0].map((_, i) => form.map((rad) => rad[i]).reverse());
}

function land(s: Tilstand): Tilstand {
  const brett = s.brett.map((r) => [...r]);
  s.brikke.form.forEach((rad, dy) =>
    rad.forEach((c, dx) => {
      if (c && s.brikke.y + dy >= 0) brett[s.brikke.y + dy][s.brikke.x + dx] = s.brikke.farge;
    }),
  );
  const igjen = brett.filter((rad) => rad.some((c) => c === null));
  const fjernet = HØYDE - igjen.length;
  let nyttBrett: Brett = [...Array.from({ length: fjernet }, () => Array(BREDDE).fill(null)), ...igjen];
  const id = (s.sisteHendelse?.id ?? 0) + 1;
  let hendelse: Tilstand['sisteHendelse'] = { type: fjernet ? 'linje' : 'landet', id };
  let makulert = s.makulert;

  let brikke = lagBrikke(s.neste);
  // Man kan ikke tape: fullt arkiv betyr at Bjarne makulerer alt og vi fortsetter.
  if (kolliderer(nyttBrett, brikke)) {
    nyttBrett = tomtBrett();
    brikke = lagBrikke(s.neste);
    makulert += 1;
    hendelse = { type: 'makulert', id };
  }
  return {
    brett: nyttBrett,
    brikke,
    neste: Math.floor(Math.random() * FORMER.length),
    linjer: s.linjer + fjernet,
    brikker: s.brikker + 1,
    makulert,
    sisteHendelse: hendelse,
  };
}

function flytt(s: Tilstand, dx: number, dy: number): Tilstand | null {
  const b = { ...s.brikke, x: s.brikke.x + dx, y: s.brikke.y + dy };
  return kolliderer(s.brett, b) ? null : { ...s, brikke: b };
}

function redusér(s: Tilstand, h: Handling): Tilstand {
  switch (h.type) {
    case 'venstre':
      return flytt(s, -1, 0) ?? s;
    case 'høyre':
      return flytt(s, 1, 0) ?? s;
    case 'roter': {
      const form = roter(s.brikke.form);
      // Enkel «wall kick»: prøv på plass, så ett steg til hver side.
      for (const dx of [0, -1, 1, -2, 2]) {
        const b = { ...s.brikke, form, x: s.brikke.x + dx };
        if (!kolliderer(s.brett, b)) return { ...s, brikke: b };
      }
      return s;
    }
    case 'tikk':
    case 'ned':
      return flytt(s, 0, 1) ?? land(s);
    case 'slipp': {
      let t = s;
      for (let neste = flytt(t, 0, 1); neste; neste = flytt(t, 0, 1)) t = neste;
      return land(t);
    }
  }
}

function start(): Tilstand {
  return {
    brett: tomtBrett(),
    brikke: lagBrikke(Math.floor(Math.random() * FORMER.length)),
    neste: Math.floor(Math.random() * FORMER.length),
    linjer: 0,
    brikker: 0,
    makulert: 0,
    sisteHendelse: null,
  };
}

const score = (s: Tilstand) => (s.linjer + s.brikker / 10) / MÅL;

export function ArkivTetris({ onFerdig }: MiniSpillProps) {
  const ferdig = useFerdig(onFerdig);
  const [s, send] = useReducer(redusér, undefined, start);
  const sRef = useRef(s);
  sRef.current = s;

  const igjen = useNedtelling(SEKUNDER, () => ferdig(score(sRef.current)));
  const fart = Math.max(200, 450 - s.linjer * 60);

  useEffect(() => {
    const id = setInterval(() => send({ type: 'tikk' }), fart);
    return () => clearInterval(id);
  }, [fart]);

  useEffect(() => {
    if (score(s) >= 1) setTimeout(() => ferdig(1), 800);
  }, [s, ferdig]);

  useEffect(() => {
    const e = s.sisteHendelse;
    if (!e) return;
    if (e.type === 'linje') lyd.linje();
    else if (e.type === 'makulert') lyd.knas();
    else lyd.pop();
  }, [s.sisteHendelse]);

  useEffect(() => {
    const taster: Record<string, Handling['type']> = {
      ArrowLeft: 'venstre',
      ArrowRight: 'høyre',
      ArrowUp: 'roter',
      ArrowDown: 'ned',
      Space: 'slipp',
    };
    const tast = (e: KeyboardEvent) => {
      const h = taster[e.code];
      if (!h) return;
      e.preventDefault();
      send({ type: h });
    };
    window.addEventListener('keydown', tast);
    return () => window.removeEventListener('keydown', tast);
  }, []);

  // Tegn brett + fallende brikke + skygge
  let skygge = s.brikke;
  while (!kolliderer(s.brett, { ...skygge, y: skygge.y + 1 })) skygge = { ...skygge, y: skygge.y + 1 };
  const visning: { farge: number | null; skygge?: boolean }[][] = s.brett.map((rad) => rad.map((farge) => ({ farge })));
  for (const [b, erSkygge] of [[skygge, true], [s.brikke, false]] as const) {
    b.form.forEach((rad, dy) =>
      rad.forEach((c, dx) => {
        const y = b.y + dy;
        if (c && y >= 0) visning[y][b.x + dx] = { farge: b.farge, skygge: erSkygge };
      }),
    );
  }

  const makulertNå = s.sisteHendelse?.type === 'makulert';

  return (
    <SpillRamme
      igjen={igjen}
      total={SEKUNDER}
      status={`Arkiverte linjer: ${s.linjer} · Effekt: ${Math.min(100, Math.round(score(s) * 100))} %`}
    >
      <div className={classes.tetrisRad}>
        <div className={classes.tetrisBrett} style={{ gridTemplateColumns: `repeat(${BREDDE}, 1fr)`, width: `min(${BREDDE * 30}px, 70vw)` }}>
          {visning.flat().map((c, i) => (
            <div
              key={i}
              className={classes.celle}
              data-skygge={c.skygge || undefined}
              style={c.farge !== null ? { background: FARGER[c.farge], color: FARGER[c.farge] } : undefined}
            />
          ))}
          {makulertNå && (
            <div key={s.sisteHendelse?.id} className={classes.makulert}>
              🤖🗑️<br />
              «Arkivet var fullt. Jeg makulerte alt.<br />Ingen kommer til å merke det.»
            </div>
          )}
        </div>
        <div className={classes.tetrisSide}>
          <div className={classes.nesteBoks}>
            <div className={classes.nesteTittel}>Neste mappe</div>
            <div
              className={classes.nesteForm}
              style={{ gridTemplateColumns: `repeat(${FORMER[s.neste][0].length}, 18px)` }}
            >
              {FORMER[s.neste].flat().map((c, i) => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: 3, background: c ? FARGER[s.neste] : 'transparent' }} />
              ))}
            </div>
            <div className={classes.nesteTittel}>{MERKELAPPER[s.neste]}skader</div>
          </div>
          <div className={classes.nesteTittel}>Makulert: {s.makulert} 🗑️</div>
          <Group gap={6} mt="sm">
            <Button size="xs" variant="light" onClick={() => send({ type: 'venstre' })}>←</Button>
            <Button size="xs" variant="light" onClick={() => send({ type: 'roter' })}>⟳</Button>
            <Button size="xs" variant="light" onClick={() => send({ type: 'høyre' })}>→</Button>
          </Group>
          <Group gap={6} mt={6}>
            <Button size="xs" variant="light" onClick={() => send({ type: 'ned' })}>↓</Button>
            <Button size="xs" variant="light" color="teal" onClick={() => send({ type: 'slipp' })}>Slipp</Button>
          </Group>
        </div>
      </div>
      <p className={classes.hint}>← → flytt · ↑ roter · ↓ raskere · mellomrom slipp. Fullt arkiv? Bjarne makulerer. Du kan ikke tape.</p>
    </SpillRamme>
  );
}
