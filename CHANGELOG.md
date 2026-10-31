# Changelog

## 1.0.2 — 2026-10-31

- Licensed the source code under AGPL-3.0-or-later.
- Renamed the release archives to `runyth-order-language-german-v1.0.2-mod.zip`, `-src.zip`, and `-doc.zip`.
- Pointed the Foundry download URL at the `-mod` archive.
- Pointed the public repository at `foundry-runyth-order-language-german`.
- Release checkouts no longer persist GitHub Actions credentials.

## 1.0.1 — 2026-09-15

- Extended the Runyth Order dependency range to `1.0.4`–`1.0.99` and verified the pack against Runyth Order 1.0.5.
- Refreshed the canonical English 90-key reference from Runyth Order 1.0.5; German translations and placeholders remain unchanged.
- Preserved Foundry-native global language selection with no scripts, settings, migrations, or dashboard language switch.
- Source release now includes complete Git history.

## 1.0.0 — 2026-08-03

- Extracted the German `RO.*` dictionary from the unpublished built-in Runyth Order localization into an independent Foundry language-pack module.
- Declared exact compatibility with Runyth Order 1.0.4.
- Added 90 German localization entries with exact English key and interpolation-placeholder parity.
- Added no scripts, settings, dashboard controls, provider registration, or persistent migration.
- Added deterministic install/source packaging, automated translation validation, checksums, CI, documentation, and clean-extraction verification.
