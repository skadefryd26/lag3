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
import { ENERGI_TAK, bjarnesDom, bjarnesKaffedom, energiØkning, stressReduksjon } from '../lib/stress';
import { MINI_SPILL } from '../spill/register';
import type { MiniSpill, Resultat } from '../types/stresspause.types';
import { useSprak } from '../../../sprak';
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
  const { t } = useSprak();
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
        const etter = Math.max(energi, Math.min(ENERGI_TAK, energi + energiØkning(score)));
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
              {t('← Tilbake til skadekøen', '← Back to the claims queue')}
            </Anchor>
            <Title order={1} mt={4}>
              🧘 {t('Stresspause', 'Stress break')}
            </Title>
            <Text c="dimmed">{t('Du kan ikke tape. Men du kan gjøre det bedre.', 'You can\'t lose. But you can do better.')}</Text>
          </div>
          <Stack w={280} gap="xs">
            <Box>
              <Group justify="space-between" mb={4}>
                <Text fw={800}>{t('Stressnivå', 'Stress level')}</Text>
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
                {t('(demo) Kunden ringte igjen: +20 stress', '(demo) The customer called again: +20 stress')}
              </Anchor>
            </Box>
            <Box>
              <Group justify="space-between" mb={4}>
                <Text fw={800}>{t('Energi', 'Energy')} ⚡</Text>
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
                ? t('Du ser stresset ut. Det stresser meg. Velg et spill, så slipper jeg å se på det.', 'You look stressed. It stresses me out. Pick a game so I don\'t have to look at it.')
                : stress > 30
                  ? t('Bedre. Men jeg har sett kaffemaskinen mer avslappet.', 'Better. But I\'ve seen the coffee machine more relaxed.')
                  : t('Du er nesten zen. Mistenkelig. Har du levert inn noe som helst i dag?', 'You\'re almost zen. Suspicious. Have you handed in anything at all today?')}
            </Bjarne>
            {[
              {
                id: 'kaffe',
                tittel: t('☕ Kaffepause', '☕ Coffee break'),
                spill: MINI_SPILL.filter((s) => s.anledning === 'kaffepause'),
              },
              {
                id: 'stress',
                tittel: t('🧘 Stresspause', '🧘 Stress break'),
                spill: MINI_SPILL.filter((s) => !s.anledning),
              },
            ].map((gruppe) => (
              <div key={gruppe.id}>
                <Title order={3} mb="sm" c="gray.4">
                  {gruppe.tittel}
                </Title>
                <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="lg">
                  {gruppe.spill.map((s) => (
                    <button key={s.id} type="button" className={classes.kort} onClick={() => velg(s)}>
                      <span className={classes.kortEmoji}>{s.emoji}</span>
                      <Title order={3} mt="sm">
                        {t(s.navn, s.navnEn)}
                      </Title>
                      <Text c="dimmed" size="sm" mt={4}>
                        {t(s.beskrivelse, s.beskrivelseEn)}
                      </Text>
                      <Text size="xs" fw={700} c="teal.3" mt="sm">
                        🎮 {t(s.kontroller, s.kontrollerEn)}
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
            <Stack align="center" gap="lg" py="xl" maw={560} mx="auto">
              <Title order={2} ta="center">
                {t(aktivt.navn, aktivt.navnEn)}
              </Title>
              <div className={classes.slikSpiller}>{t(aktivt.slikSpiller, aktivt.slikSpillerEn)}</div>
              <Button size="lg" color="teal" onClick={start}>
                Start ▶
              </Button>
            </Stack>
          </div>
        )}

        {aktivt && spiller && !resultat && (
          <div className={classes.spillflate}>
            <Group justify="space-between" mb="sm">
              <Title order={2}>
                {aktivt.emoji} {t(aktivt.navn, aktivt.navnEn)}
              </Title>
              <Button variant="subtle" color="gray" onClick={tilMenyen}>
                {t('Avbryt', 'Cancel')}
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
                {t(resultat.spill.navn, resultat.spill.navnEn)}: {Math.round(resultat.score * 100)} %
              </Title>
              {resultat.maaler === 'energi' ? (
                <Text size="xl" fw={800} c="yellow.4">
                  {t('Energi', 'Energy')} {resultat.før} % → {resultat.etter} % (+{resultat.etter - resultat.før}) ⚡
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
                  {t('Spill igjen', 'Play again')}
                </Button>
                <Button size="md" variant="light" onClick={tilMenyen}>
                  {t('Tilbake til menyen', 'Back to the menu')}
                </Button>
              </Group>
            </Stack>
          </div>
        )}
      </Container>
    </Box>
  );
}
