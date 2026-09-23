import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Button, Group } from '@mantine/core';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { useFerdig } from '../lib/useFerdig';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useNedtelling } from '../lib/useNedtelling';
import type { MiniSpillProps } from '../types/stresspause.types';
import classes from './spill.module.css';

type Mappe = 'søppel' | 'arkiv';

const EPOSTER: { fra: string; emne: string; mappe: Mappe }[] = [
  { fra: 'Takstmann Tore', emne: 'Takstrapport: fuktskade i kjeller', mappe: 'arkiv' },
  { fra: 'Nigeriansk prins', emne: 'Du har arvet 40 millioner!!!', mappe: 'søppel' },
  { fra: 'Kantina', emne: 'Taco fredag er flyttet til torsdag (igjen)', mappe: 'søppel' },
  { fra: 'Kunde K. Fiktiv', emne: 'RE: RE: FW: Trampolineskade (igjen)', mappe: 'arkiv' },
  { fra: 'Bjarne', emne: 'Jeg har løst saken din. Du er velkommen.', mappe: 'arkiv' },
  { fra: 'Alle-ansatte', emne: 'Hvem har tatt yoghurten min? Den var MERKET.', mappe: 'søppel' },
  { fra: 'Verksted Bilfiks', emne: 'Faktura: bytte av frontrute', mappe: 'arkiv' },
  { fra: 'Nyhetsbrev', emne: '10 synergier du ikke visste du trengte', mappe: 'søppel' },
  { fra: 'Juridisk', emne: 'Vilkårsendring, punkt 4.2.1 b)', mappe: 'arkiv' },
  { fra: 'Møteinvitasjon', emne: 'Formøte til formøtet om møtet', mappe: 'søppel' },
  { fra: 'Kunde F. Oppdiktet', emne: 'Bilder av vannlekkasjen, vedlagt', mappe: 'arkiv' },
  { fra: 'IT', emne: 'Har du prøvd å skru den av og på?', mappe: 'søppel' },
];

const SEKUNDER = SPILLTID_SEKUNDER;
const ANTALL = 9;
const TERSKEL = 110;

export function InnboksNull({ onFerdig }: MiniSpillProps) {
  const ferdig = useFerdig(onFerdig);
  const eposter = useMemo(() => [...EPOSTER].sort(() => Math.random() - 0.5).slice(0, ANTALL), []);
  const [indeks, setIndeks] = useState(0);
  const [riktige, setRiktige] = useState(0);
  const [dx, setDx] = useState(0);
  const [flyr, setFlyr] = useState<Mappe | null>(null);
  const [tilbakemelding, setTilbakemelding] = useState<boolean | null>(null);
  const startX = useRef<number | null>(null);
  const riktigeRef = useRef(0);

  const igjen = useNedtelling(SEKUNDER, () => ferdig(riktigeRef.current / ANTALL));

  const sorter = useCallback(
    (mappe: Mappe) => {
      if (flyr || indeks >= eposter.length) return;
      const ok = eposter[indeks].mappe === mappe;
      if (ok) {
        riktigeRef.current += 1;
        setRiktige(riktigeRef.current);
      }
      lyd.swish();
      setTilbakemelding(ok);
      setFlyr(mappe);
      setTimeout(() => {
        setFlyr(null);
        setDx(0);
        const neste = indeks + 1;
        setIndeks(neste);
        if (neste >= eposter.length) {
          lyd.ferdig();
          setTimeout(() => ferdig(riktigeRef.current / ANTALL), 700);
        }
      }, 260);
    },
    [eposter, ferdig, flyr, indeks],
  );

  useEffect(() => {
    const tast = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') sorter('søppel');
      if (e.key === 'ArrowRight') sorter('arkiv');
    };
    window.addEventListener('keydown', tast);
    return () => window.removeEventListener('keydown', tast);
  }, [sorter]);

  function ned(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
  }
  function flytt(e: ReactPointerEvent) {
    if (startX.current !== null) setDx(e.clientX - startX.current);
  }
  function opp() {
    startX.current = null;
    if (dx < -TERSKEL) sorter('søppel');
    else if (dx > TERSKEL) sorter('arkiv');
    else setDx(0);
  }

  const epost = eposter[indeks];
  const x = flyr ? (flyr === 'arkiv' ? 700 : -700) : dx;

  return (
    <SpillRamme igjen={igjen} total={SEKUNDER} status={`Innboks: ${eposter.length - indeks} uleste`}>
      <div className={classes.innboks}>
        <div className={classes.sveipMaal} data-aktiv={dx < -40 || undefined}><span>🗑️</span><br />Søppel</div>
        <div className={classes.epostBunke}>
          {epost ? (
            <>
              {eposter.slice(indeks + 1, indeks + 3).map((_, i) => (
                <div key={i} className={classes.epostBak} style={{ transform: `translateY(${(i + 1) * 8}px) scale(${1 - (i + 1) * 0.04})` }} />
              ))}
              <div
                className={classes.epost}
                style={{
                  transform: `translateX(${x}px) rotate(${x / 18}deg)`,
                  transition: startX.current !== null ? 'none' : 'transform 0.26s ease-out',
                  borderColor: dx < -TERSKEL ? '#f87171' : dx > TERSKEL ? '#5eead4' : undefined,
                }}
                onPointerDown={ned}
                onPointerMove={flytt}
                onPointerUp={opp}
              >
                <div className={classes.epostFra}>📧 {epost.fra}</div>
                <div className={classes.epostEmne}>{epost.emne}</div>
                <div className={classes.epostTekst}>Lorem ipsum forsikringsum. Vennlig hilsen, noen som vil noe.</div>
              </div>
            </>
          ) : (
            <div className={classes.innboksNull}>
              <div style={{ fontSize: 60 }}>🏝️</div>
              <b>Innboks null.</b>
              <div>Nyt det. Det varer i ca. fire sekunder.</div>
            </div>
          )}
        </div>
        <div className={classes.sveipMaal} data-aktiv={dx > 40 || undefined}><span>🗄️</span><br />Arkiv</div>
      </div>
      <Group justify="center" mt="md" gap="xl">
        <Button variant="light" color="red" onClick={() => sorter('søppel')}>← Søppel</Button>
        <span className={classes.tilbakemelding}>
          {tilbakemelding === null ? '' : tilbakemelding ? '✅' : '🤷'} {riktige} riktig
        </span>
        <Button variant="light" color="teal" onClick={() => sorter('arkiv')}>Arkiv →</Button>
      </Group>
      <p className={classes.hint}>Sveip e-posten, bruk piltastene eller knappene.</p>
    </SpillRamme>
  );
}
