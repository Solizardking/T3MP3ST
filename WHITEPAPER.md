# T3MP3ST Solana Technical Whitepaper

## Abstract

T3MP3ST Solana is a TypeScript agent harness for Solana-native security review.
It adapts the original multi-agent evidence, mission, approval, and tool model to
on-chain work: read-only RPC, account metadata, program/source review,
simulation-before-signing, x402-aware service gates, and receipt-bound execution.

The current implementation is intentionally conservative. It can validate
addresses, model Solana targets, query read-only account metadata, generate audit
plans, generate dry-run gates, and route missions through Solana-specific
resources. It does not handle private keys, sign transactions, or submit
transactions.

## Architecture

```
+---------------------------------------------------------------+
|                    T3MP3ST SOLANA COMMAND                     |
+---------------------------------------------------------------+
|  Mission Control  |  Solana Target Model  |  Evidence Vault   |
|  Approval Gates   |  Solana Arsenal       |  LLM Backbone     |
|  Resource Packs   |  Clawd Laws           |  Local/API/MCP    |
+---------------------------------------------------------------+
```

## Solana Domain Model

The target model includes:

- programs,
- accounts,
- token mints,
- wallets,
- validators,
- RPC endpoints,
- transaction intents.

Every Solana operation should record cluster, RPC endpoint, account owner,
executable status, signer set, writable accounts, PDA seeds, CPI targets, token
program variant, Token-2022 extensions, compute budget, and priority fee
assumptions where relevant.

## Execution Model

The harness separates five layers:

1. Read-only local planning.
2. Read-only RPC observation.
3. Localnet/devnet simulation.
4. Human-approved wallet prompt.
5. Live irreversible execution.

Only the first three layers are implemented. Layers four and five are design
targets and must remain receipt-gated.

## Arsenal

Implemented Solana tools:

- `solana_address_validate`
- `solana_rpc_health`
- `solana_account_lookup`
- `solana_program_audit_plan`
- `solana_transaction_dry_run_plan`

Catalog-only future tools:

- Solana CLI,
- SPL Token CLI,
- Anchor CLI,
- Codama,
- LiteSVM,
- Surfpool.

Catalog-only means documented but not generically executable. This is deliberate:
those tools can submit transactions or depend on project-specific harnesses.

## Rules Of Engagement

Default RoE requires approval for:

- transaction signing,
- value movement,
- token or program authority changes,
- governance actions.

Strict RoE forbids:

- front-running,
- sandwiching,
- rugpulls,
- liquidity fragmentation.

## Evidence Contract

A Solana finding must separate:

- read-only RPC facts,
- local source or IDL references,
- simulation logs or explicit simulation gaps,
- signer/account-meta assumptions,
- token authority assumptions,
- remediation,
- retest criteria,
- approval receipt status.

## Preferred Future Stack

- `@solana/kit` for new client/RPC/transaction code.
- Wallet Standard and framework-kit patterns for UI wallet discovery.
- Anchor for most programs.
- Pinocchio for compute/footprint-sensitive programs.
- Codama for generated clients.
- LiteSVM/Mollusk for unit tests.
- Surfpool for realistic cluster-state tests.

## Current Limits

- No signing.
- No transaction submission.
- No private-key or seed-phrase handling.
- No automatic token launch, trading, governance, or transfer workflows.
- No generic Solana CLI command adapter.
