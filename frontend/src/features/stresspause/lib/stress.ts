/** Ingen mini-spill skal ta mer enn dette. */
export const SPILLTID_SEKUNDER = 10;

/** Man kan ikke tape: selv 0 % gir litt ro. Full pott gir mye. */
export const MINSTE_EFFEKT = 5;
export const MAKS_BONUS = 45;

export function stressReduksjon(score: number): number {
  const s = Math.max(0, Math.min(1, score));
  return Math.round(MINSTE_EFFEKT + s * MAKS_BONUS);
}

/** Kaffepausen gir energi: 5 for å prøve, opptil 80 for perfekt helling. */
export const MAKS_ENERGI = 80;

export function energiØkning(score: number): number {
  const s = Math.max(0, Math.min(1, score));
  return Math.round(MINSTE_EFFEKT + s * (MAKS_ENERGI - MINSTE_EFFEKT));
}

export function bjarnesKaffedom(score: number): string {
  if (score >= 0.9) return 'Perfekt helt. Jeg ville gjort det likt. Bare raskere.';
  if (score >= 0.6) return 'Drikkbar. Jeg har fått verre fra kaffemaskinen.';
  if (score >= 0.3) return '*sukk* Det er kaffe. Teknisk sett.';
  return 'Mer på bordet enn i koppen. Men koffeinen finner veien.';
}

export function bjarnesDom(score: number): string {
  if (score >= 0.9) return 'Imponerende. Nesten like bra som meg på en dårlig dag.';
  if (score >= 0.7) return 'Greit nok. Jeg har sett verre. Har jeg vært verre? Nei.';
  if (score >= 0.4) return '*sukk* Det teller. Visstnok.';
  return 'Du fullførte i det minste. Det er mer enn skriveren klarer.';
}
