import { tekst } from '../../../sprak';

/** Ingen mini-spill skal ta mer enn dette. Skadekøen står stille imens. */
export const SPILLTID_SEKUNDER = 15;

/** Man kan ikke tape: selv 0 % gir litt effekt. Full pott gir mye. */
export const MINSTE_EFFEKT = 5;

/** En stresspause tar alltid bort minst 50 poeng stress, og opptil 80 ved perfekt spill. */
export const MINSTE_STRESSREDUKSJON = 50;
export const MAKS_STRESSREDUKSJON = 80;

export function stressReduksjon(score: number): number {
  const s = Math.max(0, Math.min(1, score));
  return Math.round(MINSTE_STRESSREDUKSJON + s * (MAKS_STRESSREDUKSJON - MINSTE_STRESSREDUKSJON));
}

/** Kaffepausen gir energi: 5 for å prøve, opptil 80 for perfekt helling. */
export const MAKS_ENERGI = 80;
/** Kaffe løfter energien til høyst dette. Helt uthvilt blir du ikke av kaffe. */
export const ENERGI_TAK = 90;

export function energiØkning(score: number): number {
  const s = Math.max(0, Math.min(1, score));
  return Math.round(MINSTE_EFFEKT + s * (MAKS_ENERGI - MINSTE_EFFEKT));
}

export function bjarnesKaffedom(score: number): string {
  if (score >= 0.9) return tekst('Perfekt helt. Jeg ville gjort det likt. Bare raskere.', 'Perfectly poured. I would have done the same. Just faster.');
  if (score >= 0.6) return tekst('Drikkbar. Jeg har fått verre fra kaffemaskinen.', 'Drinkable. I\'ve had worse from the coffee machine.');
  if (score >= 0.3) return tekst('*sukk* Det er kaffe. Teknisk sett.', '*sigh* It is coffee. Technically.');
  return tekst('Mer på bordet enn i koppen. Men koffeinen finner veien.', 'More on the desk than in the cup. But the caffeine finds a way.');
}

export function bjarnesDom(score: number): string {
  if (score >= 0.9) return tekst('Imponerende. Nesten like bra som meg på en dårlig dag.', 'Impressive. Almost as good as me on a bad day.');
  if (score >= 0.7) return tekst('Greit nok. Jeg har sett verre. Har jeg vært verre? Nei.', 'Fair enough. I\'ve seen worse. Have I been worse? No.');
  if (score >= 0.4) return tekst('*sukk* Det teller. Visstnok.', '*sigh* It counts. Apparently.');
  return tekst('Du fullførte i det minste. Det er mer enn skriveren klarer.', 'At least you finished. That\'s more than the printer manages.');
}
