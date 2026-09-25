/**
 * Vanskelighetsgradene du velger før du stempler inn. Senior er det
 * opprinnelige tempoet; de andre gir deg mer luft mellom sakene og mer tid
 * per sak. Faktorene ganges med tempoet i `useSkadeko`.
 */
export type VanskelighetsgradId = 'vikar' | 'fulltid' | 'senior';

export type Vanskelighetsgrad = {
  id: VanskelighetsgradId;
  navn: string;
  emoji: string;
  beskrivelse: string;
  /** Ganges med tida mellom hver nye sak. Høyere = roligere. */
  spawnFaktor: number;
  /** Ganges med tida kunden venter per sak. Høyere = mer tålmodige kunder. */
  varighetFaktor: number;
};

export const VANSKELIGHETSGRADER: Vanskelighetsgrad[] = [
  {
    id: 'vikar',
    navn: 'Vikar',
    emoji: '🎒',
    beskrivelse: 'Første uke. Kundene er tålmodige, og innboksen går rolig.',
    spawnFaktor: 2,
    varighetFaktor: 2,
  },
  {
    id: 'fulltid',
    navn: 'Fulltid',
    emoji: '💼',
    beskrivelse: 'Fast stilling, fast tempo. Ingen unnskyldninger lenger.',
    spawnFaktor: 1.5,
    varighetFaktor: 1.5,
  },
  {
    id: 'senior',
    navn: 'Senior',
    emoji: '🎖️',
    beskrivelse: 'Tjue år i bransjen. Alle de vanskelige sakene havner hos deg.',
    spawnFaktor: 1,
    varighetFaktor: 1,
  },
];

export const STANDARD_GRAD: VanskelighetsgradId = 'fulltid';

export const GRAD_ETTER_ID = Object.fromEntries(
  VANSKELIGHETSGRADER.map((g) => [g.id, g]),
) as Record<VanskelighetsgradId, Vanskelighetsgrad>;

export const erGrad = (verdi: unknown): verdi is VanskelighetsgradId =>
  typeof verdi === 'string' && verdi in GRAD_ETTER_ID;
