import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import { rettssakRouter } from "./features/rettssak/routes/rettssakRouter.js";

const here = path.dirname(fileURLToPath(import.meta.url));
// .env.local kan ligge i prosjektroten eller i backend/
dotenv.config({ path: path.resolve(here, "../../.env.local") });
dotenv.config({ path: path.resolve(here, "../.env.local") });

const app = express();
app.use(express.json({ limit: "100kb" }));
app.use("/api", rettssakRouter);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Bolle-retten (backend) kjører på http://localhost:${port}`);
});
