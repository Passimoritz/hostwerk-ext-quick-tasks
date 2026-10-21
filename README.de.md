![Schnell-Aufgaben](banner.svg)

# Schnell-Aufgaben

Deine Aufgaben als große Knöpfe – ein Klick startet ein Backup, einen Bericht oder ein Skript (Hostwerk fragt vorher). Lieblinge anheften, auch als Kachel.

Eine offizielle Erweiterung für [Hostwerk](https://github.com/Passimoritz/hostwerk-public).

## Funktionen

- Jede Aufgabe als großer Knopf – ein Klick startet sie (Hostwerk fragt vorher)
- Ergebnis direkt in der Karte: fertig oder fehlgeschlagen, Dauer, letzte Zeile der Ausgabe
- Suche über alle Aufgaben – Enter startet den ersten Treffer
- „Aufgabe starten …“ in der Schnellsuche, im Neu-Menü und per Tastenkürzel (Strg+Alt+Q, unter Einstellungen → Allgemein → Tastenkürzel änderbar)
- Lieblinge anheften (★) – sie stehen vorn und ab Hostwerk 3.0 auch einzeln im Menü „Neu“ („Aufgabe „Backup“ starten“); gelöschte Aufgaben fallen von selbst heraus
- Kachel für die Übersicht mit vier Knöpfen und ihrem Zustand
- Fehlerzustand mit „Erneut versuchen“; Abfragen pausieren, solange die Seite nicht zu sehen ist
- Steckt in Aufgaben → Schnellaufgaben (seit 1.5 ohne eigenen Seitenleisten-Eintrag); andere Erweiterungen dürfen Reiter ergänzen (`allowExtensions`)

## Installieren

In Hostwerk: **Apps → Erweiterungen → Marktplatz** → „Schnell-Aufgaben“ → Installieren. Updates kommen von selbst.

## Rechte

- Aufgaben lesen
- Aufgaben ausführen (mit Rückfrage)
- Eigene Daten speichern (angeheftete Aufgaben)
- Eigener Server-Teil („native“): legt die angehefteten Aufgaben ins Menü „Neu“

Seiten laufen abgeschottet (eigener Ursprung, keine fremden Skripte); alles, was etwas ändert, fragt vorher nach.

## Entwicklung

```bash
node --test tests/*.test.js            # Tests der Logik
node pfad/zu/hostwerk-public/sdk/check.js . --strict   # dieselbe Prüfung wie der Katalog
```

Die Logik steckt in `page/lib.js` (ohne DOM, getestet), Abfragen und Fehlerzustand in `page/live.js` (ebenfalls getestet), die Seite in `page/app.js`. Das Release packt alles außer dem Repo-Werkzeug (`.github/`, `tests/`). Ein Tag `vX.Y.Z` passend zu `manifest.json` veröffentlicht ein Release; der Hostwerk-Katalog übernimmt es.

English: [README.md](README.md) · Lizenz: MIT
