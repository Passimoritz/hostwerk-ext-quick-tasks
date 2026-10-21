![Quick tasks](banner.svg)

# Quick tasks

Your tasks as big buttons – one click runs a backup, a report or a script (Hostwerk asks first). Pin favourites, also as a tile.

An official [Hostwerk](https://github.com/Passimoritz/hostwerk-public) extension.

## Features

- Every task as a big button – one click runs it (Hostwerk asks first)
- The result right in the card: done or failed, duration, last line of the output
- Search across all tasks – Enter runs the first match
- “Run a task …” in the quick search, in the “New” menu and as a shortcut (Ctrl+Alt+Q, changeable under Settings → General → Shortcuts)
- Pin favourites (★) – they come first, and from Hostwerk 3.0 each one is also in the “New” menu (“Run task “Backup””); deleted tasks drop out by themselves
- Dashboard tile with four buttons and their state
- Error state with “Try again”; polling pauses while the page is not visible
- Sits in the sidebar under “Develop” right after “Tasks”; other extensions may add tabs (`allowExtensions`)

## Install

In Hostwerk: **Apps → Extensions → Marketplace** → “Quick tasks” → Install. Updates arrive automatically.

## Permissions

- Read scheduled tasks
- Run tasks (asks first)
- Store own data (pinned tasks)
- Own server part (“native”): puts the pinned tasks into the “New” menu

Pages run isolated (own origin, no external scripts); anything that changes something asks you first.

## Development

```bash
node --test tests/*.test.js            # logic tests
node path/to/hostwerk-public/sdk/check.js . --strict   # same check as the catalog
```

The logic lives in `page/lib.js` (no DOM, tested), polling and the error state in `page/live.js` (tested as well), the page in `page/app.js`. The release packs everything except the repository tooling (`.github/`, `tests/`). A tag `vX.Y.Z` matching `manifest.json` publishes a release; the Hostwerk catalog picks it up.

Deutsch: [README.de.md](README.de.md) · License: MIT
