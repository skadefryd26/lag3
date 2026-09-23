import { Badge, Box, Group, Progress, Stack, Text } from '@mantine/core';
import { KATEGORIER } from '../data/skadesaker';
import type { Sak } from '../types/skadeko.types';
import classes from './Skadeko.module.css';

type Props = {
  sak: Sak;
  onApne: (id: number) => void;
};

export function SakKort({ sak, onApne }: Props) {
  const haster = sak.igjen < 0.3;
  const advarsel = !haster && sak.igjen < 0.6;
  const farge = haster ? 'red' : advarsel ? 'yellow' : 'teal';
  const kategori = KATEGORIER[sak.kategori];

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onApne(sak.id)}
      className={`${classes.sak} ${classes[`kant_${sak.kategori}`]} ${haster ? classes.haster : ''}`}
      aria-label={`Åpne ${kategori.navn.toLowerCase()} sak fra ${sak.kunde}: ${sak.beskrivelse}`}
    >
      {haster && <span className={classes.stempel}>HASTER</span>}
      <Stack gap={4} align="flex-start">
        <Group gap={6} wrap="nowrap">
          <Text fz={28} lh={1}>
            {sak.emoji}
          </Text>
          <Badge color={kategori.farge} variant="filled" size="sm" radius="sm">
            {kategori.ikon} {kategori.navn} · {kategori.poeng}p
          </Badge>
        </Group>
        <Text fz="xs" fw={700} c="dimmed">
          {sak.kunde}
        </Text>
        <Text fz="sm" lh={1.25} ta="left" lineClamp={3}>
          «{sak.beskrivelse}»
        </Text>
      </Stack>
      <Progress value={sak.igjen * 100} color={farge} size="sm" radius="xl" mt="sm" />
    </Box>
  );
}
