import { useEffect, useState } from "react";
import { Alert, Avatar, Button, Container, Group, Paper, Stack, Text, Textarea, Title } from "@mantine/core";
import { useRettssak } from "../api/rettssakApi";
import { BolleRegn } from "./BolleRegn";
import { Kanelbolle } from "./Kanelbolle";
import { Klubbehammer } from "./Klubbehammer";

const venteTekster = [
  "Bolle-Bjarne henter kaffe …",
  "Aktor blar i Bolleloven …",
  "Forsvareren leter etter formildende omstendigheter …",
  "Bolle-Bjarne teller bollene i kantina …",
  "*sukk* …",
];

function Innlegg({ ikon, navn, farge, tekst, delay }: { ikon: string; navn: string; farge: string; tekst: string; delay: number }) {
  return (
    <Paper p="lg" withBorder className="fade-up" style={{ animationDelay: `${delay}s`, borderColor: farge }}>
      <Group align="flex-start" wrap="nowrap">
        <Avatar size="lg" radius="xl" color={farge}>{ikon}</Avatar>
        <div>
          <Text fw={700} c={farge}>{navn}</Text>
          <Text style={{ whiteSpace: "pre-wrap" }}>{tekst}</Text>
        </div>
      </Group>
    </Paper>
  );
}

export function Rettssal() {
  const [unnskyldning, setUnnskyldning] = useState("");
  const [venteIndex, setVenteIndex] = useState(0);
  const sak = useRettssak();

  useEffect(() => {
    if (!sak.isPending) return;
    const id = setInterval(() => setVenteIndex((i) => (i + 1) % venteTekster.length), 1800);
    return () => clearInterval(id);
  }, [sak.isPending]);

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Stack gap={0} align="center">
          <Text size="64px">⚖️<Kanelbolle size={72} /></Text>
          <Title order={1} size="56px" ta="center" c="orange.3">Bolle-retten</Title>
          <Text c="dimmed" ta="center" fs="italic">
            Du gikk fra PC-en ulåst. Nå står du for retten. Dommer: Bolle-Bjarne (helt upartisk, sier han).
          </Text>
        </Stack>

        <Paper p="lg" withBorder>
          <Stack>
            <Textarea
              label="Din forklaring til retten"
              placeholder="Det var bare et øyeblikk – jeg måtte redde en kollega fra en kaffemaskin som lekket …"
              autosize
              minRows={3}
              maxLength={1000}
              value={unnskyldning}
              onChange={(e) => setUnnskyldning(e.currentTarget.value)}
            />
            <Button
              size="lg"
              color="orange"
              loading={sak.isPending}
              disabled={!unnskyldning.trim()}
              onClick={() => sak.mutate(unnskyldning)}
            >
              🔨 Til retten
            </Button>
            {sak.isPending && (
              <Stack align="center" gap={2}>
                <Klubbehammer />
                <Text ta="center" c="orange.2"><span className="bounce">🥐</span> {venteTekster[venteIndex]}</Text>
              </Stack>
            )}
          </Stack>
        </Paper>

        {sak.isError && (
          <Alert color="red" title="Retten er hevet (midlertidig)">{sak.error.message}</Alert>
        )}

        {sak.data && (
          <Stack>
            <BolleRegn key={sak.submittedAt} antall={sak.data.dom.boller} />
            <Innlegg ikon="📜" navn="Aktor" farge="red" tekst={sak.data.aktor} delay={0} />
            <Innlegg ikon="🧑‍💼" navn="Forsvarer" farge="blue" tekst={sak.data.forsvarer} delay={0.6} />
            <Paper p="xl" withBorder className="fade-up" style={{ animationDelay: "1.2s", borderColor: "orange", borderWidth: 3 }}>
              <Stack align="center" gap="xs">
                <Avatar size={80} radius="xl" color="orange">☕</Avatar>
                <Text fw={900} size="xl" c="orange.3">Bolle-Bjarne avsier dom</Text>
                <Text className="stamp" fw={900} c="orange.4" style={{ fontSize: 72, animationDelay: "1.6s", fontFamily: "'Playfair Display', serif" }}>
                  {sak.data.dom.boller} <Kanelbolle size={64} />
                </Text>
                <Text size="sm" c="dimmed">boller skal leveres til Bolle-Bjarne innen fredag</Text>
                <Text ta="center" style={{ whiteSpace: "pre-wrap" }}>{sak.data.dom.begrunnelse}</Text>
              </Stack>
            </Paper>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
