export type StonadRequest = {
  navn: string;
  beloep: number;
  boller: number;
  unnskyldning: string;
};

export type StonadResponse = {
  innvilget: number;
  svar: string;
  saksnummer: string;
};

export type StonadErrorResponse = { error: string };
