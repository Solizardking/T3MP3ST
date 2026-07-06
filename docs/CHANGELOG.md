# T3MP3ST Changelog

## 2026-07-05 - Solana Trading Adaptation

The docs have been converted from a general adversarial-security and benchmark story into a Solana-native trading-security operating model.

### Changed

- Reframed the product as a Solana trading command center for read-only RPC evidence, transaction decoding, simulation gates, wallet-prompt review, route risk, and reporting.
- Replaced legacy benchmark-forward docs with Solana trading equivalents:
  - Simulation benchmark methodology.
  - Liquidity-wall forensics.
  - Trading integrity ledger.
  - Baseline comparison rules for dry-run and route-review claims.
- Promoted `solana_onchain` as the primary mission family.
- Added explicit trading controls for:
  - Quote-to-execution drift.
  - Token identity and Token-2022 extension review.
  - Unknown program and route-hop detection.
  - Compute budget and priority-fee visibility.
  - Wallet prompt mismatch review.
  - RPC/indexer trust boundaries.

### Safety Posture

- No private-key or seed-phrase handling.
- No autonomous swaps, transfers, votes, launches, mints, burns, or authority changes.
- No financial advice.
- No front-running, sandwiching, spam, spoofing, or market manipulation.
- Human receipt required before any signing, value movement, authority movement, governance action, or production write.

### Verification Focus

The release gate now emphasizes:

- `npm run test:solana`
- `npm run arsenal:smoke`
- `npm run prompt:audit`
- `npm run typecheck`
- Evidence traceability from scope receipt to simulation, finding, fix, and retest.

### Documentation Updated

- [AI_REDTEAM_TECHNIQUES.md](AI_REDTEAM_TECHNIQUES.md)
- [ARSENAL_ACTIVATION_PLAN.md](ARSENAL_ACTIVATION_PLAN.md)
- [COGNITIVE_ARCHITECTURE.md](COGNITIVE_ARCHITECTURE.md)
- [CYBENCH.md](CYBENCH.md)
- [INSTALL_MATRIX.md](INSTALL_MATRIX.md)
- [INTEGRITY_LEDGER.md](INTEGRITY_LEDGER.md)
- [OBSIDIVM.md](OBSIDIVM.md)
- [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)
- [SCOPE_AND_AUTHORIZATION.md](SCOPE_AND_AUTHORIZATION.md)
- [SOLANA_NATIVE.md](SOLANA_NATIVE.md)
- [TEAM_PREVIEW.md](TEAM_PREVIEW.md)
- [WALL_FORENSICS.md](WALL_FORENSICS.md)
- [XBOW_BASELINE.md](XBOW_BASELINE.md)
- [index.html](index.html)
