// Schnell-Aufgaben – Seite: Aufgaben per großem Knopf starten (Hostwerk fragt vorher nach). Angeheftete zuerst, Suche,
// Ergebnis des Laufs direkt in der Karte. „Aufgabe starten …“ (Schnellsuche, Neu-Menü, Kürzel) springt in die Suche.
const { html, t } = Hostwerk;
const Q = QuickTasks;
let pinned = [];
let tasks = null; // letzte Liste aus Hostwerk (null = noch nie geladen)
let query = '';
const results = new Map(); // Aufgabe → letztes Ergebnis aus dieser Sitzung { status, ms, line }
const busy = new Set(); // gerade aus dieser Seite gestartet
const BADGE = { running: 'warn', error: 'err', ok: 'ok', new: '' };

function card(x) {
  const st = busy.has(x.id) ? 'running' : Q.state(x);
  const r = results.get(x.id);
  const name = x.name;
  return html`<div class="card card-pad task stack" data-state="${st}">
    <div class="row"><b class="grow ellipsis" title="${name}">${name}</b>
      <button type="button" class="btn sm ghost pin" data-pin="${x.id}" aria-pressed="${x.pinned ? 'true' : 'false'}" aria-label="${t(x.pinned ? 'unpinName' : 'pinName', { name })}" title="${t(x.pinned ? 'unpin' : 'pin')}">${x.pinned ? '★' : '☆'}</button></div>
    <div class="tiny muted ellipsis">${x.actionLabel || ''}</div>
    <div class="row"><span class="badge ${BADGE[st]}">${t('state.' + st)}</span><span class="grow"></span>
      <button type="button" class="btn primary" data-run="${x.id}" aria-label="${t('runName', { name })}" ${st === 'running' ? Hostwerk.raw('disabled') : ''}>${t('run')}</button></div>
    ${r ? html`<div class="small task-result" role="status"><span class="${r.status === 'error' ? 'c-err' : 'c-ok'}">${t(r.status === 'error' ? 'resultError' : 'resultOk', { s: Hostwerk.fmt.number(Math.round(r.ms / 100) / 10) })}</span>${r.line ? html` <span class="muted mono ellipsis">${r.line}</span>` : ''}</div>` : ''}
  </div>`;
}

function draw() {
  if (!tasks) return;
  if (!tasks.length) { Hostwerk.render('#grid', html`<div class="empty"><h3>${t('empty')}</h3><p class="muted small">${t('emptyHint')}</p><div class="empty-action"><button type="button" class="btn" data-open-tasks>${t('openTasks')}</button></div></div>`); return; }
  const list = Q.pick(tasks, pinned, Infinity, query);
  document.getElementById('count').textContent = query ? t('found', { n: list.length, all: tasks.length }) : t('total', { n: tasks.length });
  Hostwerk.render('#grid', list.length ? html`${list.map(card)}` : html`<div class="empty"><h3>${t('noMatch')}</h3><p class="muted small">${t('noMatchHint')}</p></div>`);
}

async function load() {
  const { list } = await Hostwerk.get('/tasks');
  tasks = Array.isArray(list) ? list : [];
  // In Hostwerk gelöschte Aufgaben nicht ewig angeheftet lassen
  const p = Q.prune(pinned, tasks);
  if (p.changed) { pinned = p.pinned; Hostwerk.storage.set('pinned', pinned).then(syncNewMenu).catch(() => {}); }
  draw();
}
const reload = () => Live.guard(Hostwerk, '#grid', load);

/** Angeheftete Aufgaben ins Menü „Neu“ (eigener Server-Teil, ab Hostwerk 3.0) – ohne ihn bleibt nur der feste Eintrag. */
function syncNewMenu() { Hostwerk.backend('POST', '/quick-tasks/pins').catch(() => {}); }

async function run(id) {
  const x = (tasks || []).find((y) => y.id === id);
  if (!x || busy.has(id)) return;
  busy.add(id); results.delete(id); draw();
  try {
    // Hostwerk antwortet, wenn die Aufgabe fertig ist – mit Zustand, Dauer und Ausgabe
    const r = Q.result(await Hostwerk.post(`/tasks/${encodeURIComponent(id)}/run`));
    if (r) { results.set(id, r); Hostwerk.toast(t(r.status === 'error' ? 'doneError' : 'doneOk', { name: x.name }), { kind: r.status === 'error' ? 'error' : 'success' }); }
  } catch (er) {
    if (Q.stillRunning(er)) Hostwerk.toast(t('stillRunning', { name: x.name }));
    else if (!Q.declined(er)) Hostwerk.toast(er.message, { kind: 'error' });
  }
  busy.delete(id);
  reload();
}

document.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-run]');
  if (b) { run(b.dataset.run); return; }
  const pin = e.target.closest('button[data-pin]');
  if (pin) {
    pinned = Q.togglePin(pinned, pin.dataset.pin);
    draw();
    try { await Hostwerk.storage.set('pinned', pinned); syncNewMenu(); } catch (er) { Hostwerk.toast(er.message, { kind: 'error' }); }
    return;
  }
  if (e.target.closest('[data-open-tasks]')) Hostwerk.navigate('/aufgaben');
});

const search = document.getElementById('search');
search.addEventListener('input', () => { query = search.value; draw(); });
// Enter in der Suche startet den ersten Treffer (Hostwerk fragt trotzdem vorher), Esc leert sie
search.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { const first = Q.pick(tasks || [], pinned, 1, query)[0]; if (first) run(first.id); }
  else if (e.key === 'Escape' && search.value) { search.value = ''; query = ''; draw(); }
});

// „Aufgabe starten …“ aus Schnellsuche, Neu-Menü oder Tastenkürzel: Suche fokussieren. Dieselbe Aktion kann doppelt
// ankommen (Startdaten und Ereignis) – „at“ unterscheidet sie.
let lastAction = '';
function onAction(a) {
  if (!a || `${a.id}@${a.at}` === lastAction) return;
  // Angeheftete Aufgabe aus dem Menü „Neu“: direkt starten (Hostwerk fragt vorher)
  const task = Q.taskOfAction(a);
  if (task) { lastAction = `${a.id}@${a.at}`; if ((tasks || []).some((x) => x.id === task)) run(task); else Hostwerk.toast(t('taskGone'), { kind: 'error' }); return; }
  if (a.id !== 'run') return;
  lastAction = `${a.id}@${a.at}`;
  search.focus(); search.select();
}

Hostwerk.ready().then(async (info) => {
  const label = () => search.setAttribute('aria-label', t('search'));
  label();
  try { pinned = (await Hostwerk.storage.get('pinned')) || []; } catch { pinned = []; }
  await reload();
  onAction(info.action);
  Hostwerk.on('action', onAction);
  Hostwerk.on('lang', () => { label(); draw(); });
  Live.every(15000, reload); // Aufgaben haben kein Live-Ereignis – ruhig abfragen, nur solange die Seite sichtbar ist
});
