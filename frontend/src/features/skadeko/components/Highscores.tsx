import { Button, Group, Modal, Stack, Table, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import type { Highscore } from '../hooks/useHighscores';
import { useSprak } from '../../../sprak';

const MEDALJER = ['🥇', '🥈', '🥉'];

type ListeProps = {
  apen: boolean;
  onLukk: () => void;
  liste: Highscore[];
  nullstillesPa: Date;
};

/** Topp 10-lista, vist i et vindu over spillet. */
export function Highscores({ apen, onLukk, liste, nullstillesPa }: ListeProps) {
  const { t, sprak } = useSprak();
  const dager = Math.max(1, Math.ceil((nullstillesPa.getTime() - Date.now()) / 86_400_000));
  const dato = nullstillesPa.toLocaleDateString(sprak === 'en' ? 'en-GB' : 'nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return (
    <Modal
      opened={apen}
      onClose={onLukk}
      title={t('🏆 Poengtavle — ukens mest effektive', '🏆 Leaderboard — most efficient this week')}
      centered
      radius="lg"
    >
      <Text fz="xs" c="dimmed" mb="sm">
        {t(
          `Tavla nullstilles om ${dager} ${dager === 1 ? 'dag' : 'dager'} (${dato}). Bjarne liker ikke å bli minnet på gamle prestasjoner.`,
          `The board resets in ${dager} ${dager === 1 ? 'day' : 'days'} (${dato}). Bjarne does not like being reminded of past achievements.`,
        )}
      </Text>
      {liste.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          {t('Ingen på tavla ennå. Bjarne er ikke overrasket.', 'Nobody on the board yet. Bjarne is not surprised.')}
        </Text>
      ) : (
        <Table striped highlightOnHover verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={50}>#</Table.Th>
              <Table.Th>{t('Skadebehandler', 'Claims handler')}</Table.Th>
              <Table.Th ta="right">{t('Poeng', 'Points')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {liste.map((h, i) => (
              <Table.Tr key={`${h.navn}-${h.dato}`}>
                <Table.Td fw={700}>{MEDALJER[i] ?? i + 1}</Table.Td>
                <Table.Td>{h.navn}</Table.Td>
                <Table.Td ta="right" fw={800}>
                  {h.poeng}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Modal>
  );
}

type InnmeldingProps = {
  poeng: number;
  onLagre: (navn: string) => void;
};

/** Vises etter endt dag når poengsummen er god nok for lista. */
export function HighscoreInnmelding({ poeng, onLagre }: InnmeldingProps) {
  const { t } = useSprak();
  const [navn, setNavn] = useState('');
  const [lagret, setLagret] = useState(false);

  if (lagret) {
    return (
      <Text fw={700} c="teal">
        {t('🏆 Du er på poengtavla! Bjarne har notert det, motvillig.', '🏆 You made the leaderboard! Bjarne has noted it, reluctantly.')}
      </Text>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!navn.trim()) return;
        onLagre(navn);
        setLagret(true);
      }}
    >
      <Stack gap="xs" p="md" style={{ borderRadius: 12, background: 'rgba(250, 176, 5, 0.12)' }}>
        <Text fw={800}>
          {t(
            `🏆 Du kom på poengtavla med ${poeng} poeng! Skriv inn navnet ditt`,
            `🏆 You made the leaderboard with ${poeng} points! Enter your name`,
          )}
        </Text>
        <Group gap="xs">
          <TextInput
            aria-label={t('Navn', 'Name')}
            value={navn}
            maxLength={24}
            autoFocus
            placeholder={t('Navnet ditt', 'Your name')}
            onChange={(e) => setNavn(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 180 }}
          />
          <Button type="submit" color="yellow" c="dark" disabled={!navn.trim()}>
            {t('Legg til', 'Add')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
