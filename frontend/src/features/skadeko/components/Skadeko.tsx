import { IconCircleFilled, IconClockPlay, IconCoffee, IconFlame, IconRobot } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { Badge, Box, Button, Container, Group, Notification, Paper, Stack, Text, Title } from '@mantine/core';
import { Highscores, HighscoreInnmelding } from './Highscores';
import { Sidemeny } from './Sidemeny';
import { useHighscores } from '../hooks/useHighscores';
import { Hud } from './Hud';
import { Medarbeidersamtale } from './Medarbeidersamtale';
import { SakDialog } from './SakDialog';
import { SakKort } from './SakKort';
import { TeamsPopup } from './TeamsPopup';
import { TiltakModal } from './tiltak/TiltakModal';
import { TommingModal } from './tiltak/TommingModal';
import { MAALER_ETTER_ID } from '../data/maalere';
import { useMaalere } from '../hooks/useMaalere';
import { useSkadeko } from '../hooks/useSkadeko';
import { useTeamsForstyrrelser } from '../hooks/useTeamsForstyrrelser';
import type { MaalerId, TiltakResultat } from '../types/skadeko.types';
import classes from './Skadeko.module.css';

export function Skadeko() {
  const spill = useSkadeko();
  // Alt som skjer «ved skrivebordet» står stille mens et tiltak er åpent.
  const vedSkrivebordet = spill.tilstand === 'spiller' && !spill.pauset;
  const teams = useTeamsForstyrrelser(vedSkrivebordet);
  const highscores = useHighscores();
  const [visHighscores, setVisHighscores] = useState(false);
  const [visMeny, setVisMeny] = useState(false);
  const [aktivtTiltak, setAktivtTiltak] = useState<MaalerId | null>(null);
  const [tiltakskvittering, setTiltakskvittering] = useState<string | null>(null);

  const { maalere, paavirk, nullstill, tommes, startTomming, stoppTomming } = useMaalere(vedSkrivebordet);

  // Holder innmeldingen synlig (med «du er på lista») etter at navnet er lagret.
  const [lagretNa, setLagretNa] = useState(false);
  useEffect(() => {
    if (spill.tilstand === 'spiller') setLagretNa(false);
  }, [spill.tilstand]);

  const apneTiltak = useCallback(
    (id: MaalerId) => {
      // Noen tiltak er ikke et minispill, men noe som skjer mens køen går videre.
      if (MAALER_ETTER_ID[id].tommingPerSekund) {
        startTomming(id);
        return;
      }
      spill.pause();
      setAktivtTiltak(id);
    },
    [spill, startTomming],
  );

  const lukkTiltak = useCallback(() => {
    setAktivtTiltak(null);
    spill.fortsett();
  }, [spill]);

  const fullfoerTiltak = useCallback(
    (id: MaalerId, resultat: TiltakResultat) => {
      paavirk(id, resultat.endring);
      setTiltakskvittering(resultat.melding ?? null);
      lukkTiltak();
    },
    [paavirk, lukkTiltak],
  );

  /** Alt som må nullstilles når en ny arbeidsdag begynner. */
  const nyDag = useCallback(() => {
    setAktivtTiltak(null);
    setTiltakskvittering(null);
    nullstill();
    spill.startDagen();
  }, [nullstill, spill]);

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
            maalere={maalere}
            tommes={tommes}
            onTiltak={spill.tilstand === 'spiller' ? apneTiltak : null}
            menyApen={visMeny}
            onMeny={() => setVisMeny((v) => !v)}
          />
        </Container>
      </Box>

      <Container size="lg" py="xl">
        {spill.tilstand === 'ikke-startet' && (
          <Paper radius="lg" p="xl" shadow="sm" maw={600} mx="auto" bg="white">
            <Stack gap="md">
              <Stack gap="xs" align="center" ta="center">
                <Group gap="sm" c="violet.6" aria-hidden>
                  <IconCoffee size={44} stroke={1.5} />
                  <IconRobot size={44} stroke={1.5} />
                </Group>
                <Title order={2}>Velkommen til Skadekø! 📞☕</Title>
                <Text c="dark.4">
                  Du er skadebehandler, og innboksen fylles raskere enn du rekker å svare. Din jobb
                  er å holde hodet kaldt.
                </Text>
              </Stack>

              <Text c="dark.4">
                For hver sak må du velge riktig svar før kundens tålmodighet renner ut. Riktige svar
                gir poeng og fornøyde kunder. Feil svar eller lang ventetid skaper misnøye og øker
                presset.
              </Text>

              <Stack gap={8}>
                <Text fw={700}>Men kundene er ikke den eneste utfordringen. Du må også holde styr på:</Text>
                <Introrad tittel="☕ Energi">
                  Drikk kaffe for å hente inn energi. Hvis energien når 0 %, er du tom for krefter.
                </Introrad>
                <Introrad tittel="🚽 Blære">
                  Kaffe har en pris. Husk toalettpauser før blæren når 100 %.
                </Introrad>
                <Introrad tittel="😵 Stress">
                  Jo flere saker som hoper seg opp, desto mer stresset blir du. Når stresset når 100 %, har du møtt veggen.
                </Introrad>
              </Stack>

              <Stack gap={4}>
                <Text fw={700}>Målet</Text>
                <Text c="dark.4">
                  Behandle så mange saker som mulig, hold kundene fornøyde, og prøv å komme deg
                  gjennom arbeidsdagen.
                </Text>
              </Stack>

              <Text fw={700} ta="center">
                Lykke til. Innboksen venter allerede. 📥😈
              </Text>

              <Button
                size="lg"
                color="teal"
                onClick={nyDag}
                leftSection={<IconClockPlay size={20} />}
                style={{ alignSelf: 'center' }}
              >
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
            onNyDag={nyDag}
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
        onNyDag={nyDag}
        onVisHighscores={() => {
          highscores.oppdater();
          setVisHighscores(true);
        }}
      />

      <SakDialog sak={spill.aapenSak} onSvar={spill.svarPaSak} onLukk={spill.lukkSak} />
      <TeamsPopup meldinger={teams.meldinger} onLukk={teams.lukk} />

      <TommingModal
        aktiv={spill.tilstand === 'spiller' ? (tommes[0] ?? null) : null}
        verdi={tommes[0] ? maalere[tommes[0]] : 0}
        onAvbryt={() => tommes[0] && stoppTomming(tommes[0])}
      />

      <TiltakModal
        aktiv={aktivtTiltak}
        verdi={aktivtTiltak ? maalere[aktivtTiltak] : 0}
        onFerdig={fullfoerTiltak}
        onLukk={lukkTiltak}
      />

      {spill.tilstand === 'spiller' && tiltakskvittering && (
        <Notification
          key={tiltakskvittering}
          color="teal"
          onClose={() => setTiltakskvittering(null)}
          pos="fixed"
          bottom={156}
          left="50%"
          style={{ transform: 'translateX(-50%)', zIndex: 5 }}
        >
          {tiltakskvittering}
        </Notification>
      )}

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

function Introrad({ tittel, children }: { tittel: string; children: React.ReactNode }) {
  return (
    <Paper p="sm" radius="md" bg="gray.0" withBorder>
      <Text fw={700} fz="sm">
        {tittel}
      </Text>
      <Text fz="sm" c="dark.4">
        {children}
      </Text>
    </Paper>
  );
}
