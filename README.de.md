# Schnell-Aufgaben

Deine Aufgaben als große Knöpfe – ein Klick startet ein Backup, einen Bericht oder ein Skript (Hostwerk fragt vorher). Lieblinge anheften, auch als Kachel.

Eine offizielle Erweiterung für [Hostwerk](https://github.com/Passimoritz/hostwerk-public).

## Funktionen

- Jede Aufgabe als großer Knopf – ein Klick startet sie (Hostwerk fragt vorher)
- Letztes Ergebnis auf einen Blick (ok, Fehler, läuft)
- Lieblinge anheften (★) – sie stehen vorn
- Kachel für die Übersicht mit vier Knöpfen

## Installieren

In Hostwerk: **Apps → Erweiterungen → Marktplatz** → „Schnell-Aufgaben“ → Installieren. Updates kommen von selbst.

## Rechte

- Aufgaben lesen
- Aufgaben ausführen (mit Rückfrage)
- Eigene Daten speichern (angeheftete Aufgaben)

Seiten laufen abgeschottet (eigener Ursprung, keine fremden Skripte); alles, was etwas ändert, fragt vorher nach.

## Entwicklung

```bash
node --test tests/*.test.js            # Tests der Logik
node pfad/zu/hostwerk-public/sdk/check.js . --strict   # dieselbe Prüfung wie der Katalog
```

Die Logik steckt in `page/lib.js` (ohne DOM, getestet), die Seite in `page/app.js`. Ein Tag `vX.Y.Z` passend zu `manifest.json` veröffentlicht ein Release; der Hostwerk-Katalog übernimmt es.

English: [README.md](README.md) · Lizenz: MIT
