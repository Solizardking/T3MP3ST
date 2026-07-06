# Solana-Native Trading Adaptation

T3MP3ST now has a first-class Solana trading-security lane. The lane is designed for read-only RPC evidence, transaction decoding, route review, simulation gates, wallet-prompt safety, and defensive reporting. It is not an autonomous trading bot and it does not submit transactions by default.

## What Is Implemented

- Solana public-key validation and target factories.
- Solana target types for programs, accounts, tokens, wallets, validators, RPC endpoints, transactions, routes, and mints.
- Read-only and planning Arsenal tools:
  - `solana_address_validate`
  - `solana_rpc_health`
  - `solana_account_lookup`
  - `solana_program_audit_plan`
  - `solana_transaction_dry_run_plan`
- `solana_onchain` mission family, workflow preset, prompt pack, runbook, and resource packs.
- Trading-specific gates for quote drift, wallet prompts, compute budget, token identity, unknown route programs, and authority movement.
- Rules of engagement gates for signing, value movement, authority changes, governance actions, and production writes.
- CI coverage through `npm run test:solana`.

## What Is Deliberately Not Implemented

- No private-key or seed-phrase handling.
- No signing or transaction submission by default.
- No automatic swaps, launches, governance votes, transfers, mints, burns, delegation, or authority changes.
- No front-running, sandwiching, spam, spoofing, wash trading, or market manipulation.
- No financial advice.
- No generic Solana CLI adapter. The Solana CLI and SPL Token CLI are catalog-only until narrow no-submit adapters exist.

## Environment

```bash
T3MP3ST_SOLANA_CLUSTER=devnet
T3MP3ST_SOLANA_RPC_URL=https://api.devnet.solana.com
T3MP3ST_SOLANA_WS_URL=wss://api.devnet.solana.com
T3MP3ST_SOLANA_COMMITMENT=confirmed
T3MP3ST_SOLANA_TOKEN_GATE_MINT=
T3MP3ST_X402_GATEWAY_URL=
T3MP3ST_X402_ACCEPTED_MINTS=
```

## Review Flow

1. Validate public keys and cluster.
2. Bind RPC endpoint, websocket endpoint, and commitment.
3. Read account metadata through scoped RPC.
4. Identify token program variant: SPL Token or Token-2022.
5. Review source, IDL, route fixture, or local artifacts when available.
6. Decode the transaction or route.
7. Generate the Solana audit route.
8. Create a transaction dry-run plan if a hypothesis requires state transition.
9. Simulate locally or on devnet before any wallet prompt.
10. Require a human receipt before signing, value movement, authority changes, governance actions, or production writes.

## Trading Risk Checks

- Quote freshness and slot drift.
- Blockhash expiry.
- Route hop inventory.
- Unknown executable programs.
- Signers and writable accounts.
- Token mint identity.
- Token-2022 extensions.
- Mint, freeze, close, delegate, transfer-hook, permanent-delegate, and upgrade authorities.
- Compute unit limit, compute unit price, and estimated fee.
- Expected token deltas.
- RPC/indexer provenance.

## Preferred Solana Stack

- Client/RPC/transaction code: `@solana/kit` in new code paths.
- UI/wallet discovery: Solana framework-kit patterns and Wallet Standard.
- Legacy compatibility: keep `@solana/web3.js` behind adapter boundaries when required.
- Programs: Anchor by default, Pinocchio for compute/footprint-sensitive work.
- Testing: LiteSVM or Mollusk for fast unit feedback; Surfpool for realistic cluster-state integration tests.
