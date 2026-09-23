import { Alert, Blockquote, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { hentMedarbeidersamtale } from '../api/medarbeidersamtale.api';
import type { Dagsresultat } from '../types/skadeko.types';
import classes from './Skadeko.module.css';

type Props = {
  resultat: Dagsresultat;
  onNyDag: () => void;
};

/** Bjarne leser dagsrapporten og er uimponert. Ett kall til AI-gatewayen. */
export function Medarbeidersamtale({ resultat, onNyDag }: Props) {
  const { data, error, isPending, isError, refetch, isFetching } = useQuery({
    // Ny arbeidsdag = ny samtale. Tallene er nøkkelen.
    queryKey: ['medarbeidersamtale', resultat],
    queryFn: () => hentMedarbeidersamtale(resultat),
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
              Medarbeidersamtale med Bjarne
            </Text>
            <Text fz="sm" c="dimmed">
              Din nærmeste leder. Har aldri behandlet en skadesak. Har lest alle KPI-ene.
            </Text>
          </Stack>
        </Group>

        <Group gap="xl" wrap="wrap">
          <Nokkeltall etikett="Behandlet" verdi={`${resultat.behandlet} saker`} />
          <Nokkeltall etikett="Poeng" verdi={String(resultat.poeng)} />
          <Nokkeltall etikett="Tapte kunder" verdi={String(resultat.tapt)} />
          <Nokkeltall etikett="Tittel" verdi={resultat.tittel} />
        </Group>

        {isPending || isFetching ? (
          <Text c="dimmed" fs="italic" className={classes.tenker}>
            Bjarne blar gjennom tallene dine og sukker
          </Text>
        ) : isError ? (
          <Alert color="orange" title="Bjarne er utilgjengelig">
            {(error as Error).message}
          </Alert>
        ) : (
          <Blockquote color="violet" cite="— Bjarne, nærmeste leder" radius="md">
            <Text className={classes.samtale}>{data}</Text>
          </Blockquote>
        )}

        <Group>
          <Button size="md" onClick={onNyDag} color="teal">
            Ny arbeidsdag 🔁
          </Button>
          {isError && (
            <Button size="md" variant="subtle" onClick={() => refetch()}>
              Mas på Bjarne igjen
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
