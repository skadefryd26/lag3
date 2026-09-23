import { Box, Divider, Group, Progress, Stack, Text, Title } from '@mantine/core';

const FARGER = ['green', 'yellow', 'red'];

type Props = {
  poeng: number;
  tapt: number;
  liv: number;
  /** 0–1: hvor nær den mest utålmodige kunden er å gå. Fyller den aktive stolpen. */
  press: number;
};

export function Hud({ poeng, tapt, liv, press }: Props) {
  const fyll = (i: number) => {
    const verdi = i < tapt ? 100 : i === tapt ? Math.max(0, Math.min(1, press)) * 100 : 0;
    // Energi (første stolpe) starter full og tappes; de andre fylles opp.
    return i === 0 ? 100 - verdi : verdi;
  };
  const merkelapper = ['🔋 Energi', '🚽 Blære', '🤯 Stress'].slice(0, liv);

  return (
    <Group justify="space-between" align="center" wrap="wrap" gap="md">
      <Group gap="sm" wrap="nowrap">
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
        align="center"
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
        <Stack gap={0} align="center">
          <Text fz={22} fw={900} c="white" lh={1}>
            {poeng}
          </Text>
          <Text fz={10} c="rgba(255,255,255,0.65)" tt="uppercase" fw={700} style={{ letterSpacing: 1 }}>
            poeng
          </Text>
        </Stack>

        <Divider orientation="vertical" color="rgba(255,255,255,0.2)" />

        <Group gap="md" wrap="nowrap" aria-label="Utmattelse">
          {merkelapper.map((tekst, i) => (
            <Stack key={tekst} gap={4} w={96}>
              <Text
                fz={11}
                fw={700}
                c={i === tapt ? 'white' : 'rgba(255,255,255,0.7)'}
              >
                {tekst}{' '}
                <span
                  aria-label={i === 0 ? 'synker' : 'stiger'}
                  style={{ color: '#ff6b6b', fontWeight: 900 }}
                >
                  {i === 0 ? '▼' : '▲'}
                </span>
              </Text>
              <Progress
                size={10}
                radius="xl"
                bg="rgba(255,255,255,0.18)"
                value={fyll(i)}
                color={FARGER[i] ?? 'red'}
                animated={i === tapt && press > 0.75}
                striped={i === tapt && press > 0.75}
                transitionDuration={120}
              />
            </Stack>
          ))}
        </Group>
      </Group>
    </Group>
  );
}
