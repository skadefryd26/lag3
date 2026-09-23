import { IconCircleFilled, IconClockPlay, IconCoffee, IconFlame, IconRobot } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Badge, Box, Button, Container, Group, Notification, Paper, Stack, Text, Title } from '@mantine/core';
import { Highscores, HighscoreInnmelding } from './Highscores';
import { Sidemeny } from './Sidemeny';
import { useHighscores } from '../hooks/useHighscores';
import { Hud } from './Hud';
import { Medarbeidersamtale } from './Medarbeidersamtale';
import { SakDialog } from './SakDialog';
import { SakKort } from './SakKort';
import { TeamsPopup } from './TeamsPopup';
import { useSkadeko } from '../hooks/useSkadeko';
import { useTeamsForstyrrelser } from '../hooks/useTeamsForstyrrelser';
import classes from './Skadeko.module.css';

export function Skadeko() {
  const spill = useSkadeko();
  const teams = useTeamsForstyrrelser(spill.tilstand === 'spiller');
  const highscores = useHighscores();
  const [visHighscores, setVisHighscores] = useState(false);
  const [visMeny, setVisMeny] = useState(false);
  // Holder innmeldingen synlig (med «du er på lista») etter at navnet er lagret.
  const [lagretNa, setLagretNa] = useState(false);
  useEffect(() => {
    if (spill.tilstand === 'spiller') setLagretNa(false);
  }, [spill.tilstand]);

  return (
    <Box mih="100vh" bg="#f1f3f5">
      <Box
        px="lg"
        py="sm"
        pos="sticky"
        top={0}
        style={{
          zIndex: 10,
          background: 'linear-gradient(90deg, #5f3dc4 0%, #7048e8 50%, #9c36b5 100%)',
          boxShadow: '0 2px 12px rgba(16,24,40,0.12)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Container size="lg" px={0}>
          <Hud
            poeng={spill.poeng}
            tapt={spill.tapt}
            liv={spill.liv}
            press={
              spill.tilstand === 'spiller' && spill.saker.length > 0
                ? 1 - Math.min(...spill.saker.map((s) => s.igjen))
                : 0
            }
            menyApen={visMeny}
            onMeny={() => setVisMeny((v) => !v)}
          />
        </Container>
      </Box>

      <Container size="lg" py="xl">
        {spill.tilstand === 'ikke-startet' && (
          <Paper radius="lg" p="xl" shadow="sm" maw={560} mx="auto" bg="white">
            <Stack gap="md" align="center" ta="center">
              <Group gap="sm" c="violet.6" aria-hidden><IconCoffee size={48} stroke={1.5} /><IconRobot size={48} stroke={1.5} /></Group>
              <Title order={2}>God morgen, skadebehandler!</Title>
              <Text c="dimmed">
                Skadesakene strømmer inn. Klikk på en sak, les hva kunden skriver, og velg riktig
                håndtering. Riktig svar gir poeng — mer for vanskelige saker, raske svar og flere
                riktige på rad. Feil svar koster. Mister du tre kunder, er du offisielt{' '}
                <b>sykmeldt</b> — og da kaller Bjarne deg inn til medarbeidersamtale.
              </Text>
              <Button size="lg" color="teal" onClick={spill.startDagen} leftSection={<IconClockPlay size={20} />}>
                Stemple inn
              </Button>
            </Stack>
          </Paper>
        )}

          {spill.tilstand === 'spiller' && (
          <Stack gap="sm">
            <Group justify="space-between">
              <Group gap="xs">
                <Badge color="green" variant="light" leftSection={<IconCircleFilled size={8} />}>Enkel · 10p · god tid</Badge>
                <Badge color="yellow" variant="light" leftSection={<IconCircleFilled size={8} />}>Middels · 20p</Badge>
                <Badge color="red" variant="light" leftSection={<IconCircleFilled size={8} />}>Kompleks · 30p · kort tid</Badge>
              </Group>
              {spill.combo >= 2 && (
                <Badge color="orange" size="lg" variant="filled" leftSection={<IconFlame size={16} />}>
                  Combo x{spill.combo}
                </Badge>
              )}
            </Group>
            <div className={classes.skrivebord} aria-live="polite">
              {spill.saker.length === 0 ? (
                <Text className={classes.tomt}>Skrivebordet er tomt. Nyt det mens det varer.</Text>
              ) : (
                spill.saker.map((sak) => (
                  <SakKort key={sak.id} sak={sak} onApne={spill.apneSak} />
                ))
              )}
            </div>
          </Stack>
        )}

        {spill.tilstand === 'ferdig' && spill.resultat && (
          <Medarbeidersamtale
            resultat={spill.resultat}
            onNyDag={spill.startDagen}
            highscore={
              highscores.kvalifiserer(spill.resultat.poeng) || lagretNa
                ? (
                    <HighscoreInnmelding
                      key={spill.resultat.sekunderSpilt + '-' + spill.resultat.poeng}
                      poeng={spill.resultat.poeng}
                      onLagre={(navn) => {
                        setLagretNa(true);
                        highscores.leggTil(navn, spill.resultat!.poeng);
                      }}
                    />
                  )
                : null
            }
          />
        )}
      </Container>

      <Highscores
        apen={visHighscores}
        onLukk={() => setVisHighscores(false)}
        liste={highscores.liste}
        nullstillesPa={highscores.nullstillesPa}
      />

      <Sidemeny
        apen={visMeny}
        onLukk={() => setVisMeny(false)}
        onNyDag={spill.startDagen}
        onVisHighscores={() => {
          highscores.oppdater();
          setVisHighscores(true);
        }}
      />

      <SakDialog sak={spill.aapenSak} onSvar={spill.svarPaSak} onLukk={spill.lukkSak} />
      <TeamsPopup meldinger={teams.meldinger} onLukk={teams.lukk} />

      {spill.tilstand === 'spiller' && spill.tilbakemelding && (
        <Notification
          key={spill.tilbakemelding.id}
          color={spill.tilbakemelding.riktig ? 'teal' : 'orange'}
          withCloseButton={false}
          pos="fixed"
          bottom={90}
          left="50%"
          style={{ transform: 'translateX(-50%)', zIndex: 5 }}
        >
          {spill.tilbakemelding.tekst}
        </Notification>
      )}

      {spill.tilstand === 'spiller' && spill.tapsmelding && (
        <Notification
          key={spill.tapsmelding + spill.tapt}
          color="red"
          withCloseButton={false}
          pos="fixed"
          bottom={24}
          left="50%"
          style={{ transform: 'translateX(-50%)', zIndex: 5 }}
        >
          {spill.tapsmelding}
        </Notification>
      )}
    </Box>
  );
}
