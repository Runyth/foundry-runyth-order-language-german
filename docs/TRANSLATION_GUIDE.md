# Translation guide

## Source of truth

Translate `reference/runyth-order-en-v1.0.5.json`. Do not derive keys from screenshots or rename keys for German grammar.

## Requirements

1. Preserve every key exactly.
2. Add no key absent from the target English snapshot.
3. Preserve placeholders such as `{count}`, `{message}`, and `{pattern}`.
4. Keep values non-empty.
5. Preserve semantic distinctions between providers, modules, packs, migrations, audits, and diagnostics.
6. Prefer established German Foundry terminology where it remains clear.
7. Keep button labels short enough for narrow Foundry layouts.
8. Do not place a language selector in Runyth Order or this pack.

## Updating to a new core release

1. Replace the English reference snapshot with the new core `lang/en.json`.
2. Diff keys and placeholders.
3. Translate all additions and review changed English values.
4. Change `flags.runyth.localization.targetModuleVersion`.
5. Update the required dependency range.
6. Bump this module's version.
7. Run the full gate and clean-extraction rebuild.
