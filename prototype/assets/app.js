/* 온결 셀프상표 프로토타입 — 라우터 · 셸 · 공통 부품 · 기능 살펴보기 */
(function () {
  'use strict';
  var D = window.DB, U = D.U;

  /* ---------- 상태 ---------- */
  var S = {
    cust: null, admin: null, theme: 'light',
    flags: { mismatch: false, drop: false, authManual: false },
    wiz: null, guide: null, demoOpen: false, side: false,
    seen: {}
  };
  try { var th = localStorage.getItem('og-theme'); if (th) S.theme = th; } catch (e) { /* 저장소 미지원 */ }
  document.documentElement.setAttribute('data-theme', S.theme);

  /* ---------- 아이콘 ---------- */
  var IC = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    doc: '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    file: '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/>',
    check: '<path d="M5 12l5 5L20 7"/>', x: '<path d="M18 6L6 18M6 6l12 12"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    chev: '<path d="M9 6l6 6-6 6"/>', down: '<path d="M6 9l6 6 6-6"/>', up: '<path d="m6 15 6-6 6 6"/>',
    spark: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 14h.01M15 14h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5"/><circle cx="17" cy="9" r="2.8"/><path d="M17 14.5c2.5 0 4 1.5 4.8 4"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 10h18M7 15h3"/>',
    bank: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    stamp: '<path d="M9 3h6l-1 7h3a2 2 0 012 2v2H5v-2a2 2 0 012-2h3z"/><path d="M5 18h14v3H5z"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    type: '<path d="M4 7V5h16v2M9 19h6M12 5v14"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    bell: '<path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 004 0"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2.5"/><path d="M8 10V7a4 4 0 018 0v3"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2 2M14 9l2 2"/>',
    cpu: '<rect x="5" y="5" width="14" height="14" rx="2.5"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    play: '<path d="M7 4l13 8-13 8z"/>', pause: '<path d="M8 5v14M16 5v14"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 4v7h-7"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1.3-1.7-2-3-2-1.8 0-3 1-3 2.3 0 3 6 1.6 6 4.6 0 1.3-1.2 2.3-3 2.3-1.4 0-2.6-.7-3-2M12 5.5v2M12 16.5v2"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>', download: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
    print: '<path d="M7 9V3h10v6M7 17H5a2 2 0 01-2-2v-4a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2h-2"/><path d="M7 14h10v7H7z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    out: '<path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
    hash: '<path d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>',
    gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8c-2-4-6-4-6-1.5S10 8 12 8zM12 8c2-4 6-4 6-1.5S14 8 12 8z"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>'
  };
  function ic(n, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || '') + '</svg>'; }

  /* ---------- 공통 부품 ---------- */
  function badge(stage, cust) {
    var s = D.STAGE[stage] || { label: stage, tone: 'mute' };
    var tone = s.tone;
    if (cust && ['error', 'unknown', 'auth', 'approve', 'auto', 'submitting'].indexOf(stage) >= 0) tone = 'violet';
    var pulse = ['auto', 'submitting'].indexOf(stage) >= 0 ? ' pulse' : '';
    return '<span class="bdg ' + tone + pulse + '">' + (cust ? s.cust : s.label) + '</span>';
  }
  function bdg(text, tone, nodot) { return '<span class="bdg ' + (tone || 'mute') + (nodot ? ' nodot' : '') + '">' + text + '</span>'; }
  function mk(c) { return '<img src="' + c.mark.img + '" alt="상표 ' + U.esc(c.mark.text) + '">'; }
  function clsText(c) { return c.goods.filter(function (g) { return g.ids.length; }).map(function (g) { return g.cls + '류'; }).join(' · '); }
  function goodsCount(c) { return c.goods.reduce(function (a, g) { return a + g.ids.length; }, 0); }
  function admin() { return D.ADMINS.filter(function (a) { return a.id === S.admin; })[0]; }
  function cust() { return D.CUSTOMERS.filter(function (u) { return u.id === S.cust; })[0] || null; }
  function can(p) { var a = admin(); return a && D.ROLE[a.role].can.indexOf(p) >= 0; }

  /* ---------- 도장 · 서명 이미지 처리 ---------- */
  function sampleStamp(name) {
    var cv = document.createElement('canvas'); cv.width = 360; cv.height = 300;
    var x = cv.getContext('2d');
    // 종이 질감(약간 누런 바탕 + 잡티)
    x.fillStyle = '#F3EFE6'; x.fillRect(0, 0, 360, 300);
    for (var i = 0; i < 2600; i++) { x.fillStyle = 'rgba(120,100,70,' + (Math.random() * .08) + ')'; x.fillRect(Math.random() * 360, Math.random() * 300, 1.5, 1.5); }
    var grd = x.createLinearGradient(0, 0, 360, 300); grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(60,40,10,.10)'); x.fillStyle = grd; x.fillRect(0, 0, 360, 300);
    x.save(); x.translate(180, 152); x.rotate(-0.21);
    x.strokeStyle = '#C8272B'; x.lineWidth = 9; x.beginPath(); x.arc(0, 0, 92, 0, Math.PI * 2); x.stroke();
    x.lineWidth = 3; x.beginPath(); x.arc(0, 0, 78, 0, Math.PI * 2); x.stroke();
    x.fillStyle = '#C8272B'; x.textAlign = 'center'; x.textBaseline = 'middle';
    var nm = String(name || '도장').replace(/\s/g, '').slice(0, 4);
    if (nm.length <= 3) { x.font = '900 46px Pretendard, sans-serif'; x.fillText(nm.slice(0, 2), 0, -22); x.fillText(nm.slice(2) + '인', 0, 30); }
    else { x.font = '900 40px Pretendard, sans-serif'; x.fillText(nm.slice(0, 2), 0, -22); x.fillText(nm.slice(2, 4), 0, 26); }
    x.restore();
    // 잉크 번짐
    for (var j = 0; j < 500; j++) { x.fillStyle = 'rgba(243,239,230,' + (Math.random() * .7) + ')'; x.fillRect(80 + Math.random() * 200, 50 + Math.random() * 200, 2, 2); }
    return cv.toDataURL('image/png');
  }
  function cleanStamp(src, opt, cb) {
    opt = opt || {};
    var im = new Image();
    im.onload = function () {
      var w = im.naturalWidth, h = im.naturalHeight, sc = Math.min(1, 520 / Math.max(w, h));
      w = Math.round(w * sc); h = Math.round(h * sc);
      var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      var x = cv.getContext('2d'); x.drawImage(im, 0, 0, w, h);
      var d = x.getImageData(0, 0, w, h), p = d.data, minX = w, minY = h, maxX = 0, maxY = 0, th = opt.th == null ? 60 : opt.th;
      for (var i = 0; i < p.length; i += 4) {
        var r = p[i], g = p[i + 1], b = p[i + 2];
        var red = r - (g + b) / 2;
        if (red < th) { p[i + 3] = 0; continue; }
        var a = Math.min(255, (red - th) * 3.2);
        p[i] = 200; p[i + 1] = 30; p[i + 2] = 36; p[i + 3] = a;
        var k = i / 4, px = k % w, py = (k - px) / w;
        if (a > 40) { if (px < minX) minX = px; if (px > maxX) maxX = px; if (py < minY) minY = py; if (py > maxY) maxY = py; }
      }
      x.putImageData(d, 0, 0);
      if (maxX <= minX) { cb(null); return; }
      var pad = 8, bw = maxX - minX + pad * 2, bh = maxY - minY + pad * 2, side = Math.max(bw, bh);
      var out = document.createElement('canvas'); out.width = side; out.height = side;
      var o = out.getContext('2d');
      o.translate(side / 2, side / 2); o.rotate((opt.rot || 0) * Math.PI / 180);
      o.drawImage(cv, minX - pad, minY - pad, bw, bh, -bw / 2, -bh / 2, bw, bh);
      cb(out.toDataURL('image/png'), { w: w, h: h, kept: Math.round(bw) + '×' + Math.round(bh) });
    };
    im.onerror = function () { cb(null); };
    im.src = src;
  }

  /* ---------- 위임장 (양식 정의 기반 합성) ---------- */
  function poaData(c, extra) {
    if (c.poa && c.poa.data && !(extra && extra.fresh)) return JSON.parse(JSON.stringify(c.poa.data));
    var ap = c.applicant || {};
    var d = new Date(extra && extra.date || Date.now());
    return {
      appl_name: ap.kind === '법인' ? (ap.name || '') + (ap.rep ? '\n(대표이사 ' + ap.rep + ')' : '') : (ap.name || ''),
      appl_cust: ap.custNo || (ap.custNoReq ? '부여 신청 예정' : ''),
      appl_addr: ((ap.address || '') + (ap.addressDetail ? ' ' + ap.addressDetail : '')).trim(),
      agent_name: D.OFFICE.agent.title + ' ' + D.OFFICE.agent.name,
      agent_code: D.OFFICE.agent.code,
      agent_addr: D.OFFICE.agent.address,
      mark: (c.mark && c.mark.text ? c.mark.text : '') + (c.mark && c.mark.type !== 'text' ? ' (' + (c.mark.type === 'image' ? '도형' : '결합') + ' 상표)' : ''),
      date: d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일',
      seal: extra && extra.seal || (c.sign && c.sign.img) || null
    };
  }
  function capturePoa(c) {
    if (!c.poa) return;
    c.poa.data = poaData(c, { fresh: true, date: c.poa.at });
    var version = c.versions.filter(function (v) { return v.v === c.ver; })[0];
    if (version) version.poa = JSON.parse(JSON.stringify(c.poa));
  }
  function wrapLine(s, n) { var out = [], t = String(s); n = Number.isFinite(+n) && +n >= 1 ? Math.floor(+n) : 38; while (t.length > n) { var cut = t.lastIndexOf(' ', n); if (cut < n * .6) cut = n; out.push(t.slice(0, cut).trim()); t = t.slice(cut).trim(); } if (t) out.push(t); return out; }
  function poaCheck(data, ver) {
    var errs = [];
    D.FORM.get(ver).forEach(function (f) {
      var v = data[f.id];
      if (f.seal) { if (f.req && !v) errs.push({ fid: f.id, msg: '위임인 날인(도장 또는 서명)이 필요합니다' }); return; }
      if (f.req && !String(v || '').trim()) { errs.push({ fid: f.id, msg: f.label + ' 항목을 입력해 주세요' }); return; }
      var lines = f.lines || 1;
      var flat = String(v || '').split('\n');
      var need = flat.reduce(function (a, l) { return a + wrapLine(l, f.max).length; }, 0);
      if (need > lines + (f.id === 'appl_name' ? 1 : 0)) errs.push({ fid: f.id, msg: f.label + ' 항목이 허용 길이(' + f.max + '자 × ' + lines + '줄)를 넘습니다' });
    });
    return errs;
  }
  function poaHTML(data, o) {
    o = o || {};
    var errIds = (o.errs || []).map(function (e) { return e.fid; });
    var h = '<div class="poa' + (o.def ? ' def' : '') + '" id="' + (o.id || 'poa') + '">';
    h += '<div class="wm">양식 ' + U.esc(o.ver || D.FORM.current) + (o.hash ? ' · ' + U.short(o.hash) : '') + '</div>';
    h += '<div class="ttl">위임장</div>';
    h += '<div class="sec-t" style="top:19%">1. 위임인 (출원인)</div><div class="sec-t" style="top:41%">2. 대리인</div><div class="sec-t" style="top:59.6%">3. 위임 사항</div>';
    var labels = { appl_name: '성명(명칭)', appl_cust: '특허고객번호', appl_addr: '주소', agent_name: '성명', agent_code: '대리인 코드', agent_addr: '주소', mark: '상표(표장)' };
    var FL = o.fields || D.FORM.get(o.ver);
    FL.forEach(function (f) {
      if (labels[f.id]) h += '<div class="lb" style="top:' + (f.y + .15) + '%">' + labels[f.id] + '</div><div class="ln" style="top:' + (f.y + (f.lines === 2 ? 6.6 : 3.2)) + '%"></div>';
    });
    FL.forEach(function (f) {
      var v = data[f.id], err = errIds.indexOf(f.id) >= 0 ? ' err' : '';
      if (f.seal) {
        h += '<div class="sealbox' + err + '" data-fid="' + f.id + '" style="left:' + f.x + '%;top:' + f.y + '%;width:' + f.w + '%;aspect-ratio:1">' + (v ? '<img src="' + v + '" alt="날인">' : '<span class="lbl2">(인)</span>') + '</div>';
        return;
      }
      var txt = String(v || '').split('\n').map(function (l) { return wrapLine(l, f.max).join('\n'); }).join('\n');
      h += '<div class="fv' + err + '" data-fid="' + f.id + '" style="left:' + f.x + '%;top:' + f.y + '%;width:' + f.w + '%;font-size:' + (f.size / 5.6).toFixed(2) + 'cqi;min-height:2.6cqi">' + U.esc(txt) + '</div>';
    });
    h += '<div class="clause">위 사람을 대리인으로 선임하고 아래 사항을 위임합니다.<br>① 위 상표의 상표등록출원에 관한 일체의 절차 ② 출원 이후 보정·의견서 제출·등록료 납부 등 등록에 관한 절차 ③ 위 절차에 관한 복대리인의 선임 및 해임</div>';
    h += '<div class="lb" style="top:81.55%">작성일</div>';
    h += '<div class="lb" style="top:87.2%;left:36%">위임인 ' + U.esc(String(data.appl_name || '').split('\n')[0]) + '</div>';
    h += '<div class="foot">특 허 청 장 귀하</div>';
    h += '</div>';
    return h;
  }

  /* ---------- 라우터 ---------- */
  var VIEWS = { cust: {}, admin: {} };
  var cleanup = [];
  function onLeave(fn) { cleanup.push(fn); }
  function every(ms, fn) { var id = setInterval(fn, ms); cleanup.push(function () { clearInterval(id); }); return id; }
  function later(ms, fn) { var id = setTimeout(fn, ms); cleanup.push(function () { clearTimeout(id); }); return id; }
  var afterHooks = [];
  function after(fn) { afterHooks.push(fn); }
  var lastHash = null;

  function parse() {
    var h = (location.hash || '#/').replace(/^#\/?/, '');
    var parts = h.split('?')[0].split('/').filter(Boolean);
    var area = parts[0] === 'admin' ? 'admin' : 'cust';
    if (area === 'admin') parts.shift();
    return { area: area, name: parts[0] || '', args: parts.slice(1), hash: location.hash };
  }
  function render(keepScroll) {
    if (modalStack) while (modalStack.length) closeModal();
    cleanup.forEach(function (f) { try { f(); } catch (e) { /* 정리 실패 무시 */ } }); cleanup = []; afterHooks = [];
    var r = parse();
    if (r.area === 'admin' && r.name !== 'login' && !admin()) {
      S.adminReturn = location.hash;
      go('#/admin/login');
      return;
    }
    if (r.area === 'cust' && ['my', 'case', 'alerts', 'regpay', 'apply'].indexOf(r.name) >= 0 && !cust()) {
      S.custReturn = location.hash;
      go('#/login');
      return;
    }
    var fn = VIEWS[r.area][r.name] || VIEWS[r.area]['404'] || VIEWS[r.area][''];
    var html;
    try { html = fn.apply(null, r.args); }
    catch (err) { console.error(err); html = '<div class="wrap"><div class="empty">화면을 표시하는 중 문제가 생겼습니다.</div></div>'; }
    var root = document.getElementById('app');
    if (r.name === 'login') root.innerHTML = html;
    else if (r.area === 'admin') root.innerHTML = adminShell(r, html);
    else root.innerHTML = custShell(r, html);
    root.querySelectorAll('a[data-go]').forEach(function (el) { el.href = el.getAttribute('data-go'); });
    root.querySelectorAll('[data-go],[data-act]').forEach(function (el) {
      if (!/^(A|BUTTON|INPUT|SELECT|TEXTAREA|LABEL)$/.test(el.tagName)) { el.setAttribute('role', 'button'); el.tabIndex = 0; }
    });
    afterHooks.forEach(function (f) { try { f(); } catch (e) { console.error(e); } });
    if (!keepScroll && lastHash !== r.hash) window.scrollTo(0, 0);
    lastHash = r.hash;
    var demo = document.getElementById('demo'); if (demo) { demo.innerHTML = ''; demo.hidden = true; }
    document.title = (r.area === 'admin' ? '관리자 · ' : '') + D.OFFICE.service;
    if (window.APP.store) window.APP.store.schedule();
  }
  function go(h) { S.side = false; if (location.hash === h) render(); else location.hash = h; }
  window.addEventListener('hashchange', function () { S.side = false; render(); });

  /* ---------- 셸 ---------- */
  function custShell(r, body) {
    var u = cust();
    var dark = r.name === '' ;
    var unread = 0;
    if (u) D.CASES.forEach(function (c) { if (c.owner === u.id) unread += c.alerts.filter(function (a) { return !a.read; }).length; });
    var nav = [['', '서비스 소개'], ['apply', '셀프 출원'], ['my', '내 출원'], ['price', '요금 안내']];
    return '<header class="cnav' + (dark ? ' dark' : '') + '"><div class="wrap in">' +
      '<span class="logo" data-go="#/"><i>®</i>' + D.OFFICE.service + '<small>by ' + D.OFFICE.name + '</small></span>' +
      '<nav>' + nav.map(function (n) { return '<a data-go="#/' + n[0] + '" class="' + (r.name === n[0] ? 'on' : '') + '">' + n[1] + '</a>'; }).join('') + '</nav>' +
      '<div class="rt">' +
      (r.name === '' ? '<a class="backlink" href="../index.html" title="제안서 메인으로 이동">' + ic('back', 's') + '<span>메인으로</span></a>' : '') +
      '<button class="btn sm s admin-entry" data-go="#/admin/login">' + ic('shield', 's') + '<span>사무소 로그인</span></button>' +
      '<button class="ibtn" data-act="theme" title="화면 밝기 전환" aria-label="화면 밝기 전환">' + ic(S.theme === 'dark' ? 'sun' : 'moon') + '</button>' +
      (u ? '<button class="ibtn nb" data-go="#/alerts" title="알림" aria-label="알림">' + ic('bell') + (unread ? '<span class="dot"></span>' : '') + '</button>' +
        '<span class="umenu" data-go="#/my"><span class="avatar">' + U.esc(u.name[0]) + '</span><span>' + U.esc(u.name) + '님</span></span><button class="btn sm g" data-act="logout">로그아웃</button>'
        : '<button class="btn sm ' + (dark ? 'w' : 'p') + '" data-go="#/login">로그인</button>') +
      '</div></div></header><main class="cmain">' + body + '</main>' +
      '<footer class="cfoot"><div class="wrap"><div class="row sb wr"><div><b>' + D.OFFICE.name + '</b> · 대리인 ' + D.OFFICE.agent.title + ' ' + U.esc(D.OFFICE.agent.name) + ' · 서울특별시 마포구</div><div>개인정보 처리방침 · 이용약관 · 환불 규정</div></div>' +
      '<p class="mt8 tiny">체험 환경 · 사무소명·인물·상표·번호·요율은 가상 정보이며, 실제 인증·결제·특허청 출원·알림 발송은 이루어지지 않습니다.</p></div></footer>';
  }
  var ADM_MENU = [
    ['업무', [['', 'grid', '대시보드'], ['cases', 'doc', '출원 접수', 'cases'], ['worker', 'cpu', '자동화 모니터링', 'auto']]],
    ['결제 · 납부', [['official', 'receipt', '관납료 납부', 'official'], ['payments', 'card', '결제 · 환불']]],
    ['운영', [['stages', 'flag', '심사 · 등록 단계'], ['notify', 'send', '알림톡 발송'], ['members', 'users', '회원 관리']]],
    ['설정', [['forms', 'file', '위임장 양식'], ['rates', 'coin', '요율표'], ['settings', 'gear', '대리인 · 규격'], ['audit', 'shield', '권한 · 감사 로그']]]
  ];
  function admCount(k) {
    var C = D.CASES;
    if (k === 'cases') return C.filter(function (c) { return ['paid', 'review'].indexOf(c.stage) >= 0; }).length;
    if (k === 'auto') return C.filter(function (c) { return ['error', 'unknown', 'auth', 'approve'].indexOf(c.stage) >= 0; }).length;
    if (k === 'official') return C.filter(function (c) { return c.official.status === '미납' && c.official.due; }).length;
    return 0;
  }
  function adminShell(r, body) {
    var a = admin(), W = D.WORKER;
    var cur = r.name === 'case' || r.name === 'auto' ? (r.name === 'auto' ? 'worker' : 'cases') : r.name;
    var side = '<aside class="office-sidebar' + (S.side ? ' open' : '') + '" id="side"><span class="logo" data-go="#/admin"><i>®</i>' + D.OFFICE.service + '<small>사무소</small></span>' +
      '<div class="wk' + (W.online ? '' : ' off') + '"><span class="dot"></span>' + W.name + ' · ' + (W.online ? '연결됨' : '연결 끊김') + '</div>';
    ADM_MENU.forEach(function (g) {
      side += '<div class="grp">' + g[0] + '</div>';
      g[1].forEach(function (m) {
        var n = m[3] ? admCount(m[3]) : 0;
        side += '<a data-go="#/admin/' + m[0] + '" class="' + (cur === m[0] ? 'on' : '') + '">' + ic(m[1]) + m[2] + (n ? '<span class="cnt">' + n + '</span>' : '') + '</a>';
      });
    });
    side += '<a data-go="#/">' + ic('home') + '사용자 사이트</a><button class="btn sm o" data-act="adminLogout">' + ic('out', 's') + '로그아웃</button>';
    side += '<div class="who"><span class="avatar" style="background:' + a.color + '">' + a.name[0] + '</span><div><b>' + a.name + '</b>' + a.title + ' · ' + D.ROLE[a.role].label + ' 권한</div></div></aside>';
    var crumb = { '': '대시보드', cases: '출원 접수', case: '출원 접수 › 상세', auto: '자동화 모니터링 › 자동 입력 콘솔', worker: '자동화 모니터링', official: '관납료 납부', payments: '결제 · 환불', stages: '심사 · 등록 단계', notify: '알림톡 발송', members: '회원 관리', forms: '위임장 양식', rates: '요율표', settings: '대리인 · 규격', audit: '권한 · 감사 로그' }[r.name] || '';
    var bar = '<div class="abar"><button class="ibtn mtog" data-act="side" aria-label="메뉴">' + ic('menu') + '</button><div class="crumb"><span class="co">' + D.OFFICE.name + ' · </span><b>' + crumb + '</b></div>' +
      '<div class="rt"><label class="search">' + ic('search', 's') + '<input placeholder="신청번호·출원인·상표 검색" data-on="enter:asearch"></label>' +
      '<button class="ibtn" data-act="theme" aria-label="화면 밝기 전환">' + ic(S.theme === 'dark' ? 'sun' : 'moon') + '</button>' +
      '<button class="btn sm o" data-go="#/">' + ic('home', 's') + '고객 화면</button></div></div>';
    return '<div class="adm">' + side + '<div class="amain">' + bar + '<div class="acont">' + body + '</div></div></div>';
  }

  /* ---------- 토스트 · 모달 · 안내 ---------- */
  function toast(msg, tone) {
    var box = document.getElementById('toasts');
    var el = document.createElement('div'); el.className = 'toast ' + (tone || '');
    el.innerHTML = ic(tone === 'err' ? 'alert' : tone === 'warn' ? 'info' : 'check') + '<span>' + msg + '</span>';
    box.appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 320); }, 3200);
  }
  var modalStack = [];
  function modal(o) {
    var root = document.getElementById('modal-root');
    var previous = document.activeElement, closed = false;
    var bg = document.createElement('div'); bg.className = 'mbg';
    bg.innerHTML = '<div class="modal' + (o.wide ? ' wide' : '') + '" role="dialog" aria-modal="true"><div class="modal-h"><h3>' + o.title + '</h3><button class="ibtn" data-close aria-label="닫기">' + ic('x') + '</button></div><div class="modal-b">' + o.body + '</div>' + (o.foot ? '<div class="modal-f">' + o.foot + '</div>' : '') + '</div>';
    root.appendChild(bg);
    function close() { if (closed) return; closed = true; bg.remove(); var i = modalStack.indexOf(close); if (i >= 0) modalStack.splice(i, 1); if (previous && previous.isConnected) previous.focus(); if (o.onClose) o.onClose(); }
    bg.addEventListener('click', function (e) { if (e.target === bg || e.target.closest('[data-close]')) close(); });
    modalStack.push(close);
    bg.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var nodes = Array.from(bg.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]'));
      if (!nodes.length) return;
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    if (o.onMount) o.onMount(bg);
    var f = bg.querySelector('input,textarea,select,button.btn'); if (f && !o.noFocus) setTimeout(function () { f.focus(); }, 30);
    return close;
  }
  function closeModal() { var c = modalStack[modalStack.length - 1]; if (c) c(); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modalStack.length) closeModal(); });
  function confirmBox(title, body, okText, onOk, tone) {
    var cl = modal({ title: title, body: body, foot: '<button class="btn g" data-close>취소</button><button class="btn ' + (tone || 'p') + '" id="mOk">' + okText + '</button>' });
    var b = document.getElementById('mOk'); if (b) b.addEventListener('click', function () { cl(); onOk(); });
  }
  function guide(html) {
    var g = document.getElementById('guide');
    if (!html) { g.innerHTML = ''; g.className = ''; return; }
    g.className = 'guide'; g.innerHTML = ic('spark') + '<div>' + html + '</div><span class="x" data-act="guideX" aria-label="안내 닫기">' + ic('x', 's') + '</span>';
  }
  function spot(sel) { setTimeout(function () { var el = document.querySelector(sel); if (el) { el.classList.add('spot'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }, 120); }

  /* ---------- 이벤트 위임 ---------- */
  var ACT = {};
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g && !e.target.closest('[data-act]')) { e.preventDefault(); go(g.getAttribute('data-go')); return; }
    var el = e.target.closest('[data-act]');
    if (!el) return;
    if (el.hasAttribute('disabled') || el.classList.contains('dis') || el.getAttribute('aria-disabled') === 'true') { var why = el.getAttribute('data-why'); if (why) toast(why, 'warn'); return; }
    var fn = ACT[el.getAttribute('data-act')];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  document.addEventListener('input', function (e) { var el = e.target.closest('[data-in]'); if (el && ACT[el.getAttribute('data-in')]) ACT[el.getAttribute('data-in')](el, e); });
  document.addEventListener('change', function (e) { var el = e.target.closest('[data-ch]'); if (el && ACT[el.getAttribute('data-ch')]) ACT[el.getAttribute('data-ch')](el, e); });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-go],[role="button"][data-act]')) { e.preventDefault(); e.target.click(); return; }
    var el = e.target.closest('[data-on]');
    if (el && e.key === 'Enter') { var p = el.getAttribute('data-on').split(':'); if (p[0] === 'enter' && ACT[p[1]]) { e.preventDefault(); ACT[p[1]](el, e); } }
  });

  ACT.theme = function () { S.theme = S.theme === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', S.theme); try { localStorage.setItem('og-theme', S.theme); } catch (e) { /* 무시 */ } render(true); };
  ACT.side = function () { S.side = !S.side; document.getElementById('side').classList.toggle('open', S.side); };
  ACT.guideX = function () { guide(null); };
  ACT.demo = function () { S.demoOpen = !S.demoOpen; renderDemo(); };
  ACT.asearch = function (el) {
    var q = el.value.trim(); if (!q) return;
    var f = D.CASES.filter(function (c) { return (c.no + c.applicant.name + c.mark.text).toLowerCase().indexOf(q.toLowerCase()) >= 0; })[0];
    if (f) go('#/admin/case/' + f.id); else toast('「' + U.esc(q) + '」에 해당하는 출원 건이 없습니다', 'warn');
  };

  /* ---------- 기능 살펴보기 ---------- */
  var SCN = [];
  function scenario(o) { SCN.push(o); }
  function renderDemo() {
    var box = document.getElementById('demo');
    box.className = 'demo' + (S.demoOpen ? ' open' : '');
    var a = admin(), u = cust();
    var area = parse().area;
    var h = '<div class="demo-h" data-act="demo" role="button" tabindex="0" aria-expanded="' + S.demoOpen + '">' + ic('spark') + '기능 살펴보기' + ic('up', 'ar') + '</div><div class="demo-b">';
    h += '<div class="tg">화면 · 계정 전환</div><div class="sw">' +
      '<button data-act="asCust" data-id="u_kim" class="' + (area === 'cust' && S.cust === 'u_kim' ? 'on' : '') + '">고객 김서연<small>출원 진행 중 · 등록 결정 건</small></button>' +
      '<button data-act="asCust" data-id="u_new" class="' + (area === 'cust' && S.cust === 'u_new' ? 'on' : '') + '">새 고객 이준서<small>처음 신청하는 고객</small></button>' +
      D.ADMINS.map(function (x) { return '<button data-act="asAdmin" data-id="' + x.id + '" class="' + (area === 'admin' && S.admin === x.id ? 'on' : '') + '">' + x.name + ' ' + x.title + '<small>관리자 · ' + D.ROLE[x.role].label + ' 권한</small></button>'; }).join('') +
      '</div>';
    h += '<div class="tg">주요 기능 시연</div>';
    SCN.forEach(function (s, i) { h += '<button class="sc" data-act="scn" data-i="' + i + '"><i>' + (i + 1) + '</i><div><b>' + s.t + '</b><span>' + s.d + '</span></div></button>'; });
    h += '<div class="tg">자동화 장애 상황 만들기 (다음 실행에 적용)</div><div class="flags">' +
      '<label><input type="checkbox" data-ch="flag" data-k="mismatch"' + (S.flags.mismatch ? ' checked' : '') + '> 입력값 대조 불일치 발생</label>' +
      '<label><input type="checkbox" data-ch="flag" data-k="authManual"' + (S.flags.authManual ? ' checked' : '') + '> 인증창 직접 인증 필요</label>' +
      '<label><input type="checkbox" data-ch="flag" data-k="drop"' + (S.flags.drop ? ' checked' : '') + '> 제출 응답 끊김</label></div>';
    h += '<p class="tiny muted" style="padding:8px 4px 2px">체험 자료와 로그인 상태는 현재 브라우저에 저장됩니다. 로그인 화면에서 초기화할 수 있습니다.</p></div>';
    box.innerHTML = h;
  }
  ACT.asCust = function (el) { S.cust = el.getAttribute('data-id'); S.wiz = null; toast(cust().name + ' 고객 화면으로 전환했습니다'); go(S.cust === 'u_new' ? '#/' : '#/my'); };
  ACT.asAdmin = function (el) { S.admin = el.getAttribute('data-id'); var a = admin(); toast(a.name + ' ' + a.title + '(' + D.ROLE[a.role].label + ' 권한)으로 전환했습니다'); if (parse().area === 'admin') render(true); else go('#/admin'); };
  ACT.flag = function (el) { S.flags[el.getAttribute('data-k')] = el.checked; toast(el.checked ? '다음 자동 입력 실행에 적용됩니다' : '장애 상황을 해제했습니다', el.checked ? 'warn' : ''); };
  ACT.scn = function (el) { var s = SCN[+el.getAttribute('data-i')]; if (window.innerWidth < 760) S.demoOpen = false; s.run(); };

  /* ---------- 공개 ---------- */
  window.APP = {
    S: S, VIEWS: VIEWS, ACT: ACT, ic: ic, badge: badge, bdg: bdg, mk: mk, clsText: clsText, goodsCount: goodsCount,
    admin: admin, cust: cust, can: can, go: go, render: render, toast: toast, modal: modal, closeModal: closeModal, confirm: confirmBox,
    guide: guide, spot: spot, after: after, onLeave: onLeave, every: every, later: later, scenario: scenario, parse: parse,
    sampleStamp: sampleStamp, cleanStamp: cleanStamp, poaData: poaData, capturePoa: capturePoa, poaCheck: poaCheck, poaHTML: poaHTML, wrapLine: wrapLine,
    start: function () { D.CASES.forEach(function (c) { if (c.poa && !c.poa.data) capturePoa(c); }); if (!location.hash) location.hash = (window.APP.store && window.APP.store.resumeRoute()) || '#/'; render(); }
  };
})();
