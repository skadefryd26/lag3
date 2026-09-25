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
  {
    kategori: 'enkel',
    emoji: '🔑',
    kunde: 'Nils Nøkkelberg',
    beskrivelse: 'Nøkkelknippet ble stjålet fra garderoben på treningssenteret. Hamburger-nøkkelringen også.',
    beskrivelseEn: 'My keys were stolen from the gym changing room. The hamburger keyring too.',
    sporsmalEn: 'What can contents insurance often cover here?',
    svarEn: [
      'A new door with a fingerprint reader and face recognition',
      'Replacing or recoding the lock so the thief cannot get in',
      'A new hamburger keyring',
    ],
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
    beskrivelseEn: 'I want to report a claim, but I have no idea what my policy number is.',
    sporsmalEn: 'What do you do?',
    svarEn: [
      'Look the customer up by name or national ID number',
      'Decline: no policy number, no claim',
      'Ask the customer to guess three times',
    ],
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
    beskrivelseEn: 'The customer has sent 47 photos of a scratch in the parquet. And one of the cat.',
    sporsmalEn: 'What do you do with the photos?',
    svarEn: [
      'Start an Instagram account for the cat',
      'Ask for 47 more, just to be safe',
      'Attach them to the claim as documentation of the damage',
    ],
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
    beskrivelseEn: 'My skis were stolen from the rack outside the café at Sjusjøen while I was eating a Kvikk Lunsj.',
    sporsmalEn: 'What do you ask the customer for?',
    svarEn: [
      'A police report and a receipt or details about the skis',
      'The waxing log for the season',
      'The rest of the Kvikk Lunsj',
    ],
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
    beskrivelseEn: 'A glass of red wine was knocked over the white sofa during the Christmas party at home.',
    sporsmalEn: 'What kind of damage is this typically?',
    svarEn: [
      'Natural damage',
      'Sudden and unforeseen damage to contents',
      'Fire damage, because the wine was “smoking hot”',
    ],
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
  {
    kategori: 'middels',
    emoji: '🌊',
    kunde: 'Frode Flomstad',
    beskrivelse: 'Elva gikk over sine bredder i natt. Nå står det vann i hele første etasje, og en ørret i stua.',
    beskrivelseEn: 'The river burst its banks overnight. The whole ground floor is under water, and there is a trout in the living room.',
    sporsmalEn: 'What kind of damage is this?',
    svarEn: [
      'Pipe damage, since it is water',
      'Vandalism by the river',
      'Natural damage (flood), covered through the fire insurance',
    ],
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
    beskrivelseEn: 'I hit a moose on the way home from the cabin. The moose walked on. The car did not.',
    sporsmalEn: 'What must the customer do about the collision?',
    svarEn: [
      'Report the wildlife collision to the police, even though the moose walked away',
      'Nothing, the moose seemed fine about it',
      'Track down the moose and get it to sign the claim form',
    ],
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
    beskrivelseEn: 'The frying pan caught fire. I used a powder extinguisher. Now the whole kitchen is white, and the cat is grey.',
    sporsmalEn: 'How do you assess the powder?',
    svarEn: [
      'The customer only has themselves to blame for using an extinguisher',
      'Damage and clean-up after extinguishing is normally part of the fire damage',
      'Powder is a cosmetic upgrade',
    ],
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
    beskrivelseEn: 'My suitcase never made it to Crete. All I have is the wool underwear I travelled in.',
    sporsmalEn: 'What should the customer get at the airport?',
    svarEn: [
      'A PIR report from the airline’s baggage desk',
      'A souvenir T-shirt, so she can ditch the wool',
      'A signed confirmation from the pilot',
    ],
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
    beskrivelseEn: 'Lightning struck the neighbourhood. The TV, the router and the smart coffee maker are not smart any more.',
    sporsmalEn: 'How is this handled?',
    svarEn: [
      'As wear and tear, electronics die anyway',
      'Decline, lightning is an act of God',
      'As lightning or power surge damage to contents, with a list of what was ruined',
    ],
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
  {
    kategori: 'kompleks',
    emoji: '⛵',
    kunde: 'Sigurd Senkevik',
    beskrivelse:
      'Båten sank ved brygga i natt. Eieren hadde ikke sett til den på tre uker, og lensepumpa var koblet fra.',
    beskrivelseEn:
      'The boat sank at the jetty overnight. The owner had not checked on it for three weeks, and the bilge pump was disconnected.',
    sporsmalEn: 'What must you assess?',
    svarEn: [
      'Whether safety regulations and supervision were breached, which may reduce the payout',
      'Whether the boat can be re-registered as a submarine',
      'Nothing, boats sink sometimes',
    ],
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
    beskrivelseEn:
      'A brand new Rolex fell into the sea. No receipt, but the watch can be glimpsed in a mirror in a photo from 2019.',
    sporsmalEn: 'What do you do?',
    svarEn: [
      'Pay out, the mirror image is convincing',
      'Ask for proof of purchase and ownership, and look into the claim further before paying',
      'Accuse the customer of fraud while you have him on the phone',
    ],
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
    beskrivelseEn:
      'A German motorhome reversed into my car at a rest stop and drove on towards the North Cape.',
    sporsmalEn: 'Who handles damage caused by foreign vehicles in Norway?',
    svarEn: [
      'The German embassy',
      'Nobody, the motorhome is already on its way out of the country',
      'The Norwegian Motor Insurers’ Bureau (TFF)',
    ],
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
    beskrivelseEn:
      'The TV and the PC are gone. There are no signs of a break-in, because the door was unlocked “because it’s Lillehammer”.',
    sporsmalEn: 'How do you assess the claim?',
    svarEn: [
      'As a break-in, the thief did go in',
      'As theft from an unlocked home, which often means lower or no compensation',
      'As a gift, since the door was open',
    ],
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
    beskrivelseEn:
      'The cabin was left unheated in January. A pipe froze and burst, and now the bathroom is an ice rink.',
    sporsmalEn: 'What is most important to clarify?',
    svarEn: [
      'Whether the customer followed the safety rules, such as keeping it heated or shutting off and draining the water',
      'Whether the ice rink can be rented out',
      'Which brand the pipe was, so you can complain to the manufacturer',
    ],
    sporsmal: 'Hva er viktigst å avklare?',
    svar: [
      'Om kunden fulgte sikkerhetsforskriftene, som å holde varme eller stenge og tappe ned vannet',
      'Om skøytebanen kan leies ut',
      'Hvilket merke røret var, så du kan klage til produsenten',
    ],
    riktig: 0,
  },
];
