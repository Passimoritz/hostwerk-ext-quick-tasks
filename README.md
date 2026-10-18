# Quick tasks

Your tasks as big buttons – one click runs a backup, a report or a script (Hostwerk asks first). Pin favourites, also as a tile.

An official [Hostwerk](https://github.com/Passimoritz/hostwerk-public) extension.

## Features

- Every task as a big button – one click runs it (Hostwerk asks first)
- Last result at a glance (ok, failed, running)
- Pin favourites (★) – they come first
- Dashboard tile with four buttons

## Install

In Hostwerk: **Apps → Extensions → Marketplace** → “Quick tasks” → Install. Updates arrive automatically.

## Permissions

- Read scheduled tasks
- Run tasks (asks first)
- Store own data (pinned tasks)

Pages run isolated (own origin, no external scripts); anything that changes something asks you first.

## Development

```bash
node --test tests/*.test.js            # logic tests
node path/to/hostwerk-public/sdk/check.js . --strict   # same check as the catalog
```

The logic lives in `page/lib.js` (no DOM, tested), the page in `page/app.js`. A tag `vX.Y.Z` matching `manifest.json` publishes a release; the Hostwerk catalog picks it up.

Deutsch: [README.de.md](README.de.md) · License: MIT
