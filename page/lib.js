/* QuickTasks – pure logic without DOM, tested in tests/lib.test.js (node --test). */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api; else root.QuickTasks = api;
}(typeof self !== 'undefined' ? self : this, () => {
  /** Welche Aufgaben als Knöpfe? Angeheftete zuerst (Reihenfolge wie angeheftet), dann die zuletzt gelaufenen. */
  function pick(list, pinned = [], max = 12) {
    const all = (list || []).filter((t) => t && t.id);
    const pins = pinned.map((id) => all.find((t) => t.id === id)).filter(Boolean);
    const rest = all.filter((t) => !pinned.includes(t.id)).sort((a, b) => (b.lastRun || 0) - (a.lastRun || 0) || String(a.name).localeCompare(String(b.name)));
    return [...pins, ...rest].slice(0, max).map((t) => ({ ...t, pinned: pinned.includes(t.id) }));
  }
  /** Zustand in einem Wort: läuft, Fehler, ok, neu. */
  function state(t) { if (t.running || t.retrying) return 'running'; if (!t.lastRun) return 'new'; return t.lastStatus === 'error' ? 'error' : 'ok'; }
  /** Anheften/Lösen (für den Speicher der Erweiterung). */
  function togglePin(pinned, id) { return pinned.includes(id) ? pinned.filter((x) => x !== id) : [...pinned, id]; }
  return { pick, state, togglePin };
}));
