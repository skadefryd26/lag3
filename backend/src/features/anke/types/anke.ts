export type AnkeRequest = {
  unnskyldning: string;
  forrigeBoller: number;
  forrigeBegrunnelse: string;
  ankenivaa: number;
};

export type AnkeResponse = {
  instans: string;
  dommer: string;
  boller: number;
  begrunnelse: string;
  kanAnkeVidere: boolean;
};

export type AnkeErrorResponse = { error: string };
