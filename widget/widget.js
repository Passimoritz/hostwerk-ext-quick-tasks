// Schnell-Aufgaben – Kachel: die ersten vier als Knöpfe, mit Zustand (läuft, zuletzt Fehler) und Fehlerzustand.
const { html, t } = Hostwerk;
const Q = QuickTasks;
const running = new Set();
async function load() {
  const { list } = await Hostwerk.get('/tasks');
  let pinned = [];
  try { pinned = (await Hostwerk.storage.get('pinned')) || []; } catch { /* ohne Speicher: nur nach letztem Lauf */ }
  const xs = Q.pick(list, pinned, 4);
  Hostwerk.render('#btns', xs.length
    ? html`${xs.map((x) => { const st = running.has(x.id) ? 'running' : Q.state(x); return html`<button type="button" class="btn sm" data-run="${x.id}" data-state="${st}" title="${`${x.name} – ${t('state.' + st)}`}" aria-label="${t('runName', { name: x.name })}" ${st === 'running' ? Hostwerk.raw('disabled') : ''}><span class="ellipsis">${x.pinned ? '★ ' : ''}${x.name}</span></button>`; })}`
    : html`<div class="muted small">${t('emptyShort')}</div>`);
}
const reload = () => Live.guard(Hostwerk, '#btns', load, { compact: true });
document.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-run]'); if (!b) return;
  const id = b.dataset.run;
  running.add(id); reload();
  try {
    const r = Q.result(await Hostwerk.post(`/tasks/${encodeURIComponent(id)}/run`));
    if (r) Hostwerk.toast(t(r.status === 'error' ? 'doneErrorShort' : 'doneOkShort'), { kind: r.status === 'error' ? 'error' : 'success' });
  } catch (er) {
    if (Q.stillRunning(er)) Hostwerk.toast(t('stillRunningShort'));
    else if (!Q.declined(er)) Hostwerk.toast(er.message, { kind: 'error' });
  }
  running.delete(id); reload();
});
Hostwerk.ready().then(() => { reload(); Live.every(30000, reload); Hostwerk.on('lang', reload); });
