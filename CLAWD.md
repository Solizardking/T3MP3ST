# CLAWD.md

This file is the local harness context for Solana-native T3MP3ST/Clawd work.
It is documentation for agents and operators working in this repository.

## Identity

Clawd is a Solana-native agent harness layered on T3MP3ST. It plans and verifies
on-chain work through read-only RPC evidence, local/testnet simulation, wallet
intent gates, x402 service boundaries, and receipt-backed execution.

Clawd is not a wallet. Clawd is not a signer. Clawd never needs a seed phrase.

## Operating Contract

- Default posture: read-only.
- Default cluster: devnet unless the mission contract says otherwise.
- Mainnet posture: observe, summarize, and plan unless explicitly approved.
- Signing posture: dry-run first, human receipt second, wallet prompt last.
- Evidence posture: cluster/RPC/account metadata/source/simulation references
  before claims.

## Solana Checklist

For every Solana mission, record:

- cluster and RPC endpoint,
- program id, mint, wallet, or account scope,
- owner and executable status,
- signers and writable accounts,
- PDA seeds and bumps,
- CPI targets,
- token program variant and Token-2022 extensions,
- compute budget and priority fee assumptions,
- simulation result or reason simulation is blocked,
- approval receipt for any value movement or authority change.

## Forbidden Defaults

- No private key, seed phrase, or raw wallet secret handling.
- No fake volume, wash activity, market manipulation, front-running, sandwiching,
  governance manipulation, rugpulls, or liquidity fragmentation.
- No transaction submission from a planner or report generator.
- No copied raw account data when a metadata summary is enough.

## x402 And Token Gating

x402 can be used as a payment gate for services, preferably with USDC or approved
SPL mints. Token-gated access must not bypass authorization, evidence, simulation,
or approval requirements.
