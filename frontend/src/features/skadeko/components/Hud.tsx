import { Box, Button, Divider, Group, Progress, Stack, Text, Title, Tooltip } from '@mantine/core';
import { MenyKnapp } from './Sidemeny';
import { MAALERE, alvorlighet, erKritisk } from '../data/maalere';
import type { MaalerId, Maalere } from '../types/skadeko.types';
import classes from './Skadeko.module.css';

type Props = {
  /** Poeng, level og målere vises først når arbeidsdagen er i gang. */
  visStatus: boolean;
  poeng: number;
  /** Vanskelighetsgrad 1–10. */
  level: number;
  liv: number;
  livIgjen: number;
  maalere: Maalere;
  /** Målere som tømmes akkurat nå — knappen deres er låst til de er i mål. */
  tommes: MaalerId[];
  /** Åpner tiltaket for én måler. Null når spillet ikke er i gang. */
  onTiltak: ((id: MaalerId) => void) | null;
  menyApen: boolean;
  onMeny: () => void;
};

/** Hvit i starten, gul i midten, rød mot slutten. */
function levelFarge(level: number) {
  if (level >= 8) return '#ff8787';
  if (level >= 5) return '#ffd43b';
  return 'white';
}

export function Hud({ visStatus, poeng, level, liv, livIgjen, maalere, tommes, onTiltak, menyApen, onMeny }: Props) {
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

      {visStatus && (
        <Group
          gap="md"
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
          <Stack gap={2} align="center" miw={70}>
            <Text fz={40} fw={900} c="white" lh={1}>
              {poeng}
            </Text>
            <Text fz={13} c="rgba(255,255,255,0.75)" tt="uppercase" fw={700} style={{ letterSpacing: 1 }}>
              poeng
            </Text>
          </Stack>

          <Stack gap={2} align="center" miw={70}>
            {/* key: ny animasjon hver gang levelet øker. */}
            <Text key={level} fz={40} fw={900} c={levelFarge(level)} lh={1} className={classes.nyttLevel}>
              {level}
            </Text>
            <Text fz={13} c="rgba(255,255,255,0.75)" tt="uppercase" fw={700} style={{ letterSpacing: 1 }}>
              level
            </Text>
          </Stack>

          <Stack gap={2} align="center" miw={70} aria-label={`${livIgjen} av ${liv} liv igjen`}>
            <Group gap={2} wrap="nowrap" lh={1} fz={26}>
              {Array.from({ length: liv }, (_, i) => (
                // key med livIgjen: hjertet som nettopp ble mistet, animeres.
                <span key={`${i}-${i < livIgjen}`} className={i < livIgjen ? undefined : classes.mistetLiv}>
                  {i < livIgjen ? '❤️' : '🖤'}
                </span>
              ))}
            </Group>
            <Text fz={13} c="rgba(255,255,255,0.75)" tt="uppercase" fw={700} style={{ letterSpacing: 1 }}>
              liv
            </Text>
          </Stack>

          <Divider orientation="vertical" color="rgba(255,255,255,0.2)" />

          <Group gap="md" wrap="nowrap" align="flex-start" aria-label="Din tilstand">
            {MAALERE.map((konfig) => {
              const verdi = maalere[konfig.id];
              const kritisk = erKritisk(konfig, verdi);
              const grad = alvorlighet(konfig, verdi);

              return (
                <Stack key={konfig.id} gap={8} w={136}>
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
                      styles={{ root: { paddingInline: 6 }, label: { fontSize: 15, fontWeight: 800 } }}
                    >
                      {tommes.includes(konfig.id) ? (konfig.knappUnderveis ?? konfig.knapp) : konfig.knapp}
                    </Button>
                  </Tooltip>
                </Stack>
              );
            })}
          </Group>
        </Group>
      )}
    </Group>
  );
}
