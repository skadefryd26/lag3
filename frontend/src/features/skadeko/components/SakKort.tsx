import { Badge, Box, Group, Progress, Stack, Text } from '@mantine/core';
import { sakensIkon } from '../data/ikoner';
import { KATEGORIER } from '../data/skadesaker';
import type { Sak } from '../types/skadeko.types';
import classes from './Skadeko.module.css';
import { useSprak } from '../../../sprak';

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
  const { t } = useSprak();
  const kategoriNavn = t(kategori.navn, kategori.navnEn);
  const beskrivelse = t(sak.beskrivelse, sak.beskrivelseEn);

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onApne(sak.id)}
      className={`${classes.sak} ${classes[`kant_${sak.kategori}`]} ${haster ? classes.haster : ''}`}
      aria-label={t(
        `Åpne ${kategoriNavn.toLowerCase()} sak fra ${sak.kunde}: ${beskrivelse}`,
        `Open ${kategoriNavn.toLowerCase()} claim from ${sak.kunde}: ${beskrivelse}`,
      )}
    >
      {haster && <span className={classes.stempel}>{t('HASTER', 'URGENT')}</span>}
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
            <Text fz="sm" fw={600} lh={1.2}>
              {sak.kunde}
            </Text>
            <Badge color={kategori.farge} variant="light" size="xs" radius="sm">
              {kategoriNavn} · {kategori.poeng}p
            </Badge>
          </Stack>
        </Group>
        <Text fz="sm" lh={1.4} ta="left" c="dimmed" lineClamp={3}>
          {beskrivelse}
        </Text>
      </Stack>
      {/* Oppdateres hver frame: en CSS-overgang ville startet på nytt hele tiden og fått baren til å fryse. */}
      <Progress
        value={sak.igjen * 100}
        color={farge}
        size={6}
        radius="xl"
        mt="md"
        bg="light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))"
        transitionDuration={0}
      />
    </Box>
  );
}
