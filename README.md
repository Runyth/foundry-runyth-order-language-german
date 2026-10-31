# Runyth Order: Language German

Independent German localization for **Runyth Order 1.0.5**.

This package uses Foundry VTT's native localization system. It contains no runtime script, dashboard, macro, socket, setting, or provider registration. It contributes a German `RO.*` dictionary when the module is active and German is selected through Foundry's global language setting.

## Requirements

| Component | Required version |
|---|---|
| Foundry VTT | 13.341–13.351 |
| Runyth Order | exactly 1.0.5 |
| Game system | Any |
| Runtime dependencies | None beyond Runyth Order |

## Installation

1. Install and enable **Runyth Order 1.0.5**.
2. Extract `runyth-order-language-german-v1.0.2-mod.zip` into `FoundryVTT/Data/modules/`.
3. Enable **Runyth Order: Language German** in the world.
4. Open Foundry's **Configure Settings** interface and select German through the global Language setting.
5. Save changes and reload when Foundry requests it.

There is intentionally no language selector in Rules Hub. Foundry's global language setting remains authoritative for the complete client interface.

## Translation contract

- Target module: `runyth-order`
- Target version: `1.0.5`
- Base language: `en`
- Translation language: `de`
- Namespace: `RO.*`
- Dictionary keys: 90
- Placeholder sets: exact parity with English

The English reference snapshot in `reference/runyth-order-en-v1.0.5.json` is source-only validation material and is not included in the installable module.

## Development

```text
npm ci --ignore-scripts
npm run check
```

Build output:

- `runyth-order-language-german-v1.0.2-mod.zip`
- `runyth-order-language-german-v1.0.2-src.zip`
- `runyth-order-language-german-v1.0.2-doc.zip`
- `runyth-order-language-german-v1.0.2-SHA256SUMS.txt`
- `runyth-order-language-german-v1.0.2-build-report.json`

## Default branch

Use `master`.

## Licence

The repository is licensed under MIT. See `NOTICE.md` for translation provenance.
