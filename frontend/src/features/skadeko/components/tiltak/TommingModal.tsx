import { Badge, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { MAALER_ETTER_ID } from '../../data/maalere';
import type { MaalerId } from '../../types/skadeko.types';
import classes from './TommingModal.module.css';
import { useSprak } from '../../../../sprak';

type T = <V>(no: V, en: V) => V;

function underveis(verdi: number, t: T): string {
  if (verdi > 75) return t('Endelig. Du har holdt deg siden morgenmøtet.', "Finally. You've been holding it since the morning meeting.");
  if (verdi > 50) return t('Aaahh… Det er nesten meditativt.', "Aaahh… It's almost meditative.");
  if (verdi > 25) return t('Du leser dopapiret. Det står «Gjensidig respekt». Dypt.', 'You read the toilet paper. It says “Mutual respect”. Deep.');
  if (verdi > 5) return t('Nesten tom. Teams plinger et sted langt borte.', 'Almost empty. Teams is pinging somewhere far away.');
  return t('Ferdig! Vask hendene.', 'Done! Wash your hands.');
}

type Props = {
  /** Måleren som tømmes akkurat nå. Null = ingenting er åpent. */
  aktiv: MaalerId | null;
  /** Nåverdien på den måleren, 0–100. */
  verdi: number;
  /** Avbryt tømmingen og gå tilbake til pulten før den er i mål. */
  onAvbryt: () => void;
};

/**
 * Viser tydelig at en måler tømmes (blæra på do-tur). Skadekøen står stille
 * imens, som i de andre pausene.
 */
export function TommingModal({ aktiv, verdi, onAvbryt }: Props) {
  const konfig = aktiv ? MAALER_ETTER_ID[aktiv] : null;
  const prosent = Math.round(verdi);
  const { t } = useSprak();

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
              {t(konfig.tiltakTittel, konfig.tiltakTittelEn)}
            </Text>
            <Badge variant="light" color="gray" size="sm">
              {t('Skadekøen står stille', 'The claims queue is paused')}
            </Badge>
          </Group>
        )
      }
    >
      {konfig && (
        <Stack align="center" gap="md" pb="sm">
          <div
            className={classes.tank}
            aria-label={t(`${konfig.navn}: ${prosent} prosent`, `${konfig.navnEn}: ${prosent} percent`)}
          >
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
            {underveis(verdi, t)}
          </Text>

          <Button variant="subtle" color="gray" onClick={onAvbryt}>
            {t('Løp tilbake til pulten nå', 'Run back to your desk now')}
          </Button>
        </Stack>
      )}
    </Modal>
  );
}
