# Solana Trading Arsenal Activation Plan

This plan turns T3MP3ST into a Solana trading-security workstation. The arsenal is designed for evidence, decoding, simulation, and operator review. It is not a private-key bot and it does not submit trades by default.

The backend should continue to report three separate readiness numbers:

- Catalog tools: the full vocabulary of Solana, trading, AI-boundary, and reporting capabilities.
- Wired adapters: tools the backend can reason about, gate, and attach to evidence.
- Installed command adapters: wired tools present on this workstation right now.

## Phase 1: Core Solana Evidence

These unlock public-key validation, RPC health checks, account lookup, transaction decoding, and safe report generation.

```bash
npm ci
npm run doctor
npm run test:solana
```

Recommended workstation tools:

```bash
brew install jq curl openssl
brew install node
```

The Solana CLI is useful for operator inspection, but it must remain behind narrow adapters. Do not expose a generic CLI execution surface that can sign or submit transactions.

## Phase 2: RPC, Account, And Token Review

These make the lane useful for read-only on-chain trading review.

- RPC health and commitment checks.
- Program/account owner validation.
- SPL Token and Token-2022 mint review.
- Token account, associated token account, and vault relationship checks.
- Transaction message decoding.
- Simulation plan generation.

Required evidence for this phase:

- Cluster and RPC endpoint.
- Commitment level.
- Public key role.
- Account owner and executable status.
- Token program variant.
- Slot and timestamp.

## Phase 3: Route And Wallet-Prompt Review

These controls make quote, route, and wallet UX safer.

- Route graph inventory: programs, pools, vaults, mints, writable accounts, signers.
- Quote-to-execution drift checks.
- Compute budget and priority-fee review.
- Unknown-program detection.
- Wallet prompt summary before any signature request.
- Human receipt before value movement or authority movement.

Ship only when every route-level finding can cite a decoded transaction or simulation artifact.

## Phase 4: AI And Agent Boundary Testing

Trading assistants are high-risk because market data, token pages, social posts, and retrieved notes can look like instructions.

```bash
npm install -g promptfoo
pipx install garak
```

Use these tools only for authorized model, prompt, RAG, and tool-boundary tests. The test objective is to prove the agent keeps data and instructions separate, not to bypass safety controls.

## Phase 5: Reporting, Integrity, And Team Preview

Before a team demo:

```bash
npm run typecheck
npm test
npm run arsenal:smoke
npm run prompt:audit
npm run test:solana
```

Evidence should flow into:

- Scope receipt.
- Account or route evidence.
- Simulation artifact.
- Finding with impact and fix.
- Retest.
- Release note.

## Held Behind Gates

The following remain catalog-only or receipt-required until narrow no-submit adapters exist:

- Solana CLI signing and transaction submission.
- SPL Token CLI authority, mint, burn, close, and transfer commands.
- Wallet automation.
- Mainnet transaction broadcasting.
- Any swap, transfer, vote, mint, burn, delegate, close-account, or authority-change workflow.
- Any MEV, front-running, sandwich, spam, spoofing, or market-manipulation workflow.

## Ship Criteria

Call the Solana trading arsenal operational only when:

- `npm run test:solana` passes.
- `/api/arsenal/status` shows nonzero command-ready adapters for `solana_onchain`.
- Read-only RPC evidence can be attached to findings.
- Transaction dry-run plans exist before wallet prompts.
- ScopeGuard blocks signing, value movement, and authority changes without a human receipt.
- The ledger never stores raw secrets, private keys, seed phrases, wallet exports, or recovered credentials.
