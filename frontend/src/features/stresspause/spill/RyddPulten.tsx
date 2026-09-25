import { useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { SpillRamme } from '../components/SpillRamme';
import { lyd } from '../lib/lyd';
import { useFerdig } from '../lib/useFerdig';
import { SPILLTID_SEKUNDER } from '../lib/stress';
import { useNedtelling } from '../lib/useNedtelling';
import type { MiniSpillProps } from '../types/stresspause.types';
import { useSprak } from '../../../sprak';
import classes from './spill.module.css';

type Kurv = 'oppvask' | 'søppel' | 'innboks';

const KURVER: { id: Kurv; emoji: string; navn: string; navnEn: string }[] = [
  { id: 'oppvask', emoji: '🚰', navn: 'Oppvask', navnEn: 'Dishes' },
  { id: 'søppel', emoji: '🗑️', navn: 'Søppel', navnEn: 'Trash' },
  { id: 'innboks', emoji: '📥', navn: 'Innboks', navnEn: 'Inbox' },
];

const ROT: { emoji: string; navn: string; navnEn: string; kurv: Kurv }[] = [
  { emoji: '☕', navn: 'Kald kaffe', navnEn: 'Cold coffee', kurv: 'oppvask' },
  { emoji: '🥣', navn: 'Yoghurtbeger (tomt?)', navnEn: 'Yoghurt pot (empty?)', kurv: 'oppvask' },
  { emoji: '🍽️', navn: 'Tallerken fra i går', navnEn: 'Yesterday\'s plate', kurv: 'oppvask' },
  { emoji: '🥄', navn: 'Skje uten eier', navnEn: 'Ownerless spoon', kurv: 'oppvask' },
  { emoji: '🟨', navn: 'Post-it: «ring Bjarne»', navnEn: 'Post-it: “call Bjarne”', kurv: 'søppel' },
  { emoji: '🍌', navn: 'Bananskall', navnEn: 'Banana peel', kurv: 'søppel' },
  { emoji: '🧻', navn: 'Brukt serviett', navnEn: 'Used napkin', kurv: 'søppel' },
  { emoji: '🍫', navn: 'Sjokoladepapir', navnEn: 'Chocolate wrapper', kurv: 'søppel' },
  { emoji: '📄', navn: 'Skademelding: trampoline', navnEn: 'Claim report: trampoline', kurv: 'innboks' },
  { emoji: '📋', navn: 'Takst: vannlekkasje', navnEn: 'Assessment: water leak', kurv: 'innboks' },
  { emoji: '📑', navn: 'Vilkår, side 47', navnEn: 'Terms, page 47', kurv: 'innboks' },
  { emoji: '✉️', navn: 'Brev fra kunde', navnEn: 'Letter from customer', kurv: 'innboks' },
];

const SEKUNDER = SPILLTID_SEKUNDER;
/** Antall ting per runde — trekkes tilfeldig, men alltid med alle tre kurver representert. */
const ANTALL = 5;

type Ting = (typeof ROT)[number] & { id: number; x: number; y: number; rot: number };

function trekk() {
  const stokket = [...ROT].sort(() => Math.random() - 0.5);
  // Minst én fra hver kurv, resten tilfeldig.
  const valgt = KURVER.flatMap((k) => stokket.filter((t) => t.kurv === k.id).slice(0, 1));
  const rest = stokket.filter((t) => !valgt.includes(t)).slice(0, ANTALL - valgt.length);
  return [...valgt, ...rest].sort(() => Math.random() - 0.5);
}

export function RyddPulten({ onFerdig }: MiniSpillProps) {
  const { t: tr } = useSprak();
  const ferdig = useFerdig(onFerdig);
  const start = useMemo<Ting[]>(
    () =>
      trekk()
        .map((t, i) => ({
          ...t,
          id: i,
          x: 10 + (i % 3) * 30 + Math.random() * 6,
          y: 4 + Math.floor(i / 3) * 34 + Math.random() * 8,
          rot: Math.random() * 30 - 15,
        })),
    [],
  );
  const [ting, setTing] = useState(start);
  const [riktige, setRiktige] = useState(0);
  const [valgt, setValgt] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ id: number; dx: number; dy: number } | null>(null);
  const [blink, setBlink] = useState<{ kurv: Kurv; ok: boolean } | null>(null);
  const startPunkt = useRef({ x: 0, y: 0 });
  const riktigeRef = useRef(0);

  const igjen = useNedtelling(SEKUNDER, () => ferdig(riktigeRef.current / ANTALL));

  function legg(id: number, kurv: Kurv) {
    const t = ting.find((x) => x.id === id);
    if (!t) return;
    const ok = t.kurv === kurv;
    if (ok) {
      riktigeRef.current += 1;
      setRiktige(riktigeRef.current);
      lyd.riktig();
    } else {
      lyd.feil();
    }
    setBlink({ kurv, ok });
    setTimeout(() => setBlink(null), 350);
    const rest = ting.filter((x) => x.id !== id);
    setTing(rest);
    setValgt(null);
    if (rest.length === 0) setTimeout(() => ferdig(riktigeRef.current / ANTALL), 400);
  }

  function pointerDown(e: ReactPointerEvent<HTMLButtonElement>, id: number) {
    e.currentTarget.setPointerCapture(e.pointerId);
    startPunkt.current = { x: e.clientX, y: e.clientY };
    setDrag({ id, dx: 0, dy: 0 });
  }

  function pointerMove(e: ReactPointerEvent) {
    if (!drag) return;
    setDrag({ ...drag, dx: e.clientX - startPunkt.current.x, dy: e.clientY - startPunkt.current.y });
  }

  function pointerUp(e: ReactPointerEvent) {
    if (!drag) return;
    const flyttet = Math.hypot(drag.dx, drag.dy) > 6;
    const under = document
      .elementsFromPoint(e.clientX, e.clientY)
      .find((el) => el instanceof HTMLElement && el.dataset.kurv) as HTMLElement | undefined;
    if (under && flyttet) legg(drag.id, under.dataset.kurv as Kurv);
    else if (!flyttet) setValgt(valgt === drag.id ? null : drag.id);
    setDrag(null);
  }

  return (
    <SpillRamme igjen={igjen} total={SEKUNDER} status={`${tr('Ryddet riktig', 'Sorted correctly')}: ${riktige} / ${ANTALL}`}>
      <div className={classes.pult} onPointerMove={pointerMove} onPointerUp={pointerUp}>
        {ting.map((t) => {
          const dras = drag?.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              className={classes.ting}
              data-valgt={valgt === t.id || undefined}
              data-dras={dras || undefined}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                transform: dras
                  ? `translate(${drag.dx}px, ${drag.dy}px) scale(1.15)`
                  : `rotate(${t.rot}deg)`,
              }}
              onPointerDown={(e) => pointerDown(e, t.id)}
              title={tr(t.navn, t.navnEn)}
            >
              <span className={classes.tingEmoji}>{t.emoji}</span>
              <span className={classes.tingNavn}>{tr(t.navn, t.navnEn)}</span>
            </button>
          );
        })}
        <div className={classes.kurver}>
          {KURVER.map((k) => (
            <button
              key={k.id}
              type="button"
              data-kurv={k.id}
              className={classes.kurv}
              data-blink={blink?.kurv === k.id ? (blink.ok ? 'ok' : 'feil') : undefined}
              onClick={() => valgt !== null && legg(valgt, k.id)}
            >
              <span data-kurv={k.id} style={{ fontSize: 34 }}>{k.emoji}</span>
              <span data-kurv={k.id}>{tr(k.navn, k.navnEn)}</span>
            </button>
          ))}
        </div>
      </div>
      <p className={classes.hint}>{tr('Dra tingene til riktig kurv — eller klikk en ting, så en kurv.', 'Drag the items to the right basket — or click an item, then a basket.')}</p>
    </SpillRamme>
  );
}
