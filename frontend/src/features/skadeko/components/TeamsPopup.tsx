import { Avatar, Button, CloseButton, Group, Paper, Stack, Text } from '@mantine/core';
import type { Teamsmelding } from '../hooks/useTeamsForstyrrelser';

type Props = {
  meldinger: Teamsmelding[];
  onLukk: (id: number) => void;
};

const initialer = (navn: string) =>
  navn
    .split(/\s+/)
    .slice(0, 2)
    .map((d) => d[0])
    .join('')
    .toUpperCase();

/** Teams-aktige varsler nede til høyre. Ligger over alt annet, også saksdialogen. */
export function TeamsPopup({ meldinger, onLukk }: Props) {
  if (meldinger.length === 0) return null;

  return (
    <Stack
      gap="sm"
      pos="fixed"
      right={20}
      bottom={20}
      w={320}
      style={{ zIndex: 1000 }}
      role="log"
      aria-label="Teams-meldinger"
    >
      {meldinger.map((m) => (
        <Paper
          key={m.id}
          shadow="xl"
          radius="md"
          p="sm"
          withBorder
          style={{
            borderLeft: '5px solid #6264a7',
            animation:
              m.linjer.length > 1
                ? 'teams-rist 0.4s ease-in-out 2'
                : 'teams-inn 0.25s ease-out',
          }}
        >
          <Group justify="space-between" align="flex-start" wrap="nowrap" mb={6}>
            <Group gap="xs" wrap="nowrap">
              <Avatar color={m.avsender.farge} radius="xl" size="md">
                {initialer(m.avsender.navn)}
              </Avatar>
              <Stack gap={0}>
                <Text fz="sm" fw={700}>
                  {m.avsender.navn}
                </Text>
                <Text fz={11} c="dimmed">
                  Microsoft Teams · nå
                </Text>
              </Stack>
            </Group>
            <CloseButton aria-label="Lukk melding" onClick={() => onLukk(m.id)} />
          </Group>

          {m.linjer.map((linje, i) => (
            <Text key={i} fz="sm" fw={i > 0 ? 700 : 400} c={i > 0 ? 'red.7' : undefined}>
              {linje}
            </Text>
          ))}

          <Group gap="xs" mt="sm" grow>
            <Button size="xs" variant="light" color="gray" onClick={() => onLukk(m.id)}>
              Svar senere
            </Button>
            <Button size="xs" color="#6264a7" onClick={() => onLukk(m.id)}>
              Ja da 🙂
            </Button>
          </Group>
        </Paper>
      ))}
      <style>{`
        @keyframes teams-inn { from { transform: translateX(120%); } to { transform: translateX(0); } }
        @keyframes teams-rist {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [role="log"] > * { animation: none !important; }
        }
      `}</style>
    </Stack>
  );
}
