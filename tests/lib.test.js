const test = require('node:test');
const assert = require('node:assert');
const Q = require('../page/lib.js');
const list = [{ id: 'a', name: 'Backup', lastRun: 10 }, { id: 'b', name: 'Bericht', lastRun: 30 }, { id: 'c', name: 'Cache leeren' }, { id: 'd', name: 'Deploy', lastRun: 20 }];

test('angeheftete zuerst (in ihrer Reihenfolge), dann zuletzt gelaufene', () => {
  assert.deepStrictEqual(Q.pick(list, ['c', 'a']).map((x) => x.id), ['c', 'a', 'b', 'd']);
  assert.ok(Q.pick(list, ['c'])[0].pinned);
});
test('höchstens max Knöpfe, unbekannte Pins ignoriert', () => {
  assert.strictEqual(Q.pick(list, ['x'], 2).length, 2);
  assert.ok(!Q.pick(list, ['x']).some((x) => x.id === 'x'));
});
test('Zustand in einem Wort', () => {
  assert.strictEqual(Q.state({ running: true }), 'running');
  assert.strictEqual(Q.state({}), 'new');
  assert.strictEqual(Q.state({ lastRun: 1, lastStatus: 'error' }), 'error');
  assert.strictEqual(Q.state({ lastRun: 1, lastStatus: 'ok' }), 'ok');
});
test('Anheften umschalten', () => {
  assert.deepStrictEqual(Q.togglePin(['a'], 'b'), ['a', 'b']);
  assert.deepStrictEqual(Q.togglePin(['a', 'b'], 'a'), ['b']);
});
test('ohne Grenze alle Aufgaben, Suche über Name und Aktion', () => {
  const many = Array.from({ length: 20 }, (_, i) => ({ id: `t${i}`, name: `Aufgabe ${i}` }));
  assert.strictEqual(Q.pick(many, []).length, 20, 'die Seite zeigt alle, nicht nur 12');
  const xs = [{ id: 'a', name: 'Backup Shop', actionLabel: 'Datenbank sichern' }, { id: 'b', name: 'Bericht', actionLabel: 'Adresse aufrufen', action: { target: 'https://example.org/cron' } }];
  assert.deepStrictEqual(Q.pick(xs, [], Infinity, 'shop').map((x) => x.id), ['a']);
  assert.deepStrictEqual(Q.pick(xs, [], Infinity, 'DATENBANK sichern').map((x) => x.id), ['a']);
  assert.deepStrictEqual(Q.pick(xs, [], Infinity, 'cron').map((x) => x.id), ['b'], 'auch das Ziel zählt');
  assert.deepStrictEqual(Q.pick(xs, [], Infinity, 'gibtsnicht'), []);
});
test('gelöschte Aufgaben fallen aus den Angehefteten', () => {
  assert.deepStrictEqual(Q.prune(['a', 'weg', 'c'], list), { pinned: ['a', 'c'], changed: true });
  assert.deepStrictEqual(Q.prune(['a'], list), { pinned: ['a'], changed: false });
  assert.deepStrictEqual(Q.prune(undefined, list), { pinned: [], changed: false });
});
test('Ergebnis eines Laufs: Zustand, Dauer, letzte Zeile', () => {
  assert.deepStrictEqual(Q.result({ status: 'ok', ms: 1234, output: 'Start\nSicherung: 3 Dateien\n\n', at: 5 }), { status: 'ok', ms: 1234, line: 'Sicherung: 3 Dateien', at: 5 });
  assert.strictEqual(Q.result({ status: 'error', output: 'x' }).status, 'error');
  assert.strictEqual(Q.lastLine('a'.repeat(300)).length, 158);
  assert.strictEqual(Q.result(null), null);
});
test('Ablehnung und Zeitüberschreitung erkennen', () => {
  assert.ok(Q.declined(new Error('Declined'))); assert.ok(Q.declined('Abgelehnt'));
  assert.ok(Q.stillRunning(new Error('Hostwerk did not answer')));
  assert.ok(!Q.declined(new Error('Skript nicht gefunden')));
});

test('angeheftete Aufgaben im Menü „Neu“: Reihenfolge der Pins, höchstens 6, gelöschte fallen weg, Aktion → Aufgabe', () => {
  const tasks = [...list, ...['e', 'f', 'g', 'h'].map((id) => ({ id, name: `Aufgabe ${id}` })), { id: 'BÖSE id', name: 'x' }];
  const e = Q.newEntries(tasks, ['c', 'weg', 'a', 'BÖSE id']);
  assert.deepStrictEqual(e.map((x) => x.id), ['t-c', 't-a']);
  assert.deepStrictEqual(e[0].title, { de: 'Aufgabe „Cache leeren“ starten', en: 'Run task “Cache leeren”' });
  assert.strictEqual(e[0].icon, 'zap');
  assert.strictEqual(Q.newEntries(tasks, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']).length, 6);
  assert.deepStrictEqual(Q.newEntries(null, null), []);
  assert.strictEqual(Q.taskOfAction({ id: 't-c' }), 'c');
  assert.strictEqual(Q.taskOfAction({ id: 'run' }), null);
  assert.strictEqual(Q.taskOfAction({ id: 't-' }), null);
  assert.strictEqual(Q.taskOfAction(null), null);
});

test('Server-Teil: legt die Einträge beim Start und nach jedem Anheften fest; ohne setNewEntries (Hostwerk vor 3.0) nichts', () => {
  const routes = {};
  let pinned = ['d'];
  const sets = [];
  const host = { ctx: { scheduler: { list: () => list } }, router: { post: (p, fn) => { routes[p] = fn; } }, storage: { get: (k) => (k === 'pinned' ? pinned : undefined) }, log: () => {}, setNewEntries: (l) => { sets.push(l.map((x) => x.id)); return l.length; } };
  const S = require('../server/index');
  S.activate(host);
  assert.deepStrictEqual(sets, [['t-d']]);
  pinned = ['a', 'b'];
  let out; routes['/quick-tasks/pins']({}, { json: (x) => { out = x; } });
  assert.deepStrictEqual(out, { entries: 2, supported: true });
  assert.deepStrictEqual(sets[1], ['t-a', 't-b']);
  S.deactivate();
  const old = { ...host, setNewEntries: undefined };
  S.activate(old);
  routes['/quick-tasks/pins']({}, { json: (x) => { out = x; } });
  assert.deepStrictEqual(out, { entries: 0, supported: false });
  S.deactivate();
});
