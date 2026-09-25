import { Alert, Blockquote, Button, Group, Paper, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hentMedarbeidersamtale } from '../api/medarbeidersamtale.api';
import { GRAD_ETTER_ID } from '../data/vanskelighetsgrader';
import type { Dagsresultat } from '../types/skadeko.types';
import { useSprak } from '../../../sprak';
import classes from './Skadeko.module.css';

type Props = {
  resultat: Dagsresultat;
  onNyDag: () => void;
  onTilStart: () => void;
  /** Navne-innmelding til highscore-lista, når poengsummen er god nok. */
  highscore?: ReactNode;
  /** Åpner butikken. */
  onVisButikk?: () => void;
  /** Forfremmelsen er aktiv: spilleren er sjefen, Bjarne er skadebehandler. */
  sjef?: boolean;
  /** Lar spilleren bytte stilling før neste arbeidsdag. */
  gradvelger?: ReactNode;
};

/** Bjarne leser dagsrapporten og er uimponert. Ett kall til AI-gatewayen. */
export function Medarbeidersamtale({
  resultat,
  onNyDag,
  onTilStart,
  highscore,
  gradvelger,
  onVisButikk,
  sjef = false,
}: Props) {
  const { t, sprak } = useSprak();
  const tittel = sjef ? t('Sjef', 'Boss') : resultat.tittel;
  const { data, error, isPending, isError, refetch, isFetching } = useQuery({
    // Ny arbeidsdag = ny samtale. Tallene (og språket) er nøkkelen.
    queryKey: ['medarbeidersamtale', resultat, sprak, sjef],
    queryFn: () => hentMedarbeidersamtale({ ...resultat, tittel }, sprak, sjef),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  return (
    <Paper radius="lg" p="xl" shadow="md" withBorder>
      <Stack gap="lg">
        <Group gap="md" align="flex-start" wrap="nowrap">
          <Text className={classes.bjarne} aria-hidden>
            ☕🤖
          </Text>
          <Stack gap={2}>
            <Text fw={800} fz="lg">
              {sjef
                ? t('Rapport fra Bjarne til sjefen', 'Report from Bjarne to the boss')
                : t('Medarbeidersamtale med Bjarne', 'Performance review with Bjarne')}
            </Text>
            <Text fz="sm" c="dimmed">
              {sjef
                ? t(
                    'Bjarne er degradert til skadebehandler. Nå er det du som er sjefen hans.',
                    'Bjarne has been demoted to claims handler. You are his boss now.',
                  )
                : t(
                    'Din nærmeste leder. Har aldri behandlet en skadesak. Har lest alle KPI-ene.',
                    'Your line manager. Has never handled a single claim. Has read every KPI.',
                  )}
            </Text>
          </Stack>
        </Group>

        <Text fw={700} c="red.7">
          {resultat.aarsak}
        </Text>

        <Group gap="xl" wrap="wrap">
          <Nokkeltall
            etikett={t('Behandlet', 'Handled')}
            verdi={t(`${resultat.behandlet} saker`, `${resultat.behandlet} claims`)}
          />
          <Nokkeltall etikett={t('Poeng', 'Points')} verdi={String(resultat.poeng)} />
          <Nokkeltall etikett={t('Tapte kunder', 'Lost customers')} verdi={String(resultat.tapt)} />
          <Nokkeltall etikett={t('Tittel', 'Title')} verdi={tittel} />
          <Nokkeltall etikett={t('Stilling', 'Position')} verdi={GRAD_ETTER_ID[resultat.vanskelighetsgrad].navn} />
        </Group>

        {isPending || isFetching ? (
          <Text c="dimmed" fs="italic" className={classes.tenker}>
            {t('Bjarne blar gjennom tallene dine og sukker', 'Bjarne flips through your numbers and sighs')}
          </Text>
        ) : isError ? (
          <Alert color="orange" title={t('Bjarne er utilgjengelig', 'Bjarne is unavailable')}>
            {(error as Error).message}
          </Alert>
        ) : (
          <Blockquote color="violet" cite={sjef ? t('— Bjarne, skadebehandler', '— Bjarne, claims handler') : t('— Bjarne, nærmeste leder', '— Bjarne, line manager')} radius="md">
            <Text className={classes.samtale}>{data}</Text>
          </Blockquote>
        )}

        {highscore}

        {gradvelger}

        <Group>
          <Button size="md" onClick={onNyDag} color="teal">
            {t('Ny arbeidsdag 🔁', 'New working day 🔁')}
          </Button>
          <Button size="md" variant="default" onClick={onTilStart}>
            {t('Til startsiden', 'Back to start')}
          </Button>
          {isError && (
            <Button size="md" variant="subtle" onClick={() => refetch()}>
              {t('Mas på Bjarne igjen', 'Nag Bjarne again')}
            </Button>
          )}
          {onVisButikk && (
            <Button size="md" variant="light" color="violet" onClick={onVisButikk}>
              {t('🛒 Butikk', '🛒 Shop')}
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}

function Nokkeltall({ etikett, verdi }: { etikett: string; verdi: string }) {
  return (
    <Stack gap={0}>
      <Text fz="xs" c="dimmed" tt="uppercase" fw={700}>
        {etikett}
      </Text>
      <Text fz="xl" fw={800}>
        {verdi}
      </Text>
    </Stack>
  );
}
