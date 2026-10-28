export type RettssakRequest = { navn: string; unnskyldning: string };

export type RettssakResponse = {
  aktor: string;
  forsvarer: string;
  dom: { boller: number; begrunnelse: string };
};

export type ErrorResponse = { error: string };
