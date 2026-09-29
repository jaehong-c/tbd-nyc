# TBD.NYC (To Be Developed)

NYC repositioning feasibility suite. Pull any New York City lot from public
records, test what it can become, and underwrite the winning scenario.

Four modules, one decision path:

| Route | Module | Question |
| --- | --- | --- |
| `/zoning` | Zoning | What can this lot become? |
| `/hbu` | HBU | Which use is worth the most? |
| `/proforma` | Pro Forma | Does it pencil, and when? |
| `/wire` | NYC Wire | What changed this week? |

Every number comes from published rules over public data (MapPLUTO, NYC
Open Data). The language model writes the rationale and the news digest; it
never touches a figure.

## Stack

Next.js (App Router, JavaScript), Tailwind v4, Anthropic API via direct
fetch on server routes, Vercel Blob for the daily Wire edition, Vercel Cron.

## Run

```
npm install
npm run dev
```

Environment variables (Vercel and `.env.local`):

- `ANTHROPIC_API_KEY`
- `BLOB_READ_WRITE_TOKEN`
- `CRON_SECRET`

## Status

All four modules live: Zoning (live PLUTO and GeoSearch), HBU (three
scenarios, land residual, rationale memo), Pro Forma (quarterly cash flow,
capital calls, sensitivity, Excel export with live formulas), NYC Wire (daily
digest). Method notes in docs/hbu-method.md.
