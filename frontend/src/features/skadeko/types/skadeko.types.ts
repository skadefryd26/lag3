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

/** Alt Bjarne får vite om arbeidsdagen din. */
export type Dagsresultat = {
  poeng: number;
  behandlet: number;
  tapt: number;
  tittel: string;
  tapteSaker: string[];
  sekunderSpilt: number;
};
