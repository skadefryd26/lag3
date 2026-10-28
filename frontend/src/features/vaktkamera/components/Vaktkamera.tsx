import { Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { useBevegelsesvakt } from "../hooks/useBevegelsesvakt";

const STILLE_SEKUNDER = 10;

/**
 * Vaktkameraet: Bolle-Bjarne følger med på om noen er foran skjermen.
 * Blir det helt stille i ti sekunder, setter retten seg av seg selv.
 */
export function Vaktkamera({ onStille }: { onStille: () => void }) {
  const vakt = useBevegelsesvakt({ stilleSekunder: STILLE_SEKUNDER, onStille });

  const tekst = () => {
    switch (vakt.status) {
      case "ser-deg":
        return "Bolle-Bjarne ser deg. Han er ikke imponert, men han ser deg.";
      case "stille":
        return `Ingen bevegelse. Saken reises om ${vakt.nedtelling} sekunder …`;
      case "utloest":
        return "Du var borte. Saken er reist – nå må du forklare deg.";
      case "venter":
        return "Vakta er på. Bolle-Bjarne venter på at du skal gjøre en feil.";
      default:
        return "Bolle-Bjarne kan holde et øye med plassen din mens du jobber.";
    }
  };

  const farge = () => {
    if (vakt.status === "stille" || vakt.status === "utloest") return "red";
    if (vakt.status === "ser-deg") return "green";
    return "gray";
  };

  return (
    <Paper p="md" withBorder>
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Text size="lg">👁️</Text>
            <Text fw={700}>Bolle-Bjarnes vaktkamera</Text>
            {vakt.paa && (
              <Badge color={farge()} variant="light">
                {vakt.status === "stille" || vakt.status === "utloest" ? vakt.nedtelling : "på vakt"}
              </Badge>
            )}
          </Group>
          <Button
            size="xs"
            variant={vakt.paa ? "default" : "light"}
            color="orange"
            onClick={() => (vakt.paa ? vakt.stopp() : void vakt.start())}
          >
            {vakt.paa ? "Skru av" : "Skru på"}
          </Button>
        </Group>

        <Text size="sm" c={vakt.status === "stille" ? "red.4" : "dimmed"}>
          {tekst()}
        </Text>

        {vakt.feil && (
          <Text size="sm" c="red.4">
            {vakt.feil}
          </Text>
        )}

        <Text size="xs" c="dimmed">
          Bildet blir værende i nettleseren din. Ingenting lagres, og ingenting sendes noe sted.
          Kameraet ser ikke om PC-en er låst – bare om noen rører seg.
        </Text>
      </Stack>
    </Paper>
  );
}
