# Architecture

The module is intentionally data-only.

```text
Foundry package loader
  ├─ reads module.json
  ├─ sees language de → lang/de.json
  ├─ merges RO.* entries into the selected-language dictionary
  └─ Runyth Order uses game.i18n/localize helpers normally
```

There are no scripts, hooks, settings, sockets, migrations, ApplicationV2 windows, compendia, or provider registrations.

The English reference snapshot exists only in the source repository for deterministic parity testing. The installable ZIP contains only the German runtime dictionary and ordinary package documentation.
