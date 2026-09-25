import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Button, Group } from '@mantine/core';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { useFerdig } from '../lib/useFerdig';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useNedtelling } from '../lib/useNedtelling';
import type { MiniSpillProps } from '../types/stresspause.types';
import { useSprak } from '../../../sprak';
import classes from './spill.module.css';

type Mappe = 'søppel' | 'arkiv';

const EPOSTER: { fra: string; emne: string; fraEn: string; emneEn: string; mappe: Mappe }[] = [
  { fra: 'Takstmann Tore', emne: 'Takstrapport: fuktskade i kjeller', fraEn: 'Assessor Tore', emneEn: 'Assessment report: damp in the basement', mappe: 'arkiv' },
  { fra: 'Nigeriansk prins', emne: 'Du har arvet 40 millioner!!!', fraEn: 'Nigerian prince', emneEn: 'You have inherited 40 million!!!', mappe: 'søppel' },
  { fra: 'Kantina', emne: 'Taco fredag er flyttet til torsdag (igjen)', fraEn: 'The canteen', emneEn: 'Taco Friday has moved to Thursday (again)', mappe: 'søppel' },
  { fra: 'Kunde K. Fiktiv', emne: 'RE: RE: FW: Trampolineskade (igjen)', fraEn: 'Customer C. Fictional', emneEn: 'RE: RE: FW: Trampoline injury (again)', mappe: 'arkiv' },
  { fra: 'Bjarne', emne: 'Jeg har løst saken din. Du er velkommen.', fraEn: 'Bjarne', emneEn: 'I solved your case. You\'re welcome.', mappe: 'arkiv' },
  { fra: 'Alle-ansatte', emne: 'Hvem har tatt yoghurten min? Den var MERKET.', fraEn: 'All-staff', emneEn: 'Who took my yoghurt? It was LABELLED.', mappe: 'søppel' },
  { fra: 'Verksted Bilfiks', emne: 'Faktura: bytte av frontrute', fraEn: 'Bilfiks Garage', emneEn: 'Invoice: windscreen replacement', mappe: 'arkiv' },
  { fra: 'Nyhetsbrev', emne: '10 synergier du ikke visste du trengte', fraEn: 'Newsletter', emneEn: '10 synergies you didn\'t know you needed', mappe: 'søppel' },
  { fra: 'Juridisk', emne: 'Vilkårsendring, punkt 4.2.1 b)', fraEn: 'Legal', emneEn: 'Change of terms, clause 4.2.1 b)', mappe: 'arkiv' },
  { fra: 'Møteinvitasjon', emne: 'Formøte til formøtet om møtet', fraEn: 'Meeting invite', emneEn: 'Pre-meeting for the pre-meeting about the meeting', mappe: 'søppel' },
  { fra: 'Kunde F. Oppdiktet', emne: 'Bilder av vannlekkasjen, vedlagt', fraEn: 'Customer F. Madeup', emneEn: 'Photos of the water leak, attached', mappe: 'arkiv' },
  { fra: 'IT', emne: 'Har du prøvd å skru den av og på?', fraEn: 'IT', emneEn: 'Have you tried turning it off and on again?', mappe: 'søppel' },
];

const SEKUNDER = SPILLTID_SEKUNDER;
const ANTALL = 9;
const TERSKEL = 110;

export function InnboksNull({ onFerdig }: MiniSpillProps) {
  const { t } = useSprak();
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
    <SpillRamme igjen={igjen} total={SEKUNDER} status={t(`Innboks: ${eposter.length - indeks} uleste`, `Inbox: ${eposter.length - indeks} unread`)}>
      <div className={classes.innboks}>
        <div className={classes.sveipMaal} data-aktiv={dx < -40 || undefined}><span>🗑️</span><br />{t('Søppel', 'Trash')}</div>
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
                <div className={classes.epostFra}>📧 {t(epost.fra, epost.fraEn)}</div>
                <div className={classes.epostEmne}>{t(epost.emne, epost.emneEn)}</div>
                <div className={classes.epostTekst}>{t('Lorem ipsum forsikringsum. Vennlig hilsen, noen som vil noe.', 'Lorem ipsum insurancium. Kind regards, someone who wants something.')}</div>
              </div>
            </>
          ) : (
            <div className={classes.innboksNull}>
              <div style={{ fontSize: 60 }}>🏝️</div>
              <b>{t('Innboks null.', 'Inbox zero.')}</b>
              <div>{t('Nyt det. Det varer i ca. fire sekunder.', 'Enjoy it. It lasts about four seconds.')}</div>
            </div>
          )}
        </div>
        <div className={classes.sveipMaal} data-aktiv={dx > 40 || undefined}><span>🗄️</span><br />{t('Arkiv', 'Archive')}</div>
      </div>
      <Group justify="center" mt="md" gap="xl">
        <Button variant="light" color="red" onClick={() => sorter('søppel')}>← {t('Søppel', 'Trash')}</Button>
        <span className={classes.tilbakemelding}>
          {tilbakemelding === null ? '' : tilbakemelding ? '✅' : '🤷'} {riktige} {t('riktig', 'correct')}
        </span>
        <Button variant="light" color="teal" onClick={() => sorter('arkiv')}>{t('Arkiv', 'Archive')} →</Button>
      </Group>
      <p className={classes.hint}>{t('Sveip e-posten, bruk piltastene eller knappene.', 'Swipe the email, or use the arrow keys or the buttons.')}</p>
    </SpillRamme>
  );
}
