import { Burger, Divider, Drawer, NavLink, Stack, Text } from '@mantine/core';

type Props = {
  apen: boolean;
  onLukk: () => void;
  onNyDag: () => void;
  onVisHighscores: () => void;
};

/** Sidemenyen som glir inn fra venstre. Resten av siden blir uskarp bak den. */
export function Sidemeny({ apen, onLukk, onNyDag, onVisHighscores }: Props) {
  const velg = (handling: () => void) => () => {
    onLukk();
    handling();
  };

  return (
    <Drawer
      opened={apen}
      onClose={onLukk}
      position="left"
      size={300}
      title={
        <Text fw={900} fz="lg">
          📎 Skadekø
        </Text>
      }
      overlayProps={{ backgroundOpacity: 0.35, blur: 6 }}
      radius="md"
    >
      <Stack gap={4}>
        <NavLink label="Ny arbeidsdag" leftSection="☕" onClick={velg(onNyDag)} />
        <NavLink label="Highscores" leftSection="🏆" onClick={velg(onVisHighscores)} />
        <NavLink
          label="Spander kaffe på Bjarne"
          description="GoFundMe"
          leftSection="💸"
          component="a"
          href="https://www.gofundme.com/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLukk}
        />
        <Divider my="sm" />
        <Text fz="xs" c="dimmed" tt="uppercase" fw={700} px="sm">
          Slik spiller du
        </Text>
        <Text fz="sm" c="dimmed" px="sm">
          Klikk på skadesakene før kunden går lei. Energien tappes, blæra fylles og stresset
          stiger. Når alt er i rødt, kaller Bjarne deg inn til medarbeidersamtale.
        </Text>
      </Stack>
    </Drawer>
  );
}

export function MenyKnapp({ apen, onKlikk }: { apen: boolean; onKlikk: () => void }) {
  return <Burger opened={apen} onClick={onKlikk} color="white" aria-label="Åpne meny" />;
}
