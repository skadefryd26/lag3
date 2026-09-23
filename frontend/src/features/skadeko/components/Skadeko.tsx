import { useCallback, useState } from 'react';
import { Box, Button, Container, Notification, Paper, Stack, Text, Title } from '@mantine/core';
import { Hud } from './Hud';
import { Medarbeidersamtale } from './Medarbeidersamtale';
import { SakKort } from './SakKort';
import { TiltakModal } from './tiltak/TiltakModal';
import { useMaalere } from '../hooks/useMaalere';
import { useSkadeko } from '../hooks/useSkadeko';
import type { MaalerId, TiltakResultat } from '../types/skadeko.types';
import classes from './Skadeko.module.css';

export function Skadeko() {
  const spill = useSkadeko();
  const [aktivtTiltak, setAktivtTiltak] = useState<MaalerId | null>(null);

  // Målerne drifter bare mens du faktisk sitter på skrivebordet.
  const { maalere, paavirk, nullstill } = useMaalere(
    spill.tilstand === 'spiller' && !spill.pauset,
  );
  const [tiltakskvittering, setTiltakskvittering] = useState<string | null>(null);

  const apneTiltak = useCallback(
    (id: MaalerId) => {
      spill.pause();
      setAktivtTiltak(id);
    },
    [spill],
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

  const nyDag = useCallback(() => {
    setAktivtTiltak(null);
    setTiltakskvittering(null);
    nullstill();
    spill.startDagen();
  }, [nullstill, spill]);

  return (
    <Box mih="100vh" bg="dark.8">
      <Box
        px="lg"
        py="sm"
        pos="sticky"
        top={0}
        style={{
          zIndex: 10,
          background: 'linear-gradient(90deg, #5f3dc4 0%, #7048e8 50%, #9c36b5 100%)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Container size="lg" px={0}>
          <Hud
            poeng={spill.poeng}
            maalere={maalere}
            onTiltak={spill.tilstand === 'spiller' ? apneTiltak : null}
          />
        </Container>
      </Box>

      <Container size="lg" py="xl">
        {spill.tilstand === 'ikke-startet' && (
          <Paper radius="lg" p="xl" shadow="md" withBorder maw={560} mx="auto">
            <Stack gap="md" align="center" ta="center">
              <Text fz={54} lh={1} aria-hidden>
                ☕🤖
              </Text>
              <Title order={2}>God morgen, skadebehandler!</Title>
              <Text c="dimmed">
                Skadesakene strømmer inn. Klikk på en sak for å behandle den før kunden går lei.
                Mister du tre kunder, er du offisielt <b>sykmeldt</b> — og da kaller Bjarne deg
                inn til medarbeidersamtale.
              </Text>
              <Text c="dimmed" fz="sm">
                Samtidig tappes <b>energien</b>, <b>blæra</b> fylles og <b>stresset</b> stiger.
                Knappene under stolpene øverst tar deg vekk fra skrivebordet — men køen står
                stille mens du er borte.
              </Text>
              <Button size="lg" color="teal" onClick={nyDag}>
                Stemple inn ☕
              </Button>
            </Stack>
          </Paper>
        )}

        {spill.tilstand === 'spiller' && (
          <div className={classes.skrivebord} aria-live="polite">
            {spill.saker.length === 0 ? (
              <Text className={classes.tomt}>Skrivebordet er tomt. Nyt det mens det varer.</Text>
            ) : (
              spill.saker.map((sak) => (
                <SakKort key={sak.id} sak={sak} onBehandle={spill.behandleSak} />
              ))
            )}
          </div>
        )}

        {spill.tilstand === 'ferdig' && spill.resultat && (
          <Medarbeidersamtale resultat={spill.resultat} onNyDag={nyDag} />
        )}
      </Container>

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
          bottom={24}
          left="50%"
          style={{ transform: 'translateX(-50%)', zIndex: 5 }}
        >
          {tiltakskvittering}
        </Notification>
      )}

      {spill.tilstand === 'spiller' && spill.tapsmelding && !tiltakskvittering && (
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
