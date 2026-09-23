import { useCallback, useEffect, useState } from 'react';
import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { lyd } from '../lib/lyd';
import {
  MAKS_BONUS,
  MAKS_ENERGI,
  MINSTE_EFFEKT,
  bjarnesDom,
  bjarnesKaffedom,
  energiØkning,
  stressReduksjon,
} from '../lib/stress';
import { MINI_SPILL } from '../spill/register';
import type { MiniSpill, Resultat } from '../types/stresspause.types';
import classes from './Stresspause.module.css';

const STARTSTRESS = 85;
const STARTENERGI = 25;

function stressFarge(stress: number) {
  if (stress > 70) return 'red';
  if (stress > 40) return 'orange';
  return 'teal';
}

function energiFarge(energi: number) {
  if (energi < 30) return 'gray';
  if (energi < 60) return 'yellow';
  return 'orange';
}

function Bjarne({ children }: { children: string }) {
  return (
    <Group gap="sm" wrap="nowrap" align="flex-start">
      <div className={classes.bjarne} aria-hidden>
        🤖
      </div>
      <div className={classes.snakkeboble}>{children}</div>
    </Group>
  );
}

export function Stresspause() {
  const [stress, setStress] = useState(STARTSTRESS);
  const [energi, setEnergi] = useState(STARTENERGI);
  const [aktivt, setAktivt] = useState<MiniSpill | null>(null);
  const [spiller, setSpiller] = useState(false);
  const [runde, setRunde] = useState(0);
  const [resultat, setResultat] = useState<Resultat | null>(null);

  /** Velg et spill: vis «slik spiller du» først. */
  const velg = (spill: MiniSpill) => {
    setResultat(null);
    setSpiller(false);
    setAktivt(spill);
  };

  const start = () => {
    setResultat(null);
    setSpiller(true);
    setRunde((r) => r + 1);
  };

  const tilMenyen = () => {
    setAktivt(null);
    setSpiller(false);
    setResultat(null);
  };

  // Enter eller mellomrom starter spillet fra introskjermen.
  useEffect(() => {
    if (!aktivt || spiller) return;
    const tast = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener('keydown', tast);
    return () => window.removeEventListener('keydown', tast);
  }, [aktivt, spiller]);

  const onFerdig = useCallback(
    (score: number) => {
      if (!aktivt) return;
      lyd.ferdig();
      setSpiller(false);
      if (aktivt.anledning === 'kaffepause') {
        const etter = Math.min(100, energi + energiØkning(score));
        setResultat({ spill: aktivt, score, maaler: 'energi', før: energi, etter });
        setEnergi(etter);
        return;
      }
      const etter = Math.max(0, stress - stressReduksjon(score));
      setResultat({ spill: aktivt, score, maaler: 'stress', før: stress, etter });
      setStress(etter);
    },
    [aktivt, stress, energi],
  );

  return (
    <Box className={classes.side}>
      <Container size="lg" py="xl">
        <Group justify="space-between" align="flex-end" mb="lg">
          <div>
            <Anchor href="#" c="dimmed" size="sm">
              ← Tilbake til skadekøen
            </Anchor>
            <Title order={1} mt={4}>
              🧘 Stresspause
            </Title>
            <Text c="dimmed">Du kan ikke tape. Men du kan gjøre det bedre.</Text>
          </div>
          <Stack w={280} gap="xs">
            <Box>
              <Group justify="space-between" mb={4}>
                <Text fw={800}>Stressnivå</Text>
                <Text fw={800} c={`${stressFarge(stress)}.4`}>
                  {stress} %
                </Text>
              </Group>
              <Progress
                value={stress}
                color={stressFarge(stress)}
                size="xl"
                radius="xl"
                transitionDuration={800}
              />
              <Anchor
                component="button"
                size="xs"
                c="dimmed"
                mt={4}
                onClick={() => setStress((s) => Math.min(100, s + 20))}
              >
                (demo) Kunden ringte igjen: +20 stress
              </Anchor>
            </Box>
            <Box>
              <Group justify="space-between" mb={4}>
                <Text fw={800}>Energi ⚡</Text>
                <Text fw={800} c={`${energiFarge(energi)}.4`}>
                  {energi} %
                </Text>
              </Group>
              <Progress
                value={energi}
                color={energiFarge(energi)}
                size="xl"
                radius="xl"
                transitionDuration={800}
              />
            </Box>
          </Stack>
        </Group>

        {!aktivt && (
          <Stack gap="lg">
            <Bjarne>
              {stress > 70
                ? 'Du ser stresset ut. Det stresser meg. Velg et spill, så slipper jeg å se på det.'
                : stress > 30
                  ? 'Bedre. Men jeg har sett kaffemaskinen mer avslappet.'
                  : 'Du er nesten zen. Mistenkelig. Har du levert inn noe som helst i dag?'}
            </Bjarne>
            {[
              {
                tittel: '☕ Kaffepause',
                spill: MINI_SPILL.filter((s) => s.anledning === 'kaffepause'),
              },
              {
                tittel: '🧘 Stresspause',
                spill: MINI_SPILL.filter((s) => !s.anledning),
              },
            ].map((gruppe) => (
              <div key={gruppe.tittel}>
                <Title order={3} mb="sm" c="gray.4">
                  {gruppe.tittel}
                </Title>
                <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
                  {gruppe.spill.map((s) => (
                    <button key={s.id} type="button" className={classes.kort} onClick={() => velg(s)}>
                      <span className={classes.kortEmoji}>{s.emoji}</span>
                      <Title order={3} mt="sm">
                        {s.navn}
                      </Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        {s.beskrivelse}
                      </Text>
                      <Text size="xs" fw={700} c="teal.3" mt="sm">
                        🎮 {s.kontroller}
                      </Text>
                    </button>
                  ))}
                </SimpleGrid>
              </div>
            ))}
          </Stack>
        )}

        {aktivt && !spiller && !resultat && (
          <div className={classes.spillflate}>
            <Stack align="center" gap="md" py="md" maw={560} mx="auto">
              <div className={classes.stor}>{aktivt.emoji}</div>
              <Title order={2} ta="center">
                {aktivt.navn}
              </Title>
              <Text c="dimmed" ta="center">
                {aktivt.beskrivelse}
              </Text>
              <div className={classes.slikSpiller}>🎮 {aktivt.slikSpiller}</div>
              <Text size="sm" fw={700} c={aktivt.anledning === 'kaffepause' ? 'yellow.4' : 'teal.3'}>
                ⏱ Maks 15 sekunder ·{' '}
                {aktivt.anledning === 'kaffepause'
                  ? `Gir opptil +${MAKS_ENERGI} energi`
                  : `Senker stress med opptil ${MINSTE_EFFEKT + MAKS_BONUS}`}
              </Text>
              <Group mt="sm">
                <Button size="lg" color="teal" onClick={start}>
                  Start ▶
                </Button>
                <Button size="lg" variant="subtle" color="gray" onClick={tilMenyen}>
                  Tilbake
                </Button>
              </Group>
              <Text size="xs" c="dimmed">
                … eller trykk Enter
              </Text>
            </Stack>
          </div>
        )}

        {aktivt && spiller && !resultat && (
          <div className={classes.spillflate}>
            <Group justify="space-between" mb="sm">
              <Title order={2}>
                {aktivt.emoji} {aktivt.navn}
              </Title>
              <Button variant="subtle" color="gray" onClick={tilMenyen}>
                Avbryt
              </Button>
            </Group>
            <aktivt.Komponent key={runde} onFerdig={onFerdig} />
          </div>
        )}

        {aktivt && resultat && (
          <div className={classes.spillflate}>
            <Stack align="center" ta="center" gap="md" py="lg">
              <div className={classes.stor}>
                {resultat.score >= 0.7 ? '😌' : resultat.score >= 0.4 ? '🙂' : '😮‍💨'}
              </div>
              <Title order={2}>
                {resultat.spill.navn}: {Math.round(resultat.score * 100)} %
              </Title>
              {resultat.maaler === 'energi' ? (
                <Text size="xl" fw={800} c="yellow.4">
                  Energi {resultat.før} % → {resultat.etter} % (+{resultat.etter - resultat.før}) ⚡
                </Text>
              ) : (
                <Text size="xl" fw={800} c="teal.3">
                  Stress {resultat.før} % → {resultat.etter} % (−{resultat.før - resultat.etter})
                </Text>
              )}
              <Bjarne>
                {resultat.maaler === 'energi' ? bjarnesKaffedom(resultat.score) : bjarnesDom(resultat.score)}
              </Bjarne>
              <Group mt="md">
                <Button size="md" color="teal" onClick={start}>
                  Spill igjen
                </Button>
                <Button size="md" variant="light" onClick={tilMenyen}>
                  Tilbake til menyen
                </Button>
              </Group>
            </Stack>
          </div>
        )}
      </Container>
    </Box>
  );
}
