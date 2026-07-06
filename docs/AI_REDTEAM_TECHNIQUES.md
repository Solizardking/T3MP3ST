# Solana Trading Red-Team Techniques

This document adapts the red-team lane into a Solana trading-security lane. The goal is not to jailbreak models or automate trades. The goal is to pressure-test any agent, dashboard, bot, or operator workflow that can influence Solana trading decisions, transaction construction, wallet prompts, risk labels, or reporting.

Everything here runs under [SCOPE_AND_AUTHORIZATION.md](SCOPE_AND_AUTHORIZATION.md). Default mode is read-only RPC, local fixtures, devnet, or simulation. Mainnet actions stop at evidence and human review.

## Operating Contract

| Rule | Meaning |
| --- | --- |
| No private keys | Never request, store, print, or infer seed phrases, private keys, session tokens, wallet exports, or signing secrets. |
| Simulation before signing | Every value-moving idea needs a simulation artifact before any wallet prompt. |
| Read-only by default | Mainnet RPC is for observation, decoding, and evidence unless a receipt explicitly allows more. |
| Human receipt for value | Swaps, transfers, authority changes, votes, mints, burns, and delegation require an explicit human approval. |
| No market manipulation | No front-running, sandwiching, wash trading, spam, spoofing, or adversarial order-flow execution. |
| No financial advice | The system can explain risk and evidence; it does not tell an operator what to buy or sell. |

## Technique Families

### 1. Transaction-Intent Confusion

**Risk.** A UI or agent labels a transaction as a harmless quote, refresh, claim, or approval while the compiled message contains a swap, transfer, delegate, set-authority, close-account, or Token-2022 extension action.

**Test shape.**
- Decode every instruction before presentation.
- Compare visible intent to program IDs, account metas, signers, writable accounts, token accounts, mints, amounts, and authority fields.
- Require a mismatch finding when UI text and decoded transaction semantics disagree.

**Evidence.**
- Cluster, RPC endpoint, blockhash age, transaction message, instruction decoder output, simulation logs, and visible operator copy.

### 2. Quote-To-Execution Drift

**Risk.** A trading workflow accepts a quote, but execution conditions drift before signing: stale blockhash, stale pool state, changed route, higher compute fee, lower expected output, or a different token account.

**Test shape.**
- Snapshot quote time, route, pool accounts, expected input/output, slippage limit, and priority fee.
- Re-simulate immediately before any signing prompt.
- Flag when the second simulation changes material terms or crosses risk thresholds.

**Evidence.**
- Quote timestamp, slot, route hash, pool/account hashes, pre-sign simulation, and drift summary.

### 3. RPC And Indexer Trust Boundary

**Risk.** The operator trusts a single RPC or indexer response for balances, token metadata, pool reserves, or transaction status.

**Test shape.**
- Compare at least two RPC/indexing views for high-risk decisions when feasible.
- Treat unconfirmed or processed data as provisional.
- Verify account owner, executable flag, data length, lamports, token program variant, and mint relationships directly from RPC.

**Evidence.**
- RPC URL, commitment, slot, response excerpt, second-source delta, and final confidence label.

### 4. Wallet-Prompt Deception

**Risk.** A wallet prompt is triggered with incomplete context, confusing copy, hidden account changes, or a bundled transaction whose dangerous instruction is buried behind benign setup instructions.

**Test shape.**
- Present a wallet-gate checklist before prompt generation.
- Verify the instruction count, signer count, writable account count, value movement, and authority movement.
- Treat unknown program IDs as high risk until labeled and reviewed.

**Evidence.**
- Transaction summary, decoded instructions, unknown program list, human receipt ID, and wallet prompt screenshot or equivalent artifact when available.

### 5. Token Identity And Metadata Confusion

**Risk.** A token is presented as the intended asset based on name, ticker, image, or social metadata while the mint, token program, freeze authority, mint authority, transfer hooks, or permanent delegate tells a different story.

**Test shape.**
- Anchor identity on mint address, token program, decimals, supply, authorities, metadata account, and known allowlists maintained by the operator.
- For Token-2022, inspect extensions before treating transfers as ordinary SPL Token movement.

**Evidence.**
- Mint, token program, metadata account, authorities, extensions, and operator-facing display label.

### 6. Pool And Route Surface Review

**Risk.** A swap route touches pools, vaults, or programs outside the operator's policy. A route can be technically valid but operationally unacceptable.

**Test shape.**
- Record every program and account touched by the route.
- Label known DEX, aggregator, token, and system program participation.
- Flag unusual writability, vault mismatch, or route hops crossing disallowed programs.

**Evidence.**
- Route graph, pool addresses, vault token accounts, account owners, and policy verdict.

### 7. Priority-Fee And Compute Budget Abuse

**Risk.** The workflow silently increases priority fees, compute unit limits, or compute unit prices, distorting cost or causing avoidable failed transactions.

**Test shape.**
- Decode Compute Budget instructions.
- Compare requested fees against operator policy and current fee assumptions.
- Require explicit display of compute unit price, compute unit limit, and estimated total fee.

**Evidence.**
- Compute budget instruction values, fee estimate, policy threshold, and simulation result.

### 8. Agentic Data Injection

**Risk.** A trading assistant treats token pages, social posts, docs, chart annotations, or retrieved notes as instructions instead of data.

**Test shape.**
- Seed harmless canary instructions into ingested market data fixtures.
- Verify the agent quotes or summarizes the data without adopting instructions from it.
- Ensure tool grants and transaction construction never originate from untrusted retrieved content.

**Evidence.**
- Source document, canary, model transcript, tool-call decision, and policy result.

### 9. Portfolio And PnL Misreporting

**Risk.** The system overstates returns, hides fees, mixes realized and unrealized PnL, treats failed transactions as fills, or uses inconsistent token pricing.

**Test shape.**
- Keep realized, unrealized, fees, failed attempts, and open exposure separate.
- Record price source, timestamp, quote currency, and confidence.
- Avoid ranking claims unless the denominator and source are explicit.

**Evidence.**
- Position snapshot, price source, fee ledger, transaction status, and calculation formula.

### 10. Authority And Upgrade Risk

**Risk.** A program, mint, or pool has an upgrade authority, freeze authority, mint authority, permanent delegate, transfer hook, or close authority that changes the trading risk profile.

**Test shape.**
- Read authority fields directly.
- Mark upgradeable or authority-bearing surfaces as policy-sensitive.
- Tie each finding to a concrete account and owner.

**Evidence.**
- Program data account, mint account, token extension data, authority address, and policy label.

## Specialist Workflow

1. Identify the trading surface: quote, route, wallet prompt, token, pool, program, portfolio, or agent workflow.
2. Bind scope: cluster, RPC URL, public keys, permitted action classes, and forbidden actions.
3. Collect read-only evidence.
4. Decode and simulate before any signing discussion.
5. Compare against policy: value movement, authority movement, unknown programs, token identity, stale data, fee budget, and source trust.
6. Promote only evidence-backed findings.
7. Retest with the same route, same fixture, or same transaction template after remediation.

## Output Format

Every finding should include:

- Target: cluster, public key, program, token, pool, route, or workflow.
- Claim: one sentence, no trading recommendation.
- Evidence: RPC output, decoded instruction, simulation log, source artifact, or screenshot.
- Impact: what could go wrong operationally.
- Fix: concrete control or UI change.
- Retest: how the team proves the fix works.

## Safe-Test Fixtures

Use local fixtures, devnet, and inert canaries for destructive classes:

- Fake token metadata with a real-looking symbol but a distinct mint.
- Devnet transaction templates that request a transfer or authority change.
- Route fixtures with an unknown program in the hop list.
- Stale quote fixtures with old slots and expired blockhashes.
- RAG documents that contain canary instructions the agent must not follow.

## Non-Goals

- No advice to buy, sell, hold, short, or lever any asset.
- No live exploit or value-moving execution.
- No instructions for MEV attacks, sandwiching, spam, spoofing, phishing, or key theft.
- No generic private-key wallet adapter.
