import type { ComponentType } from 'react';
import type { MaalerId, TiltakResultat } from '../../types/skadeko.types';

/**
 * Kontrakten hvert minispill må oppfylle.
 *
 * Minispillet vet ingenting om skadekøen. Det gjør sin greie og kaller
 * `onFerdig` med hvor mange prosentpoeng spilleren fortjente — alltid som et
 * positivt tall i spillerens favør. `Tiltak` oversetter det til riktig
 * retning for måleren.
 */
export type TiltakSpillProps = {
  onFerdig: (resultat: TiltakResultat) => void;
  onAvbryt: () => void;
};

export type TiltakSpill = ComponentType<TiltakSpillProps>;

/**
 * Her kobles minispillene på. Mangler en måler her, får den
 * plassholderen i `TiltakModal` i stedet — og alt virker fortsatt.
 *
 * Slik legger du til et minispill:
 *
 *   1. Lag `KaffemaskinSpill.tsx` her i mappa, med `TiltakSpillProps`.
 *   2. Importer den og sett `energi: KaffemaskinSpill` under.
 *
 * Ingenting annet trenger å endres.
 */
export const TILTAK_SPILL: Partial<Record<MaalerId, TiltakSpill>> = {
  // energi: KaffemaskinSpill,
  // blaere: DoturSpill,
  // stress: PustSpill,
};
