import { useMutation } from "@tanstack/react-query";

export type RettssakResponse = {
  aktor: string;
  forsvarer: string;
  dom: { boller: number; begrunnelse: string };
};

async function postRettssak(unnskyldning: string): Promise<RettssakResponse> {
  const res = await fetch("/api/rettssak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ unnskyldning }),
  });
  const data = await res.json().catch(() => ({ error: "Retten fikk et uleselig svar. *sukk*" }));
  if (!res.ok) throw new Error(data.error ?? "Noe gikk galt i retten.");
  return data as RettssakResponse;
}

export function useRettssak() {
  return useMutation({ mutationFn: postRettssak });
}
