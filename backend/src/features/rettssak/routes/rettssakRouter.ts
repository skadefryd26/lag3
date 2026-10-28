import { Router, type Request, type Response } from "express";
import { GatewayError } from "../clients/aiGateway.js";
import { holdRettssak } from "../services/rettssakService.js";
import type { ErrorResponse, RettssakRequest, RettssakResponse } from "../types/rettssak.js";

export const rettssakRouter = Router();

rettssakRouter.post(
  "/rettssak",
  async (req: Request<unknown, RettssakResponse | ErrorResponse, RettssakRequest>, res: Response<RettssakResponse | ErrorResponse>) => {
    const navn = typeof req.body?.navn === "string" ? req.body.navn.trim() : "";
    const unnskyldning = typeof req.body?.unnskyldning === "string" ? req.body.unnskyldning.trim() : "";
    if (!navn) {
      return res.status(400).json({ error: "Retten dømmer ikke anonyme syndere. Oppgi fornavnet ditt." });
    }
    if (navn.length > 40) {
      return res.status(400).json({ error: "Det er ikke et fornavn. Bolle-Bjarne orker ikke lese det." });
    }
    if (!unnskyldning) {
      return res.status(400).json({ error: "Retten kan ikke dømme en tom unnskyldning. *sukk*" });
    }
    if (unnskyldning.length > 1000) {
      return res.status(400).json({ error: "Unnskyldningen er over 1000 tegn. Bolle-Bjarne leser ikke romaner." });
    }

    try {
      res.json(await holdRettssak(navn, unnskyldning));
    } catch (err) {
      console.error(err);
      if (err instanceof GatewayError && err.status === 401) {
        return res.status(401).json({ error: "Bolle-Bjarnes adgangskort har utløpt. Han nekter å jobbe før det er fornyet." });
      }
      res.status(502).json({ error: "Retten er satt på pause – Bolle-Bjarne er på kaffepause. Prøv igjen om litt." });
    }
  },
);
