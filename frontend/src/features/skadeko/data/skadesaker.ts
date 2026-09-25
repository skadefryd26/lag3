/**
 * Skadesaker med spørsmål og svar. Alt her er oppdiktet — ingen ekte kunder,
 * ingen ekte saker. `riktig` er indeksen (0–2) til riktig svaralternativ.
 * Rekkefølgen på alternativene blandes hver gang saken dukker opp.
 * Hvert tekstfelt har en engelsk søster med `En`-suffiks.
 */
import type { Kategori, Sakmal } from '../types/skadeko.types';

export const KATEGORIER: Record<
  Kategori,
  {
    navn: string;
    navnEn: string;
    ikon: string;
    farge: string;
    poeng: number;
    talmodighet: number;
  }
> = {
  enkel: { navn: 'Enkel', navnEn: 'Easy', ikon: '🟢', farge: 'green', poeng: 10, talmodighet: 1.4 },
  middels: { navn: 'Middels', navnEn: 'Medium', ikon: '🟡', farge: 'yellow', poeng: 20, talmodighet: 1.0 },
  kompleks: { navn: 'Kompleks', navnEn: 'Complex', ikon: '🔴', farge: 'red', poeng: 30, talmodighet: 0.7 },
};

export const SAKMALER: Sakmal[] = [
  // 🟢 Enkle
  {
    kategori: 'enkel',
    emoji: '🧳',
    kunde: 'Ola Nordmann',
    beskrivelse: 'Jeg mistet kofferten min på flyplassen.',
    beskrivelseEn: 'I lost my suitcase at the airport.',
    sporsmal: 'Hvordan bør saken håndteres?',
    sporsmalEn: 'How should this claim be handled?',
    svar: [
      'Avslå saken umiddelbart',
      'Registrere skaden og starte behandling',
      'Be kunden kjøpe ny koffert først',
    ],
    svarEn: [
      'Reject the claim immediately',
      'Register the claim and start processing',
      'Tell the customer to buy a new suitcase first',
    ],
    riktig: 1,
  },
  {
    kategori: 'enkel',
    emoji: '📱',
    kunde: 'Kari Fondue-Hansen',
    beskrivelse: 'Mobilen falt ned i ostefondueen. Den luktet godt, men virker ikke.',
    beskrivelseEn: 'My phone fell into the cheese fondue. It smells great, but it doesn’t work.',
    sporsmal: 'Hva trenger du først fra kunden?',
    sporsmalEn: 'What do you need from the customer first?',
    svar: [
      'En oppskrift på fondueen',
      'Kvittering eller modell på telefonen',
      'At hun spiser opp osten først',
    ],
    svarEn: [
      'The fondue recipe',
      'A receipt or the phone’s model',
      'For her to finish the cheese first',
    ],
    riktig: 1,
  },
  {
    kategori: 'enkel',
    emoji: '🚲',
    kunde: 'Svein Sykkelstad',
    beskrivelse: 'Sykkelen min ble stjålet fra bakgården. Igjen.',
    beskrivelseEn: 'My bike was stolen from the backyard. Again.',
    sporsmal: 'Hva ber du kunden om?',
    sporsmalEn: 'What do you ask the customer for?',
    svar: [
      'Politianmeldelse og rammenummer',
      'Et bilde av tyven',
      'At han slutter å eie sykler',
    ],
    svarEn: [
      'A police report and the frame number',
      'A photo of the thief',
      'That he stops owning bikes',
    ],
    riktig: 0,
  },
  {
    kategori: 'enkel',
    emoji: '🍝',
    kunde: 'Tone Tastaturvik',
    beskrivelse: 'Jeg sølte spagetti i tastaturet på den private laptopen.',
    beskrivelseEn: 'I spilled spaghetti into the keyboard of my personal laptop.',
    sporsmal: 'Hvilken forsikring gjelder typisk her?',
    sporsmalEn: 'Which insurance typically applies here?',
    svar: ['Bilforsikring', 'Reiseforsikring', 'Innboforsikring'],
    svarEn: ['Car insurance', 'Travel insurance', 'Home contents insurance'],
    riktig: 2,
  },
  {
    kategori: 'enkel',
    emoji: '🧊',
    kunde: 'Arne Frysmo',
    beskrivelse: 'Fryseren tinte i natt. Tre kilo elgkjøtt er ødelagt.',
    beskrivelseEn: 'The freezer thawed overnight. Three kilos of moose meat are ruined.',
    sporsmal: 'Hva er et fornuftig neste steg?',
    sporsmalEn: 'What is a sensible next step?',
    svar: [
      'Be kunden grille alt i dag',
      'Be om bilder og oversikt over det som er ødelagt',
      'Si at elg ikke er dekket fordi den er et dyr',
    ],
    svarEn: [
      'Tell the customer to barbecue it all today',
      'Ask for photos and a list of what was ruined',
      'Say moose isn’t covered because it’s an animal',
    ],
    riktig: 1,
  },

  // 🟡 Middels
  {
    kategori: 'middels',
    emoji: '💧',
    kunde: 'Unni Vannvik',
    beskrivelse: 'Naboens akvarium sprakk, og det renner vann og guppyer gjennom taket mitt.',
    beskrivelseEn: 'The neighbour’s aquarium burst, and water and guppies are pouring through my ceiling.',
    sporsmal: 'Hva er viktigst å gjøre akkurat nå?',
    sporsmalEn: 'What is most important to do right now?',
    svar: [
      'Begrense skaden, for eksempel skaffe vannskadefirma',
      'Redde guppyene først',
      'Vente til taket har tørket av seg selv',
    ],
    svarEn: [
      'Limit the damage, e.g. call in a water damage company',
      'Rescue the guppies first',
      'Wait for the ceiling to dry by itself',
    ],
    riktig: 0,
  },
  {
    kategori: 'middels',
    emoji: '🚗',
    kunde: 'Rune Ryggestad',
    beskrivelse: 'Jeg rygget inn i sjefens bil på parkeringsplassen. Han så det.',
    beskrivelseEn: 'I reversed into my boss’s car in the parking lot. He saw it.',
    sporsmal: 'Hvilket dokument hjelper mest i saken?',
    sporsmalEn: 'Which document helps the most here?',
    svar: [
      'En unnskyldning til sjefen',
      'Utfylt skademelding, gjerne felles med den andre parten',
      'Bilder av en annen bil',
    ],
    svarEn: [
      'An apology letter to the boss',
      'A completed claim form, ideally a joint one with the other party',
      'Photos of a different car',
    ],
    riktig: 1,
  },
  {
    kategori: 'middels',
    emoji: '🌳',
    kunde: 'Hege Carportsen',
    beskrivelse: 'Stormen veltet et tre over carporten. Bilen sto under.',
    beskrivelseEn: 'The storm knocked a tree onto the carport. The car was underneath.',
    sporsmal: 'Hvordan håndteres dette best?',
    sporsmalEn: 'How is this best handled?',
    svar: [
      'Kun som bilskade',
      'Kun som bygningsskade',
      'Både bygningsskade (carport) og bilskade (bil)',
    ],
    svarEn: [
      'Only as car damage',
      'Only as building damage',
      'Both building damage (carport) and car damage (car)',
    ],
    riktig: 2,
  },
  {
    kategori: 'middels',
    emoji: '🎸',
    kunde: 'Geir Riffelrud',
    beskrivelse: 'Gitaren ble knust på bursdagsfest. Gjesten som gjorde det, stakk.',
    beskrivelseEn: 'My guitar got smashed at a birthday party. The guest who did it ran off.',
    sporsmal: 'Hva bør du avklare først?',
    sporsmalEn: 'What should you clarify first?',
    svar: [
      'Hvem gjesten var, og om kunden har innbo med alle-risk',
      'Hvilken sang som ble spilt',
      'Om det var en god fest',
    ],
    svarEn: [
      'Who the guest was, and whether the customer has all-risk contents cover',
      'Which song was being played',
      'Whether it was a good party',
    ],
    riktig: 0,
  },
  {
    kategori: 'middels',
    emoji: '🐈',
    kunde: 'Liv Katterud',
    beskrivelse: 'Katten min hoppet på TV-benken og veltet en splitter ny TV.',
    beskrivelseEn: 'My cat jumped onto the TV stand and knocked over a brand-new TV.',
    sporsmal: 'Hva er det riktige neste steget?',
    sporsmalEn: 'What is the right next step?',
    svar: [
      'Avslå, katter er alltid skyldige',
      'Sjekke om kunden har dekning for plutselig skade på innbo',
      'Be kunden selge katten',
    ],
    svarEn: [
      'Reject it, cats are always guilty',
      'Check whether the customer is covered for sudden damage to contents',
      'Tell the customer to sell the cat',
    ],
    riktig: 1,
  },

  // 🔴 Komplekse
  {
    kategori: 'kompleks',
    emoji: '🔥',
    kunde: 'Tor Vaffelsen',
    beskrivelse:
      'Vaffeljernet tok fyr, brannen spredte seg til kjøkkenet. Kunden innrømmer at han gikk ut for å luke.',
    beskrivelseEn:
      'The waffle iron caught fire and it spread to the kitchen. The customer admits he went out to do some weeding.',
    sporsmal: 'Hvordan behandler du saken?',
    sporsmalEn: 'How do you handle the claim?',
    svar: [
      'Utbetale fullt uten spørsmål',
      'Behandle som brannskade, og vurdere om aktsomhetskrav er brutt',
      'Anmelde vaffeljernet',
    ],
    svarEn: [
      'Pay out in full, no questions asked',
      'Treat it as fire damage, and assess whether safety requirements were breached',
      'Report the waffle iron to the police',
    ],
    riktig: 1,
  },
  {
    kategori: 'kompleks',
    emoji: '🏠',
    kunde: 'Bjørg Lekkasjeby',
    beskrivelse:
      'Taket har lekket i to år, men hun meldte det først nå. Nå er det råte i hele loftet.',
    beskrivelseEn:
      'The roof has leaked for two years, but she’s only reporting it now. The whole attic is rotten.',
    sporsmal: 'Hva må du vurdere?',
    sporsmalEn: 'What do you need to assess?',
    svar: [
      'Om skaden skyldes manglende vedlikehold og om den er meldt for sent',
      'Om loftet kan brukes som badebasseng',
      'Ingenting, det er bare å betale',
    ],
    svarEn: [
      'Whether it’s due to poor maintenance and whether it was reported too late',
      'Whether the attic could be used as a swimming pool',
      'Nothing, just pay up',
    ],
    riktig: 0,
  },
  {
    kategori: 'kompleks',
    emoji: '⛺',
    kunde: 'Kjell Teltmo',
    beskrivelse:
      'Teltet blåste avgårde på fjellet med utstyr til 40 000 kr i. Han var på tur i utlandet.',
    beskrivelseEn:
      'His tent blew off a mountain with NOK 40,000 worth of gear inside. He was on a trip abroad.',
    sporsmal: 'Hvilke forsikringer må sjekkes?',
    sporsmalEn: 'Which insurance policies need checking?',
    svar: [
      'Kun husforsikring',
      'Reiseforsikring og innbo, og hvem som betaler hva',
      'Ingen, vind er en naturkraft',
    ],
    svarEn: [
      'Only home building insurance',
      'Travel and contents insurance, and who pays what',
      'None, wind is a force of nature',
    ],
    riktig: 1,
  },
  {
    kategori: 'kompleks',
    emoji: '🦆',
    kunde: 'Marit Måkestad',
    beskrivelse:
      'En måke stjal lommeboka. Etterpå ble kortet brukt til å kjøpe 200 reker i Bergen.',
    beskrivelseEn:
      'A seagull stole my wallet. Afterwards the card was used to buy 200 shrimps in Bergen.',
    sporsmal: 'Hva er viktigst å gjøre?',
    sporsmalEn: 'What is most important to do?',
    svar: [
      'Etterlyse måka',
      'Be kunden spise rekene',
      'Sperre kortet, kontakte banken og melde tyveriet',
    ],
    svarEn: [
      'Put out a wanted notice for the seagull',
      'Tell the customer to eat the shrimps',
      'Block the card, contact the bank and report the theft',
    ],
    riktig: 2,
  },
  {
    kategori: 'kompleks',
    emoji: '🛋️',
    kunde: 'Petter Flyttmo',
    beskrivelse:
      'Flyttebyrået knuste dørkarmen og en sofa. Byrået sier det var kundens feil for at døra er for smal.',
    beskrivelseEn:
      'The movers broke the door frame and a sofa. They say it’s the customer’s fault for having a door that’s too narrow.',
    sporsmal: 'Hvordan håndterer du dette?',
    sporsmalEn: 'How do you handle this?',
    svar: [
      'Kreve regress fra flyttebyrået om de er ansvarlige',
      'Gi kunden en smalere sofa',
      'Avslå, dører er kundens ansvar',
    ],
    svarEn: [
      'Seek recourse from the moving company if they are liable',
      'Give the customer a narrower sofa',
      'Reject it, doors are the customer’s responsibility',
    ],
    riktig: 0,
  },
];
