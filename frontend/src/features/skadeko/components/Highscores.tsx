import { Button, Group, Modal, Stack, Table, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import type { Highscore } from '../hooks/useHighscores';

const MEDALJER = ['🥇', '🥈', '🥉'];

type ListeProps = {
  apen: boolean;
  onLukk: () => void;
  liste: Highscore[];
  nullstillesPa: Date;
};

/** Topp 10-lista, vist i et vindu over spillet. */
export function Highscores({ apen, onLukk, liste, nullstillesPa }: ListeProps) {
  const dager = Math.max(1, Math.ceil((nullstillesPa.getTime() - Date.now()) / 86_400_000));
  return (
    <Modal opened={apen} onClose={onLukk} title="🏆 Highscores — ukens mest effektive" centered radius="lg">
      <Text fz="xs" c="dimmed" mb="sm">
        Lista nullstilles om {dager} {dager === 1 ? 'dag' : 'dager'} (
        {nullstillesPa.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}
        ). Bjarne liker ikke å bli minnet på gamle prestasjoner.
      </Text>
      {liste.length === 0 ? (
        <Text c="dimmed" ta="center" py="lg">
          Ingen på lista ennå. Bjarne er ikke overrasket.
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
  const [navn, setNavn] = useState('');
  const [lagret, setLagret] = useState(false);

  if (lagret) {
    return (
      <Text fw={700} c="teal">
        🏆 Du er på highscore-lista! Bjarne har notert det, motvillig.
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
        <Text fw={800}>🏆 Ny highscore: {poeng} poeng! Skriv inn navnet ditt</Text>
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
          <Button type="submit" color="yellow" c="dark" disabled={!navn.trim()}>
            Legg til
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
