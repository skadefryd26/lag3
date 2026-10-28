import { useState } from "react";
import {
  Alert,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useStonad } from "../api/stonadApi";

/**
 * Siste utvei: når begge ankene har gått galt, kan den dømte søke
 * bollestønad hos Geir i Kardemommeby. Han er blid, grundig og innvilger sjelden alt.
 */
export function Bollestonad({
  navn,
  boller,
  unnskyldning,
}: {
  navn: string;
  boller: number;
  unnskyldning: string;
}) {
  const [aapen, setAapen] = useState(false);
  const [soker, setSoker] = useState(navn);
  const [beloep, setBeloep] = useState<number | string>("");
  const stonad = useStonad();

  const beloepTall = typeof beloep === "number" ? beloep : Number(beloep);
  const kanSende = soker.trim().length > 0 && Number.isFinite(beloepTall) && beloepTall > 0;

  return (
    <>
      <Group justify="center">
        <Stack gap={4} align="center">
          <Button size="lg" color="teal" onClick={() => setAapen(true)}>
            🧾 Søk bollestønad
          </Button>
          <Text size="xs" c="dimmed">
            Rettsmidlene er brukt opp. Det finnes alltid et skjema.
          </Text>
        </Stack>
      </Group>

      <Modal
        opened={aapen}
        onClose={() => setAapen(false)}
        title="Søknad om bollestønad – Kardemommeby kommune"
        size="lg"
        centered
      >
        <Stack>
          <Text size="sm" c="dimmed">
            Søknaden behandles av Geir. Han er hyggelig, men grundig.
          </Text>

          <TextInput
            label="Søkerens navn"
            placeholder="Navn"
            maxLength={60}
            value={soker}
            onChange={(e) => setSoker(e.currentTarget.value)}
          />

          <NumberInput
            label="Ønsket beløp"
            placeholder="Beløp i kroner"
            suffix=" kr"
            thousandSeparator=" "
            min={1}
            max={1000000}
            value={beloep}
            onChange={setBeloep}
          />

          <Button
            color="teal"
            size="md"
            loading={stonad.isPending}
            disabled={!kanSende}
            onClick={() =>
              stonad.mutate({ navn: soker.trim(), beloep: beloepTall, boller, unnskyldning })
            }
          >
            📮 Send søknaden til Geir i Kardemommeby
          </Button>

          {stonad.isPending && (
            <Text ta="center" c="teal.3">
              <span className="bounce">🧾</span> Geir leser søknaden. To ganger, for sikkerhets skyld …
            </Text>
          )}

          {stonad.isError && (
            <Alert color="red" title="Søknaden kom i retur">
              {stonad.error.message}
            </Alert>
          )}

          {stonad.data && (
            <Paper p="lg" withBorder className="fade-up" style={{ borderColor: "#2f9e44", borderWidth: 2 }}>
              <Stack gap="xs">
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Vedtak · saksnummer {stonad.data.saksnummer}
                </Text>
                <Divider />
                <Text fw={900} size="32px" c="teal.3">
                  {stonad.data.innvilget.toLocaleString("nb-NO")} kr innvilget
                </Text>
                <Text size="sm" c="dimmed">
                  av {beloepTall.toLocaleString("nb-NO")} kr omsøkt
                </Text>
                <Text style={{ whiteSpace: "pre-wrap" }}>{stonad.data.svar}</Text>
                <Text size="xs" c="dimmed" fs="italic">
                  Vedtaket kan påklages. Klagen behandles av Geir.
                </Text>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Modal>
    </>
  );
}
