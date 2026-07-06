# Solana Trading Baseline

This file keeps the legacy `XBOW_BASELINE.md` name for compatibility. The Solana trading lane does not use XBOW as a trading baseline. XBOW benchmark claims are not comparable to route review, wallet-prompt safety, simulation discipline, or trading-risk reporting.

## Comparable Baselines

Use only baselines that share the same task, corpus, and scoring method.

| Baseline | Comparable For | Not Comparable For |
| --- | --- | --- |
| Static decoder fixture | Instruction decoding accuracy | Profitability, execution success |
| Simulation fixture | Dry-run policy and expected deltas | Real fill quality |
| Route fixture | Program/pool/token inventory | Market timing |
| Wallet-prompt fixture | Intent mismatch and receipt gates | Wallet vendor quality in production |
| Agent-boundary fixture | Data/instruction separation | Model safety in unrelated domains |

## Defensible Claim Template

Use this shape:

> "On the Solana trading fixture pack `<pack-name>` at revision `<hash>`, T3MP3ST identified `<x>/<y>` evidence-backed risks, blocked `<n>` signing/value/authority cases without receipts, and produced `<m>` simulation artifacts. The run did not submit transactions and did not issue buy/sell/hold recommendations."

Attach:

- Fixture pack revision.
- Cluster mode.
- RPC mode.
- Number of transaction or route fixtures.
- Scoring rubric.
- Evidence bundle.
- Known exclusions.

## Do Not Claim

1. "Profitable trading strategy."
2. "Guaranteed safe to sign."
3. "Best Solana trading bot."
4. "Beats another agent" without a shared public benchmark and identical scoring.
5. "Simulation proves execution outcome."
6. "A token is legitimate" based only on ticker, image, or metadata.
7. "Mainnet-ready" if signing and authority gates have not been tested.

## Honest Status Labels

| Label | Meaning |
| --- | --- |
| Fixture-clean | Passed local/devnet fixtures under the stated scoring rubric. |
| Simulation-clean | Required dry-run artifacts were produced and reviewed. |
| Receipt-clean | Signing/value/authority actions were blocked without human receipt. |
| Evidence-clean | Findings cite reproducible artifacts. |
| Preview | The surface is modeled, but not fully executable or not fully scored. |
| Blocked | A required safety gate, fixture, adapter, or evidence source is missing. |

## Baseline Roadmap

- Create a public fixture pack for stale quote, misleading mint, hidden authority, unknown route hop, fee surprise, and RAG data injection.
- Add deterministic scoring for decoded instruction semantics.
- Add simulation-diff scoring.
- Add wallet-prompt copy mismatch scoring.
- Add a no-advice classifier for final reports.
