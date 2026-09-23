import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

/**
 * Leser .env.local fra repo-roten. Importeres først i server.ts, slik at
 * AI_GATEWAY_TOKEN finnes før noe annet leser den.
 */
const her = path.dirname(fileURLToPath(import.meta.url));
const repoRot = path.resolve(her, '..', '..');

dotenv.config({ path: path.join(repoRot, '.env.local') });
