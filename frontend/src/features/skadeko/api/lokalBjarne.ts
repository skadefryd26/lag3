import { MAALER_ETTER_ID } from '../data/maalere';
import { plukk } from '../data/saker';
import type { VanskelighetsgradId } from '../data/vanskelighetsgrader';
import type { Dagsresultat, MaalerId } from '../types/skadeko.types';

/**
 * Bjarne uten AI: brukes i versjonen som ligger på Firebase, der det ikke finnes
 * noen backend og dermed ingen vei til AI-gatewayen.
 *
 * Tre setninger, som i prompten (backend/.../prompts/bjarne.ts):
 *   1. åpning ut fra tittel og stilling (eller en helt spesiell dag)
 *   2. hvordan dagen tok slutt, gjerne med en konkret kunde
 *   3. avslutning om kaffe, lønn eller personalmappa
 *
 * `{kunde}` og `{svar}` byttes ut med noe fra dagens tapte saker.
 * Vil du ha flere replikker, legg dem til i listene. Ingen annen kode må endres.
 */

type Tittel = 'Praktikant' | 'Skadebehandler' | 'Skade-Ninja';

const AAPNING: Record<VanskelighetsgradId, Record<Tittel, string[]>> = {
  vikar: {
    Praktikant: [
      'Vi ga deg de tålmodigste kundene i huset, og du ble likevel Praktikant.',
      'Vikar og Praktikant på samme dag. Jeg vet ikke lenger hva som er midlertidig.',
      'Du fikk vikartempo og endte som Praktikant. Kaffemaskinen hadde klart det uten strøm.',
      'Praktikant på vikarnivå er et nytt lavmål, og jeg har sett mange lavmål.',
      'Kundene ventet i evigheter på deg, og du ble Praktikant likevel.',
      'Vikarbyrået lovte meg en skadebehandler. De sendte en Praktikant.',
      'Jeg satte deg på det letteste vi har. Det var tydeligvis ikke lett nok.',
    ],
    Skadebehandler: [
      'Skadebehandler som vikar. Hyggelig, men vikarer glemmer jeg innen fredag.',
      'Greit nok for en vikar. Kontrakten din går ut før jeg lærer navnet ditt.',
      'Skadebehandler, sier systemet. Systemet er snillere med vikarer enn meg.',
      'Du klarte deg på vikartempo. Det er litt som å få skryt for å gå i trapper.',
      'Skadebehandler med vikarhjul. Neste gang tar vi av støttehjulene.',
      'Ikke verst for en vikar. Jeg har ikke tenkt å si det høyt.',
    ],
    'Skade-Ninja': [
      'Skade-Ninja på vikarnivå. Det er som å vinne sekkeløp mot barnehagen.',
      'Imponerende for en vikar. Jeg sier det ikke til noen, for da må vi ansette deg.',
      'Skade-Ninja, ja. Prøv det i ekte tempo før du ber om fast stilling.',
      'Du ble Skade-Ninja på det enkleste vi har. Jeg venter med jubelen.',
      'Vikarer som blir Skade-Ninja pleier å be om fast jobb. Ikke gjør det.',
      'Flott innsats på treningsbanen. Den ekte banen er ved siden av.',
    ],
  },
  fulltid: {
    Praktikant: [
      'Fast stilling, og Praktikant. Jeg har begynt å lese arbeidsmiljøloven på jakt etter smutthull.',
      'Du har fulltid, og brukte hele tida på å bli Praktikant.',
      'Praktikant i fast stilling. HR kaller det et utviklingsområde, jeg kaller det tirsdag.',
      'Vi betaler deg for hele dager. Du leverte en Praktikant-dag.',
      'Praktikant, står det her. Vårens lønnssamtale blir veldig kort.',
      'Fast ansatt og Praktikant. Det er den dyreste praktikanten vi har.',
      'Jeg har vurdert å melde deg på et kurs. Nå har jeg bestemt meg.',
    ],
    Skadebehandler: [
      'Skadebehandler, igjen. Lønnsøkningen ligger like utenfor rekkevidde, som den alltid har gjort.',
      'Helt middels. Du er skadebehandleren jeg viser til i budsjettmøter.',
      'Skadebehandler er en fin tittel. Karin på andre siden av gangen fikk en finere.',
      'Du gjorde jobben. Det er dessverre akkurat det vi betaler for.',
      'Skadebehandler, ja. Et solid ord som aldri har gitt noen lønnsøkning.',
      'Du ligger stabilt i midten. Jeg kaller det komfortsonen, og den er min.',
      'Greit levert. Jeg har skrevet «greit» i personalmappa di, med små bokstaver.',
    ],
    'Skade-Ninja': [
      'Skade-Ninja, altså. Det er i grunnen min fortjeneste, siden jeg har ledet deg så tett.',
      'Du ble Skade-Ninja i dag. Lønnsøkning blir det ikke, for jeg har egne utgifter.',
      'Skade-Ninja på fulltid. Jeg har allerede sagt til ledelsen at det var min idé.',
      'Imponerende. Jeg tar med meg resultatet på neste ledersamling, uten navnet ditt.',
      'Skade-Ninja, står det. Jeg har bedt IT sjekke om systemet er feil.',
      'Godt jobbet. Neste gang tar du Senior, så ser vi om det var flaks.',
    ],
  },
  senior: {
    Praktikant: [
      'Tjue år i bransjen, og systemet kaller deg Praktikant. Jeg har ikke hjerte til å rette det.',
      'Senior og Praktikant på samme skjerm. Det er en bedre vits enn jeg har fortalt.',
      'Du valgte Senior selv. Det sier mye om selvinnsikten, og jeg har skrevet det ned.',
      'Senior i tittelen, Praktikant i tallene. Jeg foreslår at vi bytter visittkort.',
      'Kanskje Vikar hadde vært et mer ærlig valg i dag.',
      'Du er erfaren nok til å vite bedre. Det gjør det verre.',
    ],
    Skadebehandler: [
      'Skadebehandler på seniornivå. Det er nøyaktig det vi betaler deg for, dessverre.',
      'Solid for en senior. Men solid er ikke et ord som gir lønnsøkning.',
      'Senior og Skadebehandler. Jeg kaller det erfaren middelmådighet.',
      'Du holdt stand i fullt tempo. Jeg holdt stand ved kaffemaskinen.',
      'Greit gjort i seniortempo. Jeg ville gjort det bedre, teoretisk sett.',
      'Skadebehandler med lang fartstid. Fartstiden står det mest om i mappa.',
    ],
    'Skade-Ninja': [
      'Skade-Ninja på Senior. Jeg vil ikke si at jeg er imponert, men jeg sier det oppover.',
      'Skade-Ninja i fullt tempo. Det er jeg som har lært deg alt, bare så det er sagt.',
      'Imponerende. Dessverre er lønnsbudsjettet brukt opp på en ny kaffemaskin.',
      'Skade-Ninja på det tøffeste vi har. Jeg tar æren på fredagsmøtet.',
      'Du er Skade-Ninja på Senior. Jeg har bedt om en større pult til meg selv.',
      'Det var nesten like bra som jeg ville gjort det. Nesten.',
    ],
  },
};

/** Dager som er så spesielle at de trumfer tittelen. */
const INGEN_SAKER = [
  'Du behandlet ikke en eneste sak. Det er en konsekvens jeg nesten respekterer.',
  'Innboksen var full, og du lot den være i fred. Det kaller jeg en passiv strategi.',
  'Ingen saker løst. Du og jeg har mer til felles enn jeg liker.',
  'Du kom, du så, du rørte ingenting.',
];

const KORT_DAG = [
  'Du var knapt innom før du var ute igjen. Kaffen min var ikke ferdig trukket.',
  'Kortere arbeidsdag har jeg bare sett hos meg selv på fredager.',
  'Jeg rakk ikke å lære navnet ditt før du var ferdig.',
  'Du stemplet inn og ut i samme bevegelse. Det er nesten effektivt.',
];

type Tapsmaate = 'kunder' | 'feil' | 'blandet' | MaalerId;

const SLUTT: Record<Tapsmaate, string[]> = {
  kunder: [
    '{kunde} ventet så lenge at de rakk å bytte forsikringsselskap.',
    'Saken med {kunde} husker jeg godt, for {kunde} ringte meg.',
    '{kunde} ga opp deg. Jeg forstår {kunde} bedre enn jeg vil innrømme.',
    'Jeg tenker fortsatt på {kunde}. Det gjør nok {kunde} også, hos konkurrenten.',
    'Kundene gikk lei, og i denne bransjen er det bare kaffen som får bli kald.',
    '{kunde} sendte meg et julekort i fjor. I år blir det nok ikke noe.',
    'Du lot {kunde} vente. Jeg lar aldri noen vente, bortsett fra deg.',
    '{kunde} har lagt ut en anmeldelse. Jeg har printet den og hengt den på kjøleskapet.',
  ],
  feil: [
    'Du svarte «{svar}» til {kunde}. Jeg har hengt det opp på oppslagstavla.',
    '«{svar}», sa du til {kunde}. Juridisk er det sikkert interessant.',
    '{kunde} fikk svaret «{svar}». Jeg skal nevne det oppover, uten å si til hvem.',
    'Du svarte feil så ofte at jeg lurte på om det var en strategi.',
    'Saken med {kunde} brukes nå i opplæringen, under «ikke gjør dette».',
    '«{svar}» er ikke et svar vi har i rutinene. Jeg sjekket, fordi jeg håpet.',
    'Jeg leste svaret ditt til {kunde} høyt i lunsjen. Ingen lo, og det var ikke fordi det var trist.',
  ],
  blandet: [
    'Noen kunder fikk feil svar, og resten fikk ikke noe svar i det hele tatt.',
    'Du kombinerte feil svar med ingen svar. Effektivt, bare i feil retning.',
    '{kunde} ble glemt, og de andre fikk svar de ikke burde fått.',
    'Halve køen ventet, og den andre halvdelen skulle ønske de hadde ventet.',
    'Det var et bredt spekter av feil. Jeg liker bredde, men ikke her.',
  ],
  energi: [
    'Du sovnet på tastaturet. Jeg har sagt det før, kaffe er ikke valgfritt.',
    'Du gikk tom for energi. Det skjer aldri meg, for jeg har egen kaffemaskin.',
    'Tastaturavtrykket i panna di er nå en del av personalmappa.',
    'Du hoppet over kaffepausen. Det tolker jeg som mangel på respekt for kaffemaskinen.',
    'Du sovnet midt i en sak. Kunden trodde det var ventemusikk.',
    'Du snorket på et Teams-møte. Jeg har tatt opptak, for opplæringens skyld.',
  ],
  blaere: [
    'Blæra ga opp før deg. Det står ikke i referatet, men jeg husker det.',
    'Du glemte å gå på do. Det er den eneste pausen jeg faktisk godkjenner.',
    'Vi må snakke om toalettpauser, og jeg hadde håpet vi slapp.',
    'Renholdet har sendt en avviksmelding. Den ligger nå i personalmappa di.',
    'Kontorstolen din er sendt til rens. Regningen er sendt til deg.',
    'Du prioriterte kundene over blæra. Beundringsverdig, og veldig uhygienisk.',
  ],
  stress: [
    'Du ropte til kaffemaskinen. Kaffemaskinen har levert en bekymringsmelding.',
    'Stresset tok overhånd, og stress har vi ikke budsjett til.',
    'Du møtte veggen. Veggen er forresten ny, så den må du betale for.',
    'Jeg så deg puste i en papirpose. Jeg har meldt deg på et mindfulnesskurs.',
    'Kollegaene dine hørte deg hyle. De trodde det var brannalarmen.',
    'Stressballen din er sprukket. Den var firmaets eiendom.',
  ],
};

const AVSLUTNING = [
  'Jeg har drukket mye kaffe i dag, og ingen av koppene har gjort feil.',
  'Neste gang går du innom kaffemaskinen før du svarer kundene. Det gjør jeg.',
  'Kaffemaskinen og jeg har snakket om deg. Vi er enige.',
  'Kaffen i dag var bedre enn innsatsen din, og kaffen var lunken.',
  'Jeg har notert dette, og jeg noterer mye.',
  'Stillingen din kunne vært automatisert, og jeg har meldt meg som kandidat.',
  'Nå skal jeg ha kaffe. Du kan ta en når du har fortjent den.',
  'Det blir ikke lønnsøkning i år, men du får gjerne vaske koppen min.',
  'Døra mi står alltid åpen, bortsett fra når jeg drikker kaffe.',
  'Vi tar en ny samtale etter kaffen min. Altså ikke i dag.',
  'Jeg har oppdatert utviklingsplanen din. Den er blank, men den er oppdatert.',
  'Espen på teamet klarte seg bedre i dag, og han var på ferie.',
  'Jeg skal nevne dette oppover. Hvem som er oppover, sier jeg ikke.',
  'Hent en kopp til meg på vei ut. Svart, som kvartalsrapporten.',
];

const AVSLUTNING_PER_GRAD: Record<VanskelighetsgradId, string[]> = {
  vikar: [
    'Hvis vikarbyrået ringer, sier jeg at du var hyggelig.',
    'Vikarkontrakten din har en utløpsdato, og jeg har satt ring rundt den i kalenderen.',
    'Neste gang prøver du Fulltid, eller så finner vi en ny vikar.',
    'Vikarer får ikke bruke den gode kaffemaskinen. Nå skjønner du hvorfor.',
  ],
  fulltid: [
    'Fast stilling betyr at jeg må se deg i morgen også. Det går vel greit.',
    'Kanskje Senior neste gang, hvis du tør. Jeg tror ikke du tør.',
    'Du har fast plass ved kaffemaskinen, men bare ved siden av den.',
    'Fulltid er fullt ansvar. Jeg har delegert mitt til deg.',
  ],
  senior: [
    'Seniorer drikker svart kaffe, har jeg lest. Det forklarer mye.',
    'Du har vært her lengst, så du vet hvor kaffefiltrene ligger. Fyll på.',
    'Pensjonsordningen er god. Jeg nevner det bare.',
    'Du skal lære opp de nye vikarene. Ikke lær dem dette.',
  ],
};

/** Henter kunde (og eventuelt svaret) ut av linjene `useSkadeko` skriver. */
function detaljerFra(linje: string | undefined): { kunde?: string; svar?: string } {
  if (!linje) return {};
  return {
    kunde: linje.match(/\(([^)]+)\)/)?.[1],
    svar: linje.match(/svarte «(.+)»$/)?.[1],
  };
}

function tapsmaate(resultat: Dagsresultat): Tapsmaate {
  const maaler = (Object.keys(MAALER_ETTER_ID) as MaalerId[]).find(
    (id) => MAALER_ETTER_ID[id].krisetekst === resultat.aarsak,
  );
  if (maaler) return maaler;
  const lei = resultat.tapteSaker.some((s) => s.startsWith('Kunden gikk lei'));
  const feil = resultat.tapteSaker.some((s) => s.startsWith('Feil svar'));
  if (lei && feil) return 'blandet';
  return feil ? 'feil' : 'kunder';
}

/** Velger en replikk der alle plassholderne kan fylles ut. */
function fyllInn(maler: string[], verdier: { kunde?: string; svar?: string }): string {
  const mulige = maler.filter(
    (m) => (!m.includes('{kunde}') || verdier.kunde) && (!m.includes('{svar}') || verdier.svar),
  );
  return plukk(mulige.length > 0 ? mulige : maler)
    .replaceAll('{kunde}', verdier.kunde ?? 'kunden')
    .replaceAll('{svar}', verdier.svar ?? 'det der');
}

export function lokalMedarbeidersamtale(resultat: Dagsresultat): string {
  const grad = resultat.vanskelighetsgrad;
  const tittel = (resultat.tittel in AAPNING[grad] ? resultat.tittel : 'Skadebehandler') as Tittel;

  const aapning =
    resultat.behandlet === 0
      ? plukk(INGEN_SAKER)
      : resultat.sekunderSpilt < 45 && Math.random() < 0.6
        ? plukk(KORT_DAG)
        : plukk(AAPNING[grad][tittel]);

  const maate = tapsmaate(resultat);
  // Feil svar er morsommest å sitere, så de går foran når vi velger sak.
  const sak =
    (maate === 'feil' ? resultat.tapteSaker.find((s) => s.startsWith('Feil svar')) : undefined) ??
    resultat.tapteSaker[0];
  const slutt = fyllInn(SLUTT[maate], detaljerFra(sak));

  const avslutning = Math.random() < 0.4 ? plukk(AVSLUTNING_PER_GRAD[grad]) : plukk(AVSLUTNING);

  return [aapning, slutt, avslutning].join(' ');
}
