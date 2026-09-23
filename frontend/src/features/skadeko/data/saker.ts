/**
 * Alt her er oppdiktet. Ingen ekte kunder, ingen ekte skadesaker.
 * Legg gjerne til flere — det er den enkleste måten å gjøre spillet morsommere på.
 */

export const SKADESAKER: [emoji: string, tittel: string][] = [
  ['🚗', 'Rygget inn i sjefens bil'],
  ['💧', 'Vannlekkasje fra naboens akvarium'],
  ['🐕', 'Hunden spiste passet'],
  ['📱', 'Mobil i fondueen'],
  ['🌳', 'Tre på carporten'],
  ['🧊', 'Fryseren tinte over natten'],
  ['🚲', 'Sykkel stjålet (igjen)'],
  ['🦆', 'Måke stjal lommeboka'],
  ['🔥', 'Vaffeljern i protest'],
  ['🏠', 'Taket lekker, men bare når det regner'],
  ['🎸', 'Gitar knust på bursdagsfest'],
  ['🛶', 'Kajakk på avveie'],
  ['🐈', 'Katten veltet TV-en'],
  ['❄️', 'Snømann falt på bilen'],
  ['🧳', 'Kofferten dro til Malaga uten meg'],
  ['🍝', 'Spagetti i tastaturet'],
  ['🛋️', 'Sofaen kom ikke gjennom døra'],
  ['⛺', 'Telt tatt av vinden, med teltet i'],
  ['🥘', 'Grillen tok fyr, som planlagt'],
  ['🪟', 'Vindu knust av nabokattens venn'],
];

export const FORNAVN = [
  'Kari', 'Ola', 'Bjørg', 'Arne', 'Tone', 'Svein',
  'Hege', 'Rune', 'Unni', 'Geir', 'Liv', 'Tor',
];

export const ETTERNAVN = [
  'Skadesen', 'Uhellstad', 'Bulkebakken', 'Riperud',
  'Lekkasjeby', 'Knusli', 'Vannvik', 'Sprekkmo',
];

export const TAPSMELDINGER = [
  'Kunden gikk til konkurrenten!',
  'Kunden la på i kø-musikken!',
  'Kunden skrev en sint anmeldelse og gikk!',
  'Kunden fant en billigere forsikring på nett!',
  'Kunden ringte sin fetter som «kan forsikring»!',
];

export const TILSTANDER = [
  'Nettopp drukket kaffe',
  'Sliten',
  'Utmattet',
  'Sykmeldt',
];

export const TITLER = [
  { fra: 0, navn: 'Praktikant' },
  { fra: 150, navn: 'Skadebehandler' },
  { fra: 350, navn: 'Skade-Ninja' },
];

export function finnTittel(poeng: number): string {
  return [...TITLER].reverse().find((t) => poeng >= t.fra)!.navn;
}

export function plukk<T>(liste: T[]): T {
  return liste[Math.floor(Math.random() * liste.length)];
}
