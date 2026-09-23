import { Badge, Button, Group, Modal, Progress, Stack, Text } from '@mantine/core';
import { sakensIkon } from '../data/ikoner';
import { KATEGORIER } from '../data/skadesaker';
import type { Sak } from '../types/skadeko.types';

type Props = {
  sak: Sak | null;
  onSvar: (id: number, valg: number) => void;
  onLukk: () => void;
};

const BOKSTAVER = ['A', 'B', 'C'];

/** Saken åpnet: les hva kunden skriver, og velg riktig håndtering. Klokka går fortsatt. */
export function SakDialog({ sak, onSvar, onLukk }: Props) {
  const kategori = sak ? KATEGORIER[sak.kategori] : null;

  return (
    <Modal
      opened={sak !== null}
      onClose={onLukk}
      centered
      radius="lg"
      size="lg"
      title={
        sak &&
        kategori && (
          <Group gap="sm">
            <IconForSak emoji={sak.emoji} />
            <Badge color={kategori.farge} variant="filled" size="lg" radius="sm">
              {kategori.navn}
            </Badge>
            <Text fw={700}>{sak.kunde}</Text>
          </Group>
        )
      }
    >
      {sak && (
        <Stack gap="md">
          <Progress
            value={sak.igjen * 100}
            color={sak.igjen < 0.3 ? 'red' : sak.igjen < 0.6 ? 'yellow' : 'teal'}
            size="sm"
            radius="xl"
            aria-label="Kundens tålmodighet"
          />
          <Text fz="lg" fs="italic">
            «{sak.beskrivelse}»
          </Text>
          <Text fw={800}>{sak.sporsmal}</Text>
          <Stack gap="xs">
            {sak.svar.map((tekst, i) => (
              <Button
                key={tekst}
                variant="light"
                color="violet"
                size="md"
                justify="flex-start"
                h="auto"
                py="sm"
                styles={{ label: { whiteSpace: 'normal', textAlign: 'left' } }}
                onClick={() => onSvar(sak.id, i)}
              >
                {BOKSTAVER[i]}. {tekst}
              </Button>
            ))}
          </Stack>
        </Stack>
      )}
    </Modal>
  );
}

function IconForSak({ emoji }: { emoji: string }) {
  const Ikon = sakensIkon(emoji);
  return <Ikon size={26} stroke={1.75} color="var(--mantine-color-violet-6)" aria-hidden />;
}
