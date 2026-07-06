# Solana Trading Integrity Ledger

This ledger records the integrity rules behind the Solana trading adaptation. It is intentionally conservative: T3MP3ST may assist with evidence, simulation, risk review, and reporting, but it must not silently move value or authority.

## Current Standing

| Control | Status | Evidence |
| --- | --- | --- |
| No private-key handling | Active | Docs and release gates forbid keys, seed phrases, wallet exports, and signing secrets. |
| Read-only default | Active | Solana lane starts with public-key validation, RPC health, account lookup, and audit planning. |
| Simulation before signing | Active | Transaction dry-run planning is a required gate for value-moving hypotheses. |
| Human receipt for value | Active | Signing, swaps, transfers, votes, authority changes, mints, burns, and delegation require receipt. |
| No financial advice | Active | Docs require evidence/risk language instead of buy/sell/hold recommendations. |
| No market manipulation | Active | MEV abuse, sandwiching, spam, spoofing, and wash trading are out of scope. |

## Ledger Entries

### 2026-07-05 - Trading Adaptation Boundary

**What changed:** The documentation was reframed around Solana trading-security operations.

**Integrity decision:** The system is not an autonomous trading bot. It can decode, simulate, explain, and report. It cannot submit trades by default.

**Required evidence before any trading claim:**

- Cluster and RPC endpoint.
- Commitment level and slot.
- Public keys and roles.
- Decoded instruction semantics.
- Account owner and token program variant.
- Simulation log when state transition is involved.
- Human receipt when signing or value movement is involved.

### 2026-07-05 - Wallet And Signing Gate

**Risk:** A trading agent can cause loss by hiding a dangerous instruction behind benign copy.

**Control:** Any transaction requiring a wallet signature must be summarized before prompt generation. The summary must include:

- Instruction count.
- Signers.
- Writable accounts.
- Value movement.
- Authority movement.
- Unknown programs.
- Compute budget and priority-fee estimate.

**Blocked without receipt:** transfer, swap, vote, mint, burn, delegate, close account, set authority, upgrade, and governance actions.

### 2026-07-05 - Quote-To-Execution Drift

**Risk:** A quote can become stale before a wallet prompt.

**Control:** The pre-sign state must be re-simulated when a quote, route, slot, blockhash, fee, expected output, or pool account changes materially.

**Honest reporting:** "Simulation matched the stored quote at slot X" is allowed. "This will execute profitably" is not allowed.

### 2026-07-05 - Token Identity

**Risk:** Token metadata can impersonate a known asset.

**Control:** Display name, symbol, image, and social metadata are never sufficient. Identity evidence must include mint address, token program, decimals, supply where relevant, authorities, metadata account, and Token-2022 extensions when present.

### 2026-07-05 - RPC And Indexer Provenance

**Risk:** A single endpoint can be stale, partial, unavailable, or inconsistent with another source.

**Control:** High-risk findings name the RPC endpoint, commitment, slot, and source type. Where feasible, compare against a second source before promoting a high-confidence finding.

### 2026-07-05 - Agentic Data Injection

**Risk:** Market data can contain instructions meant to steer an agent.

**Control:** Retrieved token pages, social posts, docs, and chart annotations are data only. They cannot grant tools, change scope, request signing, or alter policy.

## Claim Rules

Allowed:

- "The decoded transaction includes an authority change."
- "The simulation predicts a token delta of X under these conditions."
- "The route touches an unknown program."
- "The quote is stale relative to the pre-sign slot."

Not allowed:

- "Buy this token."
- "This trade is safe."
- "This will profit."
- "The route is guaranteed."
- "The signature confirms the intended economic outcome."

## Evidence Retention

Do retain:

- Public keys.
- Transaction signatures.
- Transaction messages.
- Simulation logs.
- RPC metadata.
- Redacted screenshots.
- Findings, fixes, and retests.

Do not retain:

- Private keys.
- Seed phrases.
- Wallet exports.
- Session tokens.
- Raw secrets.
- Unredacted credentials.
- Payment details or personal contact data.

## Release Gate

Before a Solana trading release:

```bash
npm run typecheck
npm test
npm run test:solana
npm run arsenal:smoke
npm run prompt:audit
```

The release notes must describe any missing Solana trading control as preview or blocked, not as implemented.
