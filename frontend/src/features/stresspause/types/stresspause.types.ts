import type { ComponentType } from 'react';

/** Alle mini-spill får samme kontrakt: spill ferdig, rapporter en score mellom 0 og 1. */
export type MiniSpillProps = {
  onFerdig: (score: number) => void;
};

export type MiniSpill = {
  id: string;
  navn: string;
  emoji: string;
  beskrivelse: string;
  kontroller: string;
  /** «Slik spiller du» i én setning, vist før spillet starter. */
  slikSpiller: string;
  /** Spill som hører til en bestemt situasjon i arbeidsdagen, f.eks. kaffepausen. */
  anledning?: 'kaffepause';
  Komponent: ComponentType<MiniSpillProps>;
};

/** Kaffepause-spill gir energi, alle andre senker stress. */
export type Maaler = 'stress' | 'energi';

export type Resultat = {
  spill: MiniSpill;
  score: number;
  maaler: Maaler;
  før: number;
  etter: number;
};
