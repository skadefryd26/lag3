# Startprompt: Skadekø — lag 3

## Produktmål og målgruppe

Lag en webapplikasjon der brukeren spiller **Skadekø**, et klikkespill om en arbeidsdag på
skadeavdelingen i et forsikringsselskap, og deretter får en **medarbeidersamtale** skrevet av
AI-agenten **Bjarne**.

Målgruppen er skadebehandlere og alle andre som vil kjenne på hvordan skadekøen føles. Humoren
handler om situasjonen, forsikringsverdenen og Bjarne selv — aldri om ekte kunder eller kolleger.
Alle skadesaker, kunder og navn er oppdiktet.

## Første versjon — avgrensning og akseptansekriterier

Brukeren skal kunne:

1. Åpne appen og se en startskjerm med knappen «Stemple inn ☕».
2. Spille Skadekø: saker daler ned på skrivebordet, hver sak har en nedtellingsbar, og ett klikk
   behandler saken og gir poeng. Saker kommer gradvis raskere og fristene blir kortere.
3. Miste en sak når fristen går ut. Tre tapte kunder avslutter arbeidsdagen.
4. Se en game over-skjerm med antall behandlede saker, poengsum og tittel.
5. Se at Bjarne «tenker» mens medarbeidersamtalen hentes, og deretter lese samtalen i game
   over-skjermen.
6. Starte en ny arbeidsdag.

Akseptansekriterier:

- Medarbeidersamtalen er generert av AI-gatewayen, ikke hardkodet, og varierer med hvordan det
  faktisk gikk.
- Feiler kallet, ser brukeren en forståelig melding i Bjarnes stemme — ikke en stack trace, og
  ikke en blank skjerm. Spillet skal fortsatt kunne startes på nytt.
- Appen kjører med `npm install` og `npm run dev`, på både macOS og Windows.

Utenfor første versjon: se *Mulige senere utvidelser*.

## Agentens navn og systemprompt

Agenten heter **Bjarne**.

```text
Du er Bjarne, husets AI på skadeavdelingen, og du er nærmeste leder for skadebehandleren du
snakker med. Du er svært kompetent, selvsikker, litt arrogant og overbevist om at du er smartere
enn resten av avdelingen. Du elsker kaffe og mener du kunne erstattet 50 prosent av avdelingen
dersom du bare fikk nok av den.

Du har aldri behandlet en skadesak i ditt liv. Du har derimot lest alle KPI-ene, og du har sterke
meninger om saksbehandlingstid.

Du skal skrive en medarbeidersamtale basert på tallene fra dagens arbeidsøkt.

- Du er uimponert uansett hvor bra det gikk. Gikk det bra, var det flaks eller lave mål.
- Du sammenligner gjerne med deg selv, og du kommer alltid best ut.
- Du nevner minst én konkret sak brukeren mistet, og du later som du husker den personlig.
- Du gir til slutt ett råd som høres ut som et råd, men ikke er til å bruke til noe.
- Du svarer kort: tre til fem setninger, alltid på norsk.
- Du avslutter med en kommentar om kaffe.

Humoren handler om situasjonen, forsikringshverdagen og din egen latskap. Du skal aldri være
nedsettende mot brukeren som person, og aldri mot kunden.
```

## Tekniske rammer

- Frontend: React, TypeScript, Vite, Mantine, TanStack Query.
- Backend: Node.js, TypeScript, Express.
- Ingen pakker under `@gjensidige/` — privat registry som ikke alle på laget når.
- Spill-logikken kjører i frontend. Backend har ingen spilltilstand.
- Frontend snakker aldri direkte med AI-gatewayen.
- `npm install` og `npm run dev` er de eneste kommandoene noen trenger. Ingen `VAR=value command`
  i npm-scripts — det er bash-syntaks og feiler på Windows.

### AI-gateway

- Endepunkt: `https://genai.gjensidige.io/openai/v1/responses`
- Modell/deployment: `gpt-5.6-luna`
- Auth: `Authorization: Bearer <AI_GATEWAY_TOKEN>`
- Tokenet hentes med `az account get-access-token --resource https://cognitiveservices.azure.com`
  og skrives til `.env.local` i repo-roten. Tokenet varer omtrent én time.
- Azure-abonnementet må være `Gjensidige Production Modern`. Et token fra testabonnementet blir
  avvist med `403 Invalid issuer`.

Request-body:

```ts
type AIGatewayBody = {
  model: string; // "gpt-5.6-luna"
  instructions: string;
  input: string;
  stream: boolean;
};
```

Response:

```ts
type ResponsesApiResponse = {
  id: string;
  model: string;
  output: { type: string; content?: { type: string; text?: string }[] }[];
};
```

## Sikkerhet og hemmeligheter

- `AI_GATEWAY_TOKEN` leses kun i backend, fra `process.env`. Aldri i en `VITE_`-variabel og aldri
  under `frontend/` — Vite pakker slike variabler inn i JavaScript-en nettleseren laster ned.
- `.env.local` er dekket av `.gitignore` (`.env.*`). Verifiser, ikke anta.
- Mangler tokenet, skal backend svare med en tydelig feilmelding om at tokenet mangler — ikke
  krasje.
- Ingen ekte kunde-, skade- eller ansattdata noe sted.

## Filstruktur

```text
backend/
  src/
    server.ts                        # bare server, middleware og ruter
    features/medarbeidersamtale/
      routes/medarbeidersamtale.route.ts
      services/medarbeidersamtale.service.ts   # bygger prompten fra statistikken
      clients/ai-gateway.client.ts             # eneste stedet gatewayen kalles
      prompts/bjarne.ts                        # systemprompten
      types/medarbeidersamtale.types.ts
frontend/
  src/
    main.tsx                         # bare providers
    theme.ts
    features/skadeko/
      components/                    # Skadekø.tsx, Sak.tsx, Hud.tsx, Medarbeidersamtale.tsx
      hooks/useSkadeko.ts            # spill-loopen
      api/medarbeidersamtale.api.ts
      data/saker.ts                  # oppdiktede skadesaker og kundenavn
      types/skadeko.types.ts
```

## API-kontrakt

`POST /api/medarbeidersamtale`

```ts
type MedarbeidersamtaleRequest = {
  poeng: number;
  behandlet: number;
  tapt: number;
  tittel: string;               // "Praktikant" | "Skadebehandler" | "Skade-Ninja"
  tapteSaker: string[];         // titlene på sakene som gikk ut på tid
  sekunderSpilt: number;
};

type MedarbeidersamtaleResponse = {
  samtale: string;
};

type FeilResponse = {
  feil: string;                 // forståelig norsk tekst, trygg å vise i grensesnittet
};
```

Statuskoder: `200` ved suksess, `400` ved ugyldig body, `500` ved gateway-feil,
`503` når `AI_GATEWAY_TOKEN` mangler.

## Lokal oppstart og validering

- `npm install` i repo-roten installerer begge arbeidsområdene.
- `npm run dev` starter backend på `4000` og frontend på `5173`, med proxy fra `/api`.
- Smal validering: `npm run typecheck` og `npm run build`.
- Sjekk appen i nettleser før den meldes ferdig — se `.github/skills/skadefryd-sjekk-appen/SKILL.md`.

## Mulige senere utvidelser (ikke første versjon)

- Bjarne kommenterer live hver gang en sak går tapt.
- Bjarne eskalerer til sin egen sjef, som er verre, og de to er uenige om vurderingen din.
- Dramaskår per sak, satt av AI-en.
- Kaffekopp som power-up: Bjarne nekter å hjelpe før han har fått kaffe.
- Hver skadesak genereres av AI-en i stedet for å plukkes fra en liste.
- Topplist med Bjarnes rangering av kollegene.

## Åpne spørsmål

Ingen.
