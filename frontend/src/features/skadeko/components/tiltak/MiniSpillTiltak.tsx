import { useEffect, useState } from 'react';
import { Button, Stack, Text, Title } from '@mantine/core';
import { bjarnesDom, bjarnesKaffedom, energiØkning, stressReduksjon } from '../../../stresspause/lib/stress';
import { MINI_SPILL } from '../../../stresspause/spill/register';
import type { MiniSpill } from '../../../stresspause/types/stresspause.types';
import { useSprak } from '../../../../sprak';
import type { TiltakSpill, TiltakSpillProps } from './registry';

type Oppsett = {
  /** Spillene det trekkes tilfeldig blant. */
  utvalg: MiniSpill[];
  /** Score 0–1 → prosentpoeng i spillerens favør. */
  effekt: (score: number) => number;
  dom: (score: number) => string;
  /** Hopp rett inn i spillet, uten navn og instruks først. */
  utenIntro?: boolean;
};

/**
 * Lager et tiltak av mini-spillene i `stresspause`: trekker et tilfeldig spill,
 * viser navn og instruks, og oversetter scoren til endring på måleren.
 */
function lagTiltak({ utvalg, effekt, dom, utenIntro = false }: Oppsett): TiltakSpill {
  return function MiniSpillTiltak({ onFerdig }: TiltakSpillProps) {
    const [spill] = useState(() => utvalg[Math.floor(Math.random() * utvalg.length)]);
    const [startet, setStartet] = useState(utenIntro);
    const { t } = useSprak();

    useEffect(() => {
      if (startet) return;
      const tast = (e: KeyboardEvent) => {
        if (e.code === 'Enter') setStartet(true);
      };
      window.addEventListener('keydown', tast);
      return () => window.removeEventListener('keydown', tast);
    }, [startet]);

    if (!startet) {
      return (
        <Stack align="center" gap="lg" py="md">
          <Title order={2} ta="center">
            {t(spill.navn, spill.navnEn)}
          </Title>
          <Text fz="lg" fw={700} ta="center">
            {t(spill.slikSpiller, spill.slikSpillerEn)}
          </Text>
          <Button size="lg" color="teal" onClick={() => setStartet(true)}>
            Start ▶
          </Button>
        </Stack>
      );
    }

    return (
      <spill.Komponent
        onFerdig={(score) =>
          onFerdig({
            endring: effekt(score),
            melding: `${t(spill.navn, spill.navnEn)}: ${Math.round(score * 100)} %. ${dom(score)}`,
          })
        }
      />
    );
  };
}

export const StresspauseTiltak = lagTiltak({
  utvalg: MINI_SPILL.filter((s) => !s.anledning),
  effekt: stressReduksjon,
  dom: bjarnesDom,
});

export const KaffepauseTiltak = lagTiltak({
  utvalg: MINI_SPILL.filter((s) => s.anledning === 'kaffepause'),
  effekt: energiØkning,
  dom: bjarnesKaffedom,
  // Alle vet hvordan man heller kaffe. Knappen i spillet sier resten.
  utenIntro: true,
});
