import { Router, type Request, type Response } from "express";
import { GatewayError } from "../../rettssak/clients/aiGateway.js";
import { behandleStonad } from "../services/stonadService.js";
import type { StonadErrorResponse, StonadRequest, StonadResponse } from "../types/stonad.js";

export const stonadRouter = Router();

stonadRouter.post(
  "/stonad",
  async (
    req: Request<unknown, StonadResponse | StonadErrorResponse, StonadRequest>,
    res: Response<StonadResponse | StonadErrorResponse>,
  ) => {
    const navn = typeof req.body?.navn === "string" ? req.body.navn.trim() : "";
    const beloep = Math.round(Number(req.body?.beloep));
    const boller = Math.round(Number(req.body?.boller));
    const unnskyldning = typeof req.body?.unnskyldning === "string" ? req.body.unnskyldning.trim() : "";

    if (!navn || navn.length > 60) {
      return res.status(400).json({ error: "Kardemommeby behandler ikke anonyme søknader. Oppgi navn." });
    }
    if (!Number.isFinite(beloep) || beloep < 1 || beloep > 1_000_000) {
      return res.status(400).json({ error: "Beløpet må være mellom 1 og 1 000 000 kroner. Geir er nøye på dette." });
    }

    try {
      res.json(await behandleStonad({ navn, beloep, boller: Number.isFinite(boller) ? boller : 0, unnskyldning }));
    } catch (err) {
      console.error(err);
      if (err instanceof GatewayError && err.status === 401) {
        return res.status(401).json({ error: "Geirs adgangskort har utløpt. Søknaden legges i bunken." });
      }
      res.status(502).json({ error: "Geir er på lunsj i Kardemommeby. Prøv igjen om litt." });
    }
  },
);
