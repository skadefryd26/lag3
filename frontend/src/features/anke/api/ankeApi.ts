import { useMutation } from "@tanstack/react-query";

export type AnkeResponse = {
  instans: string;
  dommer: string;
  boller: number;
  begrunnelse: string;
  kanAnkeVidere: boolean;
};

export type AnkeInput = {
  unnskyldning: string;
  forrigeBoller: number;
  forrigeBegrunnelse: string;
  ankenivaa: number;
};

async function postAnke(input: AnkeInput): Promise<AnkeResponse> {
  const res = await fetch("/api/anke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({ error: "Ankeinstansen svarte uleselig. *sukk*" }));
  if (!res.ok) throw new Error(data.error ?? "Noe gikk galt under anken.");
  return data as AnkeResponse;
}

export function useAnke() {
  return useMutation({ mutationFn: postAnke });
}
