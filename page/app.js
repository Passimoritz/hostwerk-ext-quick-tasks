// Schnell-Aufgaben – Seite: Aufgaben per großem Knopf starten (Hostwerk fragt vorher nach). Angeheftete zuerst.
const { html, t } = Hostwerk;
const Q = QuickTasks;
let pinned = [];
const BADGE = { running: 'hw-warn', error: 'hw-err', ok: 'hw-ok', new: '' };
async function load() {
  const { list } = await Hostwerk.get('/tasks');
  if (!list.length) { Hostwerk.render('#grid', html`<div class="hw-empty"><b>${t('empty')}</b>${t('emptyHint')}</div>`); return; }
  Hostwerk.render('#grid', html`${Q.pick(list, pinned).map((x) => html`<div class="hw-card task ${Q.state(x)}">
    <div class="hw-row"><b class="hw-grow hw-ellipsis">${x.name}</b><button class="hw-btn hw-sm hw-ghost pin" data-pin="${x.id}" title="${t(x.pinned ? 'unpin' : 'pin')}">${x.pinned ? '★' : '☆'}</button></div>
    <div class="hw-tiny hw-muted">${x.actionLabel || ''}</div>
    <div class="hw-row" style="margin-top:10px"><span class="hw-badge ${BADGE[Q.state(x)]}">${t('state.' + Q.state(x))}</span><span class="hw-grow"></span><button class="hw-btn hw-primary" data-run="${x.id}" ${Q.state(x) === 'running' ? 'disabled' : ''}>${t('run')}</button></div>
  </div>`)}`);
}
document.addEventListener('click', async (e) => {
  const run = e.target.closest('button[data-run]');
  if (run) {
    run.disabled = true;
    try { await Hostwerk.post(`/tasks/${encodeURIComponent(run.dataset.run)}/run`); Hostwerk.toast(t('started'), { kind: 'success' }); } catch (er) { if (!/declined|abgelehnt/i.test(er.message)) Hostwerk.toast(er.message, { kind: 'error' }); }
    setTimeout(load, 1500);
    return;
  }
  const pin = e.target.closest('button[data-pin]');
  if (pin) { pinned = Q.togglePin(pinned, pin.dataset.pin); await Hostwerk.storage.set('pinned', pinned); load(); }
});
Hostwerk.ready().then(async () => { pinned = (await Hostwerk.storage.get('pinned')) || []; load(); setInterval(load, 15000); Hostwerk.on('lang', load); });
