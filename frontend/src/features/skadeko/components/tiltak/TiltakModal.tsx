import { Alert, Badge, Button, Group, Modal, Progress, Stack, Text } from '@mantine/core';
import { MAALER_ETTER_ID, alvorlighet } from '../../data/maalere';
import type { MaalerId, TiltakResultat } from '../../types/skadeko.types';
import classes from '../Skadeko.module.css';
import { TILTAK_SPILL } from './registry';

type Props = {
  /** Hvilken måler tiltaket gjelder. Null = ingenting er åpent. */
  aktiv: MaalerId | null;
  /** Nåverdien på den måleren, 0–100. */
  verdi: number;
  onFerdig: (id: MaalerId, resultat: TiltakResultat) => void;
  onLukk: () => void;
};

/**
 * Skallet rundt minispillene.
 *
 * Modalen eier rammen — tittel, Bjarnes kommentar, status på måleren og
 * utgangen. Selve minispillet hentes fra `TILTAK_SPILL`. Finnes det ikke ennå,
 * vises plassholderen under, slik at knappene i toppstripa virker uansett.
 */
export function TiltakModal({ aktiv, verdi, onFerdig, onLukk }: Props) {
  const konfig = aktiv ? MAALER_ETTER_ID[aktiv] : null;
  const Spill = aktiv ? TILTAK_SPILL[aktiv] : undefined;

  return (
    <Modal
      opened={Boolean(konfig)}
      onClose={onLukk}
      centered
      radius="lg"
      size="lg"
      overlayProps={{ backgroundOpacity: 0.7, blur: 4 }}
      title={
        konfig && (
          <Group gap="sm">
            <Text fz={26} lh={1} aria-hidden>
              {konfig.emoji}
            </Text>
            <Text fw={800} fz="lg">
              {konfig.tiltakTittel}
            </Text>
            <Badge variant="light" color="gray" size="sm">
              Skadekøen står stille
            </Badge>
          </Group>
        )
      }
    >
      {konfig && (
        <Stack gap="lg">
          <Stack gap={6}>
            <Group justify="space-between">
              <Text fz="sm" c="dimmed" fw={600}>
                {konfig.navn} nå
              </Text>
              <Text fz="sm" fw={800}>
                {Math.round(verdi)}%
              </Text>
            </Group>
            <Progress
              value={verdi}
              color={konfig.farge}
              size="lg"
              radius="xl"
              striped={alvorlighet(konfig, verdi) > 0.75}
              animated={alvorlighet(konfig, verdi) > 0.75}
            />
          </Stack>

          <Group gap="sm" wrap="nowrap" align="flex-start">
            <Text fz={26} lh={1} aria-hidden>
              🤖
            </Text>
            <Text fz="sm" c="dimmed" fs="italic">
              {konfig.bjarneKommentar}
            </Text>
          </Group>

          {Spill ? (
            <Spill
              onFerdig={(resultat) => onFerdig(konfig.id, resultat)}
              onAvbryt={onLukk}
            />
          ) : (
            <Plassholder
              beskrivelse={konfig.tiltakBeskrivelse}
              knapp={konfig.knapp}
              onFerdig={() =>
                onFerdig(konfig.id, {
                  endring: 35,
                  melding: `${konfig.knapp} — midlertidig effekt, minispillet kommer.`,
                })
              }
              onLukk={onLukk}
            />
          )}
        </Stack>
      )}
    </Modal>
  );
}

type PlassholderProps = {
  beskrivelse: string;
  knapp: string;
  onFerdig: () => void;
  onLukk: () => void;
};

/**
 * Står her til minispillet finnes. Den gjør én ting: lar deg se at knappen,
 * pausen og påvirkningen av måleren henger sammen.
 */
function Plassholder({ beskrivelse, knapp, onFerdig, onLukk }: PlassholderProps) {
  return (
    <Stack gap="md">
      <Alert
        color="violet"
        variant="light"
        radius="md"
        title="Minispillet er ikke laget ennå"
        className={classes.plassholder}
      >
        <Text fz="sm">{beskrivelse}</Text>
        <Text fz="xs" c="dimmed" mt={6}>
          Knappen under gir en midlertidig effekt, så dere kan se at resten
          henger sammen.
        </Text>
      </Alert>

      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onLukk}>
          Tilbake til skrivebordet
        </Button>
        <Button color="teal" onClick={onFerdig}>
          {knapp} (midlertidig)
        </Button>
      </Group>
    </Stack>
  );
}
