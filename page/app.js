// Schnell-Aufgaben – Seite: Aufgaben per großem Knopf starten (Hostwerk fragt vorher nach). Angeheftete zuerst.
const { html, t } = Hostwerk;
const Q = QuickTasks;
let pinned = [];
const BADGE = { running: 'warn', error: 'err', ok: 'ok', new: '' };
async function load() {
  const { list } = await Hostwerk.get('/tasks');
  if (!list.length) { Hostwerk.render('#grid', html`<div class="empty"><b>${t('empty')}</b>${t('emptyHint')}</div>`); return; }
  Hostwerk.render('#grid', html`${Q.pick(list, pinned).map((x) => html`<div class="card card-pad task ${Q.state(x)}">
    <div class="row"><b class="grow ellipsis">${x.name}</b><button class="btn sm ghost pin" data-pin="${x.id}" title="${t(x.pinned ? 'unpin' : 'pin')}">${x.pinned ? '★' : '☆'}</button></div>
    <div class="tiny muted">${x.actionLabel || ''}</div>
    <div class="row" style="margin-top:10px"><span class="badge ${BADGE[Q.state(x)]}">${t('state.' + Q.state(x))}</span><span class="grow"></span><button class="btn primary" data-run="${x.id}" ${Q.state(x) === 'running' ? 'disabled' : ''}>${t('run')}</button></div>
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
