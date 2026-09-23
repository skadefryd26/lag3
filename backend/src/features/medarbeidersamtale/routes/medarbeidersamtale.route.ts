import { Router } from 'express';
import {
  GatewayFeil,
  ManglerTokenFeil,
} from '../clients/ai-gateway.client.js';
import { hentMedarbeidersamtale } from '../services/medarbeidersamtale.service.js';
import type {
  FeilResponse,
  MedarbeidersamtaleRequest,
  MedarbeidersamtaleResponse,
} from '../types/medarbeidersamtale.types.js';

export const medarbeidersamtaleRouter = Router();

medarbeidersamtaleRouter.post<
  unknown,
  MedarbeidersamtaleResponse | FeilResponse,
  Partial<MedarbeidersamtaleRequest>
>('/medarbeidersamtale', async (req, res) => {
  const stats = valider(req.body);
  if (!stats) {
    res.status(400).json({ feil: 'Bjarne skjønte ikke tallene dine. Prøv en ny arbeidsdag.' });
    return;
  }

  try {
    const samtale = await hentMedarbeidersamtale(stats);
    res.json({ samtale });
  } catch (feil) {
    if (feil instanceof ManglerTokenFeil) {
      console.error('[medarbeidersamtale] AI_GATEWAY_TOKEN mangler i .env.local');
      res.status(503).json({
        feil: 'Bjarne har ikke fått nøkkelen til AI-gatewayen ennå. Si fra til kodeagenten, så henter den en ny.',
      });
      return;
    }

    if (feil instanceof GatewayFeil) {
      console.error(`[medarbeidersamtale] ${feil.message}`);
      const utloept = feil.status === 401;
      res.status(500).json({
        feil: utloept
          ? 'Tilgangen til AI-gatewayen gikk ut på tid. Si fra til kodeagenten, så henter den en ny nøkkel.'
          : 'Bjarne satt fast i kaffekøen og rakk ikke å lese rapporten. Prøv en ny arbeidsdag.',
      });
      return;
    }

    console.error('[medarbeidersamtale] uventet feil', feil);
    res.status(500).json({ feil: 'Noe gikk galt hos Bjarne. Prøv en ny arbeidsdag.' });
  }
});

function valider(
  body: Partial<MedarbeidersamtaleRequest>,
): MedarbeidersamtaleRequest | null {
  const { poeng, behandlet, tapt, tittel, tapteSaker, sekunderSpilt } = body;

  if (
    typeof poeng !== 'number' ||
    typeof behandlet !== 'number' ||
    typeof tapt !== 'number' ||
    typeof sekunderSpilt !== 'number' ||
    typeof tittel !== 'string' ||
    !Array.isArray(tapteSaker)
  ) {
    return null;
  }

  return {
    poeng,
    behandlet,
    tapt,
    sekunderSpilt,
    tittel: tittel.slice(0, 60),
    // Kort liste, korte strenger — ingenting brukeren har skrevet selv havner her.
    tapteSaker: tapteSaker.filter((s): s is string => typeof s === 'string').slice(0, 20),
  };
}
