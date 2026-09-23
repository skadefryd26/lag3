# Skadekø — lag 3

## Idéen

**Skadekø** er et spill om en helt vanlig arbeidsdag på skadeavdelingen. Skadesaker daler ned på
skrivebordet ditt — «Mobil i fondueen», «Måke stjal lommeboka», «Vaffeljern i protest» — og du må
klikke dem unna før kunden går lei. Mister du tre kunder, er du offisielt sykmeldt.

Over det hele sitter **Bjarne**, husets AI og din nærmeste leder. Han hjelper ikke. Han observerer.
Og når arbeidsdagen er over, kaller han deg inn til **medarbeidersamtale**.

- **Hvem den hjelper:** skadebehandleren som trenger å le av arbeidsdagen sin — og alle andre som
  vil finne ut hvordan det egentlig er å sitte i skadekøen.
- **Forsikringsvinkelen:** skadesaker, kunder som går til konkurrenten, saksbehandlingstid.
- **Den overdrevne AI-bruken:** Bjarne får ikke bare tallene dine. Han får hele CV-en for dagen —
  hvilke saker du bommet på, hvor raskt du var, hvor mange kunder som stakk — og skriver en
  medarbeidersamtale som er knusende uansett hvor bra du gjorde det.

## Agenten

**Bjarne** — svært kompetent, selvsikker, litt arrogant, overbevist om at han er smartere enn resten
av avdelingen. Sukker før han hjelper. Elsker kaffe.

**Vrien vår:** Bjarne er din nærmeste leder, og han har aldri behandlet en skadesak i sitt liv. Han
har derimot lest alle KPI-ene. Han er *dypt* uimponert, og han har sterke meninger om
saksbehandlingstid han selv aldri har målt på egen kropp.

## Første versjon

1. Brukeren stempler inn og spiller Skadekø i nettleseren.
2. Når dagen er over (tre tapte kunder), sender frontend dagens statistikk til backend.
3. Backend legger ved Bjarnes systemprompt og kaller Gjensidiges AI-gateway.
4. Medarbeidersamtalen vises i game over-skjermen, i Bjarnes stemme.

## Arbeidsdeling

Første versjon er delt i fire deler, én per oppgave på tavla:

- **Spillet på skjermen** — selve Skadekø i React.
- **Bjarnes personlighet** — systemprompten, tonen, hva han faktisk sier.
- **Gateway-integrasjonen** — backend-endepunktet og kallet til AI-gatewayen.
- **Medarbeidersamtalen på skjermen** — hvordan resultatet presenteres, venting og feil.

Hvem som tar hva bestemmer laget selv.

## Beslutninger tatt

- Frontend: React + TypeScript + Vite + Mantine + TanStack Query.
- Backend: Node.js + TypeScript + Express.
- Spillet kjører i frontend. Ingen spill-logikk i backend.
- Tokenet ligger kun i backend, i `.env.local`. Nettleseren ser det aldri.
- Den opprinnelige prototypen `skadespill.html` er beholdt i repoet som referanse.

## Idéer til senere

Ligger som `idé`-issues på tavla.

---

Full brief for kodeagenter: `.ai/startprompt.md`
