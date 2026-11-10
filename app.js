/* TFG Volunteer Portal - concept prototype. All data is sample data held in the browser. */
const STORES = ['Al Quoz', 'JLT', 'Dubai Hills', 'Alserkal'];
const OPEN = '09:00', CLOSE = '21:00';
const MILESTONES = [10, 25, 50, 100, 200];
const COLORS = ['#1f5b43', '#e2674a', '#2f5f8f', '#c98a1b', '#7a4f9a', '#2d7a5a', '#a2483a', '#476b6b'];
const KEY = 'tfg-portal-demo-v1';

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9);
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T12:00'); d.setDate(d.getDate() + n); return iso(d); };
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const toTime = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const hrs = m => (Math.round(m / 6) / 10).toLocaleString(undefined, { maximumFractionDigits: 1 });
const nowTime = () => { const d = new Date(); return toTime(d.getHours() * 60 + d.getMinutes()); };
const fmtDate = (s, o = { weekday: 'short', day: 'numeric', month: 'short' }) => new Date(s + 'T12:00').toLocaleDateString('en-GB', o);
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => n.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
const color = id => COLORS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const avatar = v => `<div class="avatar" style="background:${color(v.id)}">${initials(v.name)}</div>`;

/* ---------- seed data ---------- */
function seed() {
  let r = 7; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  const t = today();
  const vols = [
    ['v1', 'Aisha Rahman', 'JLT', true, 46, 3],
    ['v2', 'Omar Haddad', 'Al Quoz', false, 132, 2],
    ['v3', 'Priya Nair', 'Al Quoz', true, 18, 5],
    ['v4', 'Lena Fischer', 'Dubai Hills', true, 64, 4],
    ['v5', 'Yusuf Ali', 'JLT', false, 7, 1],
    ['v6', 'Mariam Saeed', 'Alserkal', false, 33, 44],
    ['v7', 'Karan Mehta', 'Dubai Hills', true, 24, 6],
  ];
  const s = { volunteers: [], bookings: [], attendance: [], certs: [], emails: [], me: 'v1' };
  for (const [id, name, store, cert, target, lastAgo] of vols) {
    s.volunteers.push({ id, name, email: name.toLowerCase().replace(' ', '.') + '@example.com', phone: '+971 50 000 0000', store, wantsCert: cert, status: 'active', joined: addDays(t, -Math.round(target * 3.2) - 20), code: 'TFG-' + id.toUpperCase() + '-' + (1000 + Math.floor(rnd() * 8999)) });
    let left = target * 60, day = -lastAgo;
    while (left > 0) {
      const len = Math.min(left, [120, 150, 180, 240][Math.floor(rnd() * 4)]);
      const start = toMin('10:00') + Math.floor(rnd() * 8) * 30;
      s.attendance.push({ id: uid(), volId: id, store: rnd() > .85 ? STORES[Math.floor(rnd() * 4)] : store, date: addDays(t, day), in: toTime(start), out: toTime(start + len), minutes: len, source: rnd() > .12 ? 'qr' : 'manual', status: 'approved' });
      left -= len; day -= 3 + Math.floor(rnd() * 6);
    }
  }
  s.volunteers.push(
    { id: 'v8', name: 'Sofia Martins', email: 'sofia.m@example.com', phone: '+971 50 000 0000', store: 'Alserkal', wantsCert: true, status: 'pending', joined: addDays(t, -1), code: 'TFG-V8-4471', availability: 'Weekends, mornings' },
    { id: 'v9', name: 'Daniel Okafor', email: 'daniel.o@example.com', phone: '+971 50 000 0000', store: 'JLT', wantsCert: false, status: 'pending', joined: t, code: 'TFG-V9-2290', availability: 'Weekday evenings' },
  );
  const book = (volId, store, date, start, end, series) => s.bookings.push({ id: uid(), volId, store, date, start, end, series: series || null, status: 'booked' });
  book('v1', 'JLT', t, '10:00', '13:00');
  book('v3', 'Al Quoz', t, '14:00', '16:00');
  book('v5', 'JLT', t, '11:00', '12:30');
  book('v4', 'Dubai Hills', t, '16:00', '19:00');
  const ser = uid();
  for (let i = 1; i <= 4; i++) book('v1', 'JLT', addDays(t, i * 7 - 3), '10:00', '12:00', ser);
  book('v1', 'Alserkal', addDays(t, 2), '15:30', '18:00');
  book('v2', 'Al Quoz', addDays(t, 1), '09:30', '13:30');
  s.attendance.push({ id: uid(), volId: 'v2', store: 'Al Quoz', date: addDays(t, -2), in: '09:30', out: '14:15', minutes: 285, source: 'manual', status: 'pending', note: 'Forgot to scan out - stayed late for sorting donations' });
  s.attendance.push({ id: uid(), volId: 'v7', store: 'Dubai Hills', date: addDays(t, -1), in: '17:00', out: '19:30', minutes: 150, source: 'manual', status: 'pending', note: 'Phone died, no QR' });
  s.certs.push({ id: uid(), volId: 'v4', date: addDays(t, -3), status: 'pending', hours: 64 });
  s.emails.push({ id: uid(), volId: 'v4', kind: '50 hours', date: addDays(t, -12) });
  s.emails.push({ id: uid(), volId: 'v7', kind: '10 hours', date: addDays(t, -20) });
  return s;
}

let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { S = seed(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
let UI = { role: 'volunteer', tab: { volunteer: 'home', manager: 'today', join: 'form' }, chips: [], joined: null };
try { Object.assign(UI, JSON.parse(sessionStorage.getItem(KEY + '-ui')) || {}); } catch {}
const saveUI = () => { try { sessionStorage.setItem(KEY + '-ui', JSON.stringify(UI)); } catch {} };

/* ---------- selectors ---------- */
const vol = id => S.volunteers.find(v => v.id === id);
const me = () => vol(S.me) || S.volunteers.find(v => v.status === 'active');
const approvedMin = id => S.attendance.filter(a => a.volId === id && a.status === 'approved').reduce((t, a) => t + a.minutes, 0);
const pendingMin = id => S.attendance.filter(a => a.volId === id && a.status === 'pending').reduce((t, a) => t + a.minutes, 0);
const lastVisit = id => S.attendance.filter(a => a.volId === id && a.out).map(a => a.date).sort().pop();
const upcoming = id => S.bookings.filter(b => b.volId === id && b.status === 'booked' && b.date >= today()).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
const openAtt = id => S.attendance.find(a => a.volId === id && !a.out);
const approvalsCount = () => S.volunteers.filter(v => v.status === 'pending').length + S.attendance.filter(a => a.status === 'pending' && a.out).length + S.certs.filter(c => c.status === 'pending').length;
const nextMilestone = h => MILESTONES.find(m => m > h) || Math.ceil((h + 1) / 100) * 100;

/* ---------- ui primitives ---------- */
function toast(html) {
  const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = html;
  $('#toasts').append(el); setTimeout(() => el.remove(), 4200);
}
function modal(html) { $('#modal-root').innerHTML = `<div class="backdrop" data-action="close-bg"><div class="modal">${html}</div></div>`; }
function closeModal() { $('#modal-root').innerHTML = ''; }
function qr(text, cell = 5) { try { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: cell, margin: 0, scalable: true }); } catch { return `<div style="width:150px;height:150px;display:grid;place-items:center;line-height:1.3">${esc(text)}</div>`; } }
const storeOpts = sel => STORES.map(s => `<option ${s === sel ? 'selected' : ''}>${s}</option>`).join('');
const statusPill = a => !a.out ? '<span class="pill blue">On floor</span>' : a.status === 'approved' ? '<span class="pill green">Approved</span>' : '<span class="pill amber">Awaiting approval</span>';
const srcPill = a => a.source === 'qr' ? '<span class="pill">QR scan</span>' : '<span class="pill">Manual</span>';

/* ---------- milestone engine (Priority 2 hook) ---------- */
function checkMilestones(volId, beforeMin) {
  const before = beforeMin / 60, after = approvedMin(volId) / 60;
  const hit = MILESTONES.filter(m => before < m && after >= m);
  const v = vol(volId);
  for (const m of hit) {
    S.emails.unshift({ id: uid(), volId, kind: m + ' hours', date: today() });
    toast(`Auto thank-you sent to <b>${esc(v.name)}</b> - ${m} hours milestone`);
  }
}

/* ---------- render ---------- */
const TABS = {
  volunteer: [['home', 'Home'], ['book', 'Book a shift'], ['shifts', 'My shifts'], ['hours', 'Hours & certificate']],
  manager: [['today', 'Today & check-in'], ['approvals', 'Approvals'], ['hours', 'Hours log'], ['people', 'Volunteers'], ['insights', 'Insights']],
  join: [],
};
function render() {
  document.querySelectorAll('.role-switch button').forEach(b => b.classList.toggle('on', b.dataset.role === UI.role));
  const tab = UI.tab[UI.role];
  $('#tabs').style.display = TABS[UI.role].length ? '' : 'none';
  $('#tabs').innerHTML = TABS[UI.role].map(([k, l]) => {
    const n = k === 'approvals' ? approvalsCount() : 0;
    return `<button class="${k === tab ? 'on' : ''}" data-action="tab" data-tab="${k}">${l}${n ? `<span class="count">${n}</span>` : ''}</button>`;
  }).join('');
  $('#app').innerHTML = VIEWS[UI.role][tab]();
  saveUI();
}

const VIEWS = { volunteer: {}, manager: {}, join: {} };

/* ===== Volunteer ===== */
function volPicker() {
  const act = S.volunteers.filter(v => v.status === 'active');
  return `<select data-action="me" style="width:auto">${act.map(v => `<option value="${v.id}" ${v.id === S.me ? 'selected' : ''}>Viewing as ${esc(v.name)}</option>`).join('')}</select>`;
}
function shiftItem(b, actions = true) {
  const series = b.series ? '<span class="pill blue">Weekly</span>' : '';
  return `<div class="item"><div class="date-chip"><small>${fmtDate(b.date, { month: 'short' })}</small><b>${fmtDate(b.date, { day: 'numeric' })}</b></div>
    <div class="grow"><b>${b.start} – ${b.end} · ${esc(b.store)}</b><span class="small muted">${fmtDate(b.date, { weekday: 'long' })} · ${hrs(toMin(b.end) - toMin(b.start))} hrs ${b.date === today() ? '· <span class="today-tag">Today</span>' : ''}</span></div>
    ${series}${actions ? `<button class="btn sm" data-action="edit-shift" data-id="${b.id}">Change</button><button class="btn sm danger" data-action="cancel-shift" data-id="${b.id}">Cancel</button>` : ''}</div>`;
}
VIEWS.volunteer.home = () => {
  const v = me(), m = approvedMin(v.id), h = m / 60, next = upcoming(v.id)[0];
  const target = v.wantsCert && h < 50 ? 50 : nextMilestone(h);
  const onFloor = openAtt(v.id);
  return `<div class="page-head"><div><h1>Welcome back, ${esc(v.name.split(' ')[0])}</h1><p>Thank you for giving your time to Thrift for Good.</p></div>${volPicker()}</div>
  <div class="grid g3">
    <div class="card hero span2">
      <div class="eyebrow">${onFloor ? 'You are checked in' : 'Your next shift'}</div>
      ${onFloor ? `<h2>On the floor at ${esc(onFloor.store)} since ${onFloor.in}</h2><p class="muted">Scan your QR at the till again when you leave.</p>`
        : next ? `<h2>${fmtDate(next.date, { weekday: 'long', day: 'numeric', month: 'long' })}</h2><p class="muted">${next.start} – ${next.end} · ${esc(next.store)} store ${next.series ? '· repeats weekly' : ''}</p>
        <div class="row" style="margin-top:14px"><button class="btn ghost-light" data-action="edit-shift" data-id="${next.id}">Change time</button><button class="btn ghost-light" data-action="cancel-shift" data-id="${next.id}">Can't make it</button></div>`
        : `<h2>No shift booked yet</h2><p class="muted">Pick any time that suits you - even an hour helps.</p><div class="row" style="margin-top:14px"><button class="btn coral" data-action="tab" data-tab="book">Book a shift</button></div>`}
      <div style="margin-top:22px"><div class="row between small"><span>${hrs(m)} approved hours</span><span>${v.wantsCert && h < 50 ? 'Certificate at 50' : 'Next milestone ' + target}</span></div>
      <div class="progress" style="margin-top:8px"><i style="width:${Math.min(100, h / target * 100)}%"></i></div>
      <div class="milestones">${MILESTONES.filter(x => x <= target).map(x => `<span class="${h >= x ? 'hit' : ''}">${x}h</span>`).join('')}</div></div>
    </div>
    <div class="card"><div class="eyebrow">Your check-in code</div>
      <div style="margin-top:12px" class="qr-box">${qr(v.code)}</div>
      <p class="small muted" style="margin:10px 0 0">Show this at the till when you arrive and leave. Hours are logged automatically.</p>
      <p class="small" style="margin:4px 0 0"><code>${v.code}</code></p></div>
  </div>
  <div class="grid g4" style="margin-top:18px">
    ${statCard('Approved hours', hrs(m), pendingMin(v.id) ? hrs(pendingMin(v.id)) + ' hrs awaiting approval' : 'All up to date')}
    ${statCard('Shifts completed', S.attendance.filter(a => a.volId === v.id && a.out).length, 'since ' + fmtDate(v.joined, { month: 'short', year: 'numeric' }))}
    ${statCard('Upcoming', upcoming(v.id).length, 'shifts booked')}
    ${statCard('Thank-you notes', S.emails.filter(e => e.volId === v.id).length, 'milestones reached')}
  </div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><div class="card-head"><h3>Coming up</h3><button class="btn sm" data-action="tab" data-tab="book">+ Book</button></div>
      <div class="list">${upcoming(v.id).slice(0, 4).map(b => shiftItem(b)).join('') || '<div class="empty">Nothing booked</div>'}</div></div>
    <div class="card"><div class="card-head"><h3>Recent activity</h3></div>
      <div class="list">${S.attendance.filter(a => a.volId === v.id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4).map(a => `
        <div class="item"><div class="grow"><b>${fmtDate(a.date)} · ${esc(a.store)}</b><span class="small muted">${a.in} – ${a.out || '…'} ${a.out ? '· ' + hrs(a.minutes) + ' hrs' : ''}</span></div>${srcPill(a)}${statusPill(a)}</div>`).join('') || '<div class="empty">No shifts yet</div>'}</div></div>
  </div>`;
};
const statCard = (l, v, s) => `<div class="card stat"><div class="eyebrow">${l}</div><b>${v}</b><span>${s}</span></div>`;

function shiftForm(b = {}) {
  const d = b.date || addDays(today(), 1);
  return `<div class="fields">
    <div class="field"><label>Store</label><select name="store">${storeOpts(b.store || me().store)}</select></div>
    <div class="field"><label>Date</label><input type="date" name="date" value="${d}" min="${today()}"></div>
    <div class="field"><label>Arrive</label><input type="time" name="start" step="900" value="${b.start || '10:00'}" min="${OPEN}" max="${CLOSE}"></div>
    <div class="field"><label>Leave</label><input type="time" name="end" step="900" value="${b.end || '12:00'}" min="${OPEN}" max="${CLOSE}"></div>
  </div>
  <div class="field"><label>Quick picks</label><div class="chips">
    ${[['Morning', '09:30', '12:30'], ['Midday', '12:00', '15:00'], ['Afternoon', '15:00', '18:00'], ['Evening', '18:00', '21:00']].map(([l, s, e]) => `<button type="button" class="chip" data-action="quick" data-s="${s}" data-e="${e}">${l} <span class="small">${s}–${e}</span></button>`).join('')}
  </div></div>
  <div id="preview"></div>`;
}
function previewSlot(form) {
  const f = Object.fromEntries(new FormData(form)); const p = $('#preview', form); if (!p) return;
  const s = toMin(f.start || '0:0'), e = toMin(f.end || '0:0'), o = toMin(OPEN), c = toMin(CLOSE);
  const err = !f.start || !f.end ? 'Choose a start and end time' : e <= s ? 'Leave time must be after arrival' : e - s < 30 ? 'Minimum 30 minutes' : s < o || e > c ? `Stores are open ${OPEN}–${CLOSE}` : '';
  const others = f.date ? S.bookings.filter(b => b.status === 'booked' && b.date === f.date && b.store === f.store && b.id !== form.dataset.id).length : 0;
  p.innerHTML = err ? `<div class="err">${err}</div>` : `<div class="slot-preview">${hrs(e - s)} hours at ${esc(f.store)} · ${fmtDate(f.date, { weekday: 'long', day: 'numeric', month: 'short' })}
    <div class="timeline">${[9, 12, 15, 18, 21].map(h => `<span style="left:${(h * 60 - o) / (c - o) * 100}%">${h}:00</span>`).join('')}<i style="left:${(s - o) / (c - o) * 100}%;width:${(e - s) / (c - o) * 100}%;opacity:.85"></i></div>
    <div class="small" style="margin-top:8px;font-weight:500">${others ? `${others} other volunteer${others > 1 ? 's' : ''} booked at this store that day` : 'You’d be the first one in that day - the team will be glad of you'}</div></div>`;
  form.querySelector('[type=submit]').disabled = !!err;
  return !err;
}
VIEWS.volunteer.book = () => `<div class="page-head"><div><h1>Book a shift</h1><p>Choose any time that suits you, from 30 minutes upwards. You don't need to fit a fixed slot.</p></div>${volPicker()}</div>
  <div class="grid g3"><div class="card span2"><form data-form="book">${shiftForm()}
    <label class="check" style="margin:16px 0"><input type="checkbox" name="repeat"> Repeat this every week for the next
      <select name="weeks" style="width:auto;padding:4px 8px"><option>4</option><option selected>8</option><option>12</option></select> weeks</label>
    <button class="btn primary" type="submit">Confirm booking</button></form></div>
  <div class="card"><h3>How it works</h3><div class="list small steps" style="margin-top:8px">
    <div class="item"><div class="grow">Pick your store, day and the hours <i>you</i> can do.</div></div>
    <div class="item"><div class="grow">Change or cancel any time from <b style="display:inline">My shifts</b>. No need to message the team.</div></div>
    <div class="item"><div class="grow">Scan your QR code at the till when you arrive and leave. Your hours log themselves.</div></div>
    <div class="item"><div class="grow">Stayed longer? The QR scan records the real time automatically.</div></div></div></div></div>`;

VIEWS.volunteer.shifts = () => {
  const v = me(), up = upcoming(v.id);
  const past = S.bookings.filter(b => b.volId === v.id && (b.date < today() || b.status === 'cancelled')).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  return `<div class="page-head"><div><h1>My shifts</h1><p>Change times or cancel yourself. The store team sees it straight away.</p></div><div class="row">${volPicker()}<button class="btn primary" data-action="tab" data-tab="book">+ Book a shift</button></div></div>
  <div class="grid g2"><div class="card"><div class="card-head"><h3>Upcoming</h3><span class="pill">${up.length}</span></div><div class="list">${up.map(b => shiftItem(b)).join('') || '<div class="empty">No upcoming shifts</div>'}</div></div>
  <div class="card"><div class="card-head"><h3>Changes & past</h3></div><div class="list">${past.map(b => `<div class="item"><div class="grow"><b>${fmtDate(b.date)} · ${esc(b.store)}</b><span class="small muted">${b.start} – ${b.end}</span></div>${b.status === 'cancelled' ? '<span class="pill coral">Cancelled</span>' : '<span class="pill">Past</span>'}</div>`).join('') || '<div class="empty">Nothing yet</div>'}</div></div></div>`;
};

VIEWS.volunteer.hours = () => {
  const v = me(), m = approvedMin(v.id), h = m / 60;
  const req = S.certs.filter(c => c.volId === v.id).sort((a, b) => b.date.localeCompare(a.date))[0];
  const rows = S.attendance.filter(a => a.volId === v.id).sort((a, b) => b.date.localeCompare(a.date));
  const certBox = !v.wantsCert ? `<p class="muted">You told us you're not volunteering for a certificate, and that's great. We'll still keep an accurate record of your hours. Changed your mind?</p><button class="btn" data-action="toggle-cert">Yes, I'd like a certificate</button>`
    : req && req.status === 'pending' ? `<span class="pill amber">Requested ${fmtDate(req.date)}</span><p class="muted">The team will confirm and email your certificate.</p>`
    : req && req.status === 'issued' ? `<span class="pill green">Issued ${fmtDate(req.decided || req.date)}</span><p class="muted">Congratulations! You can request an updated certificate at any time.</p><button class="btn" data-action="req-cert">Request updated certificate</button>`
    : h >= 50 ? `<p class="muted">You've passed 50 hours. You can request your certificate now.</p><button class="btn coral" data-action="req-cert">Request certificate</button>`
    : `<p class="muted"><b style="display:inline">${hrs(50 * 60 - m)} hours</b> to go until your certificate unlocks.</p><div class="progress"><i style="width:${h / 50 * 100}%"></i></div>`;
  return `<div class="page-head"><div><h1>Hours & certificate</h1><p>Your official volunteering record with Thrift for Good.</p></div><div class="row">${volPicker()}</div></div>
  <div class="grid g3"><div class="card">${statCardInner('Approved', hrs(m) + ' hrs')}<div style="height:12px"></div>${statCardInner('Awaiting approval', hrs(pendingMin(v.id)) + ' hrs')}</div>
  <div class="card span2"><div class="card-head"><h3>50-hour certificate</h3>${v.wantsCert ? '<span class="pill green">Opted in</span>' : '<span class="pill">Not needed</span>'}</div>${certBox}</div></div>
  <div class="card" style="margin-top:18px"><div class="card-head"><h3>Hours log</h3><button class="btn sm" data-action="export" data-vol="${v.id}">Download my record</button></div>
  <div class="table-wrap"><table><thead><tr><th>Date</th><th>Store</th><th>Time</th><th>Hours</th><th>Logged by</th><th>Status</th></tr></thead><tbody>
  ${rows.map(a => `<tr><td>${fmtDate(a.date)}</td><td>${esc(a.store)}</td><td>${a.in} – ${a.out || '…'}</td><td>${a.out ? hrs(a.minutes) : '—'}</td><td>${srcPill(a)}</td><td>${statusPill(a)}</td></tr>`).join('')}</tbody></table></div></div>`;
};
const statCardInner = (l, v) => `<div class="stat"><div class="eyebrow">${l}</div><b>${v}</b></div>`;

/* ===== Join ===== */
VIEWS.join.form = () => {
  if (UI.joined) {
    const v = vol(UI.joined);
    return `<div class="card" style="max-width:560px;margin:20px auto;text-align:center"><div class="success-mark">&#10003;</div><h1>Thanks, ${esc(v?.name.split(' ')[0] || '')}!</h1>
      <p class="muted">Your application is with the ${esc(v?.store || '')} team. Next step: a one-hour induction with a team leader. We'll email you a time. Once you're approved you'll be able to book shifts and get your check-in QR code.</p>
      <div class="row" style="justify-content:center;margin-top:18px"><button class="btn primary" data-action="goto" data-role="manager" data-tab="approvals">See it in the staff view →</button><button class="btn" data-action="join-again">Register someone else</button></div>
      <p class="hint" style="margin-top:16px">This replaces the current Airtable form. Applications go straight into the staff approval queue.</p></div>`;
  }
  return `<div class="page-head"><div><h1>Volunteer with Thrift for Good</h1><p>Takes about two minutes. No Airtable, no back-and-forth.</p></div></div>
  <div class="grid g3"><form class="card span2" data-form="join">
    <div class="fields"><div class="field"><label>Full name</label><input name="name" required placeholder="e.g. Sara Ahmed"></div>
    <div class="field"><label>Email</label><input name="email" type="email" required placeholder="you@example.com"></div>
    <div class="field"><label>Mobile</label><input name="phone" placeholder="+971 …"></div>
    <div class="field"><label>Preferred store</label><select name="store">${storeOpts()}</select></div></div>
    <div class="field"><label>When are you usually free?</label><div class="chips">${['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekends'].map(c => `<button type="button" class="chip ${UI.chips.includes(c) ? 'on' : ''}" data-action="chip" data-v="${c}">${c}</button>`).join('')}</div></div>
    <div class="field"><label>Would you like a volunteering certificate after 50 hours?</label>
      <div class="chips"><label class="chip"><input type="radio" name="cert" value="yes" style="display:none" required> Yes, please</label><label class="chip"><input type="radio" name="cert" value="no" style="display:none"> No thanks, I'm here for the fun</label></div>
      <span class="hint">This only changes the reminders you get. We track everyone's hours either way.</span></div>
    <div class="field"><label>Anything we should know? (optional)</label><textarea name="notes" rows="2" placeholder="Skills, languages, accessibility needs…"></textarea></div>
    <label class="check" style="margin-bottom:16px"><input type="checkbox" required> I agree to Thrift for Good's volunteer code of conduct and for my hours to be stored for my record.</label>
    <button class="btn primary" type="submit">Submit application</button></form>
  <div class="card"><h3>Your journey</h3><div class="list small steps" style="margin-top:8px">
    ${[['Apply', 'This form'], ['Induction', '1 hour with a team leader'], ['Approved', 'Get your portal and QR code'], ['Book & volunteer', 'Any hours that suit you'], ['Celebrate', 'Milestones, badges, certificate']].map(([a, b], i) => `<div class="item"><div class="avatar" style="background:${i ? 'var(--surface-2);color:var(--ink-2)' : 'var(--green)'}">${i + 1}</div><div class="grow"><b>${a}</b><span class="muted">${b}</span></div></div>`).join('')}</div></div></div>`;
};

/* ===== Manager ===== */
VIEWS.manager.today = () => {
  const t = today(), exp = S.bookings.filter(b => b.date === t && b.status === 'booked').sort((a, b) => a.start.localeCompare(b.start));
  const floor = S.attendance.filter(a => !a.out);
  const done = S.attendance.filter(a => a.date === t && a.out);
  return `<div class="page-head"><div><h1>Today · ${fmtDate(t, { weekday: 'long', day: 'numeric', month: 'long' })}</h1><p>Scan volunteers in and out at the till.</p></div>
    <button class="btn" data-action="manual">+ Add hours manually</button></div>
  <div class="grid g3">
    <div class="scanner"><div class="eyebrow" style="color:#9fb2a7">Till scanner</div><h3 style="margin-top:4px">Scan a volunteer QR</h3>
      <div class="viewfinder"><span class="hint">Point camera at QR code</span></div>
      <form data-form="scan" class="row" style="flex-wrap:nowrap"><input name="code" placeholder="…or type code e.g. TFG-V1-…" autocomplete="off"><button class="btn coral" type="submit">Scan</button></form>
      <p class="hint" style="margin:10px 0 0">Demo: tap “Scan in” on anyone in the list to simulate a scan.</p></div>
    <div class="card span2"><div class="card-head"><h3>Expected today</h3><span class="pill">${exp.length} booked</span></div><div class="list">
    ${exp.map(b => { const v = vol(b.volId), o = openAtt(b.volId), d = done.find(a => a.volId === b.volId);
      return `<div class="item">${avatar(v)}<div class="grow"><b>${esc(v.name)}</b><span class="small muted">${b.start} – ${b.end} · ${esc(b.store)}</span></div>
      ${o ? `<span class="pill blue">In since ${o.in}</span><button class="btn sm primary" data-action="scan" data-code="${v.code}">Scan out</button>`
        : d ? `<span class="pill green">${hrs(d.minutes)} hrs logged</span>` : `<button class="btn sm" data-action="scan" data-code="${v.code}">Scan in</button>`}</div>`; }).join('') || '<div class="empty">No bookings today</div>'}
    </div></div></div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><div class="card-head"><h3>On the floor now</h3><span class="pill blue">${floor.length}</span></div><div class="list">
      ${floor.map(a => { const v = vol(a.volId); return `<div class="item">${avatar(v)}<div class="grow"><b>${esc(v.name)}</b><span class="small muted">${esc(a.store)} · since ${a.in}</span></div><button class="btn sm" data-action="scan" data-code="${v.code}">Scan out</button></div>`; }).join('') || '<div class="empty">Nobody checked in yet</div>'}</div></div>
    <div class="card"><div class="card-head"><h3>Walk-ins welcome</h3></div><p class="small muted" style="margin-top:0">Volunteers without a booking can still scan in. Their hours are logged the same way.</p>
      <div class="list">${S.volunteers.filter(v => v.status === 'active' && !exp.some(b => b.volId === v.id) && !openAtt(v.id)).slice(0, 4).map(v => `<div class="item">${avatar(v)}<div class="grow"><b>${esc(v.name)}</b><span class="small muted">${esc(v.store)}</span></div><button class="btn sm" data-action="scan" data-code="${v.code}">Scan in</button></div>`).join('')}</div></div></div>`;
};

VIEWS.manager.approvals = () => {
  const nv = S.volunteers.filter(v => v.status === 'pending');
  const hp = S.attendance.filter(a => a.status === 'pending' && a.out);
  const cr = S.certs.filter(c => c.status === 'pending');
  const sect = (title, n, body) => `<div class="card"><div class="card-head"><h3>${title}</h3><span class="pill ${n ? 'coral' : 'green'}">${n || 'All clear'}</span></div><div class="list">${body || '<div class="empty">Nothing waiting</div>'}</div></div>`;
  return `<div class="page-head"><div><h1>Approvals</h1><p>Everything that needs a staff decision, in one place.</p></div></div>
  <div class="grid g3">
  ${sect('New volunteers', nv.length, nv.map(v => `<div class="item stack">${avatar(v)}<div class="grow"><b>${esc(v.name)}</b><span class="small muted">${esc(v.store)} · applied ${fmtDate(v.joined)}<br>${esc(v.availability || '')}${v.wantsCert ? ' · wants certificate' : ''}</span></div>
     <div class="row"><button class="btn sm primary" data-action="approve-vol" data-id="${v.id}">Approve after induction</button><button class="btn sm danger" data-action="decline-vol" data-id="${v.id}">Decline</button></div></div>`).join(''))}
  ${sect('Hours to confirm', hp.length, hp.map(a => { const v = vol(a.volId); return `<div class="item stack">${avatar(v)}<div class="grow"><b>${esc(v.name)} · ${hrs(a.minutes)} hrs</b><span class="small muted">${fmtDate(a.date)} · ${esc(a.store)} · ${a.in}–${a.out}${a.note ? '<br>“' + esc(a.note) + '”' : ''}</span></div>
     <div class="row"><button class="btn sm primary" data-action="approve-hrs" data-id="${a.id}">Approve</button><button class="btn sm danger" data-action="reject-hrs" data-id="${a.id}">Reject</button></div></div>`; }).join(''))}
  ${sect('Certificate requests', cr.length, cr.map(c => { const v = vol(c.volId); return `<div class="item stack">${avatar(v)}<div class="grow"><b>${esc(v.name)}</b><span class="small muted">${hrs(approvedMin(v.id))} approved hrs · requested ${fmtDate(c.date)}</span></div>
     <div class="row"><button class="btn sm" data-action="preview-cert" data-id="${c.id}">Preview</button><button class="btn sm primary" data-action="issue-cert" data-id="${c.id}">Issue</button></div></div>`; }).join(''))}
  </div>`;
};

VIEWS.manager.hours = () => {
  const f = UI.filter || 'All';
  const rows = S.attendance.filter(a => a.out && (f === 'All' || a.store === f)).sort((a, b) => (b.date + b.in).localeCompare(a.date + a.in));
  const total = rows.filter(a => a.status === 'approved').reduce((t, a) => t + a.minutes, 0);
  return `<div class="page-head"><div><h1>Hours log</h1><p>The official record of volunteer hours, ready to export for CDA.</p></div>
    <div class="row"><select data-action="filter" style="width:auto">${['All', ...STORES].map(s => `<option ${s === f ? 'selected' : ''}>${s}</option>`).join('')}</select>
    <button class="btn" data-action="manual">+ Manual entry</button><button class="btn primary" data-action="export">Export CSV</button></div></div>
  <div class="grid g4" style="margin-bottom:18px">${statCard('Approved hours', hrs(total), f === 'All' ? 'all stores' : f)}${statCard('Entries', rows.length, 'shown below')}
    ${statCard('Logged by QR', Math.round(rows.filter(a => a.source === 'qr').length / Math.max(1, rows.length) * 100) + '%', 'no staff typing needed')}${statCard('Pending', rows.filter(a => a.status === 'pending').length, 'awaiting approval')}</div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Volunteer</th><th>Date</th><th>Store</th><th>Time</th><th>Hours</th><th>Logged by</th><th>Status</th></tr></thead><tbody>
  ${rows.slice(0, 60).map(a => { const v = vol(a.volId); return `<tr><td><div class="row" style="flex-wrap:nowrap">${avatar(v)}${esc(v.name)}</div></td><td>${fmtDate(a.date)}</td><td>${esc(a.store)}</td><td>${a.in}–${a.out}</td><td><b>${hrs(a.minutes)}</b></td><td>${srcPill(a)}</td><td>${statusPill(a)}</td></tr>`; }).join('')}
  </tbody></table></div>${rows.length > 60 ? `<p class="hint">Showing latest 60 of ${rows.length}. Export includes all.</p>` : ''}</div>`;
};

VIEWS.manager.people = () => {
  const act = S.volunteers.filter(v => v.status === 'active').map(v => ({ v, m: approvedMin(v.id), last: lastVisit(v.id) })).sort((a, b) => b.m - a.m);
  const quiet = act.filter(x => x.last && daysBetween(x.last, today()) > 30);
  return `<div class="page-head"><div><h1>Volunteers</h1><p>${act.length} active · ${S.volunteers.filter(v => v.status === 'pending').length} awaiting induction</p></div></div>
  ${quiet.length ? `<div class="notice"><div class="row between"><div><b>${quiet.length} volunteer${quiet.length > 1 ? 's have' : ' has'} gone quiet</b><div class="small muted">No visit in over 30 days: ${quiet.map(x => esc(x.v.name)).join(', ')}</div></div><button class="btn" data-action="nudge" data-id="${quiet[0].v.id}">Preview check-in email</button></div></div>` : ''}
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Name</th><th>Home store</th><th>Approved hours</th><th>Certificate</th><th>Last visit</th><th>Next shift</th></tr></thead><tbody>
  ${act.map(({ v, m, last }) => { const n = upcoming(v.id)[0], ago = last ? daysBetween(last, today()) : null; return `<tr><td><div class="row" style="flex-wrap:nowrap">${avatar(v)}<div><b>${esc(v.name)}</b><div class="small muted">${esc(v.email)}</div></div></div></td><td>${esc(v.store)}</td>
    <td><b>${hrs(m)}</b>${m / 60 >= 50 ? ' <span class="pill green">50+</span>' : ''}</td><td>${v.wantsCert ? (S.certs.some(c => c.volId === v.id && c.status === 'issued') ? '<span class="pill green">Issued</span>' : '<span class="pill blue">Opted in</span>') : '<span class="pill">Not needed</span>'}</td>
    <td>${last ? (ago > 30 ? `<span class="pill amber">${ago} days ago</span>` : ago === 0 ? 'Today' : ago + ' days ago') : '—'}</td><td>${n ? fmtDate(n.date) + ' · ' + n.start : '<span class="muted">—</span>'}</td></tr>`; }).join('')}</tbody></table></div></div>`;
};

VIEWS.manager.insights = () => {
  const appr = S.attendance.filter(a => a.status === 'approved' && a.out);
  const since = addDays(today(), -28);
  const byStore = STORES.map(s => [s, appr.filter(a => a.store === s && a.date >= since).reduce((t, a) => t + a.minutes, 0)]);
  const mx = Math.max(1, ...byStore.map(x => x[1]));
  const weeks = Array.from({ length: 8 }, (_, i) => { const end = addDays(today(), -7 * (7 - i)), start = addDays(end, -6); return [start, appr.filter(a => a.date >= start && a.date <= end).reduce((t, a) => t + a.minutes, 0)]; });
  const wmx = Math.max(1, ...weeks.map(w => w[1]));
  return `<div class="page-head"><div><h1>Insights</h1><p>Volunteer hours across all stores.</p></div></div>
  <div class="grid g4" style="margin-bottom:18px">${statCard('Hours · last 4 weeks', hrs(byStore.reduce((t, x) => t + x[1], 0)), 'approved, all stores')}
  ${statCard('Active volunteers', S.volunteers.filter(v => v.status === 'active').length, 'with portal access')}
  ${statCard('Reached 50 hrs', S.volunteers.filter(v => approvedMin(v.id) >= 3000).length, 'certificate eligible')}
  ${statCard('Thank-you emails', S.emails.length, 'sent automatically')}</div>
  <div class="grid g2"><div class="card"><div class="card-head"><h3>Hours by store</h3><span class="small muted">last 4 weeks</span></div><div class="bars">
    ${byStore.map(([s, m]) => `<div class="bar-row"><span>${s}</span><div class="bar-track"><i style="width:${m / mx * 100}%"></i></div><b>${hrs(m)}h</b></div>`).join('')}</div></div>
  <div class="card"><div class="card-head"><h3>Weekly hours</h3><span class="small muted">last 8 weeks</span></div><div class="cols">
    ${weeks.map(([s, m], i) => `<div class="col"><em>${hrs(m)}</em><i class="${i === 7 ? 'cur' : ''}" style="height:${Math.max(3, m / wmx * 110)}px"></i><small>${fmtDate(s, { day: 'numeric', month: 'short' })}</small></div>`).join('')}</div></div></div>
  <div class="card" style="margin-top:18px"><div class="card-head"><h3>Automatic milestone emails</h3><span class="pill blue">Links to Priority 2 · Engagement</span></div>
    <p class="small muted" style="margin-top:0">Every QR check-out runs a rule: first shift, 10 / 25 / 50 / 100 hours, back after a long break. When a rule matches, a personal thank-you is sent with no staff time needed.</p>
    <div class="list">${S.emails.slice(0, 6).map(e => { const v = vol(e.volId); return `<div class="item">${avatar(v)}<div class="grow"><b>${esc(v.name)} · ${e.kind}</b><span class="small muted">${fmtDate(e.date)}</span></div><button class="btn sm" data-action="email" data-id="${e.id}">View email</button></div>`; }).join('')}</div></div>`;
};

/* ---------- modals ---------- */
function emailHTML(v, kind) {
  const first = esc(v.name.split(' ')[0]);
  if (kind === 'welcome') return `<div class="email"><header><b>To:</b> ${esc(v.email)}<br><b>Subject:</b> Welcome to Thrift for Good</header><div><p>Hi ${first},</p><p>Welcome to the team! Your induction is complete and your volunteer portal is ready.</p><p>Book your first shift at any time that suits you and show your QR code at the till when you arrive. Your hours will log themselves.</p><p>See you soon,<br>The Thrift for Good team</p></div></div>`;
  const body = kind === 'quiet'
    ? `<p>Hi ${first},</p><p>We've missed you at ${esc(v.store)}! It's been a little while since your last shift. Life gets busy, we totally get it.</p><p>If you'd like to come back, you can book any time that suits you, even just an hour. And if you need a break or want to step away, just reply and let us know. No pressure at all.</p><p>Warmly,<br>The Thrift for Good team</p>`
    : `<p>Hi ${first},</p><p>You've just passed <b>${kind}</b> volunteering with Thrift for Good. That's ${kind} of sorting, styling and helping customers that goes straight to supporting children's charities.</p><p>We notice the effort you put in, and we're so grateful. Thank you for being part of the family.</p><p>With love,<br>The Thrift for Good team</p>`;
  return `<div class="email"><header><b>To:</b> ${esc(v.email)}<br><b>Subject:</b> ${kind === 'quiet' ? 'We miss you at Thrift for Good' : `${kind} - thank you, ${first}!`}</header><div>${body}</div></div>`;
}
const MODALS = {
  edit(b) {
    modal(`<h2>Change shift</h2><p class="muted">Adjust your hours. Staying longer or leaving earlier is fine.</p><form data-form="edit" data-id="${b.id}">${shiftForm(b)}
      ${b.series ? `<label class="check" style="margin:8px 0 14px"><input type="checkbox" name="all"> Apply to all future weekly shifts in this series</label>` : ''}
      <div class="row" style="justify-content:flex-end;margin-top:8px"><button type="button" class="btn" data-action="close">Back</button><button class="btn primary" type="submit">Save changes</button></div></form>`);
    previewSlot($('#modal-root form'));
  },
  manual() {
    const act = S.volunteers.filter(v => v.status === 'active');
    modal(`<h2>Add hours manually</h2><p class="muted">For when someone forgot to scan or their phone died. Manual entries go to Approvals.</p><form data-form="manual">
      <div class="field"><label>Volunteer</label><select name="volId">${act.map(v => `<option value="${v.id}">${esc(v.name)}</option>`).join('')}</select></div>
      <div class="fields"><div class="field"><label>Store</label><select name="store">${storeOpts()}</select></div><div class="field"><label>Date</label><input type="date" name="date" value="${today()}" max="${today()}"></div>
      <div class="field"><label>In</label><input type="time" name="in" value="10:00"></div><div class="field"><label>Out</label><input type="time" name="out" value="13:00"></div></div>
      <div class="field"><label>Reason</label><input name="note" placeholder="e.g. Forgot to scan out"></div><div class="err" id="merr"></div>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-action="close">Cancel</button><button class="btn primary" type="submit">Submit for approval</button></div></form>`);
  },
  checkout(a) {
    const v = vol(a.volId), b = S.bookings.find(x => x.volId === a.volId && x.date === a.date && x.status === 'booked');
    const out = toMin(nowTime()) > toMin(a.in) + 15 ? nowTime() : (b?.end || toTime(toMin(a.in) + 120));
    modal(`<div class="row">${avatar(v)}<div><h2>Check out ${esc(v.name)}</h2><span class="muted small">Checked in ${a.in} at ${esc(a.store)}</span></div></div>
      <form data-form="checkout" data-id="${a.id}" style="margin-top:16px"><div class="fields"><div class="field"><label>Checked in</label><input type="time" name="in" value="${a.in}"></div><div class="field"><label>Checking out</label><input type="time" name="out" value="${out}"></div></div>
      <p class="hint">In the live version these times come straight from the scan. They're editable here so the demo works at any time of day.</p>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-action="close">Cancel</button><button class="btn primary" type="submit">Confirm check-out</button></div></form>`);
  },
  cert(c) {
    const v = vol(c.volId);
    modal(`<div style="border:6px double var(--green);border-radius:12px;padding:30px;text-align:center;background:#fffdf6"><div class="eyebrow">Certificate of volunteering</div>
      <h1 style="margin:14px 0 6px">${esc(v.name)}</h1><p class="muted">has generously given</p><h2 style="color:var(--coral)">${hrs(approvedMin(v.id))} hours</h2>
      <p class="muted">of volunteer service to Thrift for Good, supporting children's charities across the UAE.</p><div class="row between small muted" style="margin-top:22px"><span>${fmtDate(today(), { day: 'numeric', month: 'long', year: 'numeric' })}</span><span>Thrift for Good</span></div></div>
      <p class="hint">Template placeholder. We'll match TFG's real certificate design once shared.</p><div class="row" style="justify-content:flex-end"><button class="btn" data-action="close">Close</button><button class="btn primary" data-action="issue-cert" data-id="${c.id}">Issue & email</button></div>`);
  },
};

/* ---------- actions ---------- */
function scan(code) {
  const v = S.volunteers.find(x => x.code.toLowerCase() === code.trim().toLowerCase());
  if (!v) return toast('Code not recognised');
  if (v.status !== 'active') return toast(`${esc(v.name)} hasn't completed induction yet`);
  const o = openAtt(v.id);
  if (o) return MODALS.checkout(o);
  const b = S.bookings.find(x => x.volId === v.id && x.date === today() && x.status === 'booked');
  const t = nowTime(), inT = toMin(t) >= toMin(OPEN) && toMin(t) < toMin(CLOSE) - 30 ? t : (b?.start || '10:00');
  S.attendance.push({ id: uid(), volId: v.id, store: b?.store || v.store, date: today(), in: inT, out: null, minutes: 0, source: 'qr', status: 'pending' });
  save(); render(); toast(`<b>${esc(v.name)}</b> checked in at ${inT}`);
}
function downloadCSV(volId) {
  const rows = S.attendance.filter(a => a.out && (!volId || a.volId === volId)).sort((a, b) => a.date.localeCompare(b.date));
  const head = ['volunteer_id', 'name', 'email', 'store', 'date', 'check_in', 'check_out', 'hours', 'source', 'status'];
  const q = s => `"${String(s).replace(/"/g, '""')}"`;
  const csv = [head.join(','), ...rows.map(a => { const v = vol(a.volId); return [v.id, v.name, v.email, a.store, a.date, a.in, a.out, (a.minutes / 60).toFixed(2), a.source, a.status].map(q).join(','); })].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const el = Object.assign(document.createElement('a'), { href: url, download: `tfg-volunteer-hours-${volId || 'all'}-${today()}.csv` });
  document.body.append(el); el.click(); el.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`Exported ${rows.length} entries (CDA-ready CSV)`);
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-action]'); if (!t) return;
  const a = t.dataset.action, id = t.dataset.id;
  if (a === 'close-bg') { if (e.target === t) closeModal(); return; }
  if (['me', 'filter'].includes(a)) return;
  const ok = msg => { save(); render(); if (msg) toast(msg); };
  switch (a) {
    case 'role': UI.role = t.dataset.role; render(); scrollTo(0, 0); break;
    case 'tab': UI.tab[UI.role] = t.dataset.tab; closeModal(); render(); scrollTo(0, 0); break;
    case 'goto': UI.role = t.dataset.role; UI.tab[UI.role] = t.dataset.tab; render(); scrollTo(0, 0); break;
    case 'close': closeModal(); break;
    case 'reset': if (confirm('Reset all demo data?')) { S = seed(); UI.joined = null; UI.chips = []; ok('Demo data reset'); } break;
    case 'quick': { const f = t.closest('form'); f.start.value = t.dataset.s; f.end.value = t.dataset.e; previewSlot(f); break; }
    case 'chip': UI.chips = UI.chips.includes(t.dataset.v) ? UI.chips.filter(x => x !== t.dataset.v) : [...UI.chips, t.dataset.v]; t.classList.toggle('on'); break;
    case 'edit-shift': MODALS.edit(S.bookings.find(b => b.id === id)); break;
    case 'cancel-shift': { const b = S.bookings.find(x => x.id === id); if (confirm(`Cancel your ${b.start}–${b.end} shift on ${fmtDate(b.date)}?`)) { b.status = 'cancelled'; ok('Shift cancelled. The store team has been notified.'); } break; }
    case 'scan': scan(t.dataset.code); break;
    case 'manual': MODALS.manual(); break;
    case 'approve-vol': { const v = vol(id); v.status = 'active'; S.emails.unshift({ id: uid(), volId: id, kind: 'welcome', date: today() }); ok(`${esc(v.name)} approved. Welcome email and QR code sent.`); break; }
    case 'decline-vol': { const v = vol(id); if (confirm(`Decline ${v.name}'s application?`)) { S.volunteers = S.volunteers.filter(x => x.id !== id); ok('Application declined'); } break; }
    case 'approve-hrs': { const at = S.attendance.find(x => x.id === id), before = approvedMin(at.volId); at.status = 'approved'; checkMilestones(at.volId, before); ok(`${hrs(at.minutes)} hrs approved for ${esc(vol(at.volId).name)}`); break; }
    case 'reject-hrs': S.attendance = S.attendance.filter(x => x.id !== id); ok('Entry rejected'); break;
    case 'preview-cert': MODALS.cert(S.certs.find(c => c.id === id)); break;
    case 'issue-cert': { const c = S.certs.find(x => x.id === id); c.status = 'issued'; c.decided = today(); closeModal(); ok(`Certificate issued and emailed to ${esc(vol(c.volId).name)}`); break; }
    case 'req-cert': S.certs.push({ id: uid(), volId: S.me, date: today(), status: 'pending', hours: approvedMin(S.me) / 60 }); ok('Certificate requested. The team will confirm soon.'); break;
    case 'toggle-cert': me().wantsCert = true; ok('You’re opted in for the 50-hour certificate'); break;
    case 'export': downloadCSV(t.dataset.vol); break;
    case 'email': { const em = S.emails.find(x => x.id === id), v = vol(em.volId); modal(`<h2 style="margin-bottom:14px">Automated email</h2>${emailHTML(v, em.kind)}<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn" data-action="close">Close</button></div>`); break; }
    case 'nudge': modal(`<h2 style="margin-bottom:6px">“Going quiet” check-in</h2><p class="muted small">Sent automatically after 30 days without a visit.</p>${emailHTML(vol(id), 'quiet')}<div class="row" style="justify-content:flex-end;margin-top:14px"><button class="btn" data-action="close">Close</button><button class="btn primary" data-action="close" onclick="setTimeout(()=>toast('Check-in email sent'),50)">Send now</button></div>`); break;
    case 'join-again': UI.joined = null; UI.chips = []; render(); break;
  }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.action === 'me') { S.me = t.value; save(); render(); }
  if (t.dataset.action === 'filter') { UI.filter = t.value; render(); }
});
document.addEventListener('input', e => { const f = e.target.closest('form[data-form=book],form[data-form=edit]'); if (f) previewSlot(f); });
document.addEventListener('change', e => { const r = e.target; if (r.name === 'cert') r.closest('.chips').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.contains(r))); });

document.addEventListener('submit', e => {
  const f = e.target, kind = f.dataset.form; if (!kind) return; e.preventDefault();
  const d = Object.fromEntries(new FormData(f));
  if (kind === 'book') {
    if (!previewSlot(f)) return;
    const n = d.repeat ? +d.weeks : 1, series = n > 1 ? uid() : null;
    for (let i = 0; i < n; i++) S.bookings.push({ id: uid(), volId: S.me, store: d.store, date: addDays(d.date, i * 7), start: d.start, end: d.end, series, status: 'booked' });
    save(); UI.tab.volunteer = 'shifts'; render();
    toast(`Booked ${n > 1 ? n + ' weekly shifts' : 'your shift'} at ${esc(d.store)}, ${d.start}–${d.end}`);
  }
  if (kind === 'edit') {
    if (!previewSlot(f)) return;
    const b = S.bookings.find(x => x.id === f.dataset.id);
    const targets = d.all && b.series ? S.bookings.filter(x => x.series === b.series && x.date >= b.date && x.status === 'booked') : [b];
    targets.forEach(x => { x.start = d.start; x.end = d.end; x.store = d.store; if (x === b) x.date = d.date; });
    closeModal(); save(); render(); toast(`Updated ${targets.length > 1 ? targets.length + ' shifts' : 'shift'}. No staff action needed.`);
  }
  if (kind === 'scan') { scan(d.code); f.reset(); }
  if (kind === 'manual') {
    const m = toMin(d.out) - toMin(d.in); if (m <= 0) { $('#merr').textContent = 'Out time must be after in time'; return; }
    S.attendance.push({ id: uid(), volId: d.volId, store: d.store, date: d.date, in: d.in, out: d.out, minutes: m, source: 'manual', status: 'pending', note: d.note });
    closeModal(); save(); render(); toast(`${hrs(m)} hrs added for ${esc(vol(d.volId).name)}. Sent to Approvals.`);
  }
  if (kind === 'checkout') {
    const at = S.attendance.find(x => x.id === f.dataset.id), m = toMin(d.out) - toMin(d.in);
    if (m <= 0) return toast('Check-out must be after check-in');
    const before = approvedMin(at.volId);
    Object.assign(at, { in: d.in, out: d.out, minutes: m, status: 'approved' });
    closeModal(); save(); render(); toast(`<b>${esc(vol(at.volId).name)}</b> checked out · ${hrs(m)} hrs logged automatically`);
    checkMilestones(at.volId, before); save(); render();
  }
  if (kind === 'join') {
    if (!d.cert) return toast('Please answer the certificate question');
    const id = 'v' + uid();
    S.volunteers.push({ id, name: d.name, email: d.email, phone: d.phone, store: d.store, wantsCert: d.cert === 'yes', status: 'pending', joined: today(), code: 'TFG-' + id.slice(1, 5).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 8999), availability: UI.chips.join(', ') || 'Flexible', notes: d.notes });
    UI.joined = id; UI.chips = []; save(); render(); scrollTo(0, 0);
  }
});

render();
