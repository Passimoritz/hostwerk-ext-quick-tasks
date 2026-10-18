// Schnell-Aufgaben – Kachel: die ersten vier als Knöpfe.
const { html, t } = Hostwerk;
async function load() {
  const { list } = await Hostwerk.get('/tasks');
  const pinned = (await Hostwerk.storage.get('pinned')) || [];
  const xs = QuickTasks.pick(list, pinned, 4);
  Hostwerk.render('#btns', xs.length ? html`${xs.map((x) => html`<button class="btn sm" data-run="${x.id}" title="${x.name}"><span class="ellipsis">${x.name}</span></button>`)}` : html`<div class="muted small">${t('emptyShort')}</div>`);
}
document.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-run]'); if (!b) return;
  try { await Hostwerk.post(`/tasks/${encodeURIComponent(b.dataset.run)}/run`); Hostwerk.toast(t('started'), { kind: 'success' }); } catch (er) { if (!/declined|abgelehnt/i.test(er.message)) Hostwerk.toast(er.message, { kind: 'error' }); }
});
Hostwerk.ready().then(() => { load(); setInterval(load, 30000); });
