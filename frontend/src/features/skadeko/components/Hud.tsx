import { Box, Button, Divider, Group, Progress, Stack, Text, Title, Tooltip } from '@mantine/core';
import { MenyKnapp } from './Sidemeny';
import { MAALERE, alvorlighet, erKritisk } from '../data/maalere';
import type { MaalerId, Maalere } from '../types/skadeko.types';
import classes from './Skadeko.module.css';

type Props = {
  poeng: number;
  maalere: Maalere;
  /** Åpner tiltaket for én måler. Null når spillet ikke er i gang. */
  onTiltak: ((id: MaalerId) => void) | null;
  menyApen: boolean;
  onMeny: () => void;
};

export function Hud({ poeng, maalere, onTiltak, menyApen, onMeny }: Props) {
  return (
    <Group justify="space-between" align="center" wrap="wrap" gap="md">
      <Group gap="sm" wrap="nowrap">
        <MenyKnapp apen={menyApen} onKlikk={onMeny} />
        <Box
          w={44}
          h={44}
          style={{
            display: 'grid',
            placeItems: 'center',
            fontSize: 24,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
          }}
          aria-hidden
        >
          📎
        </Box>
        <Stack gap={0}>
          <Title order={1} fz={24} fw={900} c="white" lh={1.1} style={{ letterSpacing: -0.5 }}>
            Skadekø
          </Title>
          <Text fz={11} c="rgba(255,255,255,0.7)" tt="uppercase" fw={600} style={{ letterSpacing: 1 }}>
            Skadeavdelingen · Bjarne følger med
          </Text>
        </Stack>
      </Group>

      <Group
        gap="lg"
        align="flex-start"
        wrap="nowrap"
        px="md"
        py={8}
        style={{
          borderRadius: 14,
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Stack gap={0} align="center" pt={6}>
          <Text fz={22} fw={900} c="white" lh={1}>
            {poeng}
          </Text>
          <Text fz={10} c="rgba(255,255,255,0.65)" tt="uppercase" fw={700} style={{ letterSpacing: 1 }}>
            poeng
          </Text>
        </Stack>

        <Divider orientation="vertical" color="rgba(255,255,255,0.2)" />

        <Group gap="md" wrap="nowrap" align="flex-start" aria-label="Din tilstand">
          {MAALERE.map((konfig) => {
            const verdi = maalere[konfig.id];
            const kritisk = erKritisk(konfig, verdi);
            const grad = alvorlighet(konfig, verdi);

            return (
              <Stack key={konfig.id} gap={5} w={112}>
                <Group gap={4} wrap="nowrap" justify="space-between">
                  <Text fz={11} fw={700} c={kritisk ? '#ffd43b' : 'rgba(255,255,255,0.8)'}>
                    {konfig.emoji} {konfig.navn}
                  </Text>
                  <Text fz={11} fw={800} c={kritisk ? '#ffd43b' : 'rgba(255,255,255,0.55)'}>
                    {Math.round(verdi)}%
                  </Text>
                </Group>

                <Progress
                  size={10}
                  radius="xl"
                  bg="rgba(255,255,255,0.18)"
                  value={verdi}
                  color={konfig.farge}
                  animated={kritisk}
                  striped={kritisk}
                  transitionDuration={200}
                  aria-label={`${konfig.navn}: ${Math.round(verdi)} prosent`}
                />

                <Tooltip
                  label={konfig.tiltakBeskrivelse}
                  withArrow
                  openDelay={400}
                  multiline
                  w={230}
                >
                  <Button
                    size="compact-xs"
                    variant={kritisk ? 'filled' : 'white'}
                    color={kritisk ? konfig.farge : undefined}
                    fullWidth
                    disabled={!onTiltak}
                    onClick={() => onTiltak?.(konfig.id)}
                    className={kritisk && grad > 0.85 ? classes.roper : undefined}
                    styles={{ label: { fontSize: 11, fontWeight: 700 } }}
                  >
                    {konfig.knapp}
                  </Button>
                </Tooltip>
              </Stack>
            );
          })}
        </Group>
      </Group>
    </Group>
  );
}
