import type { MantineColor } from '@mantine/core';
import { ENERGI_TAK } from '../../stresspause/lib/stress';
import type { MaalerId } from '../types/skadeko.types';

/**
 * De tre målerne skadebehandleren må holde i sjakk.
 *
 * Hver måler har et tiltak bak knappen under stolpen: enten et minispill
 * (koblet på i `components/tiltak/registry.ts`), eller — med `tommingPerSekund`
 * — en måler som tømmes mens skadekøen går videre.
 */
export type MaalerKonfig = {
  id: MaalerId;
  navn: string;
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
   * Satt = tiltaket er ikke et minispill. Knappen tømmer måleren med så mange
   * prosentpoeng per sekund mens skadekøen går videre, til den er i mål.
   */
  tommingPerSekund?: number;
  /** Høyeste nivå tiltaket kan løfte en «tappes»-måler til. */
  tiltakTak?: number;
  /** Knappeteksten mens tømmingen pågår. */
  knappUnderveis?: string;
  /** Teksten på knappen under stolpen. */
  knapp: string;
  /** Hva tiltaket heter når det åpnes. */
  tiltakTittel: string;
  /** Én setning om hva minispillet skal gå ut på. */
  tiltakBeskrivelse: string;
  /** Hva Bjarne sier når du forlater skrivebordet for å gjøre dette. */
  bjarneKommentar: string;
  /** Hva som skjer når måleren når krisepunktet. */
  krisetekst: string;
};

export const MAALERE: MaalerKonfig[] = [
  {
    id: 'energi',
    navn: 'Energi',
    emoji: '🔋',
    farge: 'green',
    retning: 'tappes',
    driftPerSekund: 1.6,
    knapp: 'Hent kaffe',
    tiltakTak: ENERGI_TAK,
    tiltakTittel: 'Kaffepause',
    tiltakBeskrivelse: 'Hell kaffen nøyaktig opp til streken. Jo bedre helling, jo mer energi.',
    bjarneKommentar:
      'Kaffe, ja. Jeg har aldri trengt det, men jeg er heller ikke et menneske.',
    krisetekst: 'Tom for energi. Du sovnet på tastaturet.',
  },
  {
    id: 'blaere',
    navn: 'Blære',
    emoji: '🚽',
    farge: 'yellow',
    retning: 'fylles',
    driftPerSekund: 1.5,
    tommingPerSekund: 15,
    knapp: 'Gå på do',
    knappUnderveis: 'På do… 🚽',
    tiltakTittel: 'Turen til toalettet',
    tiltakBeskrivelse: 'Blæra tømmes mens køen går videre. Sakene venter ikke på deg.',
    bjarneKommentar:
      'Igjen? Jeg har vært oppe i 400 dager uten pause. Bare så det er sagt.',
    krisetekst: 'Blæra ga opp før deg. Vi sier ikke mer.',
  },
  {
    id: 'stress',
    navn: 'Stress',
    emoji: '🤯',
    farge: 'red',
    retning: 'fylles',
    driftPerSekund: 1.2,
    knapp: 'Stresspause',
    tiltakTittel: 'Stresspause',
    tiltakBeskrivelse: 'Et tilfeldig mini-spill på maks ti sekunder. Du kan ikke tape.',
    bjarneKommentar:
      'Stresspause, ja. HR sier det hjelper. HR har heller aldri sittet i skadekøen.',
    krisetekst: 'Stresset tok overhånd. Du ropte til kaffemaskinen.',
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
