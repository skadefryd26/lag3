import { Badge, Button, Group, Modal, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import { useSprak } from '../../../sprak';

export type Vare = {
  id: string;
  navn: string;
  navnEn: string;
  emoji: string;
  beskrivelse: string;
  beskrivelseEn: string;
  pris: number;
};

/** Plassholdervarer — hva de faktisk gjør i spillet bestemmes senere. */
export const VARER: Vare[] = [
  {
    id: 'kaffe',
    navn: 'Dobbel espresso',
    navnEn: 'Double espresso',
    emoji: '☕',
    beskrivelse: 'Energien tappes 50 % saktere neste arbeidsdag.',
    beskrivelseEn: 'Your energy drains 50 % slower the next working day.',
    pris: 50,
  },
  {
    id: 'hodetelefoner',
    navn: 'Støydempende hodetelefoner',
    navnEn: 'Noise-cancelling headphones',
    emoji: '🎧',
    beskrivelse: 'Halvparten så mange Teams-meldinger neste arbeidsdag.',
    beskrivelseEn: 'Half as many Teams messages the next working day.',
    pris: 100,
  },
  {
    id: 'stressball',
    navn: 'Stressball',
    navnEn: 'Stress ball',
    emoji: '🔴',
    beskrivelse: 'Stresset stiger 50 % saktere neste arbeidsdag.',
    beskrivelseEn: 'Your stress rises 50 % slower the next working day.',
    pris: 75,
  },
  {
    id: 'kake',
    navn: 'Kake til teamet',
    navnEn: 'Cake for the team',
    emoji: '🎂',
    beskrivelse: 'Kommer snart: Bjarne blir blidere.',
    beskrivelseEn: 'Coming soon: Bjarne gets a little less grumpy.',
    pris: 150,
  },
  {
    id: 'forfremmelse',
    navn: 'Forfremmelse',
    navnEn: 'Promotion',
    emoji: '👑',
    beskrivelse: 'Du blir sjefen, og Bjarne degraderes til skadebehandler.',
    beskrivelseEn: 'You become the boss, and Bjarne is demoted to claims handler.',
    pris: 100000,
  },
];

type Props = {
  apen: boolean;
  onLukk: () => void;
  poeng: number;
  onKjop: (vare: Vare) => void;
  /** Varer som allerede er kjøpt i dag og ikke kan kjøpes igjen. */
  eide: string[];
};

export function Butikk({ apen, onLukk, poeng, onKjop, eide }: Props) {
  const { t } = useSprak();
  return (
    <Modal
      opened={apen}
      onClose={onLukk}
      title={<Text fw={900} fz="lg">{t('🛒 Butikk', '🛒 Shop')}</Text>}
      size="lg"
      radius="md"
      centered
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Stack gap={0}>
            <Text c="dimmed" fz="sm">{t('Bruk poengene dine på nyttige ting.', 'Spend your points on useful stuff.')}</Text>
            <Text c="dimmed" fz="sm" fw={600}>
              {t('Varene du kjøper blir aktive fra neste arbeidsdag.', 'Items you buy become active from the next working day.')}
            </Text>
          </Stack>
          <Badge size="lg" color="violet" variant="light">{poeng} {t('poeng', 'points')}</Badge>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {VARER.map((vare) => {
            const harRad = poeng >= vare.pris;
            const eier = eide.includes(vare.id);
            return (
              <Paper key={vare.id} withBorder radius="md" p="md">
                <Stack gap={6}>
                  <Text fw={700}>{vare.emoji} {t(vare.navn, vare.navnEn)}</Text>
                  <Text fz="sm" c="dimmed">{t(vare.beskrivelse, vare.beskrivelseEn)}</Text>
                  <Button
                    mt="xs"
                    color="teal"
                    disabled={!harRad || eier}
                    onClick={() => onKjop(vare)}
                  >
                    {eier
                      ? t('Kjøpt ✓ · neste dag', 'Bought ✓ · next day')
                      : `${t('Kjøp', 'Buy')} · ${vare.pris.toLocaleString(t('nb-NO', 'en-GB'))}p`}
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Modal>
  );
}
