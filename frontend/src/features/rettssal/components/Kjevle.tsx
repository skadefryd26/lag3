import { useEffect, useRef } from "react";
import { Stack, Text } from "@mantine/core";

/**
 * Kjevla: mens retten tenker, slår Bolle-Bjarne bakstekjevla i kanelbollen.
 * Hvert slag smeller (Web Audio, ingen lydfiler) og rister hele skjermen.
 */

const SLAG_MS = 900; // må stemme med animasjonen i styles.css

function smell() {
  type AudioCtor = typeof AudioContext;
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return;

  const ctx = new Ctor();
  const na = ctx.currentTime;

  // Dunk: et kort, dypt treff - kjevle mot bolle.
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(180, na);
  osc.frequency.exponentialRampToValueAtTime(45, na + 0.18);
  oscGain.gain.setValueAtTime(0.5, na);
  oscGain.gain.exponentialRampToValueAtTime(0.001, na + 0.25);
  osc.connect(oscGain).connect(ctx.destination);
  osc.start(na);
  osc.stop(na + 0.28);

  // Smellet: et lite knekk av stoy oppa dunken.
  const lengde = Math.floor(ctx.sampleRate * 0.08);
  const buffer = ctx.createBuffer(1, lengde, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < lengde; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / lengde) ** 3;
  }
  const stoy = ctx.createBufferSource();
  const stoyGain = ctx.createGain();
  stoy.buffer = buffer;
  stoyGain.gain.setValueAtTime(0.25, na);
  stoy.connect(stoyGain).connect(ctx.destination);
  stoy.start(na);

  window.setTimeout(() => void ctx.close(), 600);
}

export function Kjevle() {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Første smell kommer når kjevla treffer, ikke når komponenten dukker opp.
    const start = window.setTimeout(() => {
      smell();
      timerRef.current = window.setInterval(smell, SLAG_MS);
    }, SLAG_MS * 0.45);

    document.body.classList.add("rister");

    return () => {
      window.clearTimeout(start);
      if (timerRef.current) window.clearInterval(timerRef.current);
      document.body.classList.remove("rister");
    };
  }, []);

  return (
    <Stack align="center" gap={4} py="sm">
      <div className="klubbescene" aria-label="Bolle-Bjarne slår kjevla i en kanelbolle">
        <span className="kjevle" aria-hidden="true" />
        <span className="bolle-under-klubba" aria-hidden="true">
          🥐
        </span>
        <span className="smuler" aria-hidden="true">
          <i>·</i>
          <i>·</i>
          <i>·</i>
        </span>
      </div>
      <Text size="sm" c="orange.2">
        Retten er satt. Bolle-Bjarne kjevler i bollen.
      </Text>
    </Stack>
  );
}
