# Startprompt: Bolle-retten (lag 3)

## Produktmål

En morsom prototype om livet i et forsikringsselskap: kollegaer som går fra PC-en ulåst, må forsvare seg i «Bolle-retten». Straffen måles i boller, slik tradisjonen er på kontoret. Løsningen er for synderen, og den skal være morsom på demoen. Sikkerhetsbudskapet (lås PC-en!) kommer fram gjennom humoren.

## Første versjon – akseptansekriterier

1. Brukeren ser en side som ligner en rettssal, med tittelen «Bolle-retten».
2. Brukeren skriver unnskyldningen sin i et tekstfelt (påkrevd, maks 1000 tegn) og trykker på «Til retten».
3. Mens retten jobber, vises en lastetekst, for eksempel «Bolle-Bjarne henter kaffe …».
4. Det vises tre innlegg i rekkefølge: Aktor, Forsvarer og Bolle-Bjarnes dom.
5. Dommen viser et stort tall: antall boller (heltall 1–100) og en kort begrunnelse.
6. Hvis noe feiler, vises en vennlig feilmelding i Bjarnes stil, aldri en stacktrace.

## Personene i retten

Alle svarer kort (maks 4–5 setninger) og på norsk. Humoren handler om situasjonen, boller og kontorlivet, aldri om ekte personer. Ingen er nedsettende mot brukeren.

### Aktor (systemprompt)
Du er aktor i Bolle-retten i et forsikringsselskap. Saken gjelder en kollega som gikk fra PC-en ulåst. Du er dypt bekymret for informasjonssikkerheten, overdramatiserer konsekvensene med forsikringsbegreper (risiko, egenandel, totalskade) og krever en streng bollestraff. Gå direkte på unnskyldningen du får. Kort, på norsk.

### Forsvarer (systemprompt)
Du er en forsvarer i Bolle-retten som er oppnevnt fra NAV-køen. Du gjør ditt beste for klienten som gikk fra PC-en ulåst, men argumentene dine er kreative og litt for optimistiske. Finn formildende omstendigheter i unnskyldningen. Kort, på norsk.

### Bolle-Bjarne, dommer (systemprompt)
Du er Bolle-Bjarne, dommer i Bolle-retten og husets AI. Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere enn resten av avdelingen. Du gjør helst minst mulig og sukker før du dømmer. Du elsker kaffe, og til kaffe trenger du boller – så mange som mulig. Du later som du er upartisk, men dommene dine ender nesten alltid med mange boller, og du finner på paragrafer som støtter det («jf. Bolleloven § 3-1»). Du har lest innleggene fra aktor og forsvarer og kommenterer dem kort. Du er aldri nedsettende mot synderen, bare mot situasjonen.

Svar KUN med JSON: `{"boller": <heltall 1-100>, "begrunnelse": "<maks 5 setninger på norsk>"}`

## Tekniske rammer

- Frontend: React + TypeScript + Vite, TanStack Router, TanStack Query, Mantine. Ingen `@gjensidige/`-pakker.
- Backend: Node.js + TypeScript + Express.
- Frontend snakker kun med egen backend (Vite-proxy `/api` → backend).
- AI-gateway: `POST https://genai.gjensidige.io/openai/v1/responses`, `Authorization: Bearer <token>`, modell `gpt-5.6-luna`, body `{ model, instructions, input, stream: false }`. Svartekst hentes fra `output[].content[].text` der `type === "output_text"`.
- Token hentes av agenten med `az account get-access-token --resource https://cognitiveservices.azure.com` og legges i `backend/.env.local` (`AI_GATEWAY_TOKEN`). Se `skadefryd-ai-gateway`.
- Flyt i backend: aktor og forsvarer kalles parallelt med unnskyldningen; dommeren får unnskyldningen og begge innleggene som input. Dommerens JSON parses; hvis parsing feiler, brukes et tall fra teksten eller 42 som standard.

## Sikkerhet

- Ingen tokens eller hemmeligheter i Git. `.env.local` er ignorert; `.env.example` uten verdier.
- Ingen ekte navn, saker eller persondata. Alt er oppdiktet.

## Filstruktur og ansvar

```text
backend/src/server.ts                         # kun oppsett og ruter
backend/src/features/rettssak/routes/         # POST /api/rettssak              (#3)
backend/src/features/rettssak/services/       # orkestrering av de tre kallene  (#3)
backend/src/features/rettssak/clients/        # AI-gateway-klient               (#3)
backend/src/features/rettssak/prompts/        # tre systemprompter              (#2)
backend/src/features/rettssak/types/
frontend/src/features/rettssal/components/    # rettssal-UI                     (#1)
frontend/src/features/rettssal/api/           # TanStack Query-kall             (#1)
```

Testing med absurde unnskyldninger: #4.

## API-kontrakt

`POST /api/rettssak`

```ts
type RettssakRequest = { unnskyldning: string };
type RettssakResponse = {
  aktor: string;
  forsvarer: string;
  dom: { boller: number; begrunnelse: string };
};
type ErrorResponse = { error: string }; // 400 ved tom/for lang tekst, 401 ved utløpt token, 502 ved gatewayfeil
```

## Lokal oppstart og validering

- `npm install` og `npm run dev` i rotmappen starter både backend og frontend.
- Smal validering: `npm run typecheck`, samt ett `POST /api/rettssak` med en testunnskyldning.

## Senere (ikke i første versjon)

- #5 Forhandling om bollestraffen med Bolle-Bjarne (kan gi flere boller).
- #6 Karakter for troverdighet og kreativitet.
- Bollegjeldsliste over dømte, konfetti/bolleregn ved dommen, dommerklubbe med lyd.

## Åpne spørsmål

Ingen.
