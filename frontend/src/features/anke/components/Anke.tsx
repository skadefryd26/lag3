import { useState } from "react";
import { Alert, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { useAnke, type AnkeResponse } from "../api/ankeApi";
import { Kanelbolle } from "../../rettssal/components/Kanelbolle";
import { Bollefrid } from "./Bollefrid";
import { Bollestonad } from "../../stonad/components/Bollestonad";

/** Retten tåler to anker. Den tredje gangen er det skjemaveien som gjelder. */
const MAKS_ANKER = 2;

const ventetekster = [
  "Anken registreres i Bolleregisteret …",
  "Overdommer Bollefrid blir irritert …",
  "Saken leses på nytt, med vilje denne gangen …",
  "Noen blar høylytt i Bolleloven …",
];

function AnkeInnlegg({ anke, nivaa }: { anke: AnkeResponse; nivaa: number }) {
  return (
    <Paper p="xl" withBorder className="fade-up" style={{ borderColor: "#c0392b", borderWidth: 3 }}>
      <Stack align="center" gap="xs">
        <Bollefrid size={180} sinne={nivaa - 1} navn={anke.dommer} />
        <Text size="sm" c="dimmed" tt="uppercase" fw={700}>
          Anke nr. {nivaa} — {anke.instans}
        </Text>
        <Text fw={900} size="xl" c="red.4">
          {anke.dommer} skjerper dommen
        </Text>
        <Text className="stamp" fw={900} c="red.5" style={{ fontSize: 72, fontFamily: "'Playfair Display', serif" }}>
          {anke.boller} <Kanelbolle size={64} />
        </Text>
        <Text ta="center" style={{ whiteSpace: "pre-wrap" }}>
          {anke.begrunnelse}
        </Text>
      </Stack>
    </Paper>
  );
}

export function Anke({
  navn,
  unnskyldning,
  startBoller,
  startBegrunnelse,
}: {
  navn: string;
  unnskyldning: string;
  startBoller: number;
  startBegrunnelse: string;
}) {
  const [anker, setAnker] = useState<AnkeResponse[]>([]);
  const anke = useAnke();

  const sist = anker[anker.length - 1];
  const gjeldendeBoller = sist?.boller ?? startBoller;
  const gjeldendeBegrunnelse = sist?.begrunnelse ?? startBegrunnelse;
  const nesteNivaa = anker.length + 1;
  // To anker, ikke mer. Etter det finnes det bare skjemaer igjen.
  const slutt = nesteNivaa > MAKS_ANKER;

  return (
    <Stack>
      {anker.map((a, i) => (
        <AnkeInnlegg key={i} anke={a} nivaa={i + 1} />
      ))}

      {anke.isError && <Alert color="red" title="Anken stoppet i resepsjonen">{anke.error.message}</Alert>}

      {anke.isPending && (
        <Text ta="center" c="red.3">
          <span className="bounce">⚖️</span> {ventetekster[anker.length % ventetekster.length]}
        </Text>
      )}

      {!slutt ? (
        <Group justify="center">
          <Stack gap={4} align="center">
            <Button
              size="lg"
              color="red"
              variant={anker.length === 0 ? "filled" : "light"}
              loading={anke.isPending}
              onClick={() =>
                anke.mutate(
                  {
                    unnskyldning,
                    forrigeBoller: gjeldendeBoller,
                    forrigeBegrunnelse: gjeldendeBegrunnelse,
                    ankenivaa: nesteNivaa,
                  },
                  { onSuccess: (data) => setAnker((a) => [...a, data]) },
                )
              }
            >
              ⚖️ {anker.length === 0 ? "Anke dommen" : "Anke videre"}
            </Button>
            <Text size="xs" c="dimmed">
              {anker.length === 0
                ? "Dette går helt sikkert bra."
                : "Det har gått dårlig " + anker.length + (anker.length === 1 ? " gang. " : " ganger. ") + "Prøv igjen?"}
            </Text>
          </Stack>
        </Group>
      ) : (
        <Stack>
          <Alert color="orange" title="Rettsmidlene er uttømt">
            To anker, to nederlag. Det finnes ingen flere instanser, og knapt flere boller. Dommen er endelig.
          </Alert>
          <Bollestonad navn={navn} boller={gjeldendeBoller} unnskyldning={unnskyldning} />
        </Stack>
      )}
    </Stack>
  );
}
