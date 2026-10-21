'use strict';
/*
 * Quick tasks – small server part: pinned tasks show up one by one in Hostwerk's “New” menu (“Run task “Backup””,
 * SDK 2.10 host.setNewEntries). The page tells it when pins change; on start and every 10 minutes it compares with the
 * scheduled tasks again (renamed or deleted in Hostwerk). Choosing an entry opens the page with the action "t-<task id>",
 * the page starts that task – Hostwerk asks first as always (permission run:tasks).
 *   POST /api/quick-tasks/pins → { entries } – number of entries now in the “New” menu
 * Hostwerk before 3.0 has no setNewEntries – then only the fixed entry “Run task …” stays.
 */
const Q = require('../page/lib.js');

let timer = null;

function activate(host) {
  const supported = typeof host.setNewEntries === 'function';
  const sync = () => {
    if (!supported) return 0;
    try {
      const tasks = host.ctx.scheduler && typeof host.ctx.scheduler.list === 'function' ? host.ctx.scheduler.list() : [];
      const pinned = host.storage.get('pinned');
      return host.setNewEntries(Q.newEntries(tasks, Array.isArray(pinned) ? pinned : []));
    } catch (e) { host.log('new menu:', e.message); return 0; }
  };
  host.router.post('/quick-tasks/pins', (req, res) => res.json({ entries: sync(), supported }));
  sync();
  if (supported && !process.env.HW_TEST) { timer = setInterval(sync, 10 * 60000); if (timer.unref) timer.unref(); }
}

function deactivate() { clearInterval(timer); timer = null; }

module.exports = { activate, deactivate };
