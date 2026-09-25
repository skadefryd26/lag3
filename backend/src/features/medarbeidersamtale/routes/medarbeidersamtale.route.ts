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
  const en = req.body?.sprak === 'en';
  const stats = valider(req.body);
  if (!stats) {
    res.status(400).json({ feil: en ? 'Bjarne did not understand your numbers. Try a new working day.' : 'Bjarne skjønte ikke tallene dine. Prøv en ny arbeidsdag.' });
    return;
  }

  try {
    const samtale = await hentMedarbeidersamtale(stats);
    res.json({ samtale });
  } catch (feil) {
    if (feil instanceof ManglerTokenFeil) {
      console.error('[medarbeidersamtale] AI_GATEWAY_TOKEN mangler i .env.local');
      res.status(503).json({
        feil: en ? 'Bjarne has not got the AI gateway key yet. Tell the coding agent and it will fetch a new one.' : 'Bjarne har ikke fått nøkkelen til AI-gatewayen ennå. Si fra til kodeagenten, så henter den en ny.',
      });
      return;
    }

    if (feil instanceof GatewayFeil) {
      console.error(`[medarbeidersamtale] ${feil.message}`);
      const utloept = feil.status === 401;
      res.status(500).json({
        feil: utloept
          ? (en ? 'Access to the AI gateway timed out. Tell the coding agent and it will fetch a new key.' : 'Tilgangen til AI-gatewayen gikk ut på tid. Si fra til kodeagenten, så henter den en ny nøkkel.')
          : en ? 'Bjarne got stuck in the coffee queue and never read your report. Try a new working day.' : 'Bjarne satt fast i kaffekøen og rakk ikke å lese rapporten. Prøv en ny arbeidsdag.',
      });
      return;
    }

    console.error('[medarbeidersamtale] uventet feil', feil);
    res.status(500).json({ feil: en ? 'Something went wrong with Bjarne. Try a new working day.' : 'Noe gikk galt hos Bjarne. Prøv en ny arbeidsdag.' });
  }
});

/** Oversetter spillets id til det Bjarne kaller stillingen. */
const STILLINGER: Record<string, string> = {
  vikar: 'Vikar',
  fulltid: 'Fulltid',
  senior: 'Senior',
};

function valider(
  body: Partial<MedarbeidersamtaleRequest>,
): MedarbeidersamtaleRequest | null {
  const { poeng, behandlet, tapt, tittel, tapteSaker, sekunderSpilt, aarsak, vanskelighetsgrad } =
    body as Partial<MedarbeidersamtaleRequest> & { vanskelighetsgrad?: unknown };

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
    // Valgfri for bakoverkompatibilitet; teksten kommer fra spillets egne data.
    aarsak: typeof aarsak === 'string' ? aarsak.slice(0, 120) : 'Ukjent',
    sprak: body.sprak === 'en' ? 'en' : 'no',
    sjef: (body as { sjef?: unknown }).sjef === true,
    stilling:
      typeof vanskelighetsgrad === 'string' && Object.hasOwn(STILLINGER, vanskelighetsgrad)
        ? STILLINGER[vanskelighetsgrad]
        : 'Ukjent',
    // Kort liste, korte strenger — ingenting brukeren har skrevet selv havner her.
    tapteSaker: tapteSaker.filter((s): s is string => typeof s === 'string').slice(0, 20),
  };
}
