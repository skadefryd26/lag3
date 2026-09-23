import type { ReactNode } from 'react';
import { Group, Progress, Text } from '@mantine/core';

type Props = {
  igjen: number;
  total: number;
  status?: ReactNode;
  /** Overstyrer «12.3 s» for spill som ikke går på tid. */
  visning?: string;
  children: ReactNode;
};

/** Felles ramme rundt hvert mini-spill: tidslinje øverst, spillet under. */
export function SpillRamme({ igjen, total, status, visning, children }: Props) {
  const andel = (igjen / total) * 100;
  return (
    <div>
      <Group justify="space-between" mb={6}>
        <Text fw={700} c="gray.3">
          {status}
        </Text>
        <Text fw={700} c={!visning && igjen < 5 ? 'orange.4' : 'gray.4'} ff="monospace">
          {visning ?? `${igjen.toFixed(1)} s`}
        </Text>
      </Group>
      <Progress value={andel} color={andel < 25 ? 'orange' : 'teal'} size="sm" radius="xl" mb="md" transitionDuration={0} />
      {children}
    </div>
  );
}
