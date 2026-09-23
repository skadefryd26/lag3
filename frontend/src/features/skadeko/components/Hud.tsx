import { Box, Button, Divider, Group, Progress, Stack, Text, Title, Tooltip } from '@mantine/core';
import { MenyKnapp } from './Sidemeny';
import { MAALERE, alvorlighet, erKritisk } from '../data/maalere';
import type { MaalerId, Maalere } from '../types/skadeko.types';
import classes from './Skadeko.module.css';

type Props = {
  poeng: number;
  maalere: Maalere;
  /** Målere som tømmes akkurat nå — knappen deres er låst til de er i mål. */
  tommes: MaalerId[];
  /** Åpner tiltaket for én måler. Null når spillet ikke er i gang. */
  onTiltak: ((id: MaalerId) => void) | null;
  menyApen: boolean;
  onMeny: () => void;
};

export function Hud({ poeng, maalere, tommes, onTiltak, menyApen, onMeny }: Props) {
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
        gap="xl"
        align="center"
        wrap="nowrap"
        px="lg"
        py={12}
        style={{
          borderRadius: 14,
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Stack gap={2} align="center" miw={90}>
          <Text fz={40} fw={900} c="white" lh={1}>
            {poeng}
          </Text>
          <Text fz={13} c="rgba(255,255,255,0.75)" tt="uppercase" fw={700} style={{ letterSpacing: 1 }}>
            poeng
          </Text>
        </Stack>

        <Divider orientation="vertical" color="rgba(255,255,255,0.2)" />

        <Group gap="lg" wrap="nowrap" align="flex-start" aria-label="Din tilstand">
          {MAALERE.map((konfig) => {
            const verdi = maalere[konfig.id];
            const kritisk = erKritisk(konfig, verdi);
            const grad = alvorlighet(konfig, verdi);

            return (
              <Stack key={konfig.id} gap={8} w={160}>
                <Group gap={4} wrap="nowrap" justify="space-between">
                  <Text fz={15} fw={700} c={kritisk ? '#ffd43b' : 'rgba(255,255,255,0.9)'}>
                    {konfig.emoji} {konfig.navn}
                  </Text>
                  <Text fz={15} fw={800} c={kritisk ? '#ffd43b' : 'rgba(255,255,255,0.75)'}>
                    {Math.round(verdi)}%
                  </Text>
                </Group>

                {/* Oppdateres hver frame: en CSS-overgang ville startet på nytt hele tiden og fått baren til å fryse. */}
                <Progress
                  size={14}
                  radius="xl"
                  bg="rgba(255,255,255,0.18)"
                  value={verdi}
                  color={konfig.farge}
                  animated={kritisk}
                  striped={kritisk}
                  transitionDuration={0}
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
                    size="md"
                    variant={kritisk ? 'filled' : 'white'}
                    color={kritisk ? konfig.farge : undefined}
                    fullWidth
                    disabled={!onTiltak || tommes.includes(konfig.id)}
                    onClick={() => onTiltak?.(konfig.id)}
                    className={kritisk && grad > 0.85 ? classes.roper : undefined}
                    styles={{ label: { fontSize: 15, fontWeight: 800 } }}
                  >
                    {tommes.includes(konfig.id) ? (konfig.knappUnderveis ?? konfig.knapp) : konfig.knapp}
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
