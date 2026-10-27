/* 이 프로젝트 전용 브라우저 체험 저장소. 외부 전송·실제 인증은 수행하지 않습니다. */
(function () {
  'use strict';
  var A = window.APP, D = window.DB, S = A.S;
  var KEY = 'ongyeol:159277:experience:v1', SCHEMA = 1;
  var writer = D.U.uid('tab'), revision = 0, drafts = Object.create(null), pending = null;
  var suspended = false, lastRoute = null, status = 'ready', message = '';
  var baseFields = D.FORM.fields.map(function (f) { return f.id; });
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function object(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
  function text(s) { return typeof s === 'string'; }
  function array(a) { return Array.isArray(a); }
  function image(s) { return s == null || (text(s) && /^data:image\/(?:png|jpeg|webp|svg\+xml)(?:;charset=utf-8)?(?:;base64)?,[^"<>]+$/i.test(s)); }
  function validWizard(w) {
    return w == null || (object(w) && ['개인','법인'].indexOf(w.kind) >= 0 && object(w.ap) && ['name','phone','email','address','addressDetail','rrn1','rrn2'].every(function (k) { return text(w.ap[k]); }) && object(w.mark) && object(w.sign) && object(w.sel) && object(w.agree) && object(w.pay) && w.step >= 1 && w.step <= 6 && w.max >= w.step && w.max <= 6 && image(w.sign.img) && image(w.sign.raw) && (!w.mark.conv || image(w.mark.conv.url)) && (!w.mark.orig || image(w.mark.orig.url)) && Object.keys(w.sel).every(function (cls) { return array(w.sel[cls]) && w.sel[cls].every(function (id) { return D.GMAP[id] && D.GMAP[id].cls === +cls; }); }));
  }
  function valid(s) {
    if (!object(s) || s.schema !== SCHEMA || !Number.isInteger(s.rev) || s.rev < 0) return false;
    if (s.reset === true) return true;
    var d = s.data;
    if (!object(d) || !array(d.cases) || !array(d.customers) || !array(d.audit) || !object(d.office) || !object(d.office.agent) || !object(d.rates) || !object(d.form) || !object(d.form.defs) || !array(d.form.versions) || !object(d.worker) || !array(d.worker.checks) || !object(s.session) || !object(s.drafts)) return false;
    if (!['name','title','code','address'].every(function (k) { return text(d.office.agent[k]); }) || !['id','name','place','mode','def','ver'].every(function (k) { return text(d.worker[k]); })) return false;
    if (!Object.keys(D.RATE).every(function (k) { return k === 'note' ? text(d.rates[k]) : Number.isFinite(d.rates[k]) && d.rates[k] >= 0; })) return false;
    var ids = new Set();
    if (!d.cases.every(function (c) {
      if (!object(c) || !/^C[0-9]+$/.test(c.id) || ids.has(c.id) || !Number.isInteger(c.seq) || !D.STAGE[c.stage] || !object(c.applicant) || !text(c.applicant.name) || !text(c.applicant.address) || !object(c.mark) || !text(c.mark.text) || !image(c.mark.img) || !object(c.mark.spec) || !object(c.sign) || !image(c.sign.img) || !image(c.sign.raw) || !array(c.goods) || !object(c.fee) || !object(c.pay) || !object(c.official) || !object(c.receipt) || !array(c.versions) || !array(c.history) || !array(c.alerts) || !object(c.auto) || !array(c.auto.steps) || c.auto.steps.length !== 7 || !array(c.auto.log) || !array(c.auto.submitTries) || !array(c.auto.invalid)) return false;
      ids.add(c.id);
      return c.goods.every(function (g) { return array(g.ids) && g.ids.every(function (id) { return D.GMAP[id] && D.GMAP[id].cls === +g.cls; }); });
    })) return false;
    var users = new Set();
    if (!d.customers.every(function (u) { if (!object(u) || !/^u[_-][a-zA-Z0-9_-]+$/.test(u.id) || users.has(u.id) || !text(u.name) || !text(u.email) || !text(u.password)) return false; users.add(u.id); return true; })) return false;
    if (!Number.isInteger(d.sequence) || d.sequence < 55) return false;
    if (!Object.keys(s.drafts).every(function (id) { return users.has(id) && validWizard(s.drafts[id]); })) return false;
    if (!d.form.defs[d.form.current] || !d.form.versions.length) return false;
    return Object.keys(d.form.defs).every(function (ver) {
      var fields = d.form.defs[ver];
      return /^v\d+$/.test(ver) && array(fields) && fields.length === baseFields.length && new Set(fields.map(function (f) { return f.id; })).size === baseFields.length && fields.every(function (f) {
        return baseFields.indexOf(f.id) >= 0 && ['x','y','w','size','max'].every(function (k) { return Number.isFinite(f[k]); }) && f.x >= 0 && f.y >= 0 && f.x + f.w <= 100 && f.y <= 100 && f.w > 0 && f.size >= 0 && (f.seal || (Number.isInteger(f.max) && f.max >= 1 && (!f.lines || Number.isInteger(f.lines) && f.lines >= 1)));
      });
    });
  }
  function notice() {
    var box = document.getElementById('storageNotice');
    if (!box) { box = document.createElement('aside'); box.id = 'storageNotice'; box.className = 'storage-notice'; box.setAttribute('role','status'); document.body.appendChild(box); }
    box.hidden = !message;
    document.body.classList.toggle('has-storage-notice', !!message);
    box.replaceChildren();
    if (message) {
      var label = document.createElement('span'); label.textContent = message; box.appendChild(label);
      if (status === 'conflict' || status === 'reset') { var b = document.createElement('button'); b.className = 'btn sm o'; b.textContent = '새로고침'; b.onclick = function () { location.reload(); }; box.appendChild(b); }
    }
  }
  function fail(code, msg) { status = code; message = msg; notice(); }
  function copyFields(target, source) { Object.keys(target).forEach(function (k) { if (Object.prototype.hasOwnProperty.call(source,k) && typeof target[k] !== 'function') target[k] = source[k]; }); }
  function recoverWork(c) {
    if (c.stage !== 'auto' && c.stage !== 'submitting') return;
    if (c.auto.job) c.auto.job.locked = false;
    var now = Date.now(), msg;
    if (c.stage === 'submitting') {
      c.stage = 'unknown'; c.auto.steps[5].state = 'unknown'; c.official.status = '보류';
      msg = '새로고침 당시 제출이 진행 중이었습니다. 제출 내역 대조 전에는 다시 제출하거나 납부하지 않습니다.';
      c.auto.submitTries.push({ at: now, result: '새로고침 · 제출 결과 확인 필요' });
    } else {
      c.stage = 'error';
      msg = '새로고침으로 자동 입력을 중단했습니다. 현재 버전의 자료를 확인한 뒤 재처리해 주세요.';
      c.auto.err = { code: 'resume', step: 2, field: '자동 입력 작업', msg: msg };
      c.auto.steps.forEach(function (step) { if (step.state === 'run') step.state = 'stop'; });
    }
    c.auto.log.push({ t: now, lvl: 'warn', msg: msg });
    D.hist(c, now, '시스템', msg);
  }
  function stashDraft() {
    if (S.cust) { if (S.wiz) drafts[S.cust] = clone(S.wiz); else delete drafts[S.cust]; }
  }
  function getDraft(id) { return drafts[id] ? clone(drafts[id]) : null; }
  function hydrate(s) {
    var d = s.data;
    // 이미 참조한 배열·객체를 교체하지 않습니다(관리자 모듈의 목록 참조 유지).
    D.CASES.splice.apply(D.CASES, [0,D.CASES.length].concat(d.cases));
    D.CUSTOMERS.splice.apply(D.CUSTOMERS, [0,D.CUSTOMERS.length].concat(d.customers));
    D.AUDIT.splice.apply(D.AUDIT, [0,D.AUDIT.length].concat(d.audit));
    copyFields(D.OFFICE.agent, d.office.agent); copyFields(D.RATE, d.rates); copyFields(D.WORKER, d.worker);
    D.FORM.current = d.form.current; D.FORM.versions = d.form.versions; D.FORM.defs = d.form.defs; D.FORM.fields = D.FORM.defs[D.FORM.current];
    D.setSequence(d.sequence);
    drafts = Object.create(null); Object.keys(s.drafts).forEach(function (id) { drafts[id] = s.drafts[id]; });
    S.cust = D.CUSTOMERS.some(function (u) { return u.id === s.session.cust; }) ? s.session.cust : null;
    S.admin = D.ADMINS.some(function (u) { return u.id === s.session.admin; }) ? s.session.admin : null;
    S.wiz = S.cust ? getDraft(S.cust) : null;
    if (S.wiz) S.wiz.aiLoading = false;
    var last = D.find(s.session.lastCase); S.lastCase = last && last.owner === S.cust ? last.id : null;
    lastRoute = text(s.route) && /^#\/[a-zA-Z0-9_/?=\-]*$/.test(s.route) ? s.route : null;
    D.CASES.forEach(recoverWork);
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY); if (!raw) return;
      var saved = JSON.parse(raw);
      if (!valid(saved)) throw new Error('invalid snapshot');
      revision = saved.rev;
      if (!saved.reset) hydrate(saved);
    } catch (e) {
      suspended = true;
      fail('unavailable', '저장된 체험 자료를 불러오지 못했습니다. 현재는 임시로 이용할 수 있으며, 로그인 화면에서 초기화할 수 있습니다.');
    }
  }
  function snapshot() {
    stashDraft();
    return { schema: SCHEMA, rev: revision + 1, writer: writer, savedAt: Date.now(), route: location.hash,
      session: { cust: S.cust, admin: S.admin, lastCase: S.lastCase || null }, drafts: drafts,
      data: { cases: D.CASES, customers: D.CUSTOMERS, audit: D.AUDIT, office: { agent: D.OFFICE.agent }, rates: D.RATE, form: { current: D.FORM.current, versions: D.FORM.versions, defs: D.FORM.defs }, worker: D.WORKER, sequence: D.getSequence() } };
  }
  function flush() {
    if (pending) { clearTimeout(pending); pending = null; }
    if (suspended) return false;
    try {
      var raw = localStorage.getItem(KEY), current = raw ? JSON.parse(raw) : null;
      if (current && current.rev > revision && current.writer !== writer) { suspended = true; fail('conflict', '다른 탭에서 체험 자료를 변경했습니다. 최신 자료를 불러오려면 새로고침해 주세요. 현재 탭은 덮어쓰기를 중단했습니다.'); return false; }
      var state = snapshot(); localStorage.setItem(KEY, JSON.stringify(state)); revision = state.rev;
      if (status !== 'ready') { status = 'ready'; message = ''; notice(); }
      return true;
    } catch (e) {
      fail('write-error', '체험 자료를 브라우저에 저장하지 못했습니다. 큰 이미지나 저장 공간을 확인해 주세요. 최근 변경은 새로고침 시 사라질 수 있습니다.');
      return false;
    }
  }
  function schedule() { if (!suspended && !pending) pending = setTimeout(flush, 220); }
  function reset() {
    if (pending) { clearTimeout(pending); pending = null; }
    try {
      var raw = localStorage.getItem(KEY), current;
      try { current = raw && JSON.parse(raw); } catch (e) { current = null; }
      // 빈 초기화 표식으로 원자적으로 교체해 다른 탭이 이전 자료를 다시 저장하지 못하게 합니다.
      localStorage.setItem(KEY, JSON.stringify({ schema: SCHEMA, reset: true, rev: Math.max(revision, current && +current.rev || 0) + 1, writer: writer, savedAt: Date.now() }));
      suspended = true; drafts = {}; S.cust = null; S.admin = null; S.wiz = null; S.lastCase = null;
      return true;
    } catch (e) { fail('write-error', '브라우저 저장소를 초기화하지 못했습니다. 브라우저의 사이트 저장 권한을 확인해 주세요.'); return false; }
  }
  A.store = { key: KEY, schedule: schedule, flush: flush, reset: reset, stashDraft: stashDraft, getDraft: getDraft, resumeRoute: function () { return lastRoute; }, status: function () { return status; } };
  load();
  ['input','change','click','submit'].forEach(function (name) { document.addEventListener(name, schedule); });
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
  window.addEventListener('storage', function (e) {
    if (e.key !== KEY && e.key !== null) return;
    var saved; try { saved = e.newValue && JSON.parse(e.newValue); } catch (err) { saved = null; }
    if (!saved || saved.reset) {
      suspended = true; S.cust = null; S.admin = null; S.wiz = null; S.lastCase = null; D.WORKER.online = false;
      A.go('#/login'); fail('reset', '다른 탭에서 체험 자료를 초기화했습니다. 새로고침하면 처음 상태로 시작합니다.');
    } else if (saved.writer !== writer && saved.rev > revision) {
      suspended = true; fail('conflict', '다른 탭에서 체험 자료를 변경했습니다. 최신 자료를 불러오려면 새로고침해 주세요. 현재 탭은 덮어쓰기를 중단했습니다.');
    }
  });
})();
