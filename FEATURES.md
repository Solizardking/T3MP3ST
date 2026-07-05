# T3MP3ST Solana Feature Matrix

Legend:

- `[x]` implemented
- `[~]` partial or planning-only
- `[ ]` planned

## Solana Core

- [x] Solana public-key validation
- [x] Cluster normalization for `mainnet-beta`, `devnet`, `testnet`, and `localnet`
- [x] Explorer URL generation
- [x] Deterministic Solana mission receipt hashes
- [x] Read-only Solana JSON-RPC helper
- [x] Solana runtime config defaults
- [x] Environment template entries for Solana RPC, websocket, commitment, token gate, and x402 settings
- [ ] `@solana/kit` transaction builders for receipt-gated future signing flows

## Target Model

- [x] `solana_program`
- [x] `solana_account`
- [x] `solana_token`
- [x] `solana_wallet`
- [x] `solana_validator`
- [x] `solana_rpc`
- [x] `solana_transaction`
- [x] Solana program/account/token/RPC target factories
- [x] Evidence types for RPC responses, transaction simulations, and attestations

## Arsenal

- [x] `solana_address_validate`
- [x] `solana_rpc_health`
- [x] `solana_account_lookup`
- [x] `solana_program_audit_plan`
- [x] `solana_transaction_dry_run_plan`
- [~] Solana CLI catalog entry
- [~] SPL Token CLI catalog entry
- [~] Anchor CLI catalog entry
- [~] Codama catalog entry
- [~] LiteSVM catalog entry
- [~] Surfpool catalog entry
- [ ] Narrow no-submit Solana CLI adapters
- [ ] Project-aware Anchor/Pinocchio test adapters

## Mission And Routing

- [x] `solana_onchain` mission family
- [x] Solana guided workflow preset
- [x] Solana prompt pack
- [x] Solana operator runbook
- [x] Solana resource packs
- [x] Solana address task seeding instead of DNS/port/web tasks
- [x] RoE approval gates for signing, value movement, authority changes, and governance actions
- [x] Forbidden strict-mode techniques for front-running, sandwiching, rugpulls, and liquidity fragmentation

## Safety And Privacy

- [x] Read-only default posture
- [x] Mainnet read-only default
- [x] Simulation-before-signing policy
- [x] Human receipt requirement before irreversible on-chain actions
- [x] No private-key or seed-phrase handling
- [x] Account data summarized rather than copied by `solana_account_lookup`
- [x] Three on-chain laws
- [x] Clawd constitution and harness context

## Tests And CI

- [x] `src/__tests__/solana.test.ts`
- [x] `npm run test:solana`
- [x] CI runs Solana tests before the full suite

## Still Existing From The Original Harness

- [x] LLM provider abstraction
- [x] Local-agent integration
- [x] Mission control and task queue
- [x] Evidence vault
- [x] Approval controller
- [x] API server and War Room
- [x] Existing web/security benchmark artifacts

These remain for compatibility and future cross-domain work, but the primary
adaptation surface is Solana on-chain review.
