# Solana Trading Install Matrix

Use this as the team-facing view of what a workstation needs. The UI and API remain useful without every optional binary, but Solana trading review improves as read-only and simulation tools appear on `PATH`.

| Lane | Tools | macOS | Linux Notes | Execution |
| --- | --- | --- | --- | --- |
| Core app | `node`, `npm`, `tsx`, `tsc`, `vitest` | Node installer or Homebrew | Distro package, nvm, or upstream Node | Local |
| Core evidence | `curl`, `jq`, `openssl`, `dig` | `brew install jq openssl bind` | Package-manager available | Local-read |
| Solana RPC review | Built-in adapters, optional Solana CLI | Solana CLI optional | Solana CLI optional | Read-only by default |
| Transaction review | Built-in decoders, simulation plan generator | No signer required | No signer required | Local/read-only |
| Token review | SPL Token and Token-2022 account inspection | No private keys | No private keys | Read-only |
| Program review | Anchor IDLs, source artifacts, account owner checks | Anchor optional | Anchor optional | Local-read plus RPC-read |
| Local simulation | LiteSVM, Mollusk, Surfpool, local validator where needed | Project-dependent | Project-dependent | Local/devnet |
| AI boundary | `promptfoo`, `garak` | npm and pipx | npm and pipx | Receipt-gated model probing |
| Reporting | Built-in evidence, findings, retests, disclosure generator | Included | Included | Local |
| Gated/signing | Wallets, Solana CLI submit, SPL Token mutation commands | Catalog-only unless narrowly adapted | Catalog-only unless narrowly adapted | Human receipt required |

## Minimum Useful Workstation

```bash
npm ci
npm run doctor
npm run test:solana
npm run arsenal:smoke
```

Optional Solana inspection tools can be installed separately, but T3MP3ST must not require a private key to load, test, decode, simulate, or report.

## macOS Homebrew Repair

If Homebrew is owned by a different local user, installs may fail with `Cellar is not writable` or tap permission errors. Repair the prefix before installing tools:

```bash
sudo chown -R "$(whoami)":admin /opt/homebrew
brew doctor
```

## Gate Expectations

- Missing Solana CLI should degrade read-only command readiness, not break the UI.
- Missing wallet should not block decoding or simulation planning.
- Any tool capable of signing, transfer, authority mutation, or broadcast remains receipt-required.
- The ledger must never store private keys, seed phrases, session tokens, wallet exports, or raw recovered secrets.
