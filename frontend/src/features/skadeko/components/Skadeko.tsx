import { IconCircleFilled, IconClockPlay, IconFlame } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Box, Button, Container, Group, Notification, Paper, Stack, Text, Title } from '@mantine/core';
import { Highscores, HighscoreInnmelding } from './Highscores';
import { Sidemeny } from './Sidemeny';
import { Butikk } from './Butikk';
import { useHighscores } from '../hooks/useHighscores';
import { Hud } from './Hud';
import { Medarbeidersamtale } from './Medarbeidersamtale';
import { SakDialog } from './SakDialog';
import { SakKort } from './SakKort';
import { TeamsPopup } from './TeamsPopup';
import { TiltakModal } from './tiltak/TiltakModal';
import { TommingModal } from './tiltak/TommingModal';
import { MAALERE, MAALER_ETTER_ID, iKrise } from '../data/maalere';
import { useMaalere } from '../hooks/useMaalere';
import { MAKS_LEVEL, useSkadeko } from '../hooks/useSkadeko';
import { useTeamsForstyrrelser } from '../hooks/useTeamsForstyrrelser';
import type { MaalerId, TiltakResultat } from '../types/skadeko.types';
import classes from './Skadeko.module.css';
import { useSprak } from '../../../sprak';

export function Skadeko() {
  const spill = useSkadeko();
  const { t } = useSprak();
  // Alt som skjer «ved skrivebordet» står stille mens et tiltak er åpent.
  const vedSkrivebordet = spill.tilstand === 'spiller' && !spill.pauset;
  /** Butikkvarer kjøpt i dag — de blir aktive først neste arbeidsdag. */
  const [kjopt, setKjopt] = useState<string[]>([]);
  /** Varer som virker i dagens arbeidsdag (kjøpt dagen før). */
  const [aktive, setAktive] = useState<string[]>([]);
  const teams = useTeamsForstyrrelser(vedSkrivebordet, aktive.includes('hodetelefoner') ? 0.5 : 1);
  const highscores = useHighscores();
  const [visHighscores, setVisHighscores] = useState(false);
  const [visMeny, setVisMeny] = useState(false);
  const [visButikk, setVisButikk] = useState(false);
  const [aktivtTiltak, setAktivtTiltak] = useState<MaalerId | null>(null);
  const [tiltakskvittering, setTiltakskvittering] = useState<string | null>(null);

  const { maalere, paavirk, nullstill, tommes, startTomming, stoppTomming, settDriftFaktor } = useMaalere(vedSkrivebordet);

  // Do-turen er over (tom blære eller avbrutt): køen går videre.
  const varBorte = useRef(false);
  const { fortsett } = spill;
  useEffect(() => {
    if (tommes.length > 0) varBorte.current = true;
    else if (varBorte.current) {
      varBorte.current = false;
      fortsett();
    }
  }, [tommes, fortsett]);

  // En måler i krise (energi 0 %, blære eller stress 100 %) avslutter dagen.
  const { tapDagen } = spill;
  const krise = spill.tilstand === 'spiller' ? MAALERE.find((m) => iKrise(m, maalere[m.id])) : undefined;
  useEffect(() => {
    if (krise) tapDagen(t(krise.krisetekst, krise.krisetekstEn));
  }, [krise, tapDagen, t]);

  // Holder innmeldingen synlig (med «du er på lista») etter at navnet er lagret.
  const [lagretNa, setLagretNa] = useState(false);
  useEffect(() => {
    if (spill.tilstand === 'spiller') setLagretNa(false);
  }, [spill.tilstand]);

  const apneTiltak = useCallback(
    (id: MaalerId) => {
      // Noen tiltak er ikke et minispill, men noe som skjer mens køen går videre.
      if (MAALER_ETTER_ID[id].tommingPerSekund) {
        spill.pause();
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
  const startDag = useCallback(
    (level?: number) => {
      setAktivtTiltak(null);
      setTiltakskvittering(null);
      // Det som ble kjøpt i går, virker i dag.
      nullstill();
      if (kjopt.includes('kaffe')) settDriftFaktor('energi', 0.5);
      if (kjopt.includes('stressball')) settDriftFaktor('stress', 0.5);
      setAktive(kjopt);
      setKjopt([]);
      spill.startDagen(level);
    },
    [nullstill, settDriftFaktor, kjopt, spill],
  );
  const nyDag = useCallback(() => startDag(), [startDag]);
  /** Til testing og demo: hopp rett til det vanskeligste levelet. */
  const testMaksLevel = useCallback(() => startDag(MAKS_LEVEL), [startDag]);

  return (
    <Box mih="100vh" bg="light-dark(#f1f3f5, var(--mantine-color-dark-7))">
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
            visStatus={spill.tilstand !== 'ikke-startet'}
            poeng={spill.poeng}
            level={spill.level}
            liv={spill.liv}
            livIgjen={spill.livIgjen}
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
          <Paper radius="lg" p="xl" shadow="sm" maw={600} mx="auto">
            <Stack gap="md">
              <Stack gap="xs" align="center" ta="center">
                <Title order={2}>{t('Velkommen til Skadekø!', 'Welcome to Skadekø!')}</Title>
                <Text c="dimmed">
                  {t(
                    'Du er skadebehandler, og innboksen fylles raskere enn du rekker å svare. Din jobb er å holde hodet kaldt.',
                    'You are a claims handler, and the inbox fills up faster than you can reply. Your job is to keep a cool head.',
                  )}
                </Text>
              </Stack>

              <Text c="dimmed">
                {t(
                  'For hver sak må du velge riktig svar før kundens tålmodighet renner ut. Riktige svar gir poeng og fornøyde kunder. Feil svar eller lang ventetid skaper misnøye og øker presset.',
                  'For each claim you must pick the right answer before the customer runs out of patience. Right answers earn points and happy customers. Wrong answers or long waits cause frustration and pile on the pressure.',
                )}
              </Text>

              <Stack gap={8}>
                <Text fw={700}>{t('Men kundene er ikke den eneste utfordringen. Du må også holde styr på:', 'But the customers are not your only challenge. You also have to keep track of:')}</Text>
                <Introrad tittel={`${MAALER_ETTER_ID.energi.emoji} ${t('Energi', 'Energy')}`}>
                  {t('Drikk kaffe for å hente inn energi. Hvis energien når 0 %, er du tom for krefter.', 'Drink coffee to recharge. If your energy hits 0%, you go to sleep.')}
                </Introrad>
                <Introrad tittel={`${MAALER_ETTER_ID.blaere.emoji} ${t('Blære', 'Bladder')}`}>
                  {t('Kaffe har en pris. Husk toalettpauser før blæren når 100 %.', 'Coffee comes at a price. Remember bathroom breaks before your bladder hits 100 %.')}
                </Introrad>
                <Introrad tittel={`${MAALER_ETTER_ID.stress.emoji} Stress`}>
                  {t('Jo flere saker som hoper seg opp, desto mer stresset blir du. Når stresset når 100 %, har du møtt veggen.', 'The more claims pile up, the more stressed you get. When stress hits 100%, you deliver the resignation letter.')}
                </Introrad>
              </Stack>

              <Stack gap={4}>
                <Text fw={700}>{t('Målet', 'The goal')}</Text>
                <Text c="dimmed">
                  {t(
                    'Behandle så mange saker som mulig, hold kundene fornøyde, og prøv å komme deg gjennom arbeidsdagen.',
                    'Handle as many claims as you can, keep the customers happy, and try to make it through the working day.',
                  )}
                </Text>
              </Stack>

              <Text fw={700} ta="center">
                {t('Lykke til. Innboksen venter allerede. 📥😈', 'Good luck. The inbox is already waiting. 📥😈')}
              </Text>

              <Button
                size="lg"
                color="teal"
                onClick={nyDag}
                leftSection={<IconClockPlay size={20} />}
                style={{ alignSelf: 'center' }}
              >
                {t('Stemple inn', 'Clock in')}
              </Button>
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={testMaksLevel}
                style={{ alignSelf: 'center' }}
              >
                {t('Test level', 'Test level')} {MAKS_LEVEL}
              </Button>
            </Stack>
          </Paper>
        )}

        {spill.tilstand === 'spiller' && (
          <Stack gap="sm">
            <Group justify="space-between">
              <Group gap="xs">
                <Badge color="green" variant="light" leftSection={<IconCircleFilled size={8} />}>{t('Enkel · 10p · god tid', 'Easy · 10p · plenty of time')}</Badge>
                <Badge color="yellow" variant="light" leftSection={<IconCircleFilled size={8} />}>{t('Middels · 20p', 'Medium · 20p')}</Badge>
                <Badge color="red" variant="light" leftSection={<IconCircleFilled size={8} />}>{t('Kompleks · 30p · kort tid', 'Complex · 30p · short time')}</Badge>
              </Group>
              {spill.combo >= 2 && (
                <Badge color="orange" size="lg" variant="filled" leftSection={<IconFlame size={16} />}>
                  Combo x{spill.combo}
                </Badge>
              )}
            </Group>
            <div className={classes.skrivebord} aria-live="polite">
              {spill.saker.length === 0 ? (
                <Text className={classes.tomt}>{t('Skrivebordet er tomt. Nyt det mens det varer.', 'Your desk is empty. Enjoy it while it lasts.')}</Text>
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
            onVisButikk={() => setVisButikk(true)}
            sjef={aktive.includes('forfremmelse')}
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
        onVisButikk={() => {
          spill.pause();
          setVisButikk(true);
        }}
      />

      <Butikk
        apen={visButikk}
        poeng={spill.poeng}
        onLukk={() => {
          setVisButikk(false);
          spill.fortsett();
        }}
        onKjop={(vare) => {
          if (kjopt.includes(vare.id) || !spill.brukPoeng(vare.pris)) return;
          setKjopt((k) => [...k, vare.id]);
          setTiltakskvittering(
            t(
              `Kjøpt: ${vare.emoji} ${vare.navn} — aktiv fra neste arbeidsdag`,
              `Bought: ${vare.emoji} ${vare.navnEn} — active from the next working day`,
            ),
          );
        }}
        eide={kjopt}
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
    <Paper p="sm" radius="md" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))" withBorder>
      <Text fw={700} fz="sm">
        {tittel}
      </Text>
      <Text fz="sm" c="dimmed">
        {children}
      </Text>
    </Paper>
  );
}
