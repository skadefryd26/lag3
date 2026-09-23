import { Badge, Box, Group, Progress, Stack, Text } from '@mantine/core';
import { sakensIkon } from '../data/ikoner';
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
  const Ikon = sakensIkon(sak.emoji);

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onApne(sak.id)}
      className={`${classes.sak} ${classes[`kant_${sak.kategori}`]} ${haster ? classes.haster : ''}`}
      aria-label={`Åpne ${kategori.navn.toLowerCase()} sak fra ${sak.kunde}: ${sak.beskrivelse}`}
    >
      {haster && <span className={classes.stempel}>HASTER</span>}
      <Stack gap={8} align="flex-start">
        <Group gap={10} wrap="nowrap">
          <Box
            className={classes.ikonboks}
            bg={`var(--mantine-color-${kategori.farge}-0)`}
            c={`${kategori.farge}.8`}
          >
            <Ikon size={22} stroke={1.75} aria-hidden />
          </Box>
          <Stack gap={2}>
            <Text fz="sm" fw={600} lh={1.2} c="dark.7">
              {sak.kunde}
            </Text>
            <Badge color={kategori.farge} variant="light" size="xs" radius="sm">
              {kategori.navn} · {kategori.poeng}p
            </Badge>
          </Stack>
        </Group>
        <Text fz="sm" lh={1.4} ta="left" c="dark.5" lineClamp={3}>
          {sak.beskrivelse}
        </Text>
      </Stack>
      <Progress value={sak.igjen * 100} color={farge} size={6} radius="xl" mt="md" bg="gray.2" />
    </Box>
  );
}
