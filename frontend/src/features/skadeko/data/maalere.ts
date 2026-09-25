import type { MantineColor } from '@mantine/core';
import { ENERGI_TAK } from '../../stresspause/lib/stress';
import type { MaalerId } from '../types/skadeko.types';

/**
 * De tre målerne skadebehandleren må holde i sjakk.
 *
 * Hver måler har et tiltak bak knappen under stolpen: enten et minispill
 * (koblet på i `components/tiltak/registry.ts`), eller — med `tommingPerSekund`
 * — en måler som tømmes mens skadekøen står stille.
 *
 * Hvert tekstfelt har en engelsk søster med `En`-suffiks.
 */
export type MaalerKonfig = {
  id: MaalerId;
  navn: string;
  navnEn: string;
  emoji: string;
  farge: MantineColor;
  /**
   * 'tappes'  — 100 er bra, 0 er krise (energi).
   * 'fylles'  — 0 er bra, 100 er krise (blære, stress).
   */
  retning: 'tappes' | 'fylles';
  /** Hvor mange prosentpoeng måleren beveger seg per sekund mens du spiller. */
  driftPerSekund: number;
  /**
   * Satt = tiltaket er ikke et minispill. Knappen pauser skadekøen og tømmer
   * måleren med så mange prosentpoeng per sekund, til den er i mål.
   */
  tommingPerSekund?: number;
  /** Høyeste nivå tiltaket kan løfte en «tappes»-måler til. */
  tiltakTak?: number;
  /** Knappeteksten mens tømmingen pågår. */
  knappUnderveis?: string;
  knappUnderveisEn?: string;
  /** Teksten på knappen under stolpen. */
  knapp: string;
  knappEn: string;
  /** Hva tiltaket heter når det åpnes. */
  tiltakTittel: string;
  tiltakTittelEn: string;
  /** Én setning om hva minispillet skal gå ut på. */
  tiltakBeskrivelse: string;
  tiltakBeskrivelseEn: string;
  /** Hva Bjarne sier når du forlater skrivebordet for å gjøre dette. */
  bjarneKommentar: string;
  bjarneKommentarEn: string;
  /** Hva som skjer når måleren når krisepunktet. */
  krisetekst: string;
  krisetekstEn: string;
};

export const MAALERE: MaalerKonfig[] = [
  {
    id: 'energi',
    navn: 'Energi',
    navnEn: 'Energy',
    emoji: '🔋',
    farge: 'green',
    retning: 'tappes',
    driftPerSekund: 1.6,
    knapp: 'Hent kaffe',
    knappEn: 'Get coffee',
    tiltakTak: ENERGI_TAK,
    tiltakTittel: 'Kaffepause',
    tiltakTittelEn: 'Coffee break',
    tiltakBeskrivelse: 'Hell kaffen nøyaktig opp til streken. Jo bedre helling, jo mer energi.',
    tiltakBeskrivelseEn: 'Pour the coffee exactly up to the line. The better the pour, the more energy.',
    bjarneKommentar:
      'Kaffe, ja. Jeg har aldri trengt det, men jeg er heller ikke et menneske.',
    bjarneKommentarEn:
      'Coffee, right. I have never needed it, but then again, I am not human.',
    krisetekst: 'Tom for energi. Du sovnet på tastaturet.',
    krisetekstEn: 'Out of energy. You fell asleep on the keyboard.',
  },
  {
    id: 'blaere',
    navn: 'Blære',
    navnEn: 'Bladder',
    emoji: '🚽',
    farge: 'yellow',
    retning: 'fylles',
    driftPerSekund: 1.5,
    tommingPerSekund: 30,
    knapp: 'Gå på do',
    knappEn: 'Go to the loo',
    knappUnderveis: 'På do… 🚽',
    knappUnderveisEn: 'In the loo… 🚽',
    tiltakTittel: 'Turen til toalettet',
    tiltakTittelEn: 'The trip to the toilet',
    tiltakBeskrivelse: 'Blæra tømmes mens skadekøen står stille.',
    tiltakBeskrivelseEn: 'Your bladder empties while the claims queue stands still.',
    bjarneKommentar:
      'Igjen? Jeg har vært oppe i 400 dager uten pause. Bare så det er sagt.',
    bjarneKommentarEn:
      'Again? I have been up for 400 days without a break. Just saying.',
    krisetekst: 'Blæra ga opp før deg. Vi sier ikke mer.',
    krisetekstEn: 'Your bladder gave up before you did. We shall say no more.',
  },
  {
    id: 'stress',
    navn: 'Stress',
    navnEn: 'Stress',
    emoji: '🤯',
    farge: 'red',
    retning: 'fylles',
    driftPerSekund: 1.2,
    knapp: 'Stresspause',
    knappEn: 'Stress break',
    tiltakTittel: 'Stresspause',
    tiltakTittelEn: 'Stress break',
    tiltakBeskrivelse: 'Et tilfeldig mini-spill på maks ti sekunder. Du kan ikke tape.',
    tiltakBeskrivelseEn: 'A random mini-game of ten seconds max. You cannot lose.',
    bjarneKommentar:
      'Stresspause, ja. HR sier det hjelper. HR har heller aldri sittet i skadekøen.',
    bjarneKommentarEn:
      'Stress break, sure. HR says it helps. HR has never sat in the claims queue either.',
    krisetekst: 'Stresset tok overhånd. Du ropte til kaffemaskinen.',
    krisetekstEn: 'The stress took over. You yelled at the coffee machine.',
  },
];

export const MAALER_ETTER_ID = Object.fromEntries(
  MAALERE.map((m) => [m.id, m]),
) as Record<MaalerId, MaalerKonfig>;

/** Startverdien for hver måler når du stempler inn. */
export const STARTVERDIER: Record<MaalerId, number> = {
  energi: 100,
  blaere: 0,
  stress: 0,
};

/** Hvor ille det må bli før stolpen roper etter deg. */
export const VARSELGRENSE = 0.75;

/** Sant når måleren er i det røde og spilleren bør gjøre noe med det. */
/** Måleren har nådd bunnen (energi 0 %) eller toppen (blære/stress 100 %) — dagen er tapt. */
export function iKrise(konfig: MaalerKonfig, verdi: number): boolean {
  return konfig.retning === 'tappes' ? verdi <= 0 : verdi >= 100;
}

export function erKritisk(konfig: MaalerKonfig, verdi: number): boolean {
  return konfig.retning === 'tappes' ? verdi <= 25 : verdi >= 75;
}

/** Sant når måleren har gått helt. Her kobles konsekvensen på senere. */
export function erUtslatt(konfig: MaalerKonfig, verdi: number): boolean {
  return konfig.retning === 'tappes' ? verdi <= 0 : verdi >= 100;
}

/** 0–1, der 1 = full krise. Brukes til farge og animasjon i stolpen. */
export function alvorlighet(konfig: MaalerKonfig, verdi: number): number {
  return konfig.retning === 'tappes' ? (100 - verdi) / 100 : verdi / 100;
}
