/**
 * Alt her er oppdiktet. Ingen ekte kunder, ingen ekte skadesaker.
 * Legg gjerne til flere — det er den enkleste måten å gjøre spillet morsommere på.
 * Lister med tekst har en engelsk søster med `_EN`-suffiks i samme rekkefølge.
 */
import { tekst } from '../../../sprak';

export const SKADESAKER: [emoji: string, tittel: string, tittelEn: string][] = [
  ['🚗', 'Rygget inn i sjefens bil', 'Reversed into the boss’s car'],
  ['💧', 'Vannlekkasje fra naboens akvarium', 'Water leak from the neighbour’s aquarium'],
  ['🐕', 'Hunden spiste passet', 'The dog ate my passport'],
  ['📱', 'Mobil i fondueen', 'Phone in the fondue'],
  ['🌳', 'Tre på carporten', 'Tree on the carport'],
  ['🧊', 'Fryseren tinte over natten', 'Freezer thawed overnight'],
  ['🚲', 'Sykkel stjålet (igjen)', 'Bike stolen (again)'],
  ['🦆', 'Måke stjal lommeboka', 'Seagull stole my wallet'],
  ['🔥', 'Vaffeljern i protest', 'Waffle iron in revolt'],
  ['🏠', 'Taket lekker, men bare når det regner', 'Roof leaks, but only when it rains'],
  ['🎸', 'Gitar knust på bursdagsfest', 'Guitar smashed at a birthday party'],
  ['🛶', 'Kajakk på avveie', 'Kayak gone astray'],
  ['🐈', 'Katten veltet TV-en', 'The cat knocked over the TV'],
  ['❄️', 'Snømann falt på bilen', 'Snowman fell on the car'],
  ['🧳', 'Kofferten dro til Malaga uten meg', 'My suitcase went to Malaga without me'],
  ['🍝', 'Spagetti i tastaturet', 'Spaghetti in the keyboard'],
  ['🛋️', 'Sofaen kom ikke gjennom døra', 'The sofa wouldn’t fit through the door'],
  ['⛺', 'Telt tatt av vinden, med teltet i', 'Tent taken by the wind, with the tent in it'],
  ['🥘', 'Grillen tok fyr, som planlagt', 'The grill caught fire, as planned'],
  ['🪟', 'Vindu knust av nabokattens venn', 'Window broken by the neighbour cat’s friend'],
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

export const TAPSMELDINGER_EN = [
  'The customer went to a competitor!',
  'The customer hung up during the hold music!',
  'The customer wrote an angry review and left!',
  'The customer found cheaper insurance online!',
  'The customer called their cousin who “knows insurance”!',
];

export const TILSTANDER = [
  'Nettopp drukket kaffe',
  'Sliten',
  'Utmattet',
  'Sykmeldt',
];

export const TILSTANDER_EN = [
  'Just had coffee',
  'Tired',
  'Exhausted',
  'On sick leave',
];

export const TITLER = [
  { fra: 0, navn: 'Praktikant', navnEn: 'Intern' },
  { fra: 200, navn: 'Skadebehandler', navnEn: 'Claims Handler' },
  { fra: 500, navn: 'Skade-Ninja', navnEn: 'Claims Ninja' },
];

/** Tittelen i gjeldende språk (leses når funksjonen kalles). */
export function finnTittel(poeng: number): string {
  const tittel = [...TITLER].reverse().find((t) => poeng >= t.fra)!;
  return tekst(tittel.navn, tittel.navnEn);
}

export function plukk<T>(liste: T[]): T {
  return liste[Math.floor(Math.random() * liste.length)];
}
