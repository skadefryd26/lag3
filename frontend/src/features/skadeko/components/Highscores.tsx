import { Alert, Button, Group, Loader, Modal, SegmentedControl, Stack, Table, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GRAD_ETTER_ID, VANSKELIGHETSGRADER, erGrad, type VanskelighetsgradId } from '../data/vanskelighetsgrader';
import type { Highscore } from '../hooks/useHighscores';

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
  const [grad, setGrad] = useState(startGrad);
  useEffect(() => {
    if (apen) setGrad(startGrad);
  }, [apen, startGrad]);
  const liste = listeFor(grad);
  const dager = Math.max(1, Math.ceil((nullstillesPa.getTime() - Date.now()) / 86_400_000));
  return (
    <Modal opened={apen} onClose={onLukk} title="🏆 Poengtavle — ukens mest effektive" centered radius="lg">
      <Text fz="xs" c="dimmed" mb="sm">
        Tavla nullstilles om {dager} {dager === 1 ? 'dag' : 'dager'} (
        {nullstillesPa.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
        ). Bjarne liker ikke å bli minnet på gamle prestasjoner.
      </Text>
      <SegmentedControl
        fullWidth
        mb="sm"
        value={grad}
        onChange={(v) => erGrad(v) && setGrad(v)}
        data={VANSKELIGHETSGRADER.map((g) => ({ value: g.id, label: `${g.emoji} ${g.navn}` }))}
      />
      {feil ? (
        <Alert color="orange" title="Fikk ikke hentet poengtavla">
          Bjarne har lagt den et sted. Sjekk nettet og prøv igjen.
        </Alert>
      ) : laster ? (
        <Group justify="center" py="lg">
          <Loader size="sm" />
        </Group>
      ) : liste.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          Ingen på {GRAD_ETTER_ID[grad].navn.toLowerCase()}tavla ennå. Bjarne er ikke overrasket.
        </Text>
      ) : (
        <Table striped highlightOnHover verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={50}>#</Table.Th>
              <Table.Th>Skadebehandler</Table.Th>
              <Table.Th ta="right">Poeng</Table.Th>
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
  const [navn, setNavn] = useState('');
  const [lagret, setLagret] = useState(false);
  const [lagrer, setLagrer] = useState(false);
  const [feil, setFeil] = useState(false);

  if (lagret) {
    return (
      <Text fw={700} c="teal">
        🏆 Du er på poengtavla! Bjarne har notert det, motvillig.
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
        <Text fw={800}>🏆 Du kom på poengtavla med {poeng} poeng! Skriv inn navnet ditt</Text>
        <Group gap="xs">
          <TextInput
            aria-label="Navn"
            value={navn}
            maxLength={24}
            autoFocus
            placeholder="Navnet ditt"
            onChange={(e) => setNavn(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 180 }}
          />
          <Button type="submit" color="yellow" c="dark" disabled={!navn.trim()} loading={lagrer}>
            Legg til
          </Button>
        </Group>
        {feil && (
          <Text fz="sm" c="red.7">
            Fikk ikke lagret. Sjekk nettet og prøv igjen.
          </Text>
        )}
      </Stack>
    </form>
  );
}
