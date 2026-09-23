/** Oppdiktede kolleger som alltid har «bare et lite spørsmål». */
export const AVSENDERE = [
  { navn: 'Bjarne (leder)', farge: 'violet' },
  { navn: 'Trine fra Økonomi', farge: 'teal' },
  { navn: 'Kjell-Arne IT', farge: 'blue' },
  { navn: 'Praktikant Mats', farge: 'orange' },
  { navn: 'Gunhild HR', farge: 'pink' },
  { navn: 'Kantina', farge: 'yellow' },
] as const;

export const TEAMSMELDINGER = [
  'Har du 2 minutter?',
  'Kan du bare ta én sak til?',
  'Hei! Rask en 🙂',
  'Så du mailen min?',
  'Har du tid til en kjapp prat? Tar maks en time.',
  'Kan du dele skjermen et øyeblikk?',
  'Hvem har tatt kaffekoppen min?',
  'Husk å føre timer innen 12!',
  'Er du på møtet? Vi venter på deg.',
  'Kan du se på en sak for meg? Den er litt spesiell.',
  'Printeren er nede igjen. Vet du noe?',
  'Hvor lagret vi den malen fra 2019?',
  'Bare en liten påminnelse om den lille påminnelsen.',
  'Noen som har bursdag? Det er kake i 4. etasje 🎂',
  'Du har fått en ny medarbeiderundersøkelse (47 spørsmål).',
] as const;

/** Sendes hvis du lar en melding ligge for lenge. */
export const PAMINNELSER = ['Hallo? 👀', '??', 'Ser at du er grønn i Teams…', 'Ring meg?'] as const;
