# Contributing

- Use `master` as the default branch.
- Preserve every `RO.*` key from the target English reference.
- Preserve interpolation placeholders exactly.
- Keep the module translation-only; do not add runtime scripts or a custom language selector.
- Use clear idiomatic German while retaining the mechanical meaning of the English source.
- Update compatibility metadata, reference snapshot, tests, documentation, and changelog together.
- Run `npm ci --ignore-scripts` and `npm run check` before submitting changes.
