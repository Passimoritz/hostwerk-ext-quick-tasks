## 1.5.1

- German texts use Hostwerk’s words (“Sicherung” instead of “Backup”). / Deutsche Texte mit Hostwerks Wörtern („Sicherung“ statt „Backup“).

## 1.5.0

- Lives where it belongs: Tasks → Quick tasks, the “New” menu, the command palette and the dashboard tile – no own sidebar entry any more (Hostwerk 3.0+); the full page stays under Extensions → Open and can be pinned in the sidebar settings. / Steckt jetzt dort, wo sie hingehört: Aufgaben → Schnellaufgaben, Menü „Neu“, Schnellsuche und Übersichtskachel – kein eigener Seitenleisten-Eintrag mehr (Hostwerk 3.0+); die ganze Seite bleibt unter Erweiterungen → Öffnen und lässt sich in den Seitenleisten-Einstellungen anheften.
- Needs Hostwerk 3.0 (the Tasks area takes tabs since SDK 3.2). / Braucht Hostwerk 3.0 (der Bereich Aufgaben nimmt Reiter erst seit SDK 3.2).

## 1.4.0

- Pinned tasks show up one by one in the “New” menu (“Run task “Backup””) – with Hostwerk 3.0 (SDK 2.10 `host.setNewEntries`); choosing one runs that task right away (Hostwerk asks first). Needs a small own server part, hence the permission “native”. / Angeheftete Aufgaben einzeln im Menü „Neu“ („Aufgabe „Backup“ starten“) – ab Hostwerk 3.0; ein Klick startet sie (mit Rückfrage). Dafür ein kleiner eigener Server-Teil, deshalb das Recht „native“.

## 1.3.0

- Every task on the page (no limit of 12 any more) with a search; Enter runs the first match. / Alle Aufgaben auf der Seite (nicht mehr höchstens 12) mit Suche; Enter startet den ersten Treffer.
- The result of a run shows up right in the card (done or failed, duration, last line of the output) instead of just “started”. / Das Ergebnis eines Laufs steht direkt in der Karte (fertig oder fehlgeschlagen, Dauer, letzte Zeile der Ausgabe) statt nur „gestartet“.
- “Run a task …” in the quick search, in the “New” menu and as a shortcut (Ctrl+Alt+Q, changeable in the settings). / „Aufgabe starten …“ in der Schnellsuche, im Neu-Menü und als Tastenkürzel (Strg+Alt+Q, in den Einstellungen änderbar).
- Error state with “Try again” on the page and the tile; the tile shows running and failed tasks. / Fehlerzustand mit „Erneut versuchen“ auf Seite und Kachel; die Kachel zeigt laufende und fehlgeschlagene Aufgaben.
- Tasks deleted in Hostwerk no longer stay pinned. / In Hostwerk gelöschte Aufgaben bleiben nicht mehr angeheftet.
- Pin and run buttons have names for screen readers (aria-pressed, aria-label). / Anheft- und Start-Knöpfe haben Namen für Bildschirmleser (aria-pressed, aria-label).
- Polling pauses while the page is hidden; sizes from Hostwerk’s design scale; the page sits under “Develop” right after “Tasks”; other extensions may add tabs. / Abfragen pausieren bei verstecktem Reiter; Größen aus Hostwerks Design-Skala; die Seite steht unter „Entwickeln“ direkt hinter „Aufgaben“; andere Erweiterungen dürfen Reiter ergänzen.
- The release packs everything except the repository tooling. Needs Hostwerk 2.11. / Das Release packt alles außer dem Repo-Werkzeug. Braucht Hostwerk 2.11.

## 1.2.0

- New animated icon and a banner for Hostwerk's new extension page, category “developer”. / Neues bewegtes Symbol und ein Banner für die neue Erweiterungsseite, Kategorie „developer“.

## 1.1.0

- Looks exactly like Hostwerk's own pages: uses Hostwerk's design classes (card, btn, badge …) from the SDK 2.2 design kit; Hostwerk draws the page header. / Sieht aus wie Hostwerks eigene Seiten: Hostwerks Design-Klassen aus dem Baukasten (SDK 2.2), Kopf zeichnet Hostwerk.

## 1.0.0

- First release / Erste Fassung.
