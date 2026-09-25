import { Avatar, Button, CloseButton, Group, Paper, Stack, Text } from '@mantine/core';
import type { Teamsmelding } from '../hooks/useTeamsForstyrrelser';
import { useSprak } from '../../../sprak';

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
  const { t } = useSprak();
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
      aria-label={t('Teams-meldinger', 'Teams messages')}
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
                {initialer(t(m.avsender.navn, m.avsender.navnEn))}
              </Avatar>
              <Stack gap={0}>
                <Text fz="sm" fw={700}>
                  {t(m.avsender.navn, m.avsender.navnEn)}
                </Text>
                <Text fz={11} c="dimmed">
                  {t('Microsoft Teams · nå', 'Microsoft Teams · now')}
                </Text>
              </Stack>
            </Group>
            <CloseButton aria-label={t('Lukk melding', 'Close message')} onClick={() => onLukk(m.id)} />
          </Group>

          {t(m.linjer, m.linjerEn).map((linje, i) => (
            <Text key={i} fz="sm" fw={i > 0 ? 700 : 400} c={i > 0 ? 'red.7' : undefined}>
              {linje}
            </Text>
          ))}

          <Group gap="xs" mt="sm" grow>
            <Button size="xs" variant="light" color="gray" onClick={() => onLukk(m.id)}>
              {t('Svar senere', 'Reply later')}
            </Button>
            <Button size="xs" color="#6264a7" onClick={() => onLukk(m.id)}>
              {t('Ja da 🙂', 'Sure thing 🙂')}
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
