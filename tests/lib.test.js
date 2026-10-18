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
