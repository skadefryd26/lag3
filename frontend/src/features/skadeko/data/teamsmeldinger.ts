/** Oppdiktede kolleger som alltid har «bare et lite spørsmål». */
export const AVSENDERE = [
  { navn: 'Bjarne (leder)', navnEn: 'Bjarne (manager)', farge: 'violet' },
  { navn: 'Trine fra Økonomi', navnEn: 'Trine from Finance', farge: 'teal' },
  { navn: 'Kjell-Arne IT', navnEn: 'Kjell-Arne IT', farge: 'blue' },
  { navn: 'Praktikant Mats', navnEn: 'Mats the Intern', farge: 'orange' },
  { navn: 'Gunhild HR', navnEn: 'Gunhild HR', farge: 'pink' },
  { navn: 'Kantina', navnEn: 'The Canteen', farge: 'yellow' },
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

export const TEAMSMELDINGER_EN = [
  'Got 2 minutes?',
  'Could you take just one more claim?',
  'Hi! Quick one 🙂',
  'Did you see my email?',
  'Got time for a quick chat? An hour, tops.',
  'Could you share your screen for a sec?',
  'Who took my coffee mug?',
  'Remember to log your hours by 12!',
  'Are you in the meeting? We’re waiting for you.',
  'Could you look at a claim for me? It’s a bit special.',
  'The printer is down again. Know anything?',
  'Where did we save that template from 2019?',
  'Just a small reminder about the small reminder.',
  'Anyone’s birthday? There’s cake on the 4th floor 🎂',
  'You have a new employee survey (47 questions).',
] as const;

/** Sendes hvis du lar en melding ligge for lenge. */
export const PAMINNELSER = ['Hallo? 👀', '??', 'Ser at du er grønn i Teams…', 'Ring meg?'] as const;

export const PAMINNELSER_EN = ['Hello? 👀', '??', 'I can see you’re green on Teams…', 'Call me?'] as const;
