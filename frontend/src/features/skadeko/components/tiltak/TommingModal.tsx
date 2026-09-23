import { Badge, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { MAALER_ETTER_ID } from '../../data/maalere';
import type { MaalerId } from '../../types/skadeko.types';
import classes from './TommingModal.module.css';

type Props = {
  /** Måleren som tømmes akkurat nå. Null = ingenting er åpent. */
  aktiv: MaalerId | null;
  /** Nåverdien på den måleren, 0–100. */
  verdi: number;
  /** Avbryt tømmingen og gå tilbake til pulten før den er i mål. */
  onAvbryt: () => void;
};

function underveis(verdi: number): string {
  if (verdi > 75) return 'Endelig. Du har holdt deg siden morgenmøtet.';
  if (verdi > 50) return 'Aaahh… Det er nesten meditativt.';
  if (verdi > 25) return 'Du leser dopapiret. Det står «Gjensidig respekt». Dypt.';
  if (verdi > 5) return 'Nesten tom. Teams plinger et sted langt borte.';
  return 'Ferdig! Vask hendene.';
}

/**
 * Viser tydelig at en måler tømmes (blæra på do-tur). Skadekøen går videre
 * bak modalen — det er hele poenget: sakene venter ikke på deg.
 */
export function TommingModal({ aktiv, verdi, onAvbryt }: Props) {
  const konfig = aktiv ? MAALER_ETTER_ID[aktiv] : null;
  const prosent = Math.round(verdi);

  return (
    <Modal
      opened={Boolean(konfig)}
      onClose={onAvbryt}
      centered
      radius="lg"
      size="md"
      overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
      title={
        konfig && (
          <Group gap="sm">
            <Text fz={26} lh={1} aria-hidden>
              {konfig.emoji}
            </Text>
            <Text fw={800} fz="lg">
              {konfig.tiltakTittel}
            </Text>
            <Badge variant="light" color="orange" size="sm">
              Køen går videre ⏳
            </Badge>
          </Group>
        )
      }
    >
      {konfig && (
        <Stack align="center" gap="md" pb="sm">
          <div className={classes.tank} aria-label={`${konfig.navn}: ${prosent} prosent`}>
            <div className={classes.vaeske} style={{ height: `${verdi}%` }}>
              <div className={classes.boelge} />
              <span className={classes.boble} style={{ left: '20%', animationDelay: '0s' }} />
              <span className={classes.boble} style={{ left: '55%', animationDelay: '0.6s' }} />
              <span className={classes.boble} style={{ left: '75%', animationDelay: '1.2s' }} />
            </div>
            <div className={classes.prosent}>{prosent}%</div>
            <div className={classes.pil} aria-hidden>
              ⬇
            </div>
          </div>

          <Text fw={800} fz="lg" ta="center" mih={54}>
            {underveis(verdi)}
          </Text>

          <Button variant="subtle" color="gray" onClick={onAvbryt}>
            Løp tilbake til pulten nå
          </Button>
        </Stack>
      )}
    </Modal>
  );
}
