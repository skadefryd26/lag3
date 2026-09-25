import { Alert, Button, Group, Loader, Modal, SegmentedControl, Stack, Table, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GRAD_ETTER_ID, VANSKELIGHETSGRADER, erGrad, type VanskelighetsgradId } from '../data/vanskelighetsgrader';
import type { Highscore } from '../hooks/useHighscores';
import { useSprak } from '../../../sprak';

const MEDALJER = ['🥇', '🥈', '🥉'];

type ListeProps = {
  apen: boolean;
  onLukk: () => void;
  listeFor: (grad: VanskelighetsgradId) => Highscore[];
  /** Graden som vises når vinduet åpnes. */
  startGrad: VanskelighetsgradId;
  nullstillesPa: Date;
  laster: boolean;
  feil: boolean;
};

/** Topp 10-lista per vanskelighetsgrad, vist i et vindu over spillet. */
export function Highscores({ apen, onLukk, listeFor, startGrad, nullstillesPa, laster, feil }: ListeProps) {
  const { t, sprak } = useSprak();
  const [grad, setGrad] = useState(startGrad);
  useEffect(() => {
    if (apen) setGrad(startGrad);
  }, [apen, startGrad]);
  const liste = listeFor(grad);
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
      <SegmentedControl
        fullWidth
        mb="sm"
        value={grad}
        onChange={(v) => erGrad(v) && setGrad(v)}
        data={VANSKELIGHETSGRADER.map((g) => ({ value: g.id, label: `${g.emoji} ${g.navn}` }))}
      />
      {feil ? (
        <Alert color="orange" title={t('Fikk ikke hentet poengtavla', 'Could not load the leaderboard')}>
          {t('Bjarne har lagt den et sted. Sjekk nettet og prøv igjen.', 'Bjarne has put it somewhere. Check your connection and try again.')}
        </Alert>
      ) : laster ? (
        <Group justify="center" py="lg">
          <Loader size="sm" />
        </Group>
      ) : liste.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          {t(
            `Ingen på ${GRAD_ETTER_ID[grad].navn.toLowerCase()}tavla ennå. Bjarne er ikke overrasket.`,
            `Nobody on the ${GRAD_ETTER_ID[grad].navn} board yet. Bjarne is not surprised.`,
          )}
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
              <Table.Tr key={`${i}-${h.navn}-${h.poeng}`}>
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
  onLagre: (navn: string) => Promise<void>;
};

/** Vises etter endt dag når poengsummen er god nok for lista. */
export function HighscoreInnmelding({ poeng, onLagre }: InnmeldingProps) {
  const { t } = useSprak();
  const [navn, setNavn] = useState('');
  const [lagret, setLagret] = useState(false);
  const [lagrer, setLagrer] = useState(false);
  const [feil, setFeil] = useState(false);

  if (lagret) {
    return (
      <Text fw={700} c="teal">
        {t('🏆 Du er på poengtavla! Bjarne har notert det, motvillig.', '🏆 You made the leaderboard! Bjarne has noted it, reluctantly.')}
      </Text>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!navn.trim() || lagrer) return;
        setLagrer(true);
        setFeil(false);
        try {
          await onLagre(navn);
          setLagret(true);
        } catch {
          setFeil(true);
        } finally {
          setLagrer(false);
        }
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
          <Button type="submit" color="yellow" c="dark" disabled={!navn.trim()} loading={lagrer}>
            {t('Legg til', 'Add')}
          </Button>
        </Group>
        {feil && (
          <Text fz="sm" c="red.7">
            {t('Fikk ikke lagret. Sjekk nettet og prøv igjen.', 'Could not save. Check your connection and try again.')}
          </Text>
        )}
      </Stack>
    </form>
  );
}
