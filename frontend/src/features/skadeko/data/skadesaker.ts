/**
 * Skadesaker med spørsmål og svar. Alt her er oppdiktet — ingen ekte kunder,
 * ingen ekte saker. `riktig` er indeksen (0–2) til riktig svaralternativ.
 * Rekkefølgen på alternativene blandes hver gang saken dukker opp.
 */
import type { Kategori, Sakmal } from '../types/skadeko.types';

export const KATEGORIER: Record<
  Kategori,
  { navn: string; ikon: string; farge: string; poeng: number; talmodighet: number }
> = {
  enkel: { navn: 'Enkel', ikon: '🟢', farge: 'green', poeng: 10, talmodighet: 1.4 },
  middels: { navn: 'Middels', ikon: '🟡', farge: 'yellow', poeng: 20, talmodighet: 1.0 },
  kompleks: { navn: 'Kompleks', ikon: '🔴', farge: 'red', poeng: 30, talmodighet: 0.7 },
};

export const SAKMALER: Sakmal[] = [
  // 🟢 Enkle
  {
    kategori: 'enkel',
    emoji: '🧳',
    kunde: 'Ola Nordmann',
    beskrivelse: 'Jeg mistet kofferten min på flyplassen.',
    sporsmal: 'Hvordan bør saken håndteres?',
    svar: [
      'Avslå saken umiddelbart',
      'Registrere skaden og starte behandling',
      'Be kunden kjøpe ny koffert først',
    ],
    riktig: 1,
  },
  {
    kategori: 'enkel',
    emoji: '📱',
    kunde: 'Kari Fondue-Hansen',
    beskrivelse: 'Mobilen falt ned i ostefondueen. Den luktet godt, men virker ikke.',
    sporsmal: 'Hva trenger du først fra kunden?',
    svar: [
      'En oppskrift på fondueen',
      'Kvittering eller modell på telefonen',
      'At hun spiser opp osten først',
    ],
    riktig: 1,
  },
  {
    kategori: 'enkel',
    emoji: '🚲',
    kunde: 'Svein Sykkelstad',
    beskrivelse: 'Sykkelen min ble stjålet fra bakgården. Igjen.',
    sporsmal: 'Hva ber du kunden om?',
    svar: [
      'Politianmeldelse og rammenummer',
      'Et bilde av tyven',
      'At han slutter å eie sykler',
    ],
    riktig: 0,
  },
  {
    kategori: 'enkel',
    emoji: '🍝',
    kunde: 'Tone Tastaturvik',
    beskrivelse: 'Jeg sølte spagetti i tastaturet på den private laptopen.',
    sporsmal: 'Hvilken forsikring gjelder typisk her?',
    svar: ['Bilforsikring', 'Reiseforsikring', 'Innboforsikring'],
    riktig: 2,
  },
  {
    kategori: 'enkel',
    emoji: '🧊',
    kunde: 'Arne Frysmo',
    beskrivelse: 'Fryseren tinte i natt. Tre kilo elgkjøtt er ødelagt.',
    sporsmal: 'Hva er et fornuftig neste steg?',
    svar: [
      'Be kunden grille alt i dag',
      'Be om bilder og oversikt over det som er ødelagt',
      'Si at elg ikke er dekket fordi den er et dyr',
    ],
    riktig: 1,
  },
  {
    kategori: 'enkel',
    emoji: '🔑',
    kunde: 'Nils Nøkkelberg',
    beskrivelse: 'Nøkkelknippet ble stjålet fra garderoben på treningssenteret. Hamburger-nøkkelringen også.',
    sporsmal: 'Hva kan innboforsikringen ofte dekke her?',
    svar: [
      'Ny dør med fingeravtrykkleser og ansiktsgjenkjenning',
      'Bytte eller omkoding av låsen, så tyven ikke kommer inn',
      'En ny hamburger-nøkkelring',
    ],
    riktig: 1,
  },
  {
    kategori: 'enkel',
    emoji: '🧾',
    kunde: 'Polly Sesnummer',
    beskrivelse: 'Jeg vil melde en skade, men jeg aner ikke hva polisenummeret mitt er.',
    sporsmal: 'Hva gjør du?',
    svar: [
      'Slår opp kunden med navn eller fødselsnummer',
      'Avslår, uten polisenummer finnes ingen skade',
      'Ber kunden gjette tre ganger',
    ],
    riktig: 0,
  },
  {
    kategori: 'enkel',
    emoji: '📸',
    kunde: 'Fotini Parkettvik',
    beskrivelse: 'Kunden har sendt 47 bilder av en ripe i parketten. Og ett av katten.',
    sporsmal: 'Hva gjør du med bildene?',
    svar: [
      'Starter en Instagram-konto for katten',
      'Ber om 47 til, for sikkerhets skyld',
      'Legger dem ved saken som dokumentasjon på skaden',
    ],
    riktig: 2,
  },
  {
    kategori: 'enkel',
    emoji: '🎿',
    kunde: 'Sjur Kvikklund',
    beskrivelse: 'Skiene ble stjålet fra stativet utenfor kafeen på Sjusjøen mens jeg spiste kvikklunsj.',
    sporsmal: 'Hva ber du kunden om?',
    svar: [
      'Politianmeldelse og kvittering eller opplysninger om skiene',
      'Smøreprotokollen for sesongen',
      'Resten av kvikklunsjen',
    ],
    riktig: 0,
  },
  {
    kategori: 'enkel',
    emoji: '🍷',
    kunde: 'Vibeke Rødvinsrud',
    beskrivelse: 'Et glass rødvin veltet over den hvite sofaen under julebordet hjemme.',
    sporsmal: 'Hva slags skade er dette typisk?',
    svar: [
      'Naturskade',
      'Plutselig og uforutsett skade på innbo',
      'Brannskade, fordi vinen var «brennende god»',
    ],
    riktig: 1,
  },

  // 🟡 Middels
  {
    kategori: 'middels',
    emoji: '💧',
    kunde: 'Unni Vannvik',
    beskrivelse: 'Naboens akvarium sprakk, og det renner vann og guppyer gjennom taket mitt.',
    sporsmal: 'Hva er viktigst å gjøre akkurat nå?',
    svar: [
      'Begrense skaden, for eksempel skaffe vannskadefirma',
      'Redde guppyene først',
      'Vente til taket har tørket av seg selv',
    ],
    riktig: 0,
  },
  {
    kategori: 'middels',
    emoji: '🚗',
    kunde: 'Rune Ryggestad',
    beskrivelse: 'Jeg rygget inn i sjefens bil på parkeringsplassen. Han så det.',
    sporsmal: 'Hvilket dokument hjelper mest i saken?',
    svar: [
      'En unnskyldning til sjefen',
      'Utfylt skademelding, gjerne felles med den andre parten',
      'Bilder av en annen bil',
    ],
    riktig: 1,
  },
  {
    kategori: 'middels',
    emoji: '🌳',
    kunde: 'Hege Carportsen',
    beskrivelse: 'Stormen veltet et tre over carporten. Bilen sto under.',
    sporsmal: 'Hvordan håndteres dette best?',
    svar: [
      'Kun som bilskade',
      'Kun som bygningsskade',
      'Både bygningsskade (carport) og bilskade (bil)',
    ],
    riktig: 2,
  },
  {
    kategori: 'middels',
    emoji: '🎸',
    kunde: 'Geir Riffelrud',
    beskrivelse: 'Gitaren ble knust på bursdagsfest. Gjesten som gjorde det, stakk.',
    sporsmal: 'Hva bør du avklare først?',
    svar: [
      'Hvem gjesten var, og om kunden har innbo med alle-risk',
      'Hvilken sang som ble spilt',
      'Om det var en god fest',
    ],
    riktig: 0,
  },
  {
    kategori: 'middels',
    emoji: '🐈',
    kunde: 'Liv Katterud',
    beskrivelse: 'Katten min hoppet på TV-benken og veltet en splitter ny TV.',
    sporsmal: 'Hva er det riktige neste steget?',
    svar: [
      'Avslå, katter er alltid skyldige',
      'Sjekke om kunden har dekning for plutselig skade på innbo',
      'Be kunden selge katten',
    ],
    riktig: 1,
  },
  {
    kategori: 'middels',
    emoji: '🌊',
    kunde: 'Frode Flomstad',
    beskrivelse: 'Elva gikk over sine bredder i natt. Nå står det vann i hele første etasje, og en ørret i stua.',
    sporsmal: 'Hva slags skade er dette?',
    svar: [
      'Rørskade, siden det er vann',
      'Hærverk utført av elva',
      'Naturskade (flom), som dekkes gjennom brannforsikringen',
    ],
    riktig: 2,
  },
  {
    kategori: 'middels',
    emoji: '🫎',
    kunde: 'Einar Elgesæter',
    beskrivelse: 'Jeg traff en elg på vei hjem fra hytta. Elgen gikk videre. Det gjorde ikke bilen.',
    sporsmal: 'Hva må kunden gjøre med påkjørselen?',
    svar: [
      'Melde viltpåkjørselen til politiet, selv om elgen gikk sin vei',
      'Ingenting, elgen virket å ta det fint',
      'Spore opp elgen og få den til å signere skademeldingen',
    ],
    riktig: 0,
  },
  {
    kategori: 'middels',
    emoji: '🧯',
    kunde: 'Pål Pulversen',
    beskrivelse: 'Stekepanna tok fyr. Jeg brukte pulverapparat. Nå er hele kjøkkenet hvitt, og katten er grå.',
    sporsmal: 'Hvordan vurderer du pulveret?',
    svar: [
      'Kunden får skylde seg selv som brukte slokkeapparat',
      'Skader og opprydding etter slokking regnes normalt med i brannskaden',
      'Pulver er en kosmetisk oppgradering',
    ],
    riktig: 1,
  },
  {
    kategori: 'middels',
    emoji: '✈️',
    kunde: 'Bente Bagasjeli',
    beskrivelse: 'Kofferten kom ikke fram til Kreta. Jeg har bare ullundertøyet jeg reiste i.',
    sporsmal: 'Hva bør kunden skaffe på flyplassen?',
    svar: [
      'En PIR-rapport fra flyselskapets bagasjeskranke',
      'En souvenir-T-skjorte, så slipper hun ulla',
      'En signert bekreftelse fra piloten',
    ],
    riktig: 0,
  },
  {
    kategori: 'middels',
    emoji: '⚡',
    kunde: 'Lyn-Kristin Tordenskjold',
    beskrivelse: 'Lynet slo ned i nabolaget. TV-en, ruteren og den smarte kaffetrakteren er ikke smarte lenger.',
    sporsmal: 'Hvordan behandles dette?',
    svar: [
      'Som slitasje, elektronikk dør uansett',
      'Avslå, lyn er en guddommelig handling',
      'Som lyn- eller overspenningsskade på innbo, med oversikt over det som er ødelagt',
    ],
    riktig: 2,
  },

  // 🔴 Komplekse
  {
    kategori: 'kompleks',
    emoji: '🔥',
    kunde: 'Tor Vaffelsen',
    beskrivelse:
      'Vaffeljernet tok fyr, brannen spredte seg til kjøkkenet. Kunden innrømmer at han gikk ut for å luke.',
    sporsmal: 'Hvordan behandler du saken?',
    svar: [
      'Utbetale fullt uten spørsmål',
      'Behandle som brannskade, og vurdere om aktsomhetskrav er brutt',
      'Anmelde vaffeljernet',
    ],
    riktig: 1,
  },
  {
    kategori: 'kompleks',
    emoji: '🏠',
    kunde: 'Bjørg Lekkasjeby',
    beskrivelse:
      'Taket har lekket i to år, men hun meldte det først nå. Nå er det råte i hele loftet.',
    sporsmal: 'Hva må du vurdere?',
    svar: [
      'Om skaden skyldes manglende vedlikehold og om den er meldt for sent',
      'Om loftet kan brukes som badebasseng',
      'Ingenting, det er bare å betale',
    ],
    riktig: 0,
  },
  {
    kategori: 'kompleks',
    emoji: '⛺',
    kunde: 'Kjell Teltmo',
    beskrivelse:
      'Teltet blåste avgårde på fjellet med utstyr til 40 000 kr i. Han var på tur i utlandet.',
    sporsmal: 'Hvilke forsikringer må sjekkes?',
    svar: [
      'Kun husforsikring',
      'Reiseforsikring og innbo, og hvem som betaler hva',
      'Ingen, vind er en naturkraft',
    ],
    riktig: 1,
  },
  {
    kategori: 'kompleks',
    emoji: '🦆',
    kunde: 'Marit Måkestad',
    beskrivelse:
      'En måke stjal lommeboka. Etterpå ble kortet brukt til å kjøpe 200 reker i Bergen.',
    sporsmal: 'Hva er viktigst å gjøre?',
    svar: [
      'Etterlyse måka',
      'Be kunden spise rekene',
      'Sperre kortet, kontakte banken og melde tyveriet',
    ],
    riktig: 2,
  },
  {
    kategori: 'kompleks',
    emoji: '🛋️',
    kunde: 'Petter Flyttmo',
    beskrivelse:
      'Flyttebyrået knuste dørkarmen og en sofa. Byrået sier det var kundens feil for at døra er for smal.',
    sporsmal: 'Hvordan håndterer du dette?',
    svar: [
      'Kreve regress fra flyttebyrået om de er ansvarlige',
      'Gi kunden en smalere sofa',
      'Avslå, dører er kundens ansvar',
    ],
    riktig: 0,
  },
  {
    kategori: 'kompleks',
    emoji: '⛵',
    kunde: 'Sigurd Senkevik',
    beskrivelse:
      'Båten sank ved brygga i natt. Eieren hadde ikke sett til den på tre uker, og lensepumpa var koblet fra.',
    sporsmal: 'Hva må du vurdere?',
    svar: [
      'Om sikkerhetsforskrifter og tilsyn er brutt, noe som kan gi avkortning',
      'Om båten kan omregistreres som ubåt',
      'Ingenting, båter synker av og til',
    ],
    riktig: 0,
  },
  {
    kategori: 'kompleks',
    emoji: '⌚',
    kunde: 'Rolf Luksusberg',
    beskrivelse:
      'En splitter ny Rolex falt i sjøen. Ingen kvittering, men klokka skimtes i et speil på et bilde fra 2019.',
    sporsmal: 'Hva gjør du?',
    svar: [
      'Utbetaler, speilbildet er overbevisende',
      'Ber om dokumentasjon på kjøp og eierskap, og vurderer saken nærmere før utbetaling',
      'Anklager kunden for svindel mens du har ham på telefonen',
    ],
    riktig: 1,
  },
  {
    kategori: 'kompleks',
    emoji: '🚐',
    kunde: 'Gunn Rasteplassen',
    beskrivelse:
      'En tysk bobil rygget inn i bilen min på en rasteplass og kjørte videre mot Nordkapp.',
    sporsmal: 'Hvem håndterer skader voldt av utenlandske kjøretøy i Norge?',
    svar: [
      'Den tyske ambassaden',
      'Ingen, bobilen er allerede på vei ut av landet',
      'Trafikkforsikringsforeningen (TFF)',
    ],
    riktig: 2,
  },
  {
    kategori: 'kompleks',
    emoji: '🚪',
    kunde: 'Lise Ulåsnes',
    beskrivelse:
      'TV-en og PC-en er borte. Det er ingen spor etter innbrudd, for døra sto ulåst «fordi det er Lillehammer».',
    sporsmal: 'Hvordan vurderer du saken?',
    svar: [
      'Som innbrudd, tyven gikk jo inn',
      'Som tyveri fra ulåst bolig, som ofte gir lavere eller ingen erstatning',
      'Som gave, siden døra var åpen',
    ],
    riktig: 1,
  },
  {
    kategori: 'kompleks',
    emoji: '🥶',
    kunde: 'Frida Frostmo',
    beskrivelse:
      'Hytta sto uten varme i januar. Et rør frøs og sprakk, og nå er badet en skøytebane.',
    sporsmal: 'Hva er viktigst å avklare?',
    svar: [
      'Om kunden fulgte sikkerhetsforskriftene, som å holde varme eller stenge og tappe ned vannet',
      'Om skøytebanen kan leies ut',
      'Hvilket merke røret var, så du kan klage til produsenten',
    ],
    riktig: 0,
  },
];
