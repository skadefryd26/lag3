import { Box, Progress, Stack, Text } from '@mantine/core';
import type { Sak } from '../types/skadeko.types';
import classes from './Skadeko.module.css';

type Props = {
  sak: Sak;
  onBehandle: (id: number) => void;
};

export function SakKort({ sak, onBehandle }: Props) {
  const haster = sak.igjen < 0.3;
  const advarsel = !haster && sak.igjen < 0.6;
  const farge = haster ? 'red' : advarsel ? 'yellow' : 'teal';

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onBehandle(sak.id)}
      className={`${classes.sak} ${haster ? classes.haster : ''}`}
      aria-label={`Behandle sak: ${sak.tittel}, kunde ${sak.kunde}`}
    >
      {haster && <span className={classes.stempel}>HASTER</span>}
      <Stack gap={2} align="flex-start">
        <Text fz={34} lh={1}>
          {sak.emoji}
        </Text>
        <Text fw={700} fz="sm" lh={1.2} ta="left">
          {sak.tittel}
        </Text>
        <Text fz="xs" c="dimmed">
          {sak.kunde}
        </Text>
      </Stack>
      <Progress value={sak.igjen * 100} color={farge} size="sm" radius="xl" mt="sm" />
    </Box>
  );
}
