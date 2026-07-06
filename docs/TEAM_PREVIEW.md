# T3MP3ST Solana Trading Team Preview

This preview is for Solana protocol teams, wallet builders, trading-tool developers, security researchers, and operators who want an evidence-first review loop for trading workflows.

The useful mental model: T3MP3ST is a Solana trading-security command center. It routes a mission into specialist lanes, binds RPC and simulation output to evidence, promotes evidence into findings, retests claims, and only then proposes durable learning.

## Ten-Minute First Run

```bash
npm ci
npm run doctor
npm run test:solana
npm run server
```

Open `http://127.0.0.1:3333/ui/`.

In the UI:

1. Select the Solana or program/token guided start.
2. Enter a devnet, localnet, or read-only mainnet target.
3. Confirm scope and action class.
4. Run preflight.
5. Sync arsenal.
6. Generate a route or account review plan.
7. Attach one RPC or source evidence item.
8. Seed one hypothesis: stale quote, unknown program, token identity, authority risk, or wallet mismatch.
9. Run the Watch Loop pulse.
10. Promote one evidence-backed finding and queue a retest.

Expected state on a fresh machine:

- The UI should load without an LLM key.
- Solana tests should pass without private keys.
- Read-only account review should not need a wallet.
- Missing optional Solana tools should appear as activation work, not hidden success.
- Signing and value movement should be blocked without receipt.

## What Is Real Today

- Express API server and static command-center UI.
- Solana mission drafts, route previews, mission bundles, and mission gates.
- Solana target factories and public-key validation.
- Read-only RPC health/account lookup planning.
- Transaction dry-run plan generation.
- ScopeGuard approvals for signing, value movement, authority changes, governance actions, and production writes.
- Evidence, hypothesis graph, hunt queue work orders, findings, retests, and accepted-memory proposal flow.
- Watch Loop pulses for stale evidence, missing simulation, receipt gates, open work orders, retest gaps, and learning proposals.

## What Is Preview

- Route graph visualization is still a reporting surface, not a trade executor.
- Wallet UX review is designed around decoded transaction evidence and human receipts.
- Catalog-only signing tools are intentionally modeled but not executable through generic command dispatch.
- Installed tool readiness depends on the local workstation; see [ARSENAL_ACTIVATION_PLAN.md](ARSENAL_ACTIVATION_PLAN.md).

## Demo Missions

Run local-safe demos:

```bash
npm run field:drill
npm run arsenal:smoke
npm run prompt:audit
npm run test:solana
```

Suggested mission seeds:

- "Review this devnet transaction for hidden value or authority movement."
- "Inspect this token mint for identity, authority, and Token-2022 extension risk."
- "Compare this quoted route against a pre-sign simulation artifact."
- "Check whether this trading assistant treats market data as instructions."

## Feedback We Want

- Where does the UI make the operator uncertain about signing risk?
- Which Solana evidence is missing from the finding view?
- Which route, token, wallet, or program risk needs the next adapter?
- Which Watch Loop signal is actionable, noisy, or missing?
- Which feature looks executable but should be labeled as review-only?
- Which workflow should be one click easier for protocol-team reviewers?

## Ship Gate For Team Builds

Before pushing a team preview branch, run:

```bash
npm run typecheck
npm test
npm run test:solana
npm run doctor
npm run arsenal:smoke
```

If the API is not running, `doctor` still checks local files and commands. If the API is running, it also checks health, preflight, arsenal status, and activation metadata.
