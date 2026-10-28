import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Bevegelsesvakt: ser på bildet fra webkameraet og merker når det blir helt stille.
 *
 * Alt skjer i nettleseren. Ingen bilder lagres, og ingenting sendes noe sted -
 * vi sammenligner to små gråtonebilder med hverandre og kaster dem med en gang.
 *
 * Merk: nettleseren kan ikke se om PC-en er låst. Den ser bare at ingen rører seg.
 */

const PROVE_MS = 400; // hvor ofte vi ser på bildet
const BREDDE = 64; // vi skalerer ned - vi trenger ikke detaljer
const HOYDE = 48;
const PIKSELTERSKEL = 24; // hvor mye en piksel må endre seg for å telle
const ANDELTERSKEL = 0.02; // 2 % av bildet må endre seg for at noen "rører seg"

export type VaktStatus = "av" | "venter" | "ser-deg" | "stille" | "utloest" | "nektet";

type Valg = {
  stilleSekunder: number;
  onStille: () => void;
};

export function useBevegelsesvakt({ stilleSekunder, onStille }: Valg) {
  const [status, setStatus] = useState<VaktStatus>("av");
  const [nedtelling, setNedtelling] = useState(stilleSekunder);
  const [feil, setFeil] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const forrigeRef = useRef<Uint8ClampedArray | null>(null);
  const sistBevegelseRef = useRef<number>(Date.now());
  const utloestRef = useRef(false);
  const onStilleRef = useRef(onStille);

  useEffect(() => {
    onStilleRef.current = onStille;
  }, [onStille]);

  const stopp = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    forrigeRef.current = null;
    utloestRef.current = false;
    setStatus("av");
    setNedtelling(stilleSekunder);
    setFeil(null);
  }, [stilleSekunder]);

  const start = useCallback(async () => {
    setFeil(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: false,
      });
      streamRef.current = stream;

      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
      videoRef.current = video;

      sistBevegelseRef.current = Date.now();
      utloestRef.current = false;
      setStatus("venter");
    } catch (err) {
      const navn = err instanceof DOMException ? err.name : "";
      setFeil(
        navn === "NotAllowedError"
          ? "Du sa nei til kameraet. Retten respekterer det, motvillig."
          : "Fant ikke noe kamera på denne maskinen.",
      );
      setStatus("nektet");
    }
  }, []);

  // Selve vakta: sammenlign bildet med forrige bilde, fire ganger i sekundet.
  useEffect(() => {
    if (status === "av" || status === "nektet" || status === "utloest") return;

    const lerret = document.createElement("canvas");
    lerret.width = BREDDE;
    lerret.height = HOYDE;
    const ctx = lerret.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const id = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      ctx.drawImage(video, 0, 0, BREDDE, HOYDE);
      const naa = ctx.getImageData(0, 0, BREDDE, HOYDE).data;

      // Gråtone, ett tall per piksel.
      const graa = new Uint8ClampedArray(BREDDE * HOYDE);
      for (let i = 0, p = 0; i < naa.length; i += 4, p += 1) {
        graa[p] = (naa[i] * 299 + naa[i + 1] * 587 + naa[i + 2] * 114) / 1000;
      }

      const forrige = forrigeRef.current;
      forrigeRef.current = graa;
      if (!forrige) return;

      let endret = 0;
      for (let p = 0; p < graa.length; p += 1) {
        if (Math.abs(graa[p] - forrige[p]) > PIKSELTERSKEL) endret += 1;
      }

      const beveger = endret / graa.length > ANDELTERSKEL;
      if (beveger) sistBevegelseRef.current = Date.now();

      const stilleMs = Date.now() - sistBevegelseRef.current;
      const igjen = Math.max(0, Math.ceil((stilleSekunder * 1000 - stilleMs) / 1000));
      setNedtelling(igjen);
      setStatus(beveger ? "ser-deg" : "stille");

      if (igjen === 0 && !utloestRef.current) {
        utloestRef.current = true;
        setStatus("utloest");
        onStilleRef.current();
      }
    }, PROVE_MS);

    return () => window.clearInterval(id);
  }, [status, stilleSekunder]);

  // Skru alltid av kameraet når skjermen forlates.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const paa = status !== "av" && status !== "nektet";

  return { status, nedtelling, feil, paa, start, stopp };
}
