export type RettssakRequest = { unnskyldning: string };

export type RettssakResponse = {
  aktor: string;
  forsvarer: string;
  dom: { boller: number; begrunnelse: string };
};

export type ErrorResponse = { error: string };
