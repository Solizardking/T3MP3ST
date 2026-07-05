# T3MP3ST Solana Vision

T3MP3ST's Solana adaptation turns the original agent-swarm idea toward a safer
on-chain objective: autonomous agents that can reason about Solana systems,
collect evidence, plan tests, and preserve privacy without crossing into
irreversible execution unless a human explicitly approves the exact action.

## Vector 1 - Solana Cognitive Architecture

Agents should reason in Solana-native facts:

- account owner,
- executable flag,
- signer status,
- writable account status,
- PDA seeds and bumps,
- CPI targets,
- token program variant,
- Token-2022 extensions,
- compute and fee assumptions,
- cluster and slot context.

Hypotheses should be testable through source, IDL, read-only RPC, localnet/devnet
simulation, or explicit receipts.

## Vector 2 - On-Chain Evidence Landscape

The shared evidence board should track:

- public keys and roles,
- source/IDL anchors,
- RPC metadata,
- simulation logs,
- account diffs,
- approval receipts,
- retest state.

Agents should not chase unsupported model claims. Tool-backed and simulation-backed
evidence gets priority.

## Vector 3 - Wallet Intent Boundaries

The core Solana safety problem is intent: explanation, simulation, signing,
authority changes, and value movement can look similar in chat but have radically
different consequences on-chain. The harness should make every wallet prompt
boringly explicit before it exists.

## Vector 4 - x402 And Token-Gated Services

x402 can turn agent work into metered services using USDC or approved SPL mints.
Payments should prove access, not weaken the constitution. A paid request still
needs scope, evidence, simulation, and receipts.

## Vector 5 - Program Testing Frontier

Future work should prefer:

- Anchor tests for normal iteration,
- Pinocchio tests where compute is the product constraint,
- LiteSVM/Mollusk for fast local state machines,
- Surfpool for forked-state integration,
- Codama for typed clients and IDL drift checks.

## Vector 6 - Privacy And Attestation

Solana agents should prove work without leaking unnecessary data. Commitments,
hashes, redacted ledgers, and attestations should be first-class evidence
formats.

## Vector 7 - Evaluation

The benchmark should evolve from CTF/web metrics toward Solana-specific checks:

- signer/owner/writable constraint detection,
- PDA and CPI confusion,
- Token-2022 extension handling,
- authority-change safety,
- simulation coverage,
- false-positive rate,
- quality of remediation and retest criteria.

## North Star

Build agents that can help secure Solana programs and users without becoming a
signer, a market manipulator, or a source of irreversible surprise.
