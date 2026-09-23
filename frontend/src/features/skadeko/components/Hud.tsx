import { Badge, Group, Text, Title } from '@mantine/core';
import { TILSTANDER } from '../data/saker';

type Props = {
  poeng: number;
  tapt: number;
  liv: number;
};

export function Hud({ poeng, tapt, liv }: Props) {
  const merkelapper = ['😐 Sliten', '😩 Utmattet', '🤒 Sykmeldt'].slice(0, liv);

  return (
    <Group justify="space-between" align="center" wrap="wrap" gap="md">
      <Title order={1} fz="h2" c="white">
        📎 Skadekø
      </Title>

      <Group gap="xs" align="center">
        <Text fw={800} fz="lg" c="white">
          {poeng} poeng
        </Text>

        <Group gap={6} aria-label="Liv">
          {merkelapper.map((tekst, i) => (
            <Badge
              key={tekst}
              variant={i < tapt ? 'filled' : 'white'}
              color={i < tapt ? 'red' : 'gray'}
              styles={{
                label: { textDecoration: i < tapt ? 'line-through' : 'none' },
              }}
            >
              {tekst}
            </Badge>
          ))}
        </Group>

        <Text fz="sm" c="rgba(255,255,255,0.85)">
          Tilstand: {TILSTANDER[Math.min(tapt, TILSTANDER.length - 1)]}
        </Text>
      </Group>
    </Group>
  );
}
