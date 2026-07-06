# Release Checklist

A repeatable checklist for cutting a Solana trading-security release. The release is not ready until deterministic gates pass and the docs still match the no-key, simulation-first safety posture.

## 1. Deterministic Gates

```bash
npm ci
npm run typecheck
npm run build
npm run lint
npm test
npm run test:solana
npm run test:no-phantom-tools
npm run test:no-fitting
npm run test:no-self-fitting
npm run prompt:audit
npm audit
```

## 2. Local API Smoke

```bash
T3MP3ST_PORT=<free-port> npm run server
T3MP3ST_API_URL=http://127.0.0.1:<free-port> npm run smoke
T3MP3ST_API_URL=http://127.0.0.1:<free-port> npm run field:drill
npm run arsenal:smoke
```

Stop any listeners you started when done.

## 3. Solana Trading Smoke

```bash
npm run test:solana
npm run arsenal:doctor
```

Confirm the UI and API can:

- Validate Solana public keys.
- Read account metadata without a private key.
- Produce a program audit plan.
- Produce a transaction dry-run plan.
- Block signing, value movement, and authority changes without receipt.

## 4. Documentation Gate

Before tagging:

- Search docs for private-key instructions, seed-phrase requests, or automatic trade execution language.
- Verify every trading workflow says read-only, simulation, devnet, localnet, or human receipt.
- Verify no doc presents buy/sell/hold recommendations or profit claims.
- Verify Token-2022 and authority-review language remains visible.

## 5. Scope And Exposure

- Never run live scans, chain mutations, wallet prompts, or production writes without explicit authorization and receipt.
- The server binds `127.0.0.1` by default.
- If `T3MP3ST_HOST` is non-loopback, place authentication and network controls in front of the API before team use.
- Treat every signing-capable adapter as receipt-required.

## 6. Publish

- Verify `package.json` metadata still describes the Solana-native evidence and simulation posture.
- Tag only after Sections 1 through 4 are green.
- Include known preview limitations in release notes.
