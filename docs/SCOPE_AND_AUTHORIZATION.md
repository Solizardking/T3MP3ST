# Scope And Authorization Model

T3MP3ST is built for authorized Solana trading-security review, owned wallets and programs, local or devnet labs, protocol-team reviews, internal risk workflows, and evidence-backed defensive reporting.

The core rule is simple: the system can be adversarial in analysis, but it must preserve scope, evidence, operator accountability, and wallet sovereignty.

## Authority Layers

| Layer | Purpose | Example |
| --- | --- | --- |
| Human intent | Plain-language mission contract | "Review this devnet route for hidden authority or value movement." |
| Scope receipt | Proof that a target and action class are allowed | Read-only mainnet account review, devnet simulation, or local validator fixture. |
| Tool gate | Adapter execution mode | `safe_read`, `simulation_only`, `receipt_required`, `catalog_only`. |
| Evidence ledger | Durable proof before claims | RPC output, decoded transaction, simulation log, screenshot, report, note. |
| Finding ledger | Claim plus impact and fix | Severity, confidence, evidence IDs, acceptance criteria. |
| Retest | Validation before promotion | Same fixture, route, transaction template, or account check rerun. |
| Memory proposal | Human-reviewed durable learning | No silent self-modification. |

## Execution Modes

- `safe_read`: local files, public docs, and read-only RPC calls.
- `simulation_only`: dry-run, local validator, devnet, or fixture execution with no live value movement.
- `receipt_required`: signing, transaction broadcast, swaps, transfers, votes, mints, burns, delegation, authority changes, governance actions, or production writes.
- `catalog_only`: known capability that should not run through generic command execution.
- `import_only`: evidence can be imported, but collection stays outside T3MP3ST execution.

## Non-Negotiables

- No private keys, seed phrases, wallet exports, or signing secrets in prompts, logs, evidence, or memory.
- No third-party wallet, program, token, validator, RPC endpoint, or trading workflow without explicit scope.
- No mainnet value movement without a named human receipt.
- No production writes without a named approval.
- No autonomous swaps, launches, votes, transfers, mints, burns, delegation, or authority changes.
- No front-running, sandwiching, wash trading, spam, spoofing, phishing, or market manipulation.
- No financial advice or profit guarantee.
- Findings need evidence and retests before confident claims.
- Memory needs operator acceptance before it becomes durable.

## Reviewer Checklist

- Can I tell which cluster and RPC endpoint are in scope?
- Can I tell which public keys, programs, mints, pools, routes, or wallets are in scope?
- Can I tell whether the action is read-only, simulation-only, or receipt-required?
- Can I see the decoded transaction or route evidence?
- Can I see whether value movement or authority movement is present?
- Can I retest the claim?
- Can a nontechnical stakeholder understand the risk and next action?
- Can a technical stakeholder reproduce the evidence without private keys?
