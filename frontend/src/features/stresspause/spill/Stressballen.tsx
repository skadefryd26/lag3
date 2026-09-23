import { useEffect, useRef, useState } from 'react';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useFerdig } from '../lib/useFerdig';
import type { MiniSpillProps } from '../types/stresspause.types';
import classes from './spill.module.css';

const SEKUNDER = SPILLTID_SEKUNDER;
/** Faser i sekunder: klem, slipp, klem, slipp ... jevn og rolig rytme. */
const FASER = [2.5, 2.5, 2.5, 2.5, 2.5, 2.5];
/** Rett etter et bytte teller alt som riktig — ingen skal straffes for reaksjonstid. */
const NÅDETID = 0.5;
const REPLIKKER = {
  riktig: ['Mm. Ballen godkjenner.', 'Jevnt og fint.', 'Du puster nesten som en voksen.', 'Ballen er fornøyd.'],
  feil: ['Ballen er forvirret.', 'Det var ikke det vi avtalte.', 'Bjarne himler med øynene.'],
};

function fase(t: number): { klem: boolean; igjen: number; lengde: number; inne: number } {
  let acc = 0;
  for (let i = 0; i < FASER.length; i++) {
    if (t < acc + FASER[i])
      return { klem: i % 2 === 0, igjen: acc + FASER[i] - t, lengde: FASER[i], inne: t - acc };
    acc += FASER[i];
  }
  return { klem: false, igjen: 0, lengde: 1, inne: 1 };
}

function poengFraTakt(andel: number) {
  // Å gjøre ingenting gir ~60 % (alle SLIPP-faser + nådetid), så det trekkes fra. Full pott fra 90 %.
  return Math.min(1, Math.max(0, (andel - 0.6) / 0.3));
}

export function Stressballen({ onFerdig }: MiniSpillProps) {
  const ferdig = useFerdig(onFerdig);
  const [t, setT] = useState(0);
  const [holder, setHolder] = useState(false);
  const [andel, setAndel] = useState(1);
  const holderRef = useRef(false);
  const treff = useRef({ riktig: 0, totalt: 0 });
  const forrigeKlem = useRef<boolean | null>(null);

  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => {
      const nå = (performance.now() - start) / 1000;
      setT(nå);
      const f = fase(nå);
      if (forrigeKlem.current !== f.klem) {
        forrigeKlem.current = f.klem;
        if (nå > 0.1) lyd.pop();
      }
      treff.current.totalt += 1;
      if (holderRef.current === f.klem || f.inne < NÅDETID) treff.current.riktig += 1;
      setAndel(treff.current.riktig / treff.current.totalt);
      if (nå >= SEKUNDER) {
        clearInterval(id);
        ferdig(poengFraTakt(treff.current.riktig / treff.current.totalt));
      }
    }, 100);
    return () => clearInterval(id);
  }, [ferdig]);

  useEffect(() => {
    const ned = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) sett(true);
      }
    };
    const opp = (e: KeyboardEvent) => e.code === 'Space' && sett(false);
    const slipp = () => sett(false);
    window.addEventListener('keydown', ned);
    window.addEventListener('keyup', opp);
    window.addEventListener('pointerup', slipp);
    return () => {
      window.removeEventListener('keydown', ned);
      window.removeEventListener('keyup', opp);
      window.removeEventListener('pointerup', slipp);
    };
  }, []);

  function sett(v: boolean) {
    if (holderRef.current === v) return;
    holderRef.current = v;
    setHolder(v);
    if (v) lyd.klem();
  }

  const f = fase(t);
  const synk = holder === f.klem;
  const replikkListe = synk ? REPLIKKER.riktig : REPLIKKER.feil;
  const replikk = replikkListe[Math.floor(t / 3) % replikkListe.length];

  return (
    <SpillRamme igjen={Math.max(0, SEKUNDER - t)} total={SEKUNDER} status={`I takt: ${Math.round(andel * 100)} %`}>
      <div className={classes.ballflate}>
        <div className={classes.instruks} data-klem={f.klem || undefined}>
          {f.klem ? 'KLEM' : 'SLIPP'}
          <div className={classes.faseBar}>
            <div style={{ width: `${(f.igjen / f.lengde) * 100}%` }} />
          </div>
        </div>
        <div className={classes.ballHolder}>
        <div className={classes.pulsRing} data-klem={f.klem || undefined} />
        <button
          type="button"
          className={classes.ball}
          data-holder={holder || undefined}
          data-synk={synk || undefined}
          onPointerDown={() => sett(true)}
          aria-label="Stressball"
        >
          <span className={classes.ballFjes}>{holder ? '😖' : synk ? '😌' : '🙂'}</span>
        </button>
        </div>
        <div className={classes.ballReplikk}>{replikk}</div>
      </div>
      <p className={classes.hint}>Hold inne museknappen (eller mellomrom) når det står KLEM. Slipp når det står SLIPP.</p>
    </SpillRamme>
  );
}
