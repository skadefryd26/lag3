import { useEffect, useRef } from "react";
import { Stack, Text } from "@mantine/core";

/**
 * Klubbehammeren: mens retten tenker, slår Bolle-Bjarne klubba i kanelbollen.
 * Hvert slag smeller (Web Audio, ingen lydfiler) og rister hele skjermen.
 */

const SLAG_MS = 900; // må stemme med animasjonen under

function smell() {
  type AudioCtor = typeof AudioContext;
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor };
  const Ctor = w.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return;

  const ctx = new Ctor();
  const na = ctx.currentTime;

  // Dunk: et kort, dypt treff - klubbe mot bolle.
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

  // Smellet: et lite knekk av støy oppå dunken.
  const lengde = Math.floor(ctx.sampleRate * 0.08);
  const buffer = ctx.createBuffer(1, lengde, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < lengde; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / lengde) ** 3;
  }
  const støy = ctx.createBufferSource();
  const støyGain = ctx.createGain();
  støy.buffer = buffer;
  støyGain.gain.setValueAtTime(0.25, na);
  støy.connect(støyGain).connect(ctx.destination);
  støy.start(na);

  window.setTimeout(() => void ctx.close(), 600);
}

export function Klubbehammer() {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Første slag kommer når klubba treffer, ikke når komponenten dukker opp.
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
      <div className="klubbescene" aria-label="Bolle-Bjarne slår klubba i en kanelbolle">
        <span className="klubbe" aria-hidden="true">
          🔨
        </span>
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
        Retten er satt. Bolle-Bjarne banker i bollen.
      </Text>
    </Stack>
  );
}
