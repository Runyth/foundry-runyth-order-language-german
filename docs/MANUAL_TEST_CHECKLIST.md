# Manual test checklist

Use a disposable Foundry VTT 13.351 world.

- [ ] Install Runyth Order 1.0.5 in `Data/modules/runyth-order/`.
- [ ] Install this module in `Data/modules/runyth-order-language-german/`.
- [ ] Confirm module management shows `Runyth Order: Language German`.
- [ ] Confirm the module can be enabled only with Runyth Order active.
- [ ] Open Configure Settings and select German through Foundry's global language setting.
- [ ] Reload when Foundry requests it.
- [ ] Open Rules Hub from Module Settings, Settings sidebar, Scene Controls, and `Ctrl+Shift+R`.
- [ ] Confirm titles, tabs, buttons, empty states, diagnostics, audits, migration prompts, and naming findings are German.
- [ ] Confirm button text wraps without escaping controls at narrow widths.
- [ ] Confirm no separate language selector appears in Rules Hub.
- [ ] Confirm this language pack adds no module settings.
- [ ] Confirm browser console contains no error or deprecated API warning from the pack.
- [ ] Switch back to English and confirm the canonical English interface returns.
- [ ] Disable the language pack and confirm Runyth Order remains functional.
- [ ] Re-enable the pack and confirm no migration or persistent data change is requested.
