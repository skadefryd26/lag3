import { SegmentedControl, Stack, Text } from '@mantine/core';
import { GRAD_ETTER_ID, VANSKELIGHETSGRADER, erGrad, type VanskelighetsgradId } from '../data/vanskelighetsgrader';

type Props = {
  verdi: VanskelighetsgradId;
  onEndre: (grad: VanskelighetsgradId) => void;
};

/** Velg stilling før du stempler inn: Vikar, Fulltid eller Senior. */
export function GradVelger({ verdi, onEndre }: Props) {
  return (
    <Stack gap={6}>
      <SegmentedControl
        fullWidth
        radius="md"
        color="violet"
        value={verdi}
        onChange={(v) => erGrad(v) && onEndre(v)}
        data={VANSKELIGHETSGRADER.map((g) => ({ value: g.id, label: `${g.emoji} ${g.navn}` }))}
        aria-label="Vanskelighetsgrad"
      />
      <Text fz="sm" c="dimmed" ta="center">
        {GRAD_ETTER_ID[verdi].beskrivelse}
      </Text>
    </Stack>
  );
}
