import { useMutation } from "@tanstack/react-query";

export type StonadResponse = {
  innvilget: number;
  svar: string;
  saksnummer: string;
};

export type Soknad = {
  navn: string;
  beloep: number;
  boller: number;
  unnskyldning: string;
};

async function postStonad(soknad: Soknad): Promise<StonadResponse> {
  const res = await fetch("/api/stonad", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(soknad),
  });
  const data = await res.json().catch(() => ({ error: "Kardemommeby svarte med et uleselig skjema." }));
  if (!res.ok) throw new Error(data.error ?? "Søknaden kom aldri fram til Geir.");
  return data as StonadResponse;
}

export function useStonad() {
  return useMutation({ mutationFn: postStonad });
}
