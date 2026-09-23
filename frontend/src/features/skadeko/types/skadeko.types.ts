/** En sak som ligger på skrivebordet akkurat nå. */
export type Sak = {
  id: number;
  emoji: string;
  tittel: string;
  kunde: string;
  /** Tidspunkt (performance.now) da kunden går lei. */
  frist: number;
  /** Hvor lang tid saken fikk totalt, i millisekunder. */
  varighet: number;
  /** 1 = helt fersk, 0 = kunden er borte. Oppdateres hver frame. */
  igjen: number;
};

export type Spilltilstand = 'ikke-startet' | 'spiller' | 'ferdig';

/** De tre målerne skadebehandleren må holde i sjakk. */
export type MaalerId = 'energi' | 'blaere' | 'stress';

/** Verdien på hver måler, 0–100. Se `data/maalere.ts` for hva 0 og 100 betyr. */
export type Maalere = Record<MaalerId, number>;

/**
 * Det et ferdigspilt minispill leverer tilbake.
 * `endring` er prosentpoeng i retning «bra» for den måleren.
 */
export type TiltakResultat = {
  endring: number;
  melding?: string;
};

/** Alt Bjarne får vite om arbeidsdagen din. */
export type Dagsresultat = {
  poeng: number;
  behandlet: number;
  tapt: number;
  tittel: string;
  tapteSaker: string[];
  sekunderSpilt: number;
};
