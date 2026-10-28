import { Router, type Request, type Response } from "express";
import { GatewayError } from "../../rettssak/clients/aiGateway.js";
import { behandleAnke } from "../services/ankeService.js";
import type { AnkeErrorResponse, AnkeRequest, AnkeResponse } from "../types/anke.js";

export const ankeRouter = Router();

ankeRouter.post(
  "/anke",
  async (req: Request<unknown, AnkeResponse | AnkeErrorResponse, AnkeRequest>, res: Response<AnkeResponse | AnkeErrorResponse>) => {
    const unnskyldning = typeof req.body?.unnskyldning === "string" ? req.body.unnskyldning.trim() : "";
    const forrigeBoller = Math.round(Number(req.body?.forrigeBoller));
    const forrigeBegrunnelse = typeof req.body?.forrigeBegrunnelse === "string" ? req.body.forrigeBegrunnelse : "";
    const ankenivaa = Math.round(Number(req.body?.ankenivaa));

    if (!unnskyldning || !Number.isFinite(forrigeBoller) || forrigeBoller < 1) {
      return res.status(400).json({ error: "Anken mangler en sak å anke på. *sukk*" });
    }
    if (!Number.isFinite(ankenivaa) || ankenivaa < 1 || ankenivaa > 25) {
      return res.status(400).json({ error: "Selv Bollenes Råd har en grense. Saken er endelig avgjort." });
    }

    try {
      res.json(await behandleAnke({ unnskyldning, forrigeBoller, forrigeBegrunnelse, ankenivaa }));
    } catch (err) {
      console.error(err);
      if (err instanceof GatewayError && err.status === 401) {
        return res.status(401).json({ error: "Ankeinstansens adgangskort har utløpt. Saken utsettes på ubestemt tid." });
      }
      res.status(502).json({ error: "Ankeinstansen er på kaffepause. Prøv igjen om litt." });
    }
  },
);
