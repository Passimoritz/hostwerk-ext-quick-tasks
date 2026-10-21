/* QuickTasks – pure logic without DOM, tested in tests/lib.test.js (node --test). */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api; else root.QuickTasks = api;
}(typeof self !== 'undefined' ? self : this, () => {
  /** Passt eine Aufgabe zur Suche? Name, Aktion und Ziel, ohne Groß-/Kleinschreibung, alle Wörter müssen vorkommen. */
  function matches(t, query) {
    const words = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return true;
    const hay = `${t.name || ''} ${t.actionLabel || ''} ${(t.action && t.action.target) || ''}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  }
  /**
   * Welche Aufgaben als Knöpfe? Angeheftete zuerst (Reihenfolge wie angeheftet), dann die zuletzt gelaufenen.
   * max begrenzt (Kachel: 4), Seite ohne Grenze; query filtert (Suche).
   */
  function pick(list, pinned = [], max = Infinity, query = '') {
    const all = (list || []).filter((t) => t && t.id && matches(t, query));
    const pins = pinned.map((id) => all.find((t) => t.id === id)).filter(Boolean);
    const rest = all.filter((t) => !pinned.includes(t.id)).sort((a, b) => (b.lastRun || 0) - (a.lastRun || 0) || String(a.name).localeCompare(String(b.name)));
    return [...pins, ...rest].slice(0, max).map((t) => ({ ...t, pinned: pinned.includes(t.id) }));
  }
  /** Zustand in einem Wort: läuft, Fehler, ok, neu. */
  function state(t) { if (t.running || t.retrying) return 'running'; if (!t.lastRun) return 'new'; return t.lastStatus === 'error' ? 'error' : 'ok'; }
  /** Anheften/Lösen (für den Speicher der Erweiterung). */
  function togglePin(pinned, id) { return pinned.includes(id) ? pinned.filter((x) => x !== id) : [...pinned, id]; }
  /**
   * Angeheftete, die es nicht mehr gibt (in Hostwerk gelöscht), aus dem Speicher nehmen.
   * → { pinned, changed } – changed sagt, ob gespeichert werden muss.
   */
  function prune(pinned, list) {
    const ids = new Set((list || []).map((t) => t && t.id));
    const kept = (pinned || []).filter((id) => ids.has(id));
    return { pinned: kept, changed: kept.length !== (pinned || []).length };
  }
  /** Letzte sinnvolle Zeile der Ausgabe eines Laufs (für die Ergebniszeile), höchstens 160 Zeichen. */
  function lastLine(output) {
    const lines = String(output || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const l = lines.length ? lines[lines.length - 1] : '';
    return l.length > 160 ? `${l.slice(0, 157)}…` : l;
  }
  /** Ergebnis eines Laufs ({ status, ms, output } aus Hostwerk) in eine Form für die Anzeige. */
  function result(entry) {
    if (!entry || typeof entry !== 'object') return null;
    return { status: entry.status === 'error' ? 'error' : 'ok', ms: Number(entry.ms) || 0, line: lastLine(entry.output), at: entry.at || Date.now() };
  }
  /** Hat Hostwerk den Lauf abgelehnt (Rückfrage mit „Nein“ beantwortet)? Dann keine Fehlermeldung. */
  function declined(err) { return /declined|abgelehnt/i.test(String((err && err.message) || err || '')); }
  /** Brücke hat nicht rechtzeitig geantwortet – die Aufgabe läuft aber womöglich weiter. */
  function stillRunning(err) { return /did not answer|nicht geantwortet/i.test(String((err && err.message) || err || '')); }
  return { matches, pick, state, togglePin, prune, lastLine, result, declined, stillRunning };
}));
