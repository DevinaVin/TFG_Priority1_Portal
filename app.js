/* TFG Volunteer Portal - prototype. All data is sample data held in this browser. */
const STORES = ['Al Quoz', 'JLT', 'Dubai Hills', 'Alserkal'];
const STORE_NOTE = { 'Al Quoz': 'Warehouse + shop', 'JLT': 'Cluster D', 'Dubai Hills': 'Mall, level 1', 'Alserkal': 'Avenue, unit 34' };
const OPEN = 9 * 60, CLOSE = 21 * 60, STEP = 30;
const MILESTONES = [10, 25, 50, 100, 200];
const TONES = ['#0f6b4f', '#b0442a', '#3b5d86', '#a0731a', '#6d4c8c', '#2f7d6d', '#8a4b3a', '#4f6650'];
const KEY = 'tfg-portal-demo-v2';

/* ---------- icons ---------- */
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
  inbox: '<path d="M3 13h5l2 3h4l2-3h5"/><path d="M5.5 5h13L21 13v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  chart: '<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/>',
  dl: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  join: '<circle cx="10" cy="8" r="4"/><path d="M3 21a7 7 0 0 1 14 0M19 8v6M16 11h6"/>',
  warn: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  spark: '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
};
const ic = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9);
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + 'T12:00'); d.setDate(d.getDate() + n); return iso(d); };
const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const toTime = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const hrs = m => (Math.round(m / 6) / 10).toLocaleString('en-GB', { maximumFractionDigits: 1 });
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const fd = (s, o = { weekday: 'short', day: 'numeric', month: 'short' }) => new Date(s + 'T12:00').toLocaleDateString('en-GB', o);
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const initials = n => n.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
const tone = id => TONES[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];
const avatar = v => `<div class="avatar" style="background:${tone(v.id)}">${initials(v.name)}</div>`;
const first = v => esc(v.name.split(' ')[0]);
const relDay = d => { const n = daysBetween(today(), d); return n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n > 1 && n < 7 ? fd(d, { weekday: 'long' }) : fd(d); };

/* ---------- seed ---------- */
function seed() {
  let r = 11; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  const t = today();
  const vols = [
    ['v1', 'Aisha Rahman', 'JLT', true, 46.5, 3],
    ['v2', 'Omar Haddad', 'Al Quoz', false, 132, 2],
    ['v3', 'Priya Nair', 'Al Quoz', true, 18, 5],
    ['v4', 'Lena Fischer', 'Dubai Hills', true, 64, 4],
    ['v5', 'Yusuf Al Marzouqi', 'JLT', false, 7.5, 1],
    ['v6', 'Mariam Saeed', 'Alserkal', false, 33, 44],
    ['v7', 'Karan Mehta', 'Dubai Hills', true, 24, 6],
    ['v10', 'Chloé Barbier', 'Alserkal', false, 88, 2],
  ];
  const s = { volunteers: [], bookings: [], attendance: [], certs: [], emails: [], me: 'v1', scans: [] };
  for (const [id, name, store, cert, target, lastAgo] of vols) {
    s.volunteers.push({ id, name, email: name.toLowerCase().split(' ').join('.') + '@example.com', store, wantsCert: cert, status: 'active', joined: addDays(t, -Math.round(target * 3.1) - 21), code: 'TFG-' + id.toUpperCase() + '-' + (1000 + Math.floor(rnd() * 8999)) });
    let left = target * 60, day = -lastAgo;
    while (left > 0) {
      const len = Math.min(left, [120, 150, 180, 210, 240][Math.floor(rnd() * 5)]);
      const start = 10 * 60 + Math.floor(rnd() * 14) * 30;
      s.attendance.push({ id: uid(), volId: id, store: rnd() > .85 ? STORES[Math.floor(rnd() * 4)] : store, date: addDays(t, day), in: toTime(start), out: toTime(start + len), minutes: len, source: rnd() > .1 ? 'qr' : 'manual', status: 'approved' });
      left -= len; day -= 3 + Math.floor(rnd() * 6);
    }
  }
  s.volunteers.push(
    { id: 'v8', name: 'Sofia Martins', email: 'sofia.martins@example.com', store: 'Alserkal', wantsCert: true, status: 'pending', joined: addDays(t, -1), code: 'TFG-V8-4471', availability: 'Weekends, weekday mornings' },
    { id: 'v9', name: 'Daniel Okafor', email: 'daniel.okafor@example.com', store: 'JLT', wantsCert: false, status: 'pending', joined: t, code: 'TFG-V9-2290', availability: 'Weekday evenings' },
  );
  const book = (volId, store, date, start, end, series) => s.bookings.push({ id: uid(), volId, store, date, start, end, series: series || null, status: 'booked' });
  book('v1', 'JLT', t, '10:00', '13:00');
  book('v3', 'Al Quoz', t, '14:00', '16:00');
  book('v5', 'JLT', t, '11:00', '12:30');
  book('v4', 'Dubai Hills', t, '16:00', '19:30');
  book('v10', 'Alserkal', t, '09:30', '14:00');
  const ser = uid();
  for (let i = 1; i <= 4; i++) book('v1', 'JLT', addDays(t, i * 7 - 3), '10:00', '12:00', ser);
  book('v1', 'Alserkal', addDays(t, 2), '15:30', '18:00');
  book('v2', 'Al Quoz', addDays(t, 1), '09:30', '13:30');
  book('v3', 'JLT', addDays(t, 4), '10:00', '12:00');
  book('v7', 'JLT', addDays(t, 4), '11:00', '14:00');
  s.attendance.push({ id: uid(), volId: 'v10', store: 'Alserkal', date: t, in: '09:34', out: null, minutes: 0, source: 'qr', status: 'pending' });
  s.attendance.push({ id: uid(), volId: 'v2', store: 'Al Quoz', date: addDays(t, -2), in: '09:30', out: '14:15', minutes: 285, source: 'manual', status: 'pending', note: 'Forgot to scan out, stayed late sorting donations' });
  s.attendance.push({ id: uid(), volId: 'v7', store: 'Dubai Hills', date: addDays(t, -1), in: '17:00', out: '19:30', minutes: 150, source: 'manual', status: 'pending', note: 'Phone died, no QR' });
  s.certs.push({ id: uid(), volId: 'v4', date: addDays(t, -3), status: 'pending' });
  s.emails.push({ id: uid(), volId: 'v4', kind: '50 hours', date: addDays(t, -12) });
  s.emails.push({ id: uid(), volId: 'v7', kind: '10 hours', date: addDays(t, -20) });
  s.emails.push({ id: uid(), volId: 'v1', kind: '25 hours', date: addDays(t, -40) });
  s.emails.push({ id: uid(), volId: 'v10', kind: '50 hours', date: addDays(t, -58) });
  return s;
}

let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { S = seed(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
let UI = { role: 'volunteer', tab: { volunteer: 'home', manager: 'today', join: 'form' }, chips: [], joined: null, filter: 'All' };
try { Object.assign(UI, JSON.parse(sessionStorage.getItem(KEY + '-ui')) || {}); } catch {}
const saveUI = () => { try { sessionStorage.setItem(KEY + '-ui', JSON.stringify(UI)); } catch {} };

/* ---------- selectors ---------- */
const vol = id => S.volunteers.find(v => v.id === id);
const active = () => S.volunteers.filter(v => v.status === 'active');
const me = () => vol(S.me) || active()[0];
const approvedMin = id => S.attendance.filter(a => a.volId === id && a.status === 'approved').reduce((t, a) => t + a.minutes, 0);
const pendingMin = id => S.attendance.filter(a => a.volId === id && a.status === 'pending' && a.out).reduce((t, a) => t + a.minutes, 0);
const lastVisit = id => S.attendance.filter(a => a.volId === id).map(a => a.date).sort().pop();
const upcoming = id => S.bookings.filter(b => b.volId === id && b.status === 'booked' && b.date >= today()).sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
const openAtt = id => S.attendance.find(a => a.volId === id && !a.out);
const approvalsCount = () => S.volunteers.filter(v => v.status === 'pending').length + S.attendance.filter(a => a.status === 'pending' && a.out).length + S.certs.filter(c => c.status === 'pending').length;
const nextMilestone = h => MILESTONES.find(m => m > h) || Math.ceil((h + 1) / 100) * 100;

/* ---------- primitives ---------- */
function toast(html, icon = 'check') {
  const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = ic(icon) + `<span>${html}</span>`;
  $('#toasts').append(el); const all = $('#toasts').children; while (all.length > 3) all[0].remove(); setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = 0; setTimeout(() => el.remove(), 300); }, 3800);
}
function modal(title, sub, body) {
  $('#modal-root').innerHTML = `<div class="backdrop" data-action="close-bg"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>${title}</h2>${sub ? `<p class="muted small" style="margin:4px 0 0">${sub}</p>` : ''}</div><button class="btn icon" data-action="close" aria-label="Close">${ic('x')}</button></div>${body}</div></div>`;
}
function ask(title, body, label, action, id = '', danger = false) {
  modal(title, '', `<p class="muted" style="margin:-6px 0 20px">${body}</p><div class="row" style="justify-content:flex-end"><button class="btn" data-action="close">Cancel</button><button class="btn ${danger ? 'btn-danger' : 'primary'}" data-action="${action}" data-id="${id}">${label}</button></div>`);
  $('.modal').style.width = 'min(420px,100%)';
}
const closeModal = () => { $('#modal-root').innerHTML = ''; };
function qr(text, cell = 5) { try { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: cell, margin: 0, scalable: true }); } catch { return `<div class="mono" style="width:124px;height:124px;display:grid;place-items:center;line-height:1.3">${esc(text)}</div>`; } }
const statusSt = a => !a.out ? '<span class="st live">On floor</span>' : a.status === 'approved' ? '<span class="st ok">Approved</span>' : '<span class="st wait">Needs approval</span>';
const srcTag = a => `<span class="tag">${a.source === 'qr' ? 'QR' : 'MANUAL'}</span>`;
const empty = (icon, text) => `<div class="empty">${ic(icon)}${text}</div>`;

/* ---------- milestone engine (Priority 2 hook) ---------- */
function checkMilestones(volId, beforeMin) {
  const before = beforeMin / 60, after = approvedMin(volId) / 60, v = vol(volId);
  MILESTONES.filter(m => before < m && after >= m).forEach((m, i) => {
    S.emails.unshift({ id: uid(), volId, kind: m + ' hours', date: today() });
    setTimeout(() => toast(`Thank-you email sent to <b>${esc(v.name)}</b> for reaching ${m} hours`, 'mail'), 700 + i * 300);
  });
}

/* ---------- shell ---------- */
const NAV = {
  volunteer: [['home', 'Home', 'home'], ['book', 'Book a shift', 'plus'], ['shifts', 'My shifts', 'cal'], ['hours', 'Hours & certificate', 'award']],
  manager: [['today', 'Today on the floor', 'scan'], ['approvals', 'Approvals', 'inbox'], ['hours', 'Hours log', 'clock'], ['people', 'Volunteers', 'users'], ['insights', 'Insights', 'chart']],
  join: [['form', 'Volunteer sign-up', 'join']],
};
function renderRail() {
  const tab = UI.tab[UI.role];
  $('#rail').innerHTML = `
    <div class="brand"><div class="brand-mark">TFG</div><div><b>Thrift for Good</b><small>Volunteer portal</small></div></div>
    <div class="seg" role="tablist">${[['volunteer', 'Volunteer'], ['manager', 'Staff'], ['join', 'Sign-up']].map(([k, l]) => `<button class="${UI.role === k ? 'on' : ''}" data-action="role" data-role="${k}">${l}</button>`).join('')}</div>
    <nav class="nav"><div class="nav-label">${UI.role === 'manager' ? 'Store team' : UI.role === 'join' ? 'Public' : 'My volunteering'}</div>
      ${NAV[UI.role].map(([k, l, i]) => { const n = k === 'approvals' ? approvalsCount() : 0; return `<button class="${k === tab ? 'on' : ''}" data-action="tab" data-tab="${k}">${ic(i)}<span>${l}</span>${n ? `<span class="badge">${n}</span>` : ''}</button>`; }).join('')}
    </nav>
    <div class="rail-foot">${UI.role === 'volunteer' ? `<div class="who">${avatar(me())}<div style="min-width:0;flex:1"><small>Viewing as</small><select data-action="me" aria-label="Choose volunteer">${active().map(v => `<option value="${v.id}" ${v.id === S.me ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></div></div>`
      : UI.role === 'manager' ? `<div class="who"><div class="avatar" style="background:#4f6650">ML</div><div><b style="font-size:13.5px;font-weight:500">Marcela L.</b><small>Volunteer lead · all stores</small></div></div>` : ''}</div>`;
}
function render() {
  renderRail();
  const view = VIEWS[UI.role][UI.tab[UI.role]] || VIEWS[UI.role][NAV[UI.role][0][0]];
  $('#app').innerHTML = `<div class="view">${view()}</div>`;
  [...$('#app .view').children].forEach((el, i) => el.style.setProperty('--i', i));
  setTimeout(() => document.querySelectorAll('.ring .fill[data-off]').forEach(c => { c.style.strokeDashoffset = c.dataset.off; }), 40);
  document.querySelectorAll('form[data-form=book],form[data-form=edit]').forEach(updatePicker);
  saveUI();
  renderScript();
}
const VIEWS = { volunteer: {}, manager: {}, join: {} };
const head = (kicker, title, sub, right = '') => `<div class="page-head"><div><span class="kicker">${kicker}</span><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="row">${right}</div></div>`;

/* ================= VOLUNTEER ================= */
function shiftItem(b, actions = true) {
  return `<div class="item"><div class="date-chip ${b.date === today() ? 'today' : ''}"><small>${fd(b.date, { weekday: 'short' })}</small><b>${fd(b.date, { day: 'numeric' })}</b></div>
    <div class="grow"><b class="mono" style="font-size:14px">${b.start}–${b.end}</b><span class="small muted">${esc(b.store)} · ${hrs(toMin(b.end) - toMin(b.start))} hrs${b.series ? ' · weekly' : ''}</span></div>
    ${actions ? `<button class="btn sm" data-action="edit-shift" data-id="${b.id}">${ic('edit')}Change</button><button class="btn sm icon danger" data-action="cancel-shift" data-id="${b.id}" aria-label="Cancel shift" title="Cancel">${ic('x')}</button>` : ''}</div>`;
}
function ring(h, target) {
  const C = 2 * Math.PI * 54, off = C * (1 - Math.min(1, h / target));
  return `<div class="ring"><svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="54"/><circle class="fill" cx="60" cy="60" r="54" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${off}"/></svg>
    <div class="center"><div><b>${hrs(h * 60)}</b><small>of ${target} hrs</small></div></div></div>`;
}
function weekStrip(v) {
  return `<div class="week">${Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today(), i), bs = S.bookings.filter(b => b.volId === v.id && b.date === d && b.status === 'booked');
    const done = S.attendance.filter(a => a.volId === v.id && a.date === d && a.out);
    return `<div class="day ${i === 0 ? 'today' : ''}"><span class="d">${fd(d, { weekday: 'short' })}</span><span class="n">${fd(d, { day: 'numeric' })}</span>
      ${done.map(a => `<span class="blk done">${a.in}<br>${hrs(a.minutes)}h done</span>`).join('')}
      ${done.length ? '' : bs.map(b => `<span class="blk">${b.start}<br>${b.end}</span>`).join('')}</div>`;
  }).join('')}</div>`;
}
function firstSteps(v) {
  const booked = upcoming(v.id).length > 0;
  const steps = [
    [true, 'Induction done', 'Your team leader approved you. Welcome aboard.'],
    [booked, 'Book your first shift', booked ? 'Booked. See you there.' : 'Any day, any store, from 30 minutes.', booked ? '' : `<button class="btn primary sm" data-action="tab" data-tab="book">${ic('plus')}Book now</button>`],
    [false, 'Scan in at the till', 'Show the QR code on the tag above when you arrive.'],
    [false, 'Scan out when you leave', 'Your hours log themselves. Nothing to fill in.'],
    [false, 'Your first thank-you', 'Arrives by email after your first shift.'],
  ];
  const done = steps.filter(x => x[0]).length;
  return `<div class="card onboard" style="margin-top:16px"><div class="onboard-head"><div><span class="kicker">Getting started</span><h2>Your first shift, step by step</h2></div>
    <div class="onboard-meter"><b class="mono">${done}/${steps.length}</b><span class="mini-bar"><i style="width:${done / steps.length * 100}%"></i></span></div></div>
    <ol class="onboard-steps">${steps.map(([ok, t, d, act], i) => `<li class="${ok ? 'ok' : i === done ? 'now' : ''}"><i>${ok ? ic('check') : i + 1}</i><div class="grow"><b>${t}</b><span>${d}</span></div>${act || ''}</li>`).join('')}</ol></div>`;
}
VIEWS.volunteer.home = () => {
  const v = me(), m = approvedMin(v.id), h = m / 60, next = upcoming(v.id)[0], floor = openAtt(v.id);
  const target = v.wantsCert && h < 50 ? 50 : nextMilestone(h);
  const until = next ? daysBetween(today(), next.date) : null;
  const fresh = !S.attendance.some(a => a.volId === v.id);
  const ticket = floor
    ? `<div class="main"><span class="label">You're checked in</span><h2>${esc(floor.store)} store</h2><div class="when">since ${floor.in}<span>${ic('clock')}Scan again when you leave</span></div></div><div class="stub"><span class="st live">Live</span></div>`
    : next ? `<div class="main"><span class="label">Your next shift</span><h2>${relDay(next.date)}</h2>
        <div class="when">${next.start} – ${next.end}<span>${ic('pin')}${esc(next.store)}</span>${next.series ? `<span>${ic('repeat')}Weekly</span>` : ''}</div>
        <div class="actions"><button class="btn on-night sm" data-action="edit-shift" data-id="${next.id}">${ic('edit')}Change time</button><button class="btn on-night sm" data-action="cancel-shift" data-id="${next.id}">Can't make it</button></div></div>
        <div class="stub">${until === 0 ? `<small>starts</small><b class="time">${next.start}</b>` : `<b>${until}</b><small>${until === 1 ? 'day' : 'days'}</small>`}</div>`
    : `<div class="main"><span class="label">Nothing booked</span><h2>Come in when it suits you</h2><div class="when"><span>Even an hour helps the team.</span></div><div class="actions"><button class="btn primary sm" data-action="tab" data-tab="book">${ic('plus')}Book a shift</button></div></div><div class="stub"><b>–</b><small>days</small></div>`;
  const marks = MILESTONES.filter(x => x <= Math.max(target, 50)).map(x => `<div class="${h >= x ? 'hit' : x === target ? 'next' : ''}"><i></i><span class="mono">${x} hrs</span>${x === 50 && v.wantsCert ? '<span class="small">certificate</span>' : ''}</div>`).join('');
  return `${head(fd(today(), { weekday: 'long', day: 'numeric', month: 'long' }), fresh ? `Welcome to the team, ${first(v)}` : `Hi ${first(v)}, good to see you`, '')}
  <div class="bento">
    <div class="ticket">${ticket}</div>
    <div class="card ring-card">${ring(h, target)}<div><div class="eyebrow" style="margin-bottom:10px"><span class="mono">${hrs(target * 60 - m)}</span> hrs to your next milestone</div><div class="marks">${marks}</div></div></div>
    <button class="swing" data-action="big-qr" aria-label="Show check-in code full size"><small>Show at the till · tap to enlarge</small><div class="qr">${qr(v.code)}</div><b>${v.code}</b><small>Scan when you arrive and leave</small></button>
  </div>
  ${fresh ? firstSteps(v) : ''}
  <div class="card" style="margin-top:16px"><div class="card-head"><h3>Your next 7 days</h3><button class="btn sm" data-action="tab" data-tab="book">${ic('plus')}Add a shift</button></div>${weekStrip(v)}</div>
  ${fresh ? '' : `<div class="stats" style="margin-top:16px">
    <div><span>Approved hours</span><b>${hrs(m)}</b><span>${pendingMin(v.id) ? hrs(pendingMin(v.id)) + ' hrs waiting' : 'all confirmed'}</span></div>
    <div><span>Shifts done</span><b>${S.attendance.filter(a => a.volId === v.id && a.out).length}</b><span>since ${fd(v.joined, { month: 'short', year: 'numeric' })}</span></div>
    <div><span>Booked ahead</span><b>${upcoming(v.id).length}</b><span>shifts</span></div>
    <div><span>Thank-you notes</span><b>${S.emails.filter(e => e.volId === v.id && e.kind !== 'welcome').length}</b><span>from the team</span></div>
  </div>
  <div class="grid g2" style="margin-top:16px">
    <div class="card"><div class="card-head"><h3>Coming up</h3><button class="btn sm" data-action="tab" data-tab="shifts">All shifts ${ic('arrow')}</button></div>
      <div class="list">${upcoming(v.id).slice(0, 4).map(b => shiftItem(b)).join('') || empty('cal', 'Nothing booked yet')}</div></div>
    <div class="card"><div class="card-head"><h3>Recent visits</h3><button class="btn sm" data-action="tab" data-tab="hours">Full record ${ic('arrow')}</button></div>
      <div class="list">${S.attendance.filter(a => a.volId === v.id).sort((a, b) => (b.date + b.in).localeCompare(a.date + a.in)).slice(0, 4).map(a => `
        <div class="item"><div class="grow"><b>${fd(a.date)} · ${esc(a.store)}</b><span class="small muted mono">${a.in}–${a.out || '…'}${a.out ? ' · ' + hrs(a.minutes) + 'h' : ''}</span></div>${srcTag(a)}${statusSt(a)}</div>`).join('') || empty('clock', 'No visits yet')}</div></div>
  </div>`}`;
};

/* --- visual shift picker --- */
function picker(b = {}) {
  const v = me(), date = b.date || UI.prefDate || addDays(today(), 1), store = b.store || v.store;
  const s = b.start ? toMin(b.start) : 10 * 60, e = b.end ? toMin(b.end) : 12 * 60, n = (CLOSE - OPEN) / STEP;
  return `<input type="hidden" name="date" value="${date}"><input type="hidden" name="store" value="${store}"><input type="hidden" name="start" value="${toTime(s)}"><input type="hidden" name="end" value="${toTime(e)}">
  <div class="step"><i>01</i><b>Pick a day</b><span>next 3 weeks</span></div>
  <div class="dates">${Array.from({ length: 21 }, (_, i) => { const d = addDays(today(), i); return `<button type="button" data-action="pick-date" data-d="${d}"><small>${fd(d, { weekday: 'short' })}</small><b>${fd(d, { day: 'numeric' })}</b><i class="${S.bookings.some(x => x.volId === v.id && x.date === d && x.status === 'booked' && x.id !== b.id) ? 'has' : ''}"></i></button>`; }).join('')}</div>
  <div class="step"><i>02</i><b>Choose a store</b></div>
  <div class="stores">${STORES.map(x => `<button type="button" data-action="pick-store" data-s="${x}"><b>${ic('pin')}${x}</b><small>${STORE_NOTE[x]}</small></button>`).join('')}</div>
  <div class="step"><i>03</i><b>Tap when you'll arrive, then when you'll leave</b><span>dots = others booked</span></div>
  <div class="slots">${Array.from({ length: n }, (_, i) => `<button type="button" class="slot" data-action="pick-slot" data-m="${OPEN + i * STEP}" title="${toTime(OPEN + i * STEP)}" aria-label="${toTime(OPEN + i * STEP)}"><em>${i % 2 === 0 ? (OPEN + i * STEP) / 60 : ''}</em><span class="busy"></span></button>`).join('')}</div>
  <div class="slot-axis">${Array.from({ length: n }, (_, i) => `<span>${i % 2 === 0 ? (OPEN + i * STEP) / 60 : ''}</span>`).join('')}</div>
  <div class="picker-summary"><div><small class="sum-day"></small><div class="t sum-time"></div></div><div style="text-align:right"><small>Duration</small><div class="t sum-dur"></div></div></div>`;
}
function updatePicker(f) {
  const g = n => f.querySelector(`[name=${n}]`).value;
  const date = g('date'), store = g('store'), s = toMin(g('start')), e = toMin(g('end'));
  f.querySelectorAll('[data-action=pick-date]').forEach(x => x.classList.toggle('on', x.dataset.d === date));
  f.querySelectorAll('[data-action=pick-store]').forEach(x => x.classList.toggle('on', x.dataset.s === store));
  const others = S.bookings.filter(b => b.status === 'booked' && b.date === date && b.store === store && b.id !== f.dataset.id && b.volId !== S.me);
  f.querySelectorAll('.slot').forEach(x => {
    const m = +x.dataset.m;
    x.classList.toggle('on', m >= s && m < e); x.classList.toggle('edge-s', m === s); x.classList.toggle('edge-e', m === e - STEP);
    x.querySelector('.busy').innerHTML = '<i></i>'.repeat(Math.min(3, others.filter(b => toMin(b.start) <= m && toMin(b.end) > m).length));
  });
  f.querySelector('.sum-day').textContent = `${fd(date, { weekday: 'long', day: 'numeric', month: 'long' })} · ${store}`;
  f.querySelector('.sum-time').textContent = `${toTime(s)} – ${toTime(e)}`;
  f.querySelector('.sum-dur').textContent = `${hrs(e - s)}h`;
}
VIEWS.volunteer.book = () => head('Flexible hours', 'Book a shift', 'Come in for as long as suits you, from 30 minutes. Any day, any store.') +
  `<form class="card" data-form="book" style="padding:26px">${picker()}
    <label class="toggle-row check"><input type="checkbox" name="repeat"><span style="flex:1">Repeat this every week</span><span class="row small muted">for <select name="weeks"><option>4</option><option selected>8</option><option>12</option></select> weeks</span></label>
    <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn primary" type="submit">${ic('check')}Confirm booking</button></div></form>`;

function monthCal(v) {
  const off = UI.calOff || 0, base = new Date(today() + 'T12:00'); base.setDate(1); base.setMonth(base.getMonth() + off);
  const first = iso(base), lead = (base.getDay() + 6) % 7, days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const t = today(), mine = S.bookings.filter(b => b.volId === v.id), att = S.attendance.filter(a => a.volId === v.id && a.out);
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<span class="cd pad"></span>';
  for (let n = 1; n <= days; n++) {
    const d = addDays(first, n - 1), b = mine.find(x => x.date === d && x.status === 'booked'), a = att.find(x => x.date === d);
    const cls = ['cd', d === t ? 'today' : '', d < t ? 'past' : '', a ? 'done' : b ? 'booked' : ''].join(' ');
    const label = a ? `${hrs(a.minutes)}h` : b ? b.start : '';
    cells += d >= t && !b ? `<button class="${cls}" data-action="cal-book" data-d="${d}" title="Book ${fd(d)}"><b>${n}</b><em>+</em></button>`
      : `<span class="${cls}" title="${fd(d)}${label ? ' · ' + label : ''}"><b>${n}</b>${label ? `<small>${label}</small>` : ''}</span>`;
  }
  return `<div class="card cal"><div class="card-head"><h3>${base.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3><div class="row"><button class="btn icon sm" data-action="cal-nav" data-d="-1" aria-label="Previous month" ${off <= -2 ? 'disabled' : ''}><svg class="i" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button><button class="btn icon sm" data-action="cal-nav" data-d="1" aria-label="Next month" ${off >= 2 ? 'disabled' : ''}><svg class="i" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button></div></div>
    <div class="cal-grid">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(x => `<span class="cw">${x}</span>`).join('')}${cells}</div>
    <div class="legend" style="margin-top:14px"><span><i style="background:var(--accent)"></i>Booked</span><span><i style="background:var(--accent-tint)"></i>Visited</span><span><i style="box-shadow:inset 0 0 0 1.5px var(--ink)"></i>Today</span><span>Tap a free day to book</span></div></div>`;
}
VIEWS.volunteer.shifts = () => {
  const v = me(), up = upcoming(v.id);
  const past = S.bookings.filter(b => b.volId === v.id && (b.date < today() || b.status === 'cancelled')).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  return head('Your schedule', 'My shifts', 'Change times or cancel yourself. The store team sees it straight away.', `<button class="btn primary" data-action="tab" data-tab="book">${ic('plus')}Book a shift</button>`) +
  `<div class="grid" style="grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:start">${monthCal(v)}<div style="display:flex;flex-direction:column;gap:16px;min-width:0"><div class="card"><div class="card-head"><h3>Upcoming <span class="tag">${up.length}</span></h3></div><div class="list">${up.map(b => shiftItem(b)).join('') || empty('cal', 'No upcoming shifts. Book one any time.')}</div></div>
  <div class="card"><div class="card-head"><h3>Changes</h3></div><div class="list">${past.map(b => `<div class="item"><div class="grow"><b>${fd(b.date)} · ${esc(b.store)}</b><span class="small muted mono">${b.start}–${b.end}</span></div>${b.status === 'cancelled' ? '<span class="st bad">Cancelled</span>' : '<span class="st">Past</span>'}</div>`).join('') || empty('repeat', 'Cancellations will show here')}</div></div></div></div>`;
};

function badges(v) {
  const vis = S.attendance.filter(a => a.volId === v.id && a.out), h = approvedMin(v.id) / 60;
  const weekend = vis.filter(a => [0, 6].includes(new Date(a.date + 'T12:00').getDay())).length;
  const stores = new Set(vis.map(a => a.store)).size, early = vis.filter(a => toMin(a.in) <= 10 * 60).length;
  const B = [
    ['First shift', 'spark', vis.length >= 1, 'Complete one visit', 1, Math.min(1, vis.length)],
    ['10 hours', 'clock', h >= 10, '10 approved hours', 10, h],
    ['25 hours', 'clock', h >= 25, '25 approved hours', 25, h],
    ['50 hours', 'award', h >= 50, '50 approved hours', 50, h],
    ['Weekend regular', 'cal', weekend >= 3, '3 weekend visits', 3, weekend],
    ['Store explorer', 'pin', stores >= 2, 'Volunteer at 2 stores', 2, stores],
    ['Early bird', 'sun', early >= 3, '3 visits starting by 10:00', 3, early],
    ['100 hours', 'award', h >= 100, '100 approved hours', 100, h],
  ];
  const got = B.filter(b => b[2]).length;
  return `<div class="card" style="margin-top:16px"><div class="card-head"><div><h3>Badges</h3><span class="small muted">${got} of ${B.length} earned · awarded automatically from your visits</span></div></div>
    <div class="badges">${B.map(([t, i, ok, need, goal, cur]) => `<div class="badge ${ok ? 'got' : ''}" title="${ok ? 'Earned' : need}"><div class="medal">${ic(i)}</div><b>${t}</b><small>${ok ? 'Earned' : `${Math.floor(Math.min(cur, goal) * 10) / 10} / ${goal}`}</small>${ok ? '' : `<span class="b-bar"><i style="width:${Math.min(100, cur / goal * 100)}%"></i></span>`}</div>`).join('')}</div></div>`;
}
function heatmap(v) {
  const weeks = 20, end = today(), dow = (new Date(end + 'T12:00').getDay() + 6) % 7, start = addDays(end, -(weeks - 1) * 7 - dow);
  const by = {}; S.attendance.filter(a => a.volId === v.id && a.out).forEach(a => { by[a.date] = (by[a.date] || 0) + a.minutes; });
  const lvl = m => !m ? 0 : m < 150 ? 1 : m < 210 ? 2 : 3;
  let cells = '', months = '';
  for (let w = 0; w < weeks; w++) {
    const wd = addDays(start, w * 7);
    months += `<span>${new Date(wd + 'T12:00').getDate() <= 7 ? fd(wd, { month: 'short' }) : ''}</span>`;
    for (let d = 0; d < 7; d++) {
      const day = addDays(start, w * 7 + d), m = by[day] || 0;
      cells += day > end ? '<i class="future"></i>' : `<i class="l${lvl(m)}" title="${fd(day)}${m ? ' · ' + hrs(m) + ' hrs' : ''}"></i>`;
    }
  }
  const visits = Object.keys(by).filter(d => d >= start).length;
  return `<div class="card" style="margin-top:16px"><div class="card-head"><div><h3>Your last 20 weeks</h3><span class="small muted">${visits} visits · each square is a day</span></div><div class="heat-legend"><span>Less</span><i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><span>More</span></div></div>
    <div class="heat-wrap"><div class="heat-days"><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span></span></div><div><div class="heat-months" style="grid-template-columns:repeat(${weeks},1fr)">${months}</div><div class="heat" style="grid-template-columns:repeat(${weeks},1fr)">${cells}</div></div></div></div>`;
}
VIEWS.volunteer.hours = () => {
  const v = me(), m = approvedMin(v.id), h = m / 60;
  const req = S.certs.filter(c => c.volId === v.id).sort((a, b) => b.date.localeCompare(a.date))[0];
  const rows = S.attendance.filter(a => a.volId === v.id).sort((a, b) => (b.date + b.in).localeCompare(a.date + a.in));
  const certBox = !v.wantsCert ? `<p class="muted">You told us you're not volunteering for a certificate. That's completely fine, and we still keep an accurate record of every hour.</p><button class="btn" data-action="toggle-cert">I'd like a certificate after all</button>`
    : req && req.status === 'pending' ? `<span class="st wait">Requested ${fd(req.date)}</span><p class="muted">The team will check your hours and email your certificate.</p>`
    : req && req.status === 'issued' ? `<span class="st ok">Issued ${fd(req.decided || req.date)}</span><p class="muted">You can ask for an updated certificate whenever you like.</p><button class="btn" data-action="req-cert">Request updated certificate</button>`
    : h >= 50 ? `<p class="muted">You've passed 50 hours, so your certificate is ready to request.</p><button class="btn primary" data-action="req-cert">${ic('award')}Request certificate</button>`
    : `<p class="muted"><b class="mono" style="color:var(--ink)">${hrs(50 * 60 - m)} hrs</b> to go before you can request it.</p><div class="bar-track" style="height:8px"><i style="width:${h / 50 * 100}%"></i></div>`;
  return head('Official record', 'Hours & certificate', 'Every visit you scan in for, approved by the store team.', `<button class="btn" data-action="export" data-vol="${v.id}">${ic('dl')}Download my record</button>`) +
  `<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.6fr)"><div class="card ring-card">${ring(h, h < 50 ? 50 : nextMilestone(h))}<div><div class="eyebrow">Approved</div><b class="mono" style="font-size:22px">${hrs(m)} hrs</b><div class="eyebrow" style="margin-top:10px">Waiting for approval</div><b class="mono" style="font-size:16px">${hrs(pendingMin(v.id))} hrs</b></div></div>
  <div class="card"><div class="card-head"><h3>${ic('award')}50-hour certificate</h3>${v.wantsCert ? '<span class="st ok">Opted in</span>' : '<span class="st">Not needed</span>'}</div>${certBox}</div></div>
  ${badges(v)}${heatmap(v)}<div class="card" style="margin-top:16px"><div class="card-head"><h3>Visit log</h3><span class="small muted">${rows.length} visits</span></div>
  <div class="table-wrap"><table><thead><tr><th>Date</th><th>Store</th><th>Time</th><th>Hours</th><th>Logged</th><th>Status</th></tr></thead><tbody>
  ${rows.map(a => `<tr><td>${fd(a.date)}</td><td>${esc(a.store)}</td><td class="mono">${a.in}–${a.out || '…'}</td><td class="mono">${a.out ? hrs(a.minutes) + 'h' : '–'}</td><td>${srcTag(a)}</td><td>${statusSt(a)}</td></tr>`).join('')}</tbody></table></div></div>`;
};

/* ================= SIGN-UP ================= */
VIEWS.join.form = () => {
  const journey = `<div class="journey"><span class="kicker" style="color:var(--night-ink-2)">Thrift for Good</span><h2>Give a few hours. Keep clothes in circulation. Fund children's charities.</h2><p>No fixed shifts. Come in when it suits you, at any of our four stores.</p>
    <ol>${[['Apply', 'This form, about two minutes'], ['Induction', 'One hour with a team leader'], ['Get your portal', 'Book shifts and get your QR code'], ['Volunteer', 'Scan in and out, hours log themselves'], ['Milestones', 'Thank-yous, and a certificate at 50 hours']].map(([a, b], i) => `<li><i>${i + 1}</i><div><b>${a}</b><small>${b}</small></div></li>`).join('')}</ol></div>`;
  if (UI.joined) {
    const v = vol(UI.joined);
    return `<div class="join">${journey}<div class="card success"><div class="success-mark">${ic('check')}</div><h1>Thanks, ${v ? first(v) : ''}</h1>
      <p class="muted" style="max-width:46ch;margin:10px auto 0">Your application is with the ${esc(v?.store || '')} team. A team leader will email you to set up your one-hour induction. Once you're approved you can book shifts and use your QR code.</p>
      <div class="row" style="justify-content:center;margin-top:22px"><button class="btn primary" data-action="goto" data-role="manager" data-tab="approvals">See it in the staff view ${ic('arrow')}</button><button class="btn" data-action="join-again">Register someone else</button></div>
      <p class="hint" style="margin-top:18px">Replaces the current Airtable form. Applications go straight into the staff approvals queue.</p></div></div>`;
  }
  return `<div class="join">${journey}<form class="card" data-form="join" style="padding:28px" novalidate><span class="kicker">Volunteer application</span><h2 style="margin-bottom:20px">Tell us about you</h2>
    <div class="fields"><div class="field"><label for="j-name">Full name</label><input id="j-name" name="name" required placeholder="Sara Al Hashimi" autocomplete="name"><span class="err" data-err="name"></span></div>
    <div class="field"><label for="j-email">Email</label><input id="j-email" name="email" type="email" required placeholder="sara@example.com" autocomplete="email"><span class="err" data-err="email"></span></div>
    <div class="field"><label for="j-phone">Mobile</label><input id="j-phone" name="phone" type="tel" placeholder="+971 55 318 4402" autocomplete="tel"><span class="hint">Optional. For shift reminders by text later on.</span></div>
    <div class="field"><label for="j-store">Preferred store</label><select id="j-store" name="store">${STORES.map(s => `<option>${s}</option>`).join('')}</select></div></div>
    <div class="field"><label>When are you usually free?</label><div class="chips">${['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekends'].map(c => `<button type="button" class="chip ${UI.chips.includes(c) ? 'on' : ''}" data-action="chip" data-v="${c}">${c}</button>`).join('')}</div></div>
    <div class="field"><label>Would you like a volunteering certificate after 50 hours?</label>
      <div class="chips"><label class="chip"><input type="radio" name="cert" value="yes" style="display:none"> Yes, please</label><label class="chip"><input type="radio" name="cert" value="no" style="display:none"> No, I'm here for the fun</label></div>
      <span class="hint">This only changes which reminders you get. We track everyone's hours either way.</span><span class="err" id="cert-err"></span></div>
    <div class="field"><label for="j-notes">Anything we should know? <span class="hint">Optional</span></label><textarea id="j-notes" name="notes" rows="2" placeholder="Languages, skills, accessibility needs"></textarea></div>
    <label class="check" style="margin-bottom:6px"><input type="checkbox" name="consent"><span>I agree to the volunteer code of conduct and to my hours being stored for my record.</span></label><span class="err" data-err="consent" style="display:block;margin-bottom:14px"></span>
    <button class="btn primary" type="submit" style="width:100%;padding:12px">Submit application ${ic('arrow')}</button></form></div>`;
};

/* ================= STAFF ================= */
function gantt(rows) {
  const span = CLOSE - OPEN, pct = m => (Math.max(OPEN, Math.min(CLOSE, m)) - OPEN) / span * 100, now = nowMin();
  const nowLine = now > OPEN && now < CLOSE ? `<div class="g-now" style="left:${pct(now)}%"></div>` : '';
  return `<div class="gantt"><div class="g-axis"><span>Volunteer</span><div class="ticks">${[9, 12, 15, 18, 21].map(h => `<span style="left:${pct(h * 60)}%">${h}:00</span>`).join('')}</div><span></span></div>
  ${rows.map(({ v, b, o, d }) => {
    const bar = d ? `<div class="g-bar done" style="left:${pct(toMin(d.in))}%;width:${pct(toMin(d.out)) - pct(toMin(d.in))}%">${d.in}–${d.out}</div>`
      : o ? `<div class="g-bar live" style="left:${pct(toMin(o.in))}%;width:${Math.max(3, pct(Math.max(now, toMin(o.in) + 30)) - pct(toMin(o.in)))}%">in ${o.in}</div>` : '';
    const plan = b && !d && !o ? `<div class="g-bar" style="left:${pct(toMin(b.start))}%;width:${pct(toMin(b.end)) - pct(toMin(b.start))}%">${b.start}–${b.end}</div>` : '';
    return `<div class="g-row"><div class="who-cell">${avatar(v)}<div style="min-width:0"><b><button class="name-link" data-action="profile" data-id="${v.id}">${esc(v.name)}</button></b><small>${esc((o || d || b).store)}${b ? '' : ' · walk-in'}</small></div></div>
      <div class="g-track">${plan}${bar}${nowLine}</div>
      <div class="g-act">${o ? `<button class="btn sm dark" data-action="scan" data-code="${v.code}">Scan out</button>` : d ? `<span class="st ok">${hrs(d.minutes)}h logged</span>` : `<button class="btn sm" data-action="scan" data-code="${v.code}">Scan in</button>`}</div></div>`;
  }).join('') || empty('cal', 'No one booked or checked in today')}</div>`;
}
VIEWS.manager.today = () => {
  const t = today();
  const ids = [...new Set([...S.bookings.filter(b => b.date === t && b.status === 'booked').map(b => b.volId), ...S.attendance.filter(a => a.date === t).map(a => a.volId)])];
  const key = r => (r.b?.start || r.o?.in || r.d?.in || '');
  const rows = ids.map(id => ({ v: vol(id), b: S.bookings.find(b => b.volId === id && b.date === t && b.status === 'booked'), o: openAtt(id), d: S.attendance.filter(a => a.volId === id && a.date === t && a.out).pop() })).sort((a, b) => key(a).localeCompare(key(b)));
  const logged = rows.reduce((s, r) => s + (r.d?.minutes || 0), 0), walk = active().filter(v => !ids.includes(v.id));
  return head(fd(t, { weekday: 'long', day: 'numeric', month: 'long' }), 'Today on the floor', '', `<button class="btn" data-action="manual">${ic('plus')}Add hours manually</button>`) +
  `<div class="today-grid">
    <div class="scanner"><span class="label">Till scanner</span><h3 style="margin-top:4px;font-size:17px">Scan a volunteer's QR</h3>
      <div class="viewfinder" id="vf"><div class="ghost">${qr('TFG-DEMO', 4)}</div><div class="corners"><i></i><i></i><i></i><i></i></div><div class="beam"></div></div>
      <form data-form="scan"><input name="code" placeholder="or type a code" autocomplete="off" aria-label="Volunteer code"><button class="btn primary" type="submit">Scan</button></form>
      <p class="hint small">For the demo, use Scan in / Scan out on the timeline.</p>
      <div class="scan-log">${(S.scans || []).slice(0, 4).map(s => `<div><span><b>${esc(s.name)}</b> scanned ${s.dir}</span><span class="mono">${s.t}</span></div>`).join('') || '<div><span>No scans yet today</span></div>'}</div></div>
    <div style="display:flex;flex-direction:column;gap:16px;min-width:0">
      <div class="stats"><div><span>Expected</span><b>${rows.filter(r => r.b).length}</b><span>booked today</span></div><div><span>On the floor</span><b>${rows.filter(r => r.o).length}</b><span>right now</span></div><div><span>Hours logged</span><b>${hrs(logged)}</b><span>today</span></div><div><span>Walk-ins</span><b>${rows.filter(r => !r.b).length}</b><span>no booking</span></div></div>
      <div class="card"><div class="card-head"><h3>Timeline</h3><div class="legend"><span><i style="border:1.5px dashed var(--line-2)"></i>Booked</span><span><i style="background:var(--accent)"></i>On floor</span><span><i style="background:var(--accent-tint)"></i>Done</span><span><i style="background:var(--bad);width:2px;height:12px"></i>Now</span></div></div>${gantt(rows)}</div>
      <div class="card"><div class="card-head"><h3>Walk-in without a booking?</h3><span class="small muted">They can still scan in</span></div>
        <div class="row">${walk.slice(0, 6).map(v => `<button class="btn sm" data-action="scan" data-code="${v.code}">${esc(v.name)}</button>`).join('') || '<span class="small muted">Everyone active is already on today\'s list</span>'}</div></div>
    </div></div>`;
};

VIEWS.manager.approvals = () => {
  const nv = S.volunteers.filter(v => v.status === 'pending'), hp = S.attendance.filter(a => a.status === 'pending' && a.out), cr = S.certs.filter(c => c.status === 'pending');
  const sect = (icon, title, sub, n, body, emptyTxt) => `<div class="card"><div class="card-head"><div><h3>${ic(icon)}${title}</h3><span class="small muted">${sub}</span></div><span class="tag" style="${n ? 'color:var(--bad);border-color:var(--bad)' : ''}">${n}</span></div><div class="list">${body || empty('check', emptyTxt)}</div></div>`;
  const clear = !nv.length && !hp.length && !cr.length;
  return head('Needs a decision', 'Approvals', 'Everything waiting on staff, in one place.') +
  (clear ? `<div class="card all-clear"><div class="success-mark">${ic('check')}</div><div><h2>You're all caught up</h2><p class="muted" style="margin:4px 0 0">No applications, hours or certificates waiting. New ones will show up here with a count in the sidebar.</p></div></div>` : '') +
  `<div class="grid g2" style="align-items:start${clear ? ';display:none' : ''}">
  ${sect('join', 'New volunteers', 'Approve once induction is done', nv.length, nv.map(v => `<div class="item stack">${avatar(v)}<div class="grow"><b>${esc(v.name)}</b><span class="small muted">${esc(v.store)} · applied ${relDay(v.joined).toLowerCase()} · ${esc(v.availability || 'flexible')}${v.wantsCert ? ' · wants certificate' : ''}</span></div>
     <div class="row"><button class="btn sm primary" data-action="approve-vol" data-id="${v.id}">${ic('check')}Approve</button><button class="btn sm danger" data-action="decline-vol" data-id="${v.id}">Decline</button></div></div>`).join(''), 'No new applications')}
  ${sect('clock', 'Hours to confirm', 'Manual entries from missed scans', hp.length, hp.map(a => { const v = vol(a.volId); return `<div class="item stack">${avatar(v)}<div class="grow"><b>${esc(v.name)} · <span class="mono">${hrs(a.minutes)}h</span></b><span class="small muted">${fd(a.date)} · ${esc(a.store)} · <span class="mono">${a.in}–${a.out}</span>${a.note ? `<br>"${esc(a.note)}"` : ''}</span></div>
     <div class="row"><button class="btn sm primary" data-action="approve-hrs" data-id="${a.id}">${ic('check')}Approve</button><button class="btn sm danger" data-action="reject-hrs" data-id="${a.id}">Reject</button></div></div>`; }).join(''), 'All hours confirmed')}
  ${sect('award', 'Certificate requests', 'Volunteers past 50 hours', cr.length, cr.map(c => { const v = vol(c.volId); return `<div class="item stack">${avatar(v)}<div class="grow"><b>${esc(v.name)}</b><span class="small muted"><span class="mono">${hrs(approvedMin(v.id))}</span> approved hrs · requested ${fd(c.date)}</span></div>
     <div class="row"><button class="btn sm" data-action="preview-cert" data-id="${c.id}">Preview</button><button class="btn sm primary" data-action="issue-cert" data-id="${c.id}">${ic('mail')}Issue & email</button></div></div>`; }).join(''), 'No requests waiting')}
  </div>`;
};

VIEWS.manager.hours = () => {
  const f = UI.filter || 'All';
  const rows = S.attendance.filter(a => a.out && (f === 'All' || a.store === f)).sort((a, b) => (b.date + b.in).localeCompare(a.date + a.in));
  const total = rows.filter(a => a.status === 'approved').reduce((t, a) => t + a.minutes, 0);
  return head('Official record', 'Hours log', 'Every volunteer visit, ready to export for CDA.', `<select data-action="filter" style="width:auto" aria-label="Store filter">${['All', ...STORES].map(s => `<option ${s === f ? 'selected' : ''} value="${s}">${s === 'All' ? 'All stores' : s}</option>`).join('')}</select><button class="btn" data-action="manual">${ic('plus')}Manual entry</button><button class="btn primary" data-action="export">${ic('dl')}Export CSV</button>`) +
  `<div class="stats" style="margin-bottom:16px"><div><span>Approved hours</span><b>${hrs(total)}</b><span>${f === 'All' ? 'all stores' : f}</span></div><div><span>Visits</span><b>${rows.length}</b><span>logged</span></div>
    <div><span>Logged by QR</span><b>${Math.round(rows.filter(a => a.source === 'qr').length / Math.max(1, rows.length) * 100)}%</b><span>no staff typing</span></div><div><span>Waiting</span><b>${rows.filter(a => a.status === 'pending').length}</b><span>for approval</span></div></div>
  <div class="card"><div class="table-wrap"><table><thead><tr><th>Volunteer</th><th>Date</th><th>Store</th><th>Time</th><th>Hours</th><th>Logged</th><th>Status</th></tr></thead><tbody>
  ${rows.slice(0, 60).map(a => { const v = vol(a.volId); return `<tr><td><div class="who-cell">${avatar(v)}<button class="name-link" data-action="profile" data-id="${v.id}">${esc(v.name)}</button></div></td><td>${fd(a.date)}</td><td>${esc(a.store)}</td><td class="mono">${a.in}–${a.out}</td><td class="mono"><b>${hrs(a.minutes)}h</b></td><td>${srcTag(a)}</td><td>${statusSt(a)}</td></tr>`; }).join('')}
  </tbody></table></div>${rows.length > 60 ? `<p class="hint" style="margin:12px 0 0">Showing the latest 60 of ${rows.length}. The export includes everything.</p>` : ''}</div>`;
};

VIEWS.manager.people = () => {
  const list = active().map(v => ({ v, m: approvedMin(v.id), last: lastVisit(v.id) })).sort((a, b) => b.m - a.m);
  const quiet = list.filter(x => x.last && daysBetween(x.last, today()) > 30);
  return head('Roster', 'Volunteers', `${list.length} active · ${S.volunteers.filter(v => v.status === 'pending').length} waiting for induction`) +
  (quiet.length ? `<div class="notice">${ic('moon')}<div class="grow"><b>${quiet.map(x => esc(x.v.name)).join(', ')} ${quiet.length > 1 ? 'have' : 'has'} gone quiet</b><div class="small muted">No visit in over 30 days. A friendly check-in goes out automatically.</div></div><button class="btn sm" data-action="nudge" data-id="${quiet[0].v.id}">${ic('mail')}Preview check-in</button></div>` : '') +
  `<div class="card"><div class="table-wrap"><table class="t-people"><thead><tr><th>Name</th><th>Home store</th><th>Hours</th><th>Certificate</th><th>Last visit</th><th>Next shift</th></tr></thead><tbody>
  ${list.map(({ v, m, last }) => { const n = upcoming(v.id)[0], ago = last ? daysBetween(last, today()) : null; return `<tr><td><div class="who-cell">${avatar(v)}<div><button class="name-link" data-action="profile" data-id="${v.id}">${esc(v.name)}</button><div class="small muted">${esc(v.email)}</div></div></div></td><td>${esc(v.store)}</td>
    <td><div class="mini"><b class="mono">${hrs(m)}</b><span class="mini-bar"><i style="width:${Math.min(100, m / 60 / (m >= 3000 ? nextMilestone(m / 60) : 50) * 100)}%"></i></span><small class="mono">/${m >= 3000 ? nextMilestone(m / 60) : 50}</small></div></td><td>${v.wantsCert ? (S.certs.some(c => c.volId === v.id && c.status === 'issued') ? '<span class="st ok">Issued</span>' : m >= 3000 ? '<span class="st wait">Eligible</span>' : '<span class="st">Working towards</span>') : '<span class="small muted">Not needed</span>'}</td>
    <td>${last ? (ago > 30 ? `<span class="st bad">${ago} days ago</span>` : `<span class="small">${ago === 0 ? 'Today' : ago + ' days ago'}</span>`) : '–'}</td><td class="small">${n ? `${relDay(n.date)} · <span class="mono">${n.start}</span>` : '<span class="muted">–</span>'}</td></tr>`; }).join('')}</tbody></table></div></div>`;
};

function area(weeks) {
  const W = 560, H = 170, pt = 22, pb = 10, mx = Math.max(1, ...weeks.map(w => w[1])) * 1.15;
  const x = i => (i + .5) * W / weeks.length, y = m => pt + (H - pt - pb) * (1 - m / mx);
  const pts = weeks.map(([, m], i) => [x(i), y(m)]);
  let d = 'M' + pts[0].join(' ');
  for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], cx = (x0 + x1) / 2; d += ` C${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`; }
  const last = pts[pts.length - 1];
  return `<svg class="area" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Weekly hours, last 8 weeks">
    <defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0f6b4f" stop-opacity=".22"/><stop offset="1" stop-color="#0f6b4f" stop-opacity="0"/></linearGradient></defs>
    ${[0.25, 0.5, 0.75].map(f => `<line x1="0" x2="${W}" y1="${pt + (H - pt - pb) * f}" y2="${pt + (H - pt - pb) * f}" class="grid-l"/>`).join('')}
    <path d="${d} L${last[0]} ${H} L${pts[0][0]} ${H} Z" fill="url(#ag)"/>
    <path d="${d}" class="line" pathLength="1"/>
  </svg><div class="area-x">${weeks.map(([s, m]) => `<span><b class="mono">${hrs(m)}</b>${fd(s, { day: 'numeric', month: 'short' })}</span>`).join('')}</div>`;
}
function funnel() {
  const all = S.volunteers, hrsOf = v => approvedMin(v.id) / 60;
  const stages = [
    ['Applied', all.length],
    ['Approved', all.filter(v => v.status === 'active').length],
    ['First shift', all.filter(v => S.attendance.some(a => a.volId === v.id && a.out)).length],
    ['10 hours', all.filter(v => hrsOf(v) >= 10).length],
    ['25 hours', all.filter(v => hrsOf(v) >= 25).length],
    ['50 hours', all.filter(v => hrsOf(v) >= 50).length],
    ['100 hours', all.filter(v => hrsOf(v) >= 100).length],
  ];
  const max = stages[0][1] || 1;
  let worst = -1, worstDrop = 0;
  stages.forEach(([, n], i) => { if (i && stages[i - 1][1]) { const drop = 1 - n / stages[i - 1][1]; if (drop > worstDrop && i > 1) { worstDrop = drop; worst = i; } } });
  return `<div class="card" style="margin-top:16px"><div class="card-head"><div><h3>${ic('users')}Volunteer journey</h3><span class="small muted">How many volunteers reached each stage. Shows where people stop coming.</span></div><span class="tag">Priority 2</span></div>
    <div class="funnel">${stages.map(([l, n], i) => `<div class="f-row ${i === worst ? 'worst' : ''}"><span class="f-l">${l}</span><div class="f-track"><i style="width:${Math.max(2, n / max * 100)}%;animation-delay:${i * 70}ms"></i></div><b class="mono">${n}</b><span class="f-pct mono">${i ? (stages[i - 1][1] ? Math.round(n / stages[i - 1][1] * 100) + '%' : '–') : ''}</span></div>`).join('')}</div>
    ${worst > 0 ? `<p class="small muted" style="margin:14px 0 0">Biggest drop: <b style="color:var(--ink)">${stages[worst - 1][0]} → ${stages[worst][0]}</b> (${Math.round(worstDrop * 100)}% don't make it). That's where a check-in email does the most good.</p>` : ''}</div>`;
}
VIEWS.manager.insights = () => {
  const appr = S.attendance.filter(a => a.status === 'approved' && a.out), since = addDays(today(), -28);
  const byStore = STORES.map(s => [s, appr.filter(a => a.store === s && a.date >= since).reduce((t, a) => t + a.minutes, 0)]).sort((a, b) => b[1] - a[1]);
  const mx = Math.max(1, ...byStore.map(x => x[1]));
  const weeks = Array.from({ length: 8 }, (_, i) => { const end = addDays(today(), -7 * (7 - i)), start = addDays(end, -6); return [start, appr.filter(a => a.date >= start && a.date <= end).reduce((t, a) => t + a.minutes, 0)]; });
  const wmx = Math.max(1, ...weeks.map(w => w[1]));
  return head('Last 4 weeks', 'Insights', '') +
  `<div class="stats" style="margin-bottom:16px"><div><span>Hours, 4 weeks</span><b>${hrs(byStore.reduce((t, x) => t + x[1], 0))}</b><span>approved</span></div><div><span>Active volunteers</span><b>${active().length}</b><span>with portal access</span></div>
  <div><span>Past 50 hours</span><b>${active().filter(v => approvedMin(v.id) >= 3000).length}</b><span>certificate eligible</span></div><div><span>Thank-yous sent</span><b>${S.emails.length}</b><span>automatically</span></div></div>
  <div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.2fr)"><div class="card"><div class="card-head"><h3>Hours by store</h3></div><div class="bars">
    ${byStore.map(([s, m], i) => `<div class="bar-row"><span>${s}</span><div class="bar-track"><i style="width:${m / mx * 100}%;animation-delay:${i * 80}ms"></i></div><b>${hrs(m)}h</b></div>`).join('')}</div></div>
  <div class="card"><div class="card-head"><h3>Weekly hours</h3><span class="small muted">8 weeks</span></div>${area(weeks)}<div class="cols" style="display:none">
    ${weeks.map(([s, m], i) => `<div class="col"><em>${hrs(m)}</em><i class="${i === 7 ? 'cur' : ''}" style="height:${Math.max(4, m / wmx * 120)}px;animation-delay:${i * 50}ms"></i><small>${fd(s, { day: 'numeric', month: 'short' })}</small></div>`).join('')}</div></div></div>
  ${funnel()}
  <div class="card" style="margin-top:16px"><div class="card-head"><div><h3>${ic('mail')}Automatic thank-you emails</h3><span class="small muted">Each scan-out checks for a first shift, 10 / 25 / 50 / 100 hours, or a return after a break. Links to Priority 2.</span></div></div>
    <div class="list">${S.emails.slice(0, 6).map(e => { const v = vol(e.volId); return v ? `<div class="item">${avatar(v)}<div class="grow"><b>${esc(v.name)}</b><span class="small muted">${e.kind === 'welcome' ? 'Welcome email' : e.kind === 'first shift' ? 'First shift' : e.kind + ' milestone'} · ${fd(e.date)}</span></div><button class="btn sm" data-action="email" data-id="${e.id}">View email</button></div>` : ''; }).join('')}</div></div>`;
};

/* ---------- modals ---------- */
function emailHTML(v, kind) {
  const f = first(v);
  const [subject, body] = kind === 'welcome'
    ? ['Welcome to Thrift for Good', `<p>Hi ${f},</p><p>Your induction is done and your volunteer portal is ready. Book your first shift at whatever time suits you, then show your QR code at the till when you arrive. Your hours log themselves.</p><p>See you soon,<br>The Thrift for Good team</p>`]
    : kind === 'quiet'
    ? ['We miss you at Thrift for Good', `<p>Hi ${f},</p><p>It's been a little while since your last shift at ${esc(v.store)}. Life gets busy, we completely understand.</p><p>If you'd like to come back, book any time that suits you, even just an hour. And if you need a break or want to step away, just reply and tell us. No pressure at all.</p><p>Warmly,<br>The Thrift for Good team</p>`]
    : kind === 'first shift'
    ? [`Thank you for your first shift, ${f}`, `<p>Hi ${f},</p><p>Thank you for coming in for your first shift at Thrift for Good. We hope you enjoyed it, and that the team made you feel at home.</p><p>Your hours are already on your record. Book your next shift whenever suits you.</p><p>With thanks,<br>The Thrift for Good team</p>`]
    : [`${kind}. Thank you, ${f}`, `<p>Hi ${f},</p><p>You've just passed <b>${kind}</b> volunteering with Thrift for Good. That's ${kind} of sorting, styling and helping customers, and every one of them supports children's charities.</p><p>We notice the effort you put in and we're very grateful.</p><p>With thanks,<br>The Thrift for Good team</p>`];
  return `<div class="email"><header><span><b>To</b> ${esc(v.email)}</span><span><b>Subject</b> ${subject}</span></header><div>${body}</div></div>`;
}
function profile(v) {
  const m = approvedMin(v.id), h = m / 60, n = upcoming(v.id)[0], last = lastVisit(v.id), ago = last ? daysBetween(last, today()) : null;
  const target = h < 50 ? 50 : nextMilestone(h);
  $('#modal-root').innerHTML = `<div class="backdrop drawer-bg" data-action="close-bg"><aside class="drawer" role="dialog" aria-modal="true" aria-label="${esc(v.name)}">
    <div class="drawer-head"><div class="who-cell">${avatar(v)}<div><h2>${esc(v.name)}</h2><span class="small muted">${esc(v.email)} · ${esc(v.store)}</span></div></div><button class="btn icon" data-action="close" aria-label="Close">${ic('x')}</button></div>
    <div class="drawer-stats"><div>${ring(h, target)}</div><div class="ds-list">
      <div><span>Member since</span><b>${fd(v.joined, { month: 'short', year: 'numeric' })}</b></div>
      <div><span>Last visit</span><b>${last ? (ago === 0 ? 'Today' : ago + ' days ago') : '–'}</b></div>
      <div><span>Next shift</span><b>${n ? relDay(n.date) + ' · ' + n.start : 'None booked'}</b></div>
      <div><span>Certificate</span><b>${v.wantsCert ? (S.certs.some(c => c.volId === v.id && c.status === 'issued') ? 'Issued' : 'Wants one') : 'Not needed'}</b></div>
    </div></div>
    <div class="row" style="margin:4px 0 6px"><button class="btn sm" data-action="nudge" data-id="${v.id}">${ic('mail')}Send check-in</button><button class="btn sm" data-action="export" data-vol="${v.id}">${ic('dl')}Export hours</button></div>
    ${badges(v)}${heatmap(v)}</aside></div>`;
  setTimeout(() => document.querySelectorAll('.drawer .ring .fill[data-off]').forEach(c => { c.style.strokeDashoffset = c.dataset.off; }), 40);
}
const MODALS = {
  edit(b) {
    modal('Change shift', 'Arrive later, leave earlier, stay longer. All fine.', `<form data-form="edit" data-id="${b.id}">${picker(b)}
      ${b.series ? `<label class="toggle-row check"><input type="checkbox" name="all"><span>Apply to every later shift in this weekly series</span></label>` : ''}
      <div class="row" style="justify-content:flex-end;margin-top:18px"><button type="button" class="btn" data-action="close">Back</button><button class="btn primary" type="submit">Save changes</button></div></form>`);
    $('.modal').style.width = 'min(780px,100%)';
    updatePicker($('#modal-root form'));
  },
  manual() {
    modal('Add hours manually', 'For a missed scan or a flat phone. Manual entries go to Approvals.', `<form data-form="manual">
      <div class="field"><label>Volunteer</label><select name="volId">${active().map(v => `<option value="${v.id}">${esc(v.name)}</option>`).join('')}</select></div>
      <div class="fields"><div class="field"><label>Store</label><select name="store">${STORES.map(s => `<option>${s}</option>`).join('')}</select></div><div class="field"><label>Date</label><input type="date" name="date" value="${today()}" max="${today()}"></div>
      <div class="field"><label>Arrived</label><input type="time" name="in" value="10:00"></div><div class="field"><label>Left</label><input type="time" name="out" value="13:00"></div></div>
      <div class="field"><label>Reason</label><input name="note" placeholder="Forgot to scan out"></div><div class="err" id="merr"></div>
      <div class="row" style="justify-content:flex-end"><button type="button" class="btn" data-action="close">Cancel</button><button class="btn primary" type="submit">Send for approval</button></div></form>`);
  },
  checkout(a) {
    const v = vol(a.volId), b = S.bookings.find(x => x.volId === a.volId && x.date === a.date && x.status === 'booked');
    const out = nowMin() > toMin(a.in) + 15 && nowMin() <= CLOSE ? toTime(nowMin()) : (b?.end || toTime(toMin(a.in) + 120));
    modal(`Scan out ${esc(v.name)}`, `In since ${a.in} at ${esc(a.store)}`, `<form data-form="checkout" data-id="${a.id}"><div class="fields"><div class="field"><label>Arrived</label><input type="time" name="in" value="${a.in}"></div><div class="field"><label>Leaving</label><input type="time" name="out" value="${out}"></div></div>
      <p class="hint" style="margin-top:-4px">In the live version both times come from the scans. They're editable here so the demo works at any time of day.</p>
      <div class="row" style="justify-content:flex-end;margin-top:14px"><button type="button" class="btn" data-action="close">Cancel</button><button class="btn primary" type="submit">${ic('check')}Confirm scan out</button></div></form>`);
  },
  cert(c) {
    const v = vol(c.volId);
    modal('Certificate preview', 'Placeholder layout, to be matched to TFG\'s real template.', `<div class="cert"><span class="kicker">Certificate of volunteering</span><h1>${esc(v.name)}</h1><p class="muted" style="margin:0">has given</p><div class="big">${hrs(approvedMin(v.id))} hours</div>
      <p class="muted" style="max-width:40ch;margin:8px auto 0">of volunteer service to Thrift for Good, supporting children's charities across the UAE.</p><div class="row between small muted" style="margin-top:26px"><span>${fd(today(), { day: 'numeric', month: 'long', year: 'numeric' })}</span><span>Thrift for Good</span></div></div>
      <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn" data-action="close">Close</button><button class="btn primary" data-action="issue-cert" data-id="${c.id}">${ic('mail')}Issue & email</button></div>`);
  },
};

/* ---------- presenter script ---------- */
const SCRIPT = [
  ['join', 'form', 'Sign-up replaces Airtable', 'Two-minute form, with the 50-hour certificate question.'],
  ['manager', 'approvals', 'Approve after induction', 'Staff approve. A welcome email and QR code go out.'],
  ['volunteer', 'book', 'Flexible booking', 'Any day, any store, any hours. Tap arrive, then leave.'],
  ['volunteer', 'shifts', 'Change or cancel yourself', 'No more staff editing shifts by hand.'],
  ['manager', 'today', 'Scan in and out at the till', 'Scan Aisha in, then out at 14:00. She crosses 50 hours.'],
  ['manager', 'insights', 'Automatic thank-yous', 'The 50-hour email has just gone out. Priority 2 link.'],
  ['manager', 'hours', 'Export for CDA', 'One CSV with every visit, ready to hand over.'],
];
function renderScript() {
  let el = $('#script');
  if (!el) { el = document.createElement('aside'); el.id = 'script'; document.body.append(el); }
  if (!UI.script) { el.innerHTML = `<button class="script-fab" data-action="script-open">${ic('arrow')}Demo script</button>`; return; }
  const cur = SCRIPT.findIndex(([r, t]) => UI.role === r && UI.tab[r] === t);
  el.innerHTML = `<div class="script-panel"><div class="script-head"><div><span class="kicker" style="margin:0">Presenter</span><b>Demo script</b></div><button class="btn icon sm" data-action="script-close" aria-label="Hide demo script">${ic('x')}</button></div>
    <ol>${SCRIPT.map(([r, t, title, note], i) => `<li class="${i === cur ? 'on' : ''}"><button data-action="script-go" data-i="${i}"><i>${i + 1}</i><span><b>${title}</b><small>${note}</small></span></button></li>`).join('')}</ol>
    <div class="script-foot"><button class="btn sm" data-action="script-step" data-d="-1" ${cur <= 0 ? 'disabled' : ''}>Back</button><span class="mono small muted">${cur < 0 ? '–' : cur + 1} / ${SCRIPT.length}</span><button class="btn sm primary" data-action="script-step" data-d="1" ${cur >= SCRIPT.length - 1 ? 'disabled' : ''}>Next ${ic('arrow')}</button></div></div>`;
  const on = el.querySelector('li.on'); if (on) on.scrollIntoView({ block: 'nearest' });
}
function goScript(i) { const [r, t] = SCRIPT[i]; UI.role = r; UI.tab[r] = t; closeModal(); render(); scrollTo(0, 0); }

/* ---------- actions ---------- */
function flash() { const vf = $('#vf'); if (vf) { vf.classList.remove('flash'); void vf.offsetWidth; vf.classList.add('flash'); } }
function logScan(v, dir, t) { S.scans = [{ name: v.name, dir, t }, ...(S.scans || [])].slice(0, 8); }
function scan(code) {
  const v = S.volunteers.find(x => x.code.toLowerCase() === code.trim().toLowerCase());
  if (!v) return toast('That code isn\'t recognised', 'warn');
  if (v.status !== 'active') return toast(`${esc(v.name)} hasn't finished induction yet`, 'warn');
  flash();
  const o = openAtt(v.id);
  if (o) return setTimeout(() => MODALS.checkout(o), 250);
  const b = S.bookings.find(x => x.volId === v.id && x.date === today() && x.status === 'booked');
  const n = nowMin(), inT = n >= OPEN && n < CLOSE - 30 ? toTime(n) : (b?.start || '10:00');
  S.attendance.push({ id: uid(), volId: v.id, store: b?.store || v.store, date: today(), in: inT, out: null, minutes: 0, source: 'qr', status: 'pending' });
  logScan(v, 'in', inT); save(); render(); flash(); toast(`<b>${esc(v.name)}</b> scanned in at ${inT}`);
}
function downloadCSV(volId) {
  const rows = S.attendance.filter(a => a.out && (!volId || a.volId === volId)).sort((a, b) => a.date.localeCompare(b.date));
  const cols = ['volunteer_id', 'name', 'email', 'store', 'date', 'check_in', 'check_out', 'hours', 'source', 'status'];
  const q = s => `"${String(s).replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...rows.map(a => { const v = vol(a.volId); return [v.id, v.name, v.email, a.store, a.date, a.in, a.out, (a.minutes / 60).toFixed(2), a.source, a.status].map(q).join(','); })].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const el = Object.assign(document.createElement('a'), { href: url, download: `tfg-volunteer-hours-${volId || 'all'}-${today()}.csv` });
  document.body.append(el); el.click(); el.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast(`Exported ${rows.length} visits as CSV, ready for CDA`, 'dl');
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-action]'); if (!t) return;
  const a = t.dataset.action, id = t.dataset.id;
  if (a === 'close-bg') { if (e.target === t) closeModal(); return; }
  if (['me', 'filter'].includes(a)) return;
  if (['approve-vol', 'approve-hrs', 'reject-hrs', 'issue-cert'].includes(a) && !t.dataset.go && t.closest('.view .item')) { const row = t.closest('.item'); row.classList.add(a.startsWith('reject') ? 'leaving bad' : 'leaving'); t.dataset.go = 1; setTimeout(() => t.click(), 320); return; }
  const ok = (msg, icon) => { save(); render(); if (msg) toast(msg, icon); };
  const f = t.closest('form');
  switch (a) {
    case 'role': UI.role = t.dataset.role; render(); scrollTo(0, 0); break;
    case 'tab': UI.tab[UI.role] = t.dataset.tab; closeModal(); render(); scrollTo(0, 0); break;
    case 'goto': UI.role = t.dataset.role; UI.tab[UI.role] = t.dataset.tab; render(); scrollTo(0, 0); break;
    case 'close': closeModal(); break;
    case 'reset': ask('Reset the demo?', 'All bookings, scans and approvals go back to the sample data. Use this before presenting.', 'Reset data', 'do-reset'); break;
    case 'do-reset': closeModal(); S = seed(); UI.joined = null; UI.chips = []; ok('Demo data reset', 'repeat'); break;
    case 'pick-date': f.date.value = t.dataset.d; updatePicker(f); break;
    case 'pick-store': f.store.value = t.dataset.s; updatePicker(f); break;
    case 'pick-slot': {
      const m = +t.dataset.m;
      if (f.dataset.anchor !== undefined && m >= +f.dataset.anchor) { f.end.value = toTime(m + STEP); delete f.dataset.anchor; }
      else { f.start.value = toTime(m); f.end.value = toTime(m + STEP); f.dataset.anchor = m; }
      updatePicker(f); break;
    }
    case 'chip': UI.chips = UI.chips.includes(t.dataset.v) ? UI.chips.filter(x => x !== t.dataset.v) : [...UI.chips, t.dataset.v]; t.classList.toggle('on'); break;
    case 'edit-shift': MODALS.edit(S.bookings.find(b => b.id === id)); break;
    case 'cancel-shift': { const b = S.bookings.find(x => x.id === id); b.status = 'cancelled'; ok(`${fd(b.date)} ${b.start}–${b.end} cancelled <button class="undo" data-action="undo-cancel" data-id="${b.id}">Undo</button>`, 'x'); break; }
    case 'undo-cancel': { const b = S.bookings.find(x => x.id === id); if (b) { b.status = 'booked'; t.closest('.toast')?.remove(); ok('Shift restored', 'repeat'); } break; }
    case 'scan': scan(t.dataset.code); break;
    case 'manual': MODALS.manual(); break;
    case 'approve-vol': { const v = vol(id); v.status = 'active'; S.emails.unshift({ id: uid(), volId: id, kind: 'welcome', date: today() }); ok(`<b>${esc(v.name)}</b> approved. Welcome email and QR code sent.`, 'mail'); break; }
    case 'decline-vol': { const v = vol(id); ask(`Decline ${esc(v.name)}?`, 'Their application is removed. They can apply again any time.', 'Decline', 'do-decline', id, true); break; }
    case 'do-decline': { closeModal(); S.volunteers = S.volunteers.filter(x => x.id !== id); ok('Application declined', 'x'); break; }
    case 'approve-hrs': { const at = S.attendance.find(x => x.id === id), before = approvedMin(at.volId); at.status = 'approved'; checkMilestones(at.volId, before); ok(`${hrs(at.minutes)} hrs approved for <b>${esc(vol(at.volId).name)}</b>`); break; }
    case 'reject-hrs': S.attendance = S.attendance.filter(x => x.id !== id); ok('Entry rejected', 'x'); break;
    case 'preview-cert': MODALS.cert(S.certs.find(c => c.id === id)); break;
    case 'issue-cert': { const c = S.certs.find(x => x.id === id); c.status = 'issued'; c.decided = today(); closeModal(); ok(`Certificate issued and emailed to <b>${esc(vol(c.volId).name)}</b>`, 'award'); break; }
    case 'req-cert': S.certs.push({ id: uid(), volId: S.me, date: today(), status: 'pending' }); ok('Certificate requested. The team will confirm soon.', 'award'); break;
    case 'toggle-cert': me().wantsCert = true; ok('You\'re opted in for the 50-hour certificate', 'award'); break;
    case 'export': downloadCSV(t.dataset.vol); break;
    case 'email': { const em = S.emails.find(x => x.id === id); modal('Automated email', `Sent ${fd(em.date)}`, emailHTML(vol(em.volId), em.kind)); break; }
    case 'nudge': modal('"Gone quiet" check-in', 'Sent automatically after 30 days without a visit.', emailHTML(vol(id), 'quiet') + `<div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn" data-action="close">Close</button><button class="btn primary" data-action="send-nudge">${ic('mail')}Send now</button></div>`); break;
    case 'send-nudge': closeModal(); toast('Check-in email sent', 'mail'); break;
    case 'script-open': UI.script = true; renderScript(); saveUI(); break;
    case 'script-close': UI.script = false; renderScript(); saveUI(); break;
    case 'script-go': goScript(+t.dataset.i); break;
    case 'script-step': { const cur = SCRIPT.findIndex(([r, tb]) => UI.role === r && UI.tab[r] === tb); goScript(Math.max(0, Math.min(SCRIPT.length - 1, (cur < 0 ? -1 : cur) + +t.dataset.d))); break; }
    case 'cal-nav': UI.calOff = Math.max(-2, Math.min(2, (UI.calOff || 0) + +t.dataset.d)); render(); break;
    case 'cal-book': UI.prefDate = t.dataset.d; UI.tab.volunteer = 'book'; render(); delete UI.prefDate; scrollTo(0, 0); break;
    case 'profile': profile(vol(id)); break;
    case 'big-qr': { const v = me(); $('#modal-root').innerHTML = `<div class="backdrop qr-bg" data-action="close-bg"><div class="qr-full" role="dialog" aria-modal="true"><span class="kicker">Thrift for Good · volunteer</span><h2>${esc(v.name)}</h2><div class="qr-big">${qr(v.code, 8)}</div><b class="mono">${v.code}</b><p class="small muted">Turn your screen brightness up and hold it under the scanner.</p><button class="btn dark" data-action="close" style="width:100%">Done</button></div></div>`; break; }
    case 'join-again': UI.joined = null; UI.chips = []; render(); break;
  }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.action === 'me') { S.me = t.value; save(); render(); }
  if (t.dataset.action === 'filter') { UI.filter = t.value; render(); }
  if (t.name === 'cert') { t.closest('.chips').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.contains(t))); $('#cert-err').textContent = ''; }
});
document.addEventListener('input', e => {
  const fld = e.target.closest('form[data-form=join] .field.invalid');
  if (fld) { fld.classList.remove('invalid'); const er = fld.querySelector('[data-err]'); if (er) er.textContent = ''; }
  if (e.target.name === 'consent') { const er = $('[data-err=consent]'); if (er) er.textContent = ''; }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.addEventListener('submit', e => {
  const f = e.target, kind = f.dataset.form; if (!kind) return; e.preventDefault();
  const d = Object.fromEntries(new FormData(f));
  if (kind === 'book') {
    const n = d.repeat ? +d.weeks : 1, series = n > 1 ? uid() : null;
    for (let i = 0; i < n; i++) S.bookings.push({ id: uid(), volId: S.me, store: d.store, date: addDays(d.date, i * 7), start: d.start, end: d.end, series, status: 'booked' });
    save(); UI.tab.volunteer = 'shifts'; render(); scrollTo(0, 0);
    toast(`Booked ${n > 1 ? n + ' weekly shifts' : relDay(d.date).toLowerCase()} at ${esc(d.store)}, ${d.start}–${d.end}`, 'cal');
  }
  if (kind === 'edit') {
    const b = S.bookings.find(x => x.id === f.dataset.id);
    const targets = d.all && b.series ? S.bookings.filter(x => x.series === b.series && x.date >= b.date && x.status === 'booked') : [b];
    targets.forEach(x => { x.start = d.start; x.end = d.end; x.store = d.store; if (x === b) x.date = d.date; });
    closeModal(); save(); render(); toast(`Updated ${targets.length > 1 ? targets.length + ' shifts' : 'your shift'}. No staff action needed.`, 'cal');
  }
  if (kind === 'scan') { if (d.code.trim()) scan(d.code); f.reset(); }
  if (kind === 'manual') {
    const m = toMin(d.out) - toMin(d.in); if (m <= 0) { $('#merr').textContent = 'The leaving time needs to be after the arrival time'; return; }
    S.attendance.push({ id: uid(), volId: d.volId, store: d.store, date: d.date, in: d.in, out: d.out, minutes: m, source: 'manual', status: 'pending', note: d.note });
    closeModal(); save(); render(); toast(`${hrs(m)} hrs added for <b>${esc(vol(d.volId).name)}</b> and sent to Approvals`);
  }
  if (kind === 'checkout') {
    const at = S.attendance.find(x => x.id === f.dataset.id), m = toMin(d.out) - toMin(d.in);
    if (m <= 0) return toast('Leaving time needs to be after arrival', 'warn');
    const before = approvedMin(at.volId), v = vol(at.volId), isFirst = !S.attendance.some(x => x.volId === at.volId && x.out);
    Object.assign(at, { in: d.in, out: d.out, minutes: m, status: 'approved' });
    logScan(v, 'out', d.out); closeModal(); checkMilestones(at.volId, before);
    if (isFirst) { S.emails.unshift({ id: uid(), volId: v.id, kind: 'first shift', date: today() }); setTimeout(() => toast(`First-shift thank-you sent to <b>${esc(v.name)}</b>`, 'mail'), 700); } save(); render();
    toast(`<b>${esc(v.name)}</b> scanned out. ${hrs(m)} hrs logged automatically.`);
  }
  if (kind === 'join') {
    const errs = {};
    if (!d.name.trim() || d.name.trim().length < 2) errs.name = 'Please enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) errs.email = d.email.trim() ? 'That email doesn\'t look quite right' : 'We need an email to send your induction details';
    if (!d.cert) errs.cert = 'Please choose one';
    if (!d.consent) errs.consent = 'Please agree to continue';
    f.querySelectorAll('[data-err]').forEach(x => { x.textContent = errs[x.dataset.err] || ''; x.closest('.field')?.classList.toggle('invalid', !!errs[x.dataset.err]); });
    $('#cert-err').textContent = errs.cert || '';
    if (Object.keys(errs).length) { const firstBad = f.querySelector('.field.invalid input, .field.invalid textarea') || f.querySelector('[name=consent]'); if (errs.name || errs.email) firstBad.focus(); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); return; }
    const id = 'v' + uid();
    S.volunteers.push({ id, name: d.name.trim(), email: d.email, store: d.store, wantsCert: d.cert === 'yes', status: 'pending', joined: today(), code: 'TFG-' + id.slice(1, 5).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 8999), availability: UI.chips.join(', ') || 'Flexible', notes: d.notes });
    UI.joined = id; UI.chips = []; save(); render(); scrollTo(0, 0);
  }
});

render();
