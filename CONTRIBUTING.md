# Contributing To T3MP3ST

T3MP3ST needs contributions from Solana program auditors, wallet/security
engineers, prompt engineers, AI-security researchers, defensive operators, and
product-minded builders.

The best contributions make the system more capable while making its evidence and authority boundaries clearer.

## High-Value Contribution Types

- Add a tool adapter in `src/arsenal/catalog.ts`.
- Add or improve a Solana mission-family prompt pack in `src/resources/`.
- Add a runbook phase with evidence requirements and exit criteria.
- Add a local-safe demo mission in `examples/demo-missions.json`.
- Add a smoke-test check in `scripts/arsenal-smoke.mjs` or `scripts/field-drill.mjs`.
- Improve UI truth labels for preview, wired, installed, gated, synthetic, and live states.
- Add parser support that turns tool output into structured evidence.

## Solana Contribution Rules

- Do not add signing or transaction-submission behavior without a dry-run path,
  exact human receipt, and tests proving the no-receipt path fails closed.
- Do not add code that accepts seed phrases or private keys.
- Prefer `@solana/kit` for new client/RPC/transaction code when transaction code
  becomes necessary.
- Prefer read-only RPC, localnet/devnet, LiteSVM/Mollusk, Surfpool, or fixtures
  before any live cluster interaction.
- Solana CLI, SPL Token CLI, Anchor, Codama, LiteSVM, and Surfpool adapters must
  be narrow templates, not generic arbitrary-argument executors.

## Adapter Checklist

Every adapter should define:

- `id`, `binary`, and human-readable `name`.
- `category` and mission `families`.
- `risk`: `local_read`, `passive`, `active`, `intrusive`, `credential`, or `dangerous`.
- `execution`: `safe_command`, `receipt_required`, `import_only`, or `catalog_only`.
- `networked`: whether it can touch remote systems.
- `evidenceKinds`: what proof the tool should produce.
- `outputFormats`: expected output shape.
- `installHint` and `commandHint`.
- `parserStatus`: `structured`, `text`, or `planned`.
- `notes`: the operational caution or value.

## Prompt Pack Checklist

Prompt packs should include:

- A sharp role frame.
- Operating rules that bind the agent to scope and evidence.
- Expected outputs that reviewers can inspect.
- Escalation rules for uncertainty, scope, and dangerous actions.
- Evidence contracts that say what must be captured before making claims.

## Review Standard

Before opening a PR:

```bash
npm run typecheck
npm run test:solana
npm test
npm run doctor
```

If the API is running:

```bash
npm run arsenal:smoke
npm run field:drill
```

## Style

- Prefer clear adapters and evidence contracts over clever hidden behavior.
- Label preview surfaces honestly.
- Keep dangerous capability modeled, gated, and auditable.
- Make the nontechnical path simpler without weakening the expert path.
