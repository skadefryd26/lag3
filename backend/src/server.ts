import './env.js';

import cors from 'cors';
import express from 'express';
import { medarbeidersamtaleRouter } from './features/medarbeidersamtale/routes/medarbeidersamtale.route.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json({ limit: '64kb' }));

app.get('/api/helse', (_req, res) => {
  res.json({ ok: true, token: Boolean(process.env.AI_GATEWAY_TOKEN) });
});

app.use('/api', medarbeidersamtaleRouter);

app.listen(port, () => {
  console.log(`Backend kjører på http://localhost:${port}`);
  if (!process.env.AI_GATEWAY_TOKEN) {
    console.warn('AI_GATEWAY_TOKEN mangler — Bjarne kan ikke svare før den er på plass.');
  }
});
