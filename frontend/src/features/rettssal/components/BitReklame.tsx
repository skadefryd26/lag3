import { useState } from "react";
import { Group, Paper, Text } from "@mantine/core";
import { Kanelbolle } from "./Kanelbolle";

const slagord = [
  "Når dommen faller, er BIT klar.",
  "Offisiell bolleleverandør til Bolle-retten.",
  "Dømt? Ta det med en bolle. Eller åtte.",
  "Bolle-Bjarne anbefaler BIT. Han har ikke fått betalt for å si det. Ennå.",
];

export function BitReklame({ variant = "banner" }: { variant?: "banner" | "dom" }) {
  const [tekst] = useState(() => slagord[Math.floor(Math.random() * slagord.length)]);

  if (variant === "dom") {
    return (
      <Text size="sm" c="orange.2" ta="center">
        Straffen kan sones hos <b>BIT</b> – der Bolle-retten kjøper bollene sine.
      </Text>
    );
  }

  return (
    <Paper className="bit-reklame" p="sm" radius="md">
      <Group justify="center" gap="sm" wrap="nowrap">
        <Kanelbolle size={36} />
        <div>
          <Text fw={900} size="xs" tt="uppercase" c="dark.4" style={{ letterSpacing: 2 }}>
            Annonse · Retten sponses av
          </Text>
          <Text fw={900} size="xl" c="dark.8">BIT · {tekst}</Text>
        </div>
        <Kanelbolle size={36} />
      </Group>
    </Paper>
  );
}
