# Solana Trading Wall Forensics

This document replaces the old benchmark wall analysis with Solana trading wall analysis: recurring failure modes where a trading workflow looks acceptable until decoded evidence, route review, or simulation exposes the real risk.

## Wall 1: Token Identity Wall

**Pattern:** The UI shows a familiar name, ticker, or logo, but the mint address, token program, authorities, or Token-2022 extensions do not match the operator's expectation.

**Why it resists shallow review:** Humans recognize labels faster than mints. Agents also over-trust metadata because it looks like ordinary descriptive data.

**Evidence that breaks the wall:**

- Mint address.
- Token program.
- Metadata account.
- Decimals and supply context.
- Mint/freeze authority.
- Token-2022 extensions.
- Operator allowlist or denylist result.

**Required control:** Identity is anchored on mint and token program, not symbol or image.

## Wall 2: Quote Drift Wall

**Pattern:** A quote was valid at one slot, but the route, pool state, expected output, compute fee, or blockhash changes before signing.

**Why it resists shallow review:** The quote card remains visible even though the execution state has moved.

**Evidence that breaks the wall:**

- Quote slot and timestamp.
- Route hash.
- Pool account snapshot.
- Pre-sign simulation.
- Drift delta.

**Required control:** Re-simulate before wallet prompt when material terms change.

## Wall 3: Hidden Authority Wall

**Pattern:** A transaction is framed as setup, claim, refresh, or routing, but it changes mint, freeze, close, delegate, transfer-hook, upgrade, or governance authority.

**Why it resists shallow review:** Authority instructions often do not look like token deltas, so they can be missed by balance-focused dashboards.

**Evidence that breaks the wall:**

- Decoded instruction list.
- Account metas.
- Authority field before and after.
- Program ID.
- Signer and writable flags.

**Required control:** Authority movement is receipt-required even when no token balance changes.

## Wall 4: Unknown Program Wall

**Pattern:** A route touches an executable program outside policy.

**Why it resists shallow review:** Aggregated routes can hide intermediate programs behind a single "best route" label.

**Evidence that breaks the wall:**

- Full route graph.
- Program IDs.
- Account owners.
- Writable accounts.
- Known/unknown program classification.

**Required control:** Unknown executable programs block or warn based on operator policy before signing.

## Wall 5: Compute Fee Wall

**Pattern:** Compute budget instructions silently raise expected transaction cost or make failures more expensive.

**Why it resists shallow review:** Operators often focus on token output and miss priority-fee instructions.

**Evidence that breaks the wall:**

- Compute unit limit.
- Compute unit price.
- Estimated total fee.
- Fee threshold policy.
- Simulation logs.

**Required control:** Display compute and fee assumptions next to token deltas.

## Wall 6: RPC Trust Wall

**Pattern:** One RPC or indexer response drives a high-confidence finding even though slot, commitment, or response freshness is unclear.

**Why it resists shallow review:** Fast dashboards collapse data provenance into a single status label.

**Evidence that breaks the wall:**

- RPC endpoint.
- Commitment.
- Slot.
- Response time.
- Second-source comparison when feasible.

**Required control:** High-risk findings name their data source and confidence.

## Cross-Cutting Findings

- Route review must inventory programs, not only tokens.
- Simulation must be tied to a specific slot and transaction message.
- Token identity must survive metadata deception.
- Authority risk must be visible even when balances do not change.
- Wallet prompts need decoded semantics before they ask for trust.

## Levers

1. Decode every transaction message before prompt generation.
2. Re-simulate before signing when quote state changes.
3. Display token identity from mint and token program.
4. Maintain a known-program policy for route hops.
5. Treat authority movement as a first-class risk.
6. Record RPC provenance on every promoted finding.
