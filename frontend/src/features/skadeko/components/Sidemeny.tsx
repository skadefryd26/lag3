import { Burger, Divider, Drawer, NavLink, SegmentedControl, Stack, Switch, Text, useMantineColorScheme } from '@mantine/core';
import { useSprak, type Sprak } from '../../../sprak';

type Props = {
  apen: boolean;
  onLukk: () => void;
  onNyDag: () => void;
  onTilStart: () => void;
  onVisHighscores: () => void;
  onVisButikk: () => void;
};

/** Sidemenyen som glir inn fra venstre. Resten av siden blir uskarp bak den. */
export function Sidemeny({ apen, onLukk, onNyDag, onTilStart, onVisHighscores, onVisButikk }: Props) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { sprak, settSprak, t } = useSprak();
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
        <NavLink label={t('Startsiden', 'Start page')} leftSection="🏠" onClick={velg(onTilStart)} />
        <NavLink label={t('Ny arbeidsdag', 'New working day')} leftSection="☕" onClick={velg(onNyDag)} />
        <NavLink label={t('Poengtavle', 'Leaderboard')} leftSection="🏆" onClick={velg(onVisHighscores)} />
        <NavLink label={t('Butikk', 'Shop')} leftSection="🛒" onClick={velg(onVisButikk)} />
        <NavLink
          label={t('Spander kaffe på Bjarne', 'Buy Bjarne a coffee')}
          description="GoFundMe"
          leftSection="💸"
          component="a"
          href="https://www.gofundme.com/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLukk}
        />
        <NavLink
          label={t('Mørk modus', 'Dark mode')}
          leftSection="🌙"
          role="switch"
          aria-checked={colorScheme === 'dark'}
          onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          rightSection={
            <Switch
              checked={colorScheme === 'dark'}
              onChange={() => {}}
              style={{ pointerEvents: 'none' }}
              aria-hidden
              tabIndex={-1}
            />
          }
        />
        <NavLink
          component="div"
          label={t('Språk', 'Language')}
          leftSection="🌐"
          rightSection={
            <SegmentedControl
              size="xs"
              value={sprak}
              onChange={(v) => settSprak(v as Sprak)}
              data={[
                { value: 'no', label: 'Norsk' },
                { value: 'en', label: 'English' },
              ]}
            />
          }
        />
        <Divider my="sm" />
        <Text fz="xs" c="dimmed" tt="uppercase" fw={700} px="sm">
          {t('Slik spiller du', 'How to play')}
        </Text>
        <Text fz="sm" c="dimmed" px="sm">
          {t(
            'Klikk på skadesakene før kunden går lei. Energien tappes, blæra fylles og stresset stiger. Når alt er i rødt, kaller Bjarne deg inn til medarbeidersamtale.',
            'Click the claims before the customer gives up. Your energy drains, your bladder fills and your stress rises. When everything is in the red, Bjarne calls you in for a performance review.',
          )}
        </Text>
      </Stack>
    </Drawer>
  );
}

export function MenyKnapp({ apen, onKlikk }: { apen: boolean; onKlikk: () => void }) {
  const { t } = useSprak();
  return <Burger opened={apen} onClick={onKlikk} color="white" aria-label={t('Åpne meny', 'Open menu')} />;
}
