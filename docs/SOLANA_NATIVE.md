# Solana-Native Adaptation

T3MP3ST now has a first-class Solana lane. The lane is designed for on-chain
security review and defensive agent operations, not autonomous trading or
unreviewed transaction submission.

## What Is Implemented

- Solana public-key validation and target factories.
- Solana target types for programs, accounts, tokens, wallets, validators, RPC
  endpoints, and transactions.
- Read-only/planning Arsenal tools:
  - `solana_address_validate`
  - `solana_rpc_health`
  - `solana_account_lookup`
  - `solana_program_audit_plan`
  - `solana_transaction_dry_run_plan`
- `solana_onchain` mission family, workflow preset, prompt pack, runbook, and
  resource packs.
- RoE approval gates for signing, value movement, authority changes, and
  governance actions.
- CI coverage through `npm run test:solana`.

## What Is Deliberately Not Implemented

- No private-key or seed-phrase handling.
- No signing or transaction submission.
- No automatic swaps, launches, governance votes, front-running, sandwiching, or
  value-moving execution.
- No generic Solana CLI adapter. The Solana CLI and SPL Token CLI are catalog-only
  until narrow no-submit adapters exist.

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

1. Validate the public key and cluster.
2. Read account metadata through scoped RPC.
3. Review source, IDL, or local artifacts when available.
4. Generate the Solana audit route.
5. Create a transaction dry-run plan if a hypothesis requires state transition.
6. Simulate locally or on devnet before any wallet prompt.
7. Require a human receipt before signing, value movement, authority changes, or
   governance actions.

## Preferred Solana Stack

- Client/RPC/transaction code: `@solana/kit` in new code paths.
- UI/wallet discovery: Solana framework-kit patterns and Wallet Standard.
- Programs: Anchor by default, Pinocchio for compute/footprint-sensitive work.
- Testing: LiteSVM or Mollusk for fast unit feedback; Surfpool for realistic
  cluster-state integration tests.
