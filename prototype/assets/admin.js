/* 온결 셀프상표 — 사무소 관리자: 대시보드 · 출원 접수 · 자동 입력 콘솔 · 관납료 납부 · 결제 · 단계 · 알림 · 회원 · 설정 */
(function () {
  'use strict';
  var D = window.DB, U = D.U, A = window.APP, S = A.S, V = A.VIEWS.admin, ACT = A.ACT, ic = A.ic;
  var C = D.CASES;

  function lock(perm, why) { return A.can(perm) ? '' : ' aria-disabled="true" data-why="' + (why || '이 작업은 ' + permOwner(perm) + ' 권한이 필요합니다') + '"'; }
  function permOwner(p) { var r = []; Object.keys(D.ROLE).forEach(function (k) { if (D.ROLE[k].can.indexOf(p) >= 0) r.push(D.ROLE[k].label); }); return r.join('·'); }
  function who() { return A.admin() ? A.admin().name : '연동 워커'; }
  function audit(act, target, detail) { D.AUDIT.unshift({ t: Date.now(), who: who(), act: act, target: target, detail: detail || '—' }); }
  function head(t, p, right) { return '<div class="ph"><div><h1>' + t + '</h1>' + (p ? '<p>' + p + '</p>' : '') + '</div>' + (right ? '<div class="row wr">' + right + '</div>' : '') + '</div>'; }
  function today(t) { var a = new Date(t), b = new Date(); return a.toDateString() === b.toDateString(); }
  function name(c) { return U.esc(c.applicant.kind === '법인' ? c.applicant.name : U.maskName(c.applicant.name)); }

  /* ================= 대시보드 ================= */
  V[''] = function () {
    var cnt = function (arr) { return C.filter(function (c) { return arr.indexOf(c.stage) >= 0; }).length; };
    var todayN = C.filter(function (c) { return c.pay.status === 'paid' && today(c.pay.at); }).length;
    var dueSoon = C.filter(function (c) { return c.official.status === '미납' && c.official.due && c.official.due - Date.now() < 2 * D.DAY; }).length;
    var hot = cnt(['error', 'unknown']);
    var k = [
      ['오늘 신청', todayN, '결제 완료 기준', 'cases', 'var(--brand)'],
      ['변리사 검토 대기', cnt(['paid', 'review']), '자동 입력 전', 'cases?f=review', 'var(--violet)'],
      ['제출 승인 · 인증', cnt(['approve', 'auth']), '변리사 확인 필요', 'worker', 'var(--amber)'],
      ['확인 필요', hot, '자동화 중단 · 확인 대기', 'worker', 'var(--rose)', hot],
      ['관납료 기한 임박', dueSoon, '48시간 이내', 'official', 'var(--teal)'],
      ['등록 결정', cnt(['decided', 'reg_paid']), '등록료 결제·납부', 'stages', 'var(--mint)']
    ];
    var h = head('안녕하세요, ' + A.admin().name + ' ' + A.admin().title + '님', '오늘 처리할 출원 업무와 자동화 상태를 한눈에 확인하세요.', '<button class="btn o sm" data-go="#/admin/cases">' + ic('doc', 's') + '출원 접수</button><button class="btn p sm" data-go="#/admin/worker">' + ic('cpu', 's') + '자동화 모니터링</button>');
    h += '<div class="kpis">' + k.map(function (x) { return '<div class="kpi' + (x[5] ? ' hot' : '') + '" style="--kc:' + x[4] + '" data-go="#/admin/' + x[3] + '"><div class="l">' + x[0] + '</div><div class="v">' + x[1] + '</div><div class="s">' + x[2] + '</div></div>'; }).join('') + '</div>';
    // 처리할 일
    var todo = C.filter(function (c) { return ['error', 'unknown', 'auth', 'approve', 'review', 'paid'].indexOf(c.stage) >= 0; }).sort(function (a, b) { return D.ORDER.indexOf(b.stage) - D.ORDER.indexOf(a.stage); });
    h += '<div class="dash"><div class="col" style="gap:20px"><div class="card"><div class="card-h"><h3>지금 처리할 일</h3><span class="muted small">' + todo.length + '건</span></div><div class="tw"><table class="t"><tbody>' +
      todo.map(function (c) {
        var act = { error: ['재처리 확인', 'auto'], unknown: ['제출 여부 판정', 'auto'], auth: ['사무소 PC 인증', 'auto'], approve: ['제출 승인', 'auto'], review: ['검토 · 자동 입력 시작', 'case'], paid: ['서류 확인 · 검토 요청', 'case'] }[c.stage];
        return '<tr class="click" data-go="#/admin/' + act[1] + '/' + c.id + '"><td style="width:84px"><div class="mkth">' + A.mk(c) + '</div></td><td class="cell2"><b>' + U.esc(c.mark.text) + '</b><span>' + c.no + ' · ' + name(c) + '</span></td><td>' + A.badge(c.stage) + '</td><td class="num"><span class="btn sm ' + (['error', 'unknown'].indexOf(c.stage) >= 0 ? 'd' : 's') + '">' + act[0] + '</span></td></tr>';
      }).join('') + '</tbody></table></div></div>';
    // 신청 추이
    var days = [];
    for (var i = 6; i >= 0; i--) { var d = new Date(Date.now() - i * D.DAY); var n = C.filter(function (c) { return new Date(c.pay.at).toDateString() === d.toDateString() && c.pay.status === 'paid'; }).length; days.push({ l: (d.getMonth() + 1) + '/' + d.getDate(), n: n, t: i === 0 }); }
    var mx = Math.max.apply(null, days.map(function (x) { return x.n; })) || 1;
    var paidSum = C.filter(function (c) { return c.pay.status === 'paid'; }).reduce(function (a, c) { return a + c.fee.total; }, 0);
    var offSum = C.filter(function (c) { return c.official.status === '납부 완료'; }).reduce(function (a, c) { return a + c.official.amount; }, 0);
    h += '<div class="card"><div class="card-h"><h3>최근 7일 신청</h3><span class="muted small">결제 완료 기준 · 시연 데이터</span></div><div class="card-b"><div class="bars">' + days.map(function (x) { return '<div class="' + (x.t ? 'today' : '') + '"><span>' + x.n + '</span><i style="height:' + Math.max(8, x.n / mx * 110) + 'px"></i>' + x.l + '</div>'; }).join('') + '</div>' +
      '<div class="g3 mt16"><div class="spec">고객 결제 합계<b>' + U.won(paidSum) + '</b></div><div class="spec">관납료 납부 기록<b>' + U.won(offSum) + '</b></div><div class="spec">등록 단계 결제<b>' + U.won(C.filter(function (c) { return c.reg && c.reg.pay.status === 'paid'; }).reduce(function (a, c) { return a + c.reg.fee.total; }, 0)) + '</b></div></div></div></div></div>';
    // 오른쪽
    var W = D.WORKER;
    h += '<div class="col" style="gap:20px"><div class="card"><div class="card-h"><h3>연동 워커</h3>' + (W.online ? A.bdg('연결됨', 'ok') : A.bdg('연결 끊김', 'danger')) + '</div><div class="card-b"><dl class="kv" style="grid-template-columns:96px 1fr;font-size:13px"><dt>장비</dt><dd>' + W.name + ' (' + W.id + ')</dd><dt>방식</dt><dd>' + W.mode + '</dd><dt>정의</dt><dd>' + W.def + ' · ' + W.ver + '</dd><dt>신호</dt><dd>' + U.ago(W.beat) + '</dd><dt>오늘 점검</dt><dd>' + (W.checks[0].ok ? A.bdg('정상', 'ok') : A.bdg('변경 감지', 'warn')) + ' <span class="small muted">' + U.time(W.checks[0].t) + '</span></dd></dl><button class="btn s sm mt12" data-go="#/admin/worker">자세히 ' + ic('chev', 's') + '</button></div></div>';
    var feed = []; C.forEach(function (c) { c.history.forEach(function (x) { feed.push({ x: x, c: c }); }); });
    feed.sort(function (a, b) { return b.x.t - a.x.t; });
    h += '<div class="card"><div class="card-h"><h3>최근 활동</h3></div><div class="card-b feed">' + feed.slice(0, 9).map(function (f) { return '<div>' + ic(f.x.who === '연동 워커' ? 'cpu' : f.x.who === 'PG' ? 'card' : 'user', 's') + '<span><b>' + U.esc(f.c.mark.text) + '</b> · ' + U.esc(f.x.msg) + '</span><span class="t">' + U.ago(f.x.t) + '</span></div>'; }).join('') + '</div></div></div></div>';
    return h;
  };

  /* ================= 출원 접수 목록 ================= */
  var FILT = [['all', '전체', null], ['review', '검토 대기', ['paid', 'review']], ['auto', '자동화 진행', ['auto', 'submitting']], ['approve', '승인 · 인증', ['approve', 'auth']], ['hot', '확인 필요', ['error', 'unknown']], ['filed', '출원 · 심사', ['submitted', 'exam']], ['reg', '등록 단계', ['decided', 'reg_paid', 'registered']], ['wait', '입금 대기', ['wait_deposit']], ['draft', '작성 중', ['draft']], ['cancel', '취소', ['cancel']]];
  var curF = 'all', q = '';
  V.cases = function () {
    var m = /f=(\w+)/.exec(location.hash); if (m) curF = m[1];
    var fdef = FILT.filter(function (f) { return f[0] === curF; })[0] || FILT[0];
    var list = C.filter(function (c) { return (!fdef[2] || fdef[2].indexOf(c.stage) >= 0) && (!q || (c.no + c.applicant.name + c.mark.text).toLowerCase().indexOf(q.toLowerCase()) >= 0); });
    var h = head('출원 접수', '고객이 신청한 출원 건 전체를 상태별로 관리합니다.');
    h += '<div class="card"><div class="card-b fbar">' + FILT.map(function (f) { var n = C.filter(function (c) { return !f[2] || f[2].indexOf(c.stage) >= 0; }).length; return '<button class="chip ' + (curF === f[0] ? 'on' : '') + '" data-act="cf" data-f="' + f[0] + '">' + f[1] + ' <b>' + n + '</b></button>'; }).join('') +
      '<input class="inp" style="max-width:260px;min-height:38px;margin-left:auto" placeholder="신청번호 · 출원인 · 상표" value="' + U.esc(q) + '" data-in="cq"></div>' +
      '<div class="tw"><table class="t"><thead><tr><th>신청번호</th><th>상표</th><th>출원인</th><th>상품류</th><th class="num">결제 금액</th><th>결제</th><th>상태</th><th>버전</th><th>신청일</th></tr></thead><tbody id="ctb">' + rows(list) + '</tbody></table></div></div>';
    return h;
  };
  function rows(list) {
    if (!list.length) return '<tr><td colspan="9"><div class="empty">조건에 맞는 출원 건이 없습니다.</div></td></tr>';
    return list.map(function (c) {
      return '<tr class="click" data-go="#/admin/case/' + c.id + '"><td class="mono small">' + c.no + '</td><td><div class="row"><div class="mkth">' + A.mk(c) + '</div><b>' + U.esc(c.mark.text) + '</b></div></td><td class="cell2"><b>' + name(c) + '</b><span>' + c.applicant.kind + '</span></td><td>' + (A.clsText(c) || '—') + '</td><td class="num">' + U.won(c.fee.total) + '</td><td>' + payB(c) + '</td><td>' + A.badge(c.stage) + '</td><td><span class="tag">v' + c.ver + '</span></td><td class="small muted">' + U.dt(c.created) + '</td></tr>';
    }).join('');
  }
  function payB(c) { return { paid: A.bdg(c.pay.method === 'vbank' ? '가상계좌' : '카드', 'ok'), wait: A.bdg('입금 대기', 'warn'), refunded: A.bdg('취소', 'mute'), none: A.bdg('—', 'mute', true) }[c.pay.status]; }
  ACT.cf = function (el) { curF = el.getAttribute('data-f'); if (/f=/.test(location.hash)) location.hash = '#/admin/cases'; else A.render(true); };
  ACT.cq = function (el) { q = el.value; var fdef = FILT.filter(function (f) { return f[0] === curF; })[0]; var list = C.filter(function (c) { return (!fdef[2] || fdef[2].indexOf(c.stage) >= 0) && (!q || (c.no + c.applicant.name + c.mark.text).toLowerCase().indexOf(q.toLowerCase()) >= 0); }); document.getElementById('ctb').innerHTML = rows(list); };

  /* ================= 출원 건 상세 ================= */
  var tab = 'info', defOn = false, reveal = {};
  V.case = function (id) {
    var viewingAdmin = S.admin, viewingRoute = location.hash;
    A.onLeave(function () { if (S.admin !== viewingAdmin || location.hash !== viewingRoute) reveal = {}; });
    var c = D.find(id); if (!c) return '<div class="empty">출원 건을 찾을 수 없습니다.</div>';
    var h = '<div class="row wr"><button class="btn sm g" data-go="#/admin/cases">' + ic('back', 's') + '출원 접수</button></div>';
    h += '<div class="card pad"><div class="dhead"><div class="mk">' + A.mk(c) + '</div><div class="grow"><div class="row wr"><h1 style="font-size:24px">' + U.esc(c.mark.text) + '</h1>' + A.badge(c.stage) + '<span class="tag">버전 v' + c.ver + '</span>' + (c.auto.invalid.length ? A.bdg('이전 승인 무효 ' + c.auto.invalid.length + '건', 'warn') : '') + '</div><p class="muted small mt8"><span class="mono">' + c.no + '</span> · ' + name(c) + ' (' + c.applicant.kind + ') · ' + A.clsText(c) + ' · 지정상품 ' + A.goodsCount(c) + '개 · 신청 ' + U.dt(c.created) + '</p></div><div class="row wr">' + actions(c) + '</div></div>' + stageNote(c) + '</div>';
    var tabs = [['info', '신청 정보'], ['poa', '위임장'], ['auto', '자동화 기록'], ['pay', '결제 · 납부'], ['hist', '이력']];
    h += '<div class="card"><div class="tabs" style="padding:0 12px">' + tabs.map(function (t) { return '<button class="' + (tab === t[0] ? 'on' : '') + '" data-act="ctab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div class="card-b">' + tabBody(c) + '</div></div>';
    return h;
  };
  function actions(c) {
    var b = '';
    if (c.stage === 'wait_deposit') b += '<button class="btn s" data-act="admDeposit" data-id="' + c.id + '">' + ic('bank', 's') + '입금 통지 시연</button>';
    if (c.stage === 'paid') b += '<button class="btn p" data-act="toReview" data-id="' + c.id + '">' + ic('check', 's') + '서류 확인 · 검토 요청</button>';
    if (c.stage === 'review') b += '<button class="btn p" data-act="startAuto" data-id="' + c.id + '"' + lock('review', '검토 완료와 자동 입력 시작은 변리사 권한이 필요합니다') + '>' + ic('play', 's') + '검토 완료 · 자동 입력 시작</button>';
    if (['auto', 'error', 'approve', 'auth', 'unknown', 'submitting'].indexOf(c.stage) >= 0) b += '<button class="btn p" data-go="#/admin/auto/' + c.id + '">' + ic('monitor', 's') + '자동 입력 콘솔</button>';
    if (c.stage === 'approve') b += '<button class="btn o" data-act="approve" data-id="' + c.id + '"' + lock('approve', '제출 승인은 변리사 권한이 필요합니다') + '>' + ic('shield', 's') + '제출 승인</button>';
    if (['submitted', 'exam', 'decided', 'reg_paid'].indexOf(c.stage) >= 0) b += '<button class="btn s" data-go="#/admin/stages">' + ic('flag', 's') + '단계 관리</button>';
    if (['wait_deposit', 'paid', 'review', 'error', 'approve', 'auth'].indexOf(c.stage) >= 0) b += '<button class="btn o" data-act="editCase" data-id="' + c.id + '"' + lock('edit') + '>' + ic('edit', 's') + '정보 변경</button>';
    return b;
  }
  function stageNote(c) {
    var n = {
      paid: ['info', '결제와 위임장 생성이 끝났습니다. 서류를 확인하고 변리사 검토를 요청하세요.'],
      review: ['info', '변리사 검토 후 「자동 입력 시작」을 누르면 사무소 연동 PC가 이 버전(v' + c.ver + ')의 작업을 가져갑니다.'],
      error: ['danger', '자동 입력이 멈췄습니다: ' + (c.auto.err ? c.auto.err.msg : '') + ' — 콘솔에서 원인을 확인하고 재처리하세요.'],
      approve: ['warn', '자동 입력·첨부가 끝났습니다. 입력 내용과 증적 화면을 확인한 뒤 v' + c.ver + '에 제출 승인을 해 주세요.'],
      auth: ['warn', '인증창 직접 조작이 필요합니다. 사무소 PC에서 권한 있는 담당자가 인증하면 이어서 제출합니다.'],
      unknown: ['danger', '제출 응답이 끊겨 결과가 불분명합니다. 자동으로 다시 제출하지 않으며, 제출 내역을 대조해 판정해야 합니다. 관납료 납부도 보류됩니다.'],
      wait_deposit: ['warn', '가상계좌 입금을 기다리고 있습니다. 입금 통지를 받으면 자동으로 결제 완료가 됩니다.']
    }[c.stage];
    if (c.auto.invalid.length && c.stage === 'review') n = ['warn', '정보 변경으로 v' + c.ver + ' 버전을 만들었습니다. 이전 위임장과 제출 승인은 사용할 수 없으며, 다시 검토·자동 입력·승인을 거칩니다.'];
    return n ? '<div class="note ' + n[0] + ' mt16">' + ic(n[0] === 'danger' ? 'alert' : 'info', 's') + '<span>' + n[1] + '</span></div>' : '';
  }
  function tabBody(c) {
    var ap = c.applicant;
    if (tab === 'info') {
      var rv = A.can('reveal') && reveal[c.id] === S.admin;
      var h = '<div class="dgrid"><div class="col" style="gap:16px"><div><div class="row sb"><b>출원인</b>' + (rv ? A.bdg('열람 중 · 기록됨', 'warn') : '<button class="btn sm g" data-act="reveal" data-id="' + c.id + '"' + lock('reveal') + '>' + ic('eye', 's') + '개인정보 열람</button>') + '</div><dl class="kv mt12">' +
        '<dt>구분</dt><dd>' + ap.kind + '</dd><dt>성명(명칭)</dt><dd>' + (rv ? U.esc(ap.name) : name(c)) + (ap.rep ? ' · 대표 ' + U.esc(rv ? ap.rep : U.maskName(ap.rep)) : '') + '</dd>' +
        (ap.kind === '개인' ? '<dt>주민등록번호</dt><dd class="mono">' + (ap.rrn ? (rv ? ap.rrn : ap.rrn.slice(0, 2) + '****-*******') : '—') + ' <span class="tiny muted">체험용 마스킹</span></dd>' : '<dt>사업자번호</dt><dd class="mono">' + (ap.bizNo || '—') + '</dd>') +
        '<dt>연락처</dt><dd>' + U.esc(rv ? ap.phone : U.maskPhone(ap.phone)) + ' · ' + U.esc(rv ? ap.email : U.maskEmail(ap.email)) + '</dd>' +
        '<dt>주소</dt><dd>' + (rv ? U.esc(ap.address) : U.esc((ap.address || '').split(' ').slice(0, 2).join(' ') + ' ***')) + '</dd>' +
        '<dt>특허고객번호</dt><dd>' + (ap.custNo ? '<span class="mono">' + ap.custNo + '</span>' : A.bdg('부여 신청 동시 진행', 'violet')) + '</dd></dl></div>' +
        '<div><b>지정상품</b><div class="col mt12">' + c.goods.map(function (g) { return '<div class="row top"><span class="tag">' + g.cls + '류</span><div class="small">' + g.ids.map(function (i) { return D.GMAP[i].name + ' <span class="mono tiny muted">' + i + '</span>'; }).join(', ') + '</div></div>'; }).join('') + '</div></div>' +
        '<div><b>AI 추천 이력</b><div class="mt12">' + (c.ai ? '<div class="note">' + ic('spark', 's') + '<span>「' + U.esc(c.ai.query) + '」<br>선택 ' + c.ai.picked.length + '건 · 목록 밖 표현 제외: ' + c.ai.excluded.map(U.esc).join(', ') + '</span></div>' : c.desc ? '<div class="note">' + ic('spark', 's') + '<span>사업 설명: 「' + U.esc(c.desc) + '」 · AI 추천 후 고객 선택</span></div>' : '<span class="muted small">AI 추천을 사용하지 않았습니다.</span>') + '</div></div></div>';
      h += '<div class="col" style="gap:16px"><div><b>상표 이미지</b><div class="g2 mt12"><div class="spec">고객 원본<b style="font-size:13px">' + c.mark.spec.orig + '</b></div><div class="spec ok">제출용 변환본<b style="font-size:13px">' + c.mark.spec.conv + '</b></div></div><div class="markbox mt12">' + A.mk(c) + '</div></div>' +
        '<div><b>날인</b><div class="stamp-pane mt12"><div class="cv chk" style="height:120px">' + (c.sign.img ? '<img src="' + c.sign.img + '" alt="날인 이미지" style="max-height:100px">' : '<span class="muted small">—</span>') + '</div><p class="tiny muted mt8">' + (c.sign.type === 'sign' ? '화면 서명' : '도장 이미지 · 생성 버전별 관리') + '</p></div></div></div></div>';
      return h;
    }
    if (tab === 'poa') {
      if (!A.can('reveal')) return '<div class="note">' + ic('lock', 's') + '<span>위임장에는 개인정보와 날인이 포함되어 있습니다. 문서 열람은 변리사·사무장 계정으로 진행해 주세요.</span></div>';
      if (!c.poa) return '<div class="empty">결제 완료 후 위임장이 생성됩니다.</div>';
      var data = A.poaData(c, { date: c.poa.at });
      var h2 = '<div class="row sb wr mb16"><div class="row wr">' + A.bdg('양식 ' + c.poa.formVer, 'brand', true) + '<span class="small muted">버전 v' + c.ver + ' · 생성 ' + U.dt(c.poa.at) + ' · 해시 <span class="mono">' + U.short(c.poa.hash) + '</span></span></div><div class="row wr"><label class="chk" style="font-size:13px"><input type="checkbox" data-ch="defT"' + (defOn ? ' checked' : '') + '> 양식 정의 보기</label><button class="btn sm o" onclick="window.print()">' + ic('print', 's') + 'PDF 저장</button></div></div>';
      h2 += '<div class="dgrid"><div class="poa-wrap">' + A.poaHTML(data, { def: defOn, hash: c.poa.hash, ver: c.poa.formVer }) + '</div><div class="col"><b>버전과 승인</b><div class="vers">' + c.versions.slice().reverse().map(function (v) {
        var inv = c.auto.invalid.filter(function (x) { return x.ver === v.v; })[0];
        return '<div class="ver ' + (v.v === c.ver ? 'cur' : 'old') + '"><span class="tag">v' + v.v + '</span><div class="grow"><b>' + U.esc(v.reason) + '</b><div class="tiny muted">' + U.dt(v.at) + ' · <span class="mono">' + U.short(v.hash) + '</span></div></div>' + (v.v === c.ver ? A.bdg('현재', 'brand') : A.bdg(inv ? '승인 무효' : '이전 버전', 'mute')) + '</div>';
      }).join('') + '</div><div class="note">' + ic('info', 's') + '<span>작성 당시의 입력값·대리인 정보·양식 버전·날인 원본·PDF 해시를 함께 보관해, 보관 기간 안에는 당시 자료와 제출본을 대조할 수 있습니다.</span></div></div></div>';
      return h2;
    }
    if (tab === 'auto') {
      return '<div class="row sb wr mb16"><div class="lockbar">' + ic('lock', 's') + '작업 ' + (c.auto.job ? '<span class="mono">' + c.auto.job.id + '</span> · 버전 v' + c.auto.job.ver : '없음') + ' · 제출 시도 ' + c.auto.submitTries.length + '회</div><button class="btn sm s" data-go="#/admin/auto/' + c.id + '">' + ic('monitor', 's') + '콘솔 열기</button></div>' +
        '<div class="asteps">' + stepsHTML(c) + '</div><div class="console mt16">' + logHTML(c) + '</div>';
    }
    if (tab === 'pay') return payTab(c);
    return '<div class="hlog">' + c.history.slice().reverse().map(function (x) { return '<div><span class="w">' + U.dt(x.t) + '</span><span><b>' + U.esc(x.who) + '</b> · ' + U.esc(x.msg) + '</span></div>'; }).join('') + '</div>';
  }
  function payTab(c) {
    var f = c.fee;
    var h = '<div class="dgrid"><div class="col"><b>고객 결제 (PG)</b><div class="card pad"><div class="feeline"><span>관납료</span><span>' + U.won(f.official) + '</span></div><div class="feeline"><span>서비스 이용료 + 부가세</span><span>' + U.won(f.service + f.vat) + '</span></div><div class="feeline tot"><span>결제 금액</span><b>' + U.won(f.total) + '</b></div>' +
      '<dl class="kv mt12" style="font-size:13px"><dt>수단</dt><dd>' + (c.pay.method === 'vbank' ? '가상계좌' : c.pay.method === 'card' ? '카드' : '—') + '</dd><dt>상태</dt><dd>' + payB(c) + '</dd><dt>거래번호</dt><dd class="mono">' + (c.pay.tx || '—') + '</dd><dt>승인 시각</dt><dd>' + U.dt(c.pay.at) + '</dd></dl></div></div>';
    h += '<div class="col"><b>특허청 관납료 납부 (사무소)</b><div class="card pad"><dl class="kv" style="font-size:13px"><dt>상태</dt><dd>' + offB(c) + '</dd><dt>금액</dt><dd>' + U.won(c.official.amount) + '</dd><dt>기한</dt><dd>' + (c.official.due ? U.dt(c.official.due) + ' <b>' + U.dday(c.official.due) + '</b>' : '출원 후 설정') + '</dd><dt>영수증</dt><dd class="mono">' + (c.official.receipt || '—') + '</dd><dt>납부 기록</dt><dd>' + (c.official.by ? c.official.by + ' · ' + U.dt(c.official.at) : '—') + '</dd></dl>' +
      '<div class="note mt12">' + ic('info', 's') + '<span>고객 결제 성공만으로 납부 완료로 처리하지 않습니다. 사무소 담당자가 특허로에서 납부한 뒤 영수증을 기록합니다.</span></div><button class="btn sm s mt12" data-go="#/admin/official">관납료 납부 관리 ' + ic('chev', 's') + '</button></div>';
    if (c.reg) h += '<b class="mt8">등록 단계</b><div class="card pad"><dl class="kv" style="font-size:13px"><dt>등록 결정</dt><dd>' + U.dt(c.reg.decidedAt) + '</dd><dt>고객 결제</dt><dd>' + (c.reg.pay.status === 'paid' ? A.bdg('완료 ' + U.won(c.reg.fee.total), 'ok') : A.bdg('대기 ' + U.won(c.reg.fee.total), 'warn')) + '</dd><dt>등록료 납부</dt><dd>' + (c.reg.official.status === '납부 완료' ? A.bdg('납부 완료', 'ok') : A.bdg('미납 · 기한 ' + U.date(c.reg.official.due), 'warn')) + '</dd></dl></div>';
    return h + '</div></div>';
  }
  function offB(c) { var s = c.official.status; return s === '납부 완료' ? A.bdg('납부 완료', 'ok') : s === '보류' ? A.bdg('보류 · 제출 확인 후', 'violet') : s === '미납' ? (c.official.due ? A.bdg('미납', 'warn') : A.bdg('출원 전', 'mute')) : A.bdg(s, 'mute'); }
  ACT.ctab = function (el) { tab = el.getAttribute('data-t'); A.render(true); };
  ACT.defT = function (el) { defOn = el.checked; A.render(true); };
  ACT.reveal = function (el) {
    var id = el.getAttribute('data-id'), c = D.find(id);
    var cl = A.modal({ title: '개인정보 열람 사유', body: '<p class="small muted">열람 기록(열람자·시각·사유)이 감사 로그에 남습니다.</p><div class="col mt12">' + ['관납료 납부 확인', '출원서 기재 내용 확인', '고객 문의 응대'].map(function (r, i) { return '<label class="chk"><input type="radio" name="rr" value="' + r + '"' + (i === 0 ? ' checked' : '') + '> ' + r + '</label>'; }).join('') + '</div>', foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="rvOk">열람</button>' });
    document.getElementById('rvOk').addEventListener('click', function () { var r = document.querySelector('input[name=rr]:checked').value; reveal[id] = S.admin; audit('개인정보 열람', c.no, '사유: ' + r); cl(); A.toast('열람 기록을 남겼습니다', 'ok'); A.render(true); });
  };
  ACT.admDeposit = function (el) { ACT.deposit(el); };
  ACT.toReview = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    c.stage = 'review'; D.hist(c, Date.now(), who(), '서류 확인 완료 · 변리사 검토 요청'); A.toast('변리사 검토 대기로 넘겼습니다', 'ok'); A.render(true);
  };

  /* --- 정보 변경 → 새 버전 --- */
  ACT.editCase = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    var cl = A.modal({ title: '출원 정보 변경 — 새 버전 생성', body: '<div class="note warn">' + ic('alert', 's') + '<span>정보를 바꾸면 <b>v' + (c.ver + 1) + '</b>이 만들어지고, 이전 위임장 PDF와 제출 승인(있다면)은 현재 처리에 사용할 수 없습니다. 변경된 자료로 다시 검토·자동 입력·승인을 거칩니다.</span></div>' +
      '<div class="fld mt16"><label>출원인 주소</label><input class="inp" id="edAddr" value="' + U.esc((c.applicant.address + ' ' + (c.applicant.addressDetail || '')).trim()) + '"></div><div class="fld mt12"><label>변경 사유</label><select class="sel" id="edWhy"><option>고객 요청으로 주소 변경</option><option>입력 오기 수정</option><option>지정상품 조정 (고객 확인)</option></select></div>',
      foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="edOk">새 버전 만들기</button>' });
    document.getElementById('edOk').addEventListener('click', function () {
      var addr = document.getElementById('edAddr').value.trim(), why = document.getElementById('edWhy').value;
      if (!addr) { A.toast('주소를 입력해 주세요', 'err'); return; }
      if (addr === (c.applicant.address + ' ' + (c.applicant.addressDetail || '')).trim()) { A.toast('바뀐 내용이 없습니다', 'warn'); return; }
      cl();
      var oldVer = c.ver;
      c.applicant.address = addr; c.applicant.addressDetail = ''; c.ver++;
      var hsh = U.hash(c.id + ':' + c.ver + ':' + JSON.stringify(c.applicant) + JSON.stringify(c.goods));
      c.versions.push({ v: c.ver, at: Date.now(), reason: why, hash: hsh });
      if (c.auto.approval) { c.auto.invalid.push({ ver: c.auto.approval.ver, by: c.auto.approval.by, at: c.auto.approval.at, why: '버전 변경' }); }
      else if (c.poa) c.auto.invalid.push({ ver: oldVer, why: '버전 변경 (승인 전)' });
      c.auto.approval = null; c.auto.job = null; c.auto.err = null; c.auto.screen = null;
      c.auto.steps.forEach(function (s) { s.state = 'wait'; s.at = null; });
      c.auto.log.push({ t: Date.now(), lvl: 'warn', msg: 'v' + oldVer + ' → v' + c.ver + ' 변경 · 이전 작업·승인 무효 처리' });
      if (c.poa) c.poa = { formVer: D.FORM.current, hash: U.hash(JSON.stringify(A.poaData(c, { fresh: true })) + c.id + c.ver), at: Date.now() };
      A.capturePoa(c);
      if (['wait_deposit'].indexOf(c.stage) < 0) c.stage = c.stage === 'paid' ? 'paid' : 'review';
      D.hist(c, Date.now(), who(), '정보 변경 (' + why + ') → v' + c.ver + ' 생성 · 이전 위임장/승인 무효');
      audit('정보 변경', c.no, 'v' + oldVer + ' → v' + c.ver + ' · ' + why);
      A.toast('v' + c.ver + ' 버전을 만들었습니다. 이전 승인은 무효이며 다시 검토가 필요합니다', 'warn');
      tab = 'poa'; A.render(true);
    });
  };

  /* ================= 자동 입력 엔진 (시연) ================= */
  var RUN = {};
  function stopJob(c) {
    (RUN[c.id] || []).forEach(clearTimeout); RUN[c.id] = [];
    if (c.auto.job) c.auto.job.locked = false;
  }
  function sched(c, ms, fn) {
    var job = c.auto.job, ver = c.ver;
    RUN[c.id] = RUN[c.id] || [];
    RUN[c.id].push(setTimeout(function () {
      if (c.stage === 'cancel' || c.ver !== ver || c.auto.job !== job) return;
      if (!D.WORKER.online) {
        var submitting = c.stage === 'submitting';
        stopJob(c);
        if (submitting) {
          c.stage = 'unknown'; step(c, 6, 'unknown'); c.official.status = '보류';
          c.auto.submitTries.push({ at: Date.now(), result: '연결 끊김 · 제출 결과 확인 필요' });
          log(c, 'error', '제출 중 연동 PC 연결이 끊겼습니다. 제출 내역을 대조하기 전에는 재제출하거나 관납료를 납부하지 않습니다.');
          D.hist(c, Date.now(), '연동 워커', '제출 중 연결 끊김 — 제출 확인 대기 · 재제출·납부 보류');
        } else {
          c.stage = 'error'; c.auto.approval = null;
          c.auto.err = { code: 'connection', msg: '사무소 연동 PC 연결이 끊겨 입력을 중단했습니다. 다시 연결한 뒤 현재 버전으로 재처리해 주세요.' };
          c.auto.steps.forEach(function (s) { if (s.state === 'run') s.state = 'stop'; });
          log(c, 'error', c.auto.err.msg); D.hist(c, Date.now(), '연동 워커', '연결 끊김으로 자동 입력 중단');
        }
        paint(c, true); return;
      }
      fn();
    }, ms));
  }
  function fieldsOf(c) {
    var ap = c.applicant, saved = A.poaData(c), addr = ((ap.address || '') + (ap.addressDetail ? ' ' + ap.addressDetail : '')).trim();
    var cut = addr.length > 40 ? (addr.lastIndexOf(' ', 40) > 20 ? addr.lastIndexOf(' ', 40) : 40) : addr.length;
    return [
      { k: 'kind', l: '출원인 구분', v: ap.kind },
      { k: 'name', l: '출원인 성명(명칭)', v: ap.name },
      { k: 'cust', l: '특허고객번호', v: ap.custNo || '부여 신청 동시 진행' },
      { k: 'addr', l: '주소', v: addr.slice(0, cut).trim(), full: addr },
      { k: 'addr2', l: '상세 주소', v: addr.slice(cut).trim() || '—' },
      { k: 'agent', l: '대리인 코드', v: saved.agent_code },
      { k: 'mark', l: '상표 명칭', v: c.mark.text },
      { k: 'mtype', l: '상표 유형', v: { text: '문자', image: '도형', combo: '결합' }[c.mark.type] },
      { k: 'cls', l: '상품류', v: c.goods.map(function (g) { return g.cls; }).join(', ') },
      { k: 'goods', l: '지정상품', v: c.goods.map(function (g) { return g.ids.map(function (i) { return D.GMAP[i].name; }).join(', '); }).join(' / ') }
    ];
  }
  function displayField(field, value) {
    if (A.can('reveal') || ['name','cust','addr','addr2'].indexOf(field.k) < 0) return value;
    return value ? (field.k === 'name' ? U.maskName(String(value)) : '권한 확인 후 열람') : '';
  }
  function screenInit(c, fill) {
    var sc = { f: {}, files: { poa: false, mark: false }, submit: false, cur: null };
    fieldsOf(c).forEach(function (f) { sc.f[f.k] = { v: fill ? f.v : '', s: fill ? 'ok' : '' }; });
    if (fill) { sc.files.poa = sc.files.mark = true; }
    if (fill && c.auto.err) { sc.f.addr = { v: c.auto.err.got, s: 'bad' }; sc.f.addr2 = { v: '', s: 'bad' }; ['mark', 'mtype', 'cls', 'goods', 'agent'].forEach(function (k) { sc.f[k] = { v: '', s: '' }; }); sc.files.poa = sc.files.mark = false; }
    c.auto.screen = sc; return sc;
  }
  function log(c, lvl, msg) { c.auto.log.push({ t: Date.now(), lvl: lvl, msg: msg }); if (A.store) A.store.schedule(); }
  function step(c, n, st) { var s = c.auto.steps[n - 1]; s.state = st; if (st === 'done' || st === 'stop') s.at = Date.now(); }
  function onConsole(c) { var p = A.parse(); return p.area === 'admin' && p.name === 'auto' && p.args[0] === c.id; }
  function paint(c, full) {
    if (A.store) A.store.schedule();
    if (!onConsole(c)) return;
    if (full) { var y = window.scrollY; A.render(true); window.scrollTo(0, y); return; }
    var a = document.getElementById('aSteps'); if (a) a.innerHTML = stepsHTML(c);
    var s = document.getElementById('efScreen'); if (s) s.innerHTML = screenHTML(c);
    var l = document.getElementById('aLog'); if (l) { l.innerHTML = logHTML(c); l.scrollTop = l.scrollHeight; }
    var m = document.getElementById('aCmp'); if (m) m.innerHTML = cmpHTML(c);
  }
  function startJob(c) {
    if (!D.WORKER.online) { A.toast('연동 워커가 연결되어 있지 않아 작업을 보낼 수 없습니다', 'err'); return false; }
    if (c.auto.job && c.auto.job.locked) { A.toast('이미 ' + c.auto.job.id + ' 작업이 진행 중입니다 — 중복 실행을 차단했습니다', 'warn'); return false; }
    c.auto.job = { id: 'JOB-' + c.id.slice(1) + '-v' + c.ver + (c.auto.tries ? '-r' + c.auto.tries : ''), ver: c.ver, locked: true, at: Date.now() };
    return true;
  }
  ACT.startAuto = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    if (!c || c.stage !== 'review' || c.pay.status !== 'paid') { A.toast('결제와 변리사 검토 상태를 확인해 주세요', 'warn'); return; }
    if (!startJob(c)) return;
    c.stage = 'auto'; c.auto.err = null;
    D.hist(c, Date.now(), who(), '변리사 검토 완료 · 자동 입력 시작 (v' + c.ver + ')');
    audit('자동 입력 시작', c.no, c.auto.job.id);
    A.go('#/admin/auto/' + c.id);
    runFrom(c, 1);
  };
  function runFrom(c, n) {
    screenInit(c, false);
    if (n <= 1) {
      step(c, 1, 'run'); log(c, 'info', '[' + c.auto.job.id + '] 작업 수신 · 출원 건 잠금 획득 · 버전 v' + c.ver + ' 원본 고정'); paint(c, true);
      sched(c, 700, function () { step(c, 1, 'done'); log(c, 'ok', '중복 수신·동시 실행 차단 확인 (중복 작업 없음)'); typeAll(c); });
    } else {
      log(c, 'info', '재처리 — 현재 버전 v' + c.ver + ' · 마지막 완료 단계 ①부터 이어서 진행'); paint(c, true);
      sched(c, 500, function () { typeAll(c); });
    }
  }
  function typeAll(c) {
    step(c, 2, 'run'); c.stage = 'auto'; paint(c, true);
    var F = fieldsOf(c), i = 0;
    var bad = S.flags.mismatch || c.flags.mismatch;
    function next() {
      if (i >= F.length) {
        step(c, 2, 'done'); log(c, 'ok', '출원 정보 ' + F.length + '개 항목 입력 · 화면 값 재판독 대조 ' + F.length + '/' + F.length + ' 일치'); paint(c);
        sched(c, 500, function () { attach(c); }); return;
      }
      var f = F[i], cell = c.auto.screen.f[f.k];
      var target = f.v;
      if (bad && f.k === 'addr') target = (f.full || f.v).slice(0, 40);
      if (bad && f.k === 'addr2') target = '';
      cell.s = 'typing'; cell.v = '';
      var chars = target.split(''), per = Math.max(1, Math.ceil(chars.length / 14)), k = 0;
      (function tick() {
        k = Math.min(chars.length, k + per); cell.v = chars.slice(0, k).join(''); paint(c);
        if (k < chars.length) { sched(c, 38, tick); return; }
        sched(c, 120, function () {
          var expect = bad && (f.k === 'addr' || f.k === 'addr2') ? null : f.v;
          if (expect === null) {
            if (f.k === 'addr2') { i++; next(); return; }
            cell.s = 'bad';
            c.auto.err = { step: 2, field: '출원인 주소', expect: f.full, got: target, msg: '입력값 대조 불일치 — 주소 칸에 40자까지만 입력됨' };
            step(c, 2, 'stop'); c.stage = 'error'; c.auto.job.locked = false;
            log(c, 'error', '출원인 주소 대조 불일치 (원본 ' + f.full.length + '자 / 화면 40자) → 자동화 중단 · 관리자 알림');
            D.hist(c, Date.now(), '연동 워커', '② 출원 정보 입력에서 중단 — 출원인 주소 대조 불일치');
            S.flags.mismatch = false;
            A.toast('자동 입력을 멈췄습니다 — 출원인 주소가 원본과 다릅니다', 'err');
            paint(c, true); return;
          }
          cell.s = 'ok'; log(c, 'info', f.l + ' 입력 → 재판독 일치'); i++; next();
        });
      })();
    }
    next();
  }
  function attach(c) {
    step(c, 3, 'run'); paint(c);
    sched(c, 700, function () { c.auto.screen.files.poa = true; log(c, 'info', '위임장_' + c.no + '_v' + c.ver + '.pdf 첨부 · 해시 ' + U.short(c.poa.hash) + ' 일치'); paint(c); });
    sched(c, 1400, function () { c.auto.screen.files.mark = true; log(c, 'info', '상표견본_' + c.no + '.jpg 첨부 (제출용 변환본) · 원본 대응 확인'); paint(c); });
    sched(c, 1900, function () {
      step(c, 3, 'done'); log(c, 'ok', '첨부 목록 2/2 · 파일 해시 대조 일치'); step(c, 4, 'run'); paint(c);
      sched(c, 800, function () {
        step(c, 4, 'done'); log(c, 'ok', '단계별 증적 화면 3장 저장 (출원인 · 상표·지정상품 · 첨부 목록)');
        step(c, 5, 'hold'); c.stage = 'approve'; c.auto.job.locked = false;
        log(c, 'warn', '제출 승인 대기 — 변리사 확인 전에는 제출하지 않습니다');
        D.hist(c, Date.now(), '연동 워커', '자동 입력·첨부 완료 · 제출 승인 대기');
        A.toast('자동 입력·첨부가 끝났습니다. 제출 승인을 기다립니다', 'ok');
        paint(c, true);
      });
    });
  }
  ACT.approve = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    if (c.stage !== 'approve') { A.toast('제출 승인 대기 상태가 아닙니다', 'warn'); return; }
    var v = c.versions[c.ver - 1];
    var cl = A.modal({ title: '제출 승인 — v' + c.ver, body: '<dl class="kv"><dt>출원 건</dt><dd>' + c.no + ' · 「' + U.esc(c.mark.text) + '」</dd><dt>승인 버전</dt><dd><span class="tag">v' + c.ver + '</span> <span class="mono small">' + U.short(v.hash) + '</span></dd><dt>입력값 대조</dt><dd>' + A.bdg(fieldsOf(c).length + '/' + fieldsOf(c).length + ' 일치', 'ok') + '</dd><dt>첨부</dt><dd>' + A.bdg('2/2 · 해시 일치', 'ok') + '</dd><dt>증적 화면</dt><dd>3장</dd></dl>' +
      '<div class="col mt16"><label class="chk"><input type="checkbox" class="apc"> 출원인·상표·지정상품 입력 내용을 확인했습니다</label><label class="chk"><input type="checkbox" class="apc"> 위임장 PDF와 상표 이미지 첨부를 확인했습니다</label></div>' +
      '<div class="note mt16">' + ic('info', 's') + '<span>승인 후 워커는 현재 버전과 승인 버전·해시를 다시 대조한 뒤 대리인 공동인증서로 제출합니다. 인증서와 비밀번호는 서버·로그에 저장되지 않습니다.</span></div>',
      foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="apOk">' + ic('shield', 's') + '승인하고 제출 진행</button>' });
    document.getElementById('apOk').addEventListener('click', function () {
      var ok = Array.prototype.every.call(document.querySelectorAll('.apc'), function (x) { return x.checked; });
      if (!ok) { A.toast('확인 항목을 모두 체크해 주세요', 'err'); return; }
      cl();
      c.auto.approval = { ver: c.ver, by: who(), at: Date.now(), hash: v.hash };
      step(c, 5, 'done'); log(c, 'ok', '제출 승인 — ' + who() + ' · v' + c.ver + ' · 해시 ' + U.short(v.hash));
      D.hist(c, Date.now(), who(), '제출 승인 (v' + c.ver + ' · 해시 ' + U.short(v.hash) + ')');
      audit('제출 승인', c.no, 'v' + c.ver);
      if (!onConsole(c)) A.go('#/admin/auto/' + c.id);
      submit(c);
    });
  };
  function submit(c, resume) {
    if (!D.WORKER.online || !c.auto.approval || c.auto.approval.ver !== c.ver || c.auto.approval.hash !== c.versions[c.ver - 1].hash) { A.toast('연동 PC 연결과 현재 버전의 제출 승인을 확인해 주세요', 'warn'); return; }
    c.auto.job = c.auto.job || { id: 'JOB-' + c.id.slice(1) + '-v' + c.ver, ver: c.ver };
    if (c.auto.job.locked && !resume) { A.toast('이미 제출 명령이 진행 중입니다 — 작업 잠금으로 중복 제출을 막았습니다', 'warn'); return; }
    c.auto.job.locked = true;
    step(c, 6, 'run'); c.stage = 'submitting'; paint(c, true);
    if (!resume) {
      sched(c, 600, function () {
        if (!c.auto.approval || c.auto.approval.ver !== c.ver || c.auto.approval.hash !== c.versions[c.ver - 1].hash) {
          step(c, 6, 'stop'); c.stage = 'approve'; c.auto.job.locked = false; log(c, 'error', '승인 버전과 현재 버전이 다릅니다 → 제출 중단 · 재승인 필요'); paint(c, true); return;
        }
        log(c, 'ok', '현재 버전 v' + c.ver + ' = 승인 버전 v' + c.auto.approval.ver + ' · 해시 일치');
        if (S.flags.authManual || c.flags.authManual) {
          step(c, 6, 'hold'); c.stage = 'auth'; c.auto.job.locked = false; S.flags.authManual = false; c.flags.authManual = false;
          log(c, 'warn', '인증창 직접 조작 필요 — 사무소 PC에서 권한 있는 담당자 인증 대기');
          D.hist(c, Date.now(), '연동 워커', '인증 대기 — 사무소 담당자 인증 필요');
          A.toast('사무소 PC에서 인증이 필요합니다', 'warn'); paint(c, true); return;
        }
        doSubmit(c);
      });
    } else doSubmit(c);
  }
  function doSubmit(c) {
    log(c, 'info', '공동인증서 인증 · 제출 명령 전송 (제출 시도 ' + (c.auto.submitTries.length + 1) + '회차)');
    c.auto.screen = c.auto.screen || screenInit(c, true); c.auto.screen.submit = true; paint(c);
    sched(c, 1500, function () {
      if (S.flags.drop) {
        S.flags.drop = false;
        c.auto.submitTries.push({ at: Date.now(), result: '응답 끊김' });
        step(c, 6, 'unknown'); c.stage = 'unknown'; c.auto.job.locked = false; c.official.status = '보류';
        log(c, 'error', '제출 명령 후 응답 끊김 → 자동 재제출하지 않음 · 확인 대기 전환 · 관납료 납부 보류');
        D.hist(c, Date.now(), '연동 워커', '제출 응답 끊김 — 확인 대기 (재제출·납부 보류)');
        A.toast('제출 응답이 끊겼습니다 — 자동으로 다시 제출하지 않습니다', 'err'); paint(c, true); return;
      }
      c.auto.submitTries.push({ at: Date.now(), result: '제출 완료' });
      step(c, 6, 'done'); step(c, 7, 'run'); log(c, 'ok', '제출 완료 응답 수신'); paint(c);
      sched(c, 900, function () { finishSubmit(c); });
    });
  }
  function finishSubmit(c, given) {
    var y = new Date().getFullYear();
    c.receipt = { no: given || ('1-1-' + y + '-' + U.pad(Math.floor(5e5 + Math.random() * 4e5), 7) + '-' + U.pad(Math.floor(10 + Math.random() * 89))), appNo: given ? null : '40-' + y + '-' + U.pad(Math.floor(1e5 + Math.random() * 8e5), 7), at: Date.now() };
    step(c, 6, 'done'); step(c, 7, 'done'); c.stage = 'submitted'; c.auto.job.locked = false;
    c.official = { status: '미납', amount: c.fee.official, due: D.after(3), receipt: null, by: null, at: null };
    log(c, 'ok', '결과 수집 — 접수번호 ' + c.receipt.no + ' / 출원번호 ' + (c.receipt.appNo || '확인 대기') + ' (별도 필드 기록)');
    D.hist(c, Date.now(), '연동 워커', '제출 완료 · 접수번호·출원번호 기록');
    D.alert(c, Date.now(), '출원 완료', '상표 「' + c.mark.text + '」 출원이 완료되었습니다. ' + (c.receipt.appNo ? '출원번호 ' + c.receipt.appNo : '접수번호 ' + c.receipt.no + ' · 출원번호는 확인 후 안내드립니다.'));
    audit('제출', c.no, '접수번호 기록');
    A.toast('제출 완료 — 고객에게 알림톡을 보냈습니다', 'ok');
    paint(c, true);
  }
  ACT.authDone = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    A.confirm('사무소 PC 인증 확인', '<p>사무소 전용 PC에서 <b>대리인 공동인증서 인증</b>을 완료하셨나요?</p><div class="note mt12">' + ic('lock', 's') + '<span>인증서와 비밀번호는 사무소 PC 밖으로 나가지 않으며, 화면 캡처·로그에도 남기지 않습니다.</span></div>', '인증 완료 · 제출 이어가기', function () {
      log(c, 'ok', '사무소 담당자 인증 완료 (' + who() + ') — 자동화 이어서 진행');
      D.hist(c, Date.now(), who(), '사무소 PC 인증 완료');
      audit('사무소 PC 인증', c.no, '—');
      if (!c.auto.screen) screenInit(c, true);
      submit(c, true);
    });
  };
  ACT.judge = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    var found = '1-1-' + new Date().getFullYear() + '-0' + U.pad(600000 + c.seq * 13, 6) + '-' + U.pad(c.seq % 90 + 10);
    var cl = A.modal({ title: '제출 여부 판정', body: '<div class="note warn">' + ic('alert', 's') + '<span>마지막 제출 시도: ' + U.dt(c.auto.submitTries.slice(-1)[0].at) + ' · 응답 끊김. 사무소 담당자가 <b>특허로 제출 내역</b>을 조회해 판정합니다. 판정 전에는 재제출과 관납료 납부를 하지 않습니다.</span></div>' +
      '<div class="col mt16">' +
      '<label class="opt on" data-j="done"><input type="radio" name="jd" value="done" checked class="sr"><span class="oi">' + ic('check') + '</span><div><b>제출됨</b><span>제출 내역에서 해당 건을 찾음 · 접수번호를 기록합니다</span></div></label>' +
      '<div class="fld" id="jdNo"><label>제출 내역의 접수번호</label><input class="inp mono" id="jdIn" value="' + found + '"><span class="hint">시연: 제출 내역에서 찾은 번호가 미리 채워져 있습니다</span></div>' +
      '<label class="opt" data-j="none"><input type="radio" name="jd" value="none" class="sr"><span class="oi">' + ic('x') + '</span><div><b>미제출</b><span>내역에 없음 · 재승인 후 다시 제출할 수 있게 합니다</span></div></label>' +
      '<label class="opt" data-j="wait"><input type="radio" name="jd" value="wait" class="sr"><span class="oi">' + ic('clock') + '</span><div><b>아직 확인 불가</b><span>확인 대기 유지 · 재제출·납부 보류 계속</span></div></label></div>',
      foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="jdOk">판정 기록</button>',
      onMount: function (bg) { bg.querySelectorAll('[data-j]').forEach(function (o) { o.addEventListener('click', function () { bg.querySelectorAll('[data-j]').forEach(function (x) { x.classList.toggle('on', x === o); }); o.querySelector('input').checked = true; bg.querySelector('#jdNo').style.display = o.getAttribute('data-j') === 'done' ? '' : 'none'; }); }); } });
    document.getElementById('jdOk').addEventListener('click', function () {
      var v = document.querySelector('input[name=jd]:checked').value;
      if (v === 'done') {
        var no = document.getElementById('jdIn').value.trim(); if (!no) { A.toast('접수번호를 입력해 주세요', 'err'); return; }
        cl(); log(c, 'ok', '판정: 제출됨 (' + who() + ') — 제출 내역 대조 결과 기록'); D.hist(c, Date.now(), who(), '제출 여부 판정: 제출됨'); audit('제출 판정', c.no, '제출됨');
        c.auto.screen = c.auto.screen || screenInit(c, true); finishSubmit(c, no);
      } else if (v === 'none') {
        cl(); c.auto.approval && c.auto.invalid.push({ ver: c.auto.approval.ver, why: '미제출 판정 · 재승인 필요' }); c.auto.approval = null;
        step(c, 5, 'hold'); step(c, 6, 'wait'); c.stage = 'approve'; c.official.status = '미납'; c.official.due = null;
        log(c, 'warn', '판정: 미제출 (' + who() + ') — 재승인 후 다시 제출'); D.hist(c, Date.now(), who(), '제출 여부 판정: 미제출 → 재승인 대기'); audit('제출 판정', c.no, '미제출');
        A.toast('미제출로 판정했습니다. 다시 승인하면 제출합니다', 'warn'); paint(c, true);
      } else { cl(); log(c, 'info', '판정 보류 — 확인 대기 유지'); A.toast('확인 대기를 유지합니다'); paint(c, true); }
    });
  };
  ACT.reproc = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    var e = c.auto.err || {};
    if (e.code === 'resume' || e.code === 'connection') {
      A.confirm('자동 입력 재처리', '<p>' + (e.code === 'connection' ? '연동 PC 연결 끊김으로' : '새로고침으로') + ' 중단된 작업입니다. 현재 버전 <b>v' + c.ver + '</b>의 출원 정보와 첨부 파일을 다시 입력·대조합니다. 제출 전에는 변리사 승인을 다시 확인합니다.</p>', '현재 버전으로 재처리', function () {
        if (!D.WORKER.online) { A.toast('연동 PC를 먼저 연결해 주세요.', 'warn'); return; }
        c.auto.tries = (c.auto.tries || 0) + 1;
        c.auto.job = { id: 'JOB-' + c.id.slice(1) + '-v' + c.ver + '-r' + c.auto.tries, ver: c.ver, locked: true, at: Date.now() };
        c.auto.err = null; c.auto.approval = null;
        c.auto.steps.forEach(function (s, i) { if (i > 0) { s.state = 'wait'; s.at = null; } });
        step(c, 1, 'done'); D.hist(c, Date.now(), who(), '중단된 자동 입력 재처리 · 현재 버전 재대조'); audit('재처리', c.no, c.auto.job.id);
        runFrom(c, 2);
      });
      return;
    }
    var cl = A.modal({ title: '원인 확인 · 재처리', body: '<dl class="kv"><dt>중단 단계</dt><dd>② 출원 정보 입력</dd><dt>항목</dt><dd>' + (e.field || '') + '</dd><dt>원본 (v' + c.ver + ')</dt><dd>' + U.esc(displayField({ k: 'addr' }, e.expect || '')) + ' <span class="tiny muted">(' + (e.expect || '').length + '자)</span></dd><dt>화면 재판독</dt><dd style="color:var(--rose-ink)">' + U.esc(displayField({ k: 'addr' }, e.got || '')) + ' <span class="tiny muted">(' + (e.got || '').length + '자)</span></dd><dt>마지막 완료</dt><dd>① 작업 수신</dd></dl>' +
      '<div class="note info mt16">' + ic('info', 's') + '<span>원인: 기관 화면의 주소 칸이 40자까지만 받습니다. <b>입력 위치 정의 v3.1</b>에서 긴 주소를 「주소 + 상세 주소」 칸으로 나눠 입력하도록 고쳤습니다.</span></div>' +
      '<label class="chk mt16"><input type="checkbox" id="rpOk1" checked> 입력 위치 정의 v3.1 적용 후 현재 버전(v' + c.ver + ')으로 ②단계부터 재처리</label>',
      foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="rpGo">' + ic('refresh', 's') + '재처리</button>' });
    document.getElementById('rpGo').addEventListener('click', function () {
      if (!document.getElementById('rpOk1').checked) { A.toast('재처리 조건을 확인해 주세요', 'err'); return; }
      cl(); c.flags.mismatch = false; S.flags.mismatch = false; D.WORKER.def = '입력 위치 정의 v3.1';
      c.auto.tries = (c.auto.tries || 0) + 1;
      c.auto.job = { id: 'JOB-' + c.id.slice(1) + '-v' + c.ver + '-r' + c.auto.tries, ver: c.ver, locked: true, at: Date.now() };
      c.auto.err = null; step(c, 2, 'wait');
      D.hist(c, Date.now(), who(), '재처리 시작 (입력 위치 정의 v3.1)'); audit('재처리', c.no, c.auto.job.id);
      runFrom(c, 2);
    });
  };

  /* --- 콘솔 화면 --- */
  function stepsHTML(c) {
    return D.AUTO_STEPS.map(function (s, i) {
      var st = c.auto.steps[i].state;
      var cls = { done: 'done', run: 'run', stop: 'stop', hold: 'hold', 'wait-auth': 'hold', unknown: 'stop' }[st] || '';
      var lab = { done: '완료', run: '진행 중', stop: '중단', hold: '대기', 'wait-auth': '인증 대기', unknown: '확인 대기' }[st] || '';
      return '<div class="ast ' + cls + '"><span class="n">' + (st === 'done' ? '✓' : s.n) + '</span><div><b>' + s.n + '. ' + s.label + (lab ? ' <span class="tiny muted">· ' + lab + '</span>' : '') + '</b><span>' + s.check + '</span>' + (c.auto.steps[i].at ? '<span class="mono tiny">' + U.time(c.auto.steps[i].at) + '</span>' : '') + '</div></div>';
    }).join('');
  }
  function screenHTML(c) {
    var sc = c.auto.screen || screenInit(c, ['approve', 'auth', 'unknown', 'submitting', 'submitted', 'exam', 'decided', 'reg_paid', 'registered', 'error'].indexOf(c.stage) >= 0);
    var F = fieldsOf(c);
    var row = function (f) { var x = sc.f[f.k] || { v: '', s: '' }; return '<div class="fr"><span>' + f.l + '</span><div><div class="box ' + x.s + '">' + U.esc(displayField(f, x.v)) + (x.s === 'typing' ? '<span class="caret"></span>' : '') + '</div></div></div>'; };
    return '<div class="screen-h"><span class="dots"><i></i><i></i><i></i></span><span class="url">전자출원 › 상표등록출원서 작성 (모의 화면)</span><span class="mockt">시연용 모의</span></div>' +
      '<div class="ef"><div class="frm"><div class="ft">상표등록출원서 · 출원인 / 대리인</div>' + F.slice(0, 6).map(row).join('') + '<div class="ft">표장 · 지정상품</div>' + F.slice(6).map(row).join('') + '</div>' +
      '<div class="att"><div class="frm"><div class="ft">첨부 서류</div><div style="padding:8px;display:flex;flex-direction:column;gap:8px"><div class="afile pdf ' + (sc.files.poa ? 'on' : '') + '"><i>PDF</i><div><b>위임장_' + c.no + '_v' + c.ver + '.pdf</b><div style="color:#6B7393">' + (sc.files.poa ? '첨부됨 · ' + U.short(c.poa && c.poa.hash) : '대기') + '</div></div></div><div class="afile img ' + (sc.files.mark ? 'on' : '') + '"><i>JPG</i><div><b>상표견본_' + c.no + '.jpg</b><div style="color:#6B7393">' + (sc.files.mark ? '첨부됨 · 변환본' : '대기') + '</div></div></div></div></div>' +
      '<div class="sbm ' + (sc.submit ? 'live' : '') + '">' + (sc.submit ? '인증 · 제출 중…' : '제출 (승인 후 활성)') + '</div><p style="font-size:11px;color:#6B7393;line-height:1.5">기관 화면을 가정한 시연용 모의 화면입니다. 실제 특허청 시스템과 연결되어 있지 않습니다.</p></div></div>';
  }
  function cmpHTML(c) {
    var sc = c.auto.screen; if (!sc) return '';
    var F = fieldsOf(c);
    return '<table class="t cmp"><thead><tr><th>항목</th><th>원본 (v' + c.ver + ')</th><th>화면 재판독</th><th>결과</th></tr></thead><tbody>' + F.map(function (f) {
      var x = sc.f[f.k] || {}; var res = x.s === 'ok' ? '<td class="ok">일치</td>' : x.s === 'bad' ? '<td class="bad">불일치</td>' : x.s === 'typing' ? '<td>입력 중</td>' : '<td class="muted">—</td>';
      return '<tr><td class="small"><b>' + f.l + '</b></td><td class="small">' + U.esc(displayField(f, f.v)) + '</td><td class="small">' + U.esc(displayField(f, x.v || '')) + '</td>' + res + '</tr>';
    }).join('') + '</tbody></table>';
  }
  function logHTML(c) { return c.auto.log.map(function (l) { return '<div><span class="t">' + U.clock(l.t) + '</span> <span class="' + l.lvl + '">' + { info: 'INFO', ok: ' OK ', warn: 'WARN', error: 'FAIL' }[l.lvl] + '</span> ' + U.esc(l.msg) + '</div>'; }).join('') || '<div class="t">작업 기록이 없습니다.</div>'; }

  V.auto = function (id) {
    var c = D.find(id); if (!c) return '<div class="empty">출원 건을 찾을 수 없습니다.</div>';
    var h = '<div class="row wr"><button class="btn sm g" data-go="#/admin/case/' + c.id + '">' + ic('back', 's') + '출원 상세</button><button class="btn sm g" data-go="#/admin/worker">' + ic('cpu', 's') + '자동화 모니터링</button></div>';
    h += '<div class="card pad"><div class="row sb wr"><div class="row wr"><div class="mkth" style="width:96px;height:44px">' + A.mk(c) + '</div><div><h1 style="font-size:20px">자동 입력 콘솔 · ' + U.esc(c.mark.text) + '</h1><p class="small muted">' + c.no + ' · ' + name(c) + ' · ' + A.clsText(c) + '</p></div>' + A.badge(c.stage) + '</div><div class="row wr">' + consoleActions(c) + '</div></div>' +
      '<div class="lockbar mt16">' + ic('lock', 's') + '<span>작업 <span class="mono">' + (c.auto.job ? c.auto.job.id : '—') + '</span></span><span>· 버전 <b>v' + c.ver + '</b></span><span>· 잠금 ' + (c.auto.job && c.auto.job.locked ? A.bdg('사용 중', 'info') : A.bdg('해제', 'mute')) + '</span><span>· 워커 ' + D.WORKER.id + '</span><span>· 정의 ' + D.WORKER.def + '</span><span>· 제출 시도 ' + c.auto.submitTries.length + '회</span>' + (c.auto.approval ? '<span>· 승인 v' + c.auto.approval.ver + ' (' + c.auto.approval.by + ')</span>' : '') + '</div>' + banner(c) + '</div>';
    h += '<div class="ac"><div class="asteps" id="aSteps">' + stepsHTML(c) + '</div><div class="col" style="gap:16px;min-width:0"><div class="screen" id="efScreen">' + screenHTML(c) + '</div>' +
      '<div class="card"><div class="card-h"><h3>입력값 대조</h3><span class="muted small">입력 후 화면 값을 다시 읽어 버전 원본과 비교</span></div><div class="tw" id="aCmp">' + cmpHTML(c) + '</div></div>' +
      '<div class="card"><div class="card-h"><h3>증적 화면</h3><span class="muted small">단계별 저장</span></div><div class="card-b"><div class="shots">' + ['① 출원인 정보', '② 상표 · 지정상품', '③ 첨부 목록'].map(function (s, i) { var ok = c.auto.steps[3].state === 'done'; return '<div class="shot" data-act="shot" data-id="' + c.id + '" data-i="' + i + '"><div class="im" style="' + (ok ? '' : 'opacity:.35') + '"></div><div class="c">' + s + (ok ? '' : ' · 대기') + '</div></div>'; }).join('') + '</div></div></div>' +
      '<div><b class="small">작업 로그</b><div class="console mt8" id="aLog">' + logHTML(c) + '</div></div></div></div>';
    A.after(function () { var l = document.getElementById('aLog'); if (l) l.scrollTop = l.scrollHeight; });
    return h;
  };
  function consoleActions(c) {
    var b = '';
    if (c.stage === 'review') b += '<button class="btn p" data-act="startAuto" data-id="' + c.id + '"' + lock('review', '자동 입력 시작은 변리사 권한이 필요합니다') + '>' + ic('play', 's') + '자동 입력 시작</button>';
    if (c.stage === 'approve') b += '<button class="btn p" data-act="approve" data-id="' + c.id + '"' + lock('approve', '제출 승인은 변리사 권한이 필요합니다') + '>' + ic('shield', 's') + '제출 승인</button>';
    if (c.stage === 'error') b += '<button class="btn d" data-act="reproc" data-id="' + c.id + '"' + lock('start') + '>' + ic('refresh', 's') + '원인 확인 · 재처리</button>';
    if (c.stage === 'auth') b += '<button class="btn p" data-act="authDone" data-id="' + c.id + '"' + lock('auth', '사무소 PC 인증 확인은 변리사·사무장 권한이 필요합니다') + '>' + ic('key', 's') + '사무소 PC 인증 완료</button>';
    if (c.stage === 'unknown') b += '<button class="btn d" data-act="judge" data-id="' + c.id + '"' + lock('judge', '제출 여부 판정은 변리사·사무장 권한이 필요합니다') + '>' + ic('search', 's') + '제출 여부 판정</button>';
    if (c.stage === 'submitting') b += '<button class="btn p dis" data-act="dupSubmit" data-why="이미 제출 명령이 진행 중입니다 — 작업 잠금으로 중복 제출을 막았습니다">' + ic('send', 's') + '제출 중…</button>';
    if (['submitted', 'exam'].indexOf(c.stage) >= 0) b += '<button class="btn s" data-go="#/admin/official">' + ic('receipt', 's') + '관납료 납부</button>';
    return b;
  }
  function banner(c) {
    var b = {
      error: ['', 'alert', '자동 입력을 멈췄습니다', (c.auto.err ? c.auto.err.msg + ' — ' : '') + '잘못된 내용으로 진행하지 않도록 즉시 멈추고 관리자에게 알렸습니다. 원인을 확인한 뒤 같은 버전으로 재처리합니다.'],
      approve: ['warn', 'shield', '제출 승인 대기', '자동 입력·첨부가 끝났습니다. 변리사가 입력값 대조와 증적 화면을 확인하고 이 버전(v' + c.ver + ')에 승인하면 제출합니다.'],
      auth: ['warn', 'key', '사무소 PC 인증 필요', '인증창이 직접 조작을 요구합니다. 사무소 전용 PC에서 권한 있는 담당자가 인증하면 워커가 다음 단계를 이어갑니다.'],
      unknown: ['', 'alert', '제출 확인 대기 — 자동 재제출 없음', '제출 명령 후 응답이 끊겼습니다. 같은 출원이 두 번 들어가지 않도록 자동으로 다시 제출하지 않고, 관납료 납부도 보류합니다. 제출 내역을 대조해 판정하세요.'],
      submitted: ['ok', 'check', '제출 완료', '접수번호 ' + (c.receipt.no || '—') + ' · 출원번호 ' + (c.receipt.appNo || '확인 대기') + ' — 고객에게 알림톡을 보냈습니다. 관납료 납부는 관납료 납부 화면에서 기록합니다.']
    }[c.stage];
    if (!b) return '';
    return '<div class="big-alert ' + b[0] + ' mt16"><span class="ic">' + ic(b[1]) + '</span><div><h4>' + b[2] + '</h4><p>' + b[3] + '</p></div></div>';
  }
  ACT.shot = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    if (c.auto.steps[3].state !== 'done') { A.toast('증적 화면은 ④단계에서 저장됩니다', 'warn'); return; }
    if (!c.auto.screen) screenInit(c, true);
    A.modal({ title: '증적 화면 · ' + ['① 출원인 정보', '② 상표 · 지정상품', '③ 첨부 목록'][+el.getAttribute('data-i')], wide: true, body: '<p class="small muted mb8">' + U.dt(c.auto.steps[3].at) + ' 저장 · 작업 ' + (c.auto.job ? c.auto.job.id : '') + ' · 인증 비밀번호 영역은 캡처하지 않습니다</p><div class="screen">' + screenHTML(c) + '</div>' });
  };

  /* ================= 자동화 모니터링 ================= */
  V.worker = function () {
    var W = D.WORKER;
    var need = C.filter(function (c) { return ['error', 'unknown', 'auth', 'approve', 'auto', 'submitting', 'review'].indexOf(c.stage) >= 0; }).sort(function (a, b) { return D.ORDER.indexOf(b.stage) - D.ORDER.indexOf(a.stage); });
    var h = head('자동화 모니터링', '사무소 연동 PC의 상태와 출원 건별 자동 입력·제출 진행을 확인합니다.', '<button class="btn o sm" data-act="wkCheck">' + ic('refresh', 's') + '지금 화면 점검</button><button class="btn sm ' + (W.online ? 'g' : 'p') + '" data-act="wkToggle">' + (W.online ? '연결 끊김 시연' : '다시 연결') + '</button>');
    h += '<div class="g4">' + [['연결 상태', W.online ? '연결됨' : '끊김', W.online ? '신호 ' + U.ago(W.beat) : '작업 전송 중단', W.online ? 'ok' : 'danger'], ['자동화 방식', '웹출원', W.mode, 'info'], ['입력 위치 정의', W.def.replace('입력 위치 정의 ', ''), W.ver, 'brand'], ['오늘 화면 점검', W.checks[0].ok ? '정상' : '변경 감지', U.time(W.checks[0].t) + ' · 제출·납부 미실행', W.checks[0].ok ? 'ok' : 'warn']].map(function (x) { return '<div class="kpi" style="cursor:default"><div class="l">' + x[0] + '</div><div class="v" style="font-size:22px">' + x[1] + '</div><div class="s">' + x[2] + '</div></div>'; }).join('') + '</div>';
    h += '<div class="dash"><div class="card"><div class="card-h"><h3>자동화 대상 출원 건</h3><span class="muted small">' + need.length + '건</span></div><div class="tw"><table class="t"><thead><tr><th>상표</th><th>단계 진행</th><th>상태</th><th>작업</th><th></th></tr></thead><tbody>' + need.map(function (c) {
      var done = c.auto.steps.filter(function (s) { return s.state === 'done'; }).length;
      return '<tr class="click" data-go="#/admin/auto/' + c.id + '"><td class="cell2"><b>' + U.esc(c.mark.text) + '</b><span>' + c.no + '</span></td><td><div class="row" style="gap:4px">' + c.auto.steps.map(function (s) { var col = { done: 'var(--mint)', stop: 'var(--rose)', unknown: 'var(--rose)', hold: 'var(--amber)', 'wait-auth': 'var(--amber)', run: 'var(--brand)' }[s.state] || 'var(--surface-3)'; return '<i style="width:18px;height:8px;border-radius:4px;background:' + col + '"></i>'; }).join('') + '<span class="tiny muted" style="margin-left:6px">' + done + '/7</span></div></td><td>' + A.badge(c.stage) + '</td><td class="mono tiny">' + (c.auto.job ? c.auto.job.id : '—') + '</td><td>' + ic('chev', 's') + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
    h += '<div class="card"><div class="card-h"><h3>매일 화면 구조 점검</h3><span class="muted small">매일 07:00 · 제출·납부는 실행하지 않음</span></div><div class="card-b feed">' + W.checks.map(function (k) { return '<div>' + (k.ok ? '<span style="color:var(--mint)">' + ic('check', 's') + '</span>' : '<span style="color:var(--amber)">' + ic('alert', 's') + '</span>') + '<span>' + U.esc(k.msg) + (k.fix ? '<br><span class="tiny muted">' + k.fix + '</span>' : '') + '</span><span class="t">' + U.md(k.t) + ' ' + U.time(k.t) + '</span></div>'; }).join('') + '</div></div></div>';
    h += '<div class="note">' + ic('lock', 's') + '<span>워커는 사무소 안의 전용 PC에서 동작하며 서버로만 암호화 통신합니다. 사무실 PC의 외부 접속 포트는 열지 않고, 대리인 공동인증서와 비밀번호는 사무소 안에서 권한 있는 담당자가 관리합니다.</span></div>';
    return h;
  };
  ACT.wkCheck = function () {
    if (!D.WORKER.online) { A.toast('사무소 연동 PC가 연결되어 있지 않습니다', 'warn'); return; }
    A.toast('화면 구조를 점검하는 중…');
    setTimeout(function () { D.WORKER.checks.unshift({ t: Date.now(), ok: true, msg: '수동 점검 정상 · 입력 위치 22곳 일치 (제출·납부 미실행)' }); audit('화면 점검', '연동 워커', '수동'); A.toast('점검 정상 — 입력 위치 22곳이 정의와 일치합니다', 'ok'); A.render(true); }, 1200);
  };
  ACT.wkToggle = function () { var W = D.WORKER; W.online = !W.online; W.beat = Date.now(); A.toast(W.online ? '연동 PC가 다시 연결되었습니다' : '연동 PC 연결이 끊겼습니다 — 새 작업 전송을 멈춥니다', W.online ? 'ok' : 'err'); A.render(true); };

  /* ================= 관납료 납부 ================= */
  V.official = function () {
    var list = C.filter(function (c) { return c.receipt.no || c.stage === 'unknown' || (c.reg); });
    var unpaid = list.filter(function (c) { return c.official.status === '미납' && c.official.due; });
    var h = head('관납료 납부', '고객 결제(PG)와 사무소의 특허청 관납료 납부를 별도 상태로 관리합니다.', '');
    h += '<div class="g4">' + [['고객 결제 완료', list.filter(function (c) { return c.pay.status === 'paid'; }).length + '건', 'PG 결제 기준'], ['관납료 미납', unpaid.length + '건', '출원 완료 · 납부 전'], ['기한 48시간 이내', unpaid.filter(function (c) { return c.official.due - Date.now() < 2 * D.DAY; }).length + '건', '알림 대상'], ['납부 보류', list.filter(function (c) { return c.official.status === '보류'; }).length + '건', '제출 확인 대기']].map(function (x, i) { return '<div class="kpi' + (i === 2 && unpaid.length ? ' hot' : '') + '" style="cursor:default"><div class="l">' + x[0] + '</div><div class="v" style="font-size:26px">' + x[1] + '</div><div class="s">' + x[2] + '</div></div>'; }).join('') + '</div>';
    h += '<div class="note info">' + ic('info', 's') + '<span>고객 결제가 성공해도 납부 완료로 처리하지 않습니다. 담당자가 특허로에서 납부한 뒤 영수증을 기록하며, 기록 전에 같은 건의 기존 납부 내역을 대조해 중복 납부를 막습니다.</span></div>';
    h += '<div class="card"><div class="tw"><table class="t"><thead><tr><th>출원 건</th><th>구분</th><th>고객 결제</th><th class="num">관납료</th><th>납부 상태</th><th>기한</th><th>영수증 · 담당</th><th></th></tr></thead><tbody>';
    list.forEach(function (c) {
      h += '<tr><td class="cell2"><b>' + U.esc(c.mark.text) + '</b><span>' + c.no + (c.receipt.appNo ? ' · ' + c.receipt.appNo : '') + '</span></td><td>출원료</td><td>' + payB(c) + '</td><td class="num">' + U.won(c.official.amount) + '</td><td>' + offB(c) + '</td><td>' + (c.official.due ? U.md(c.official.due) + ' <b class="small">' + U.dday(c.official.due) + '</b>' : '—') + '</td><td class="small">' + (c.official.receipt ? '<span class="mono">' + U.esc(c.official.receipt) + '</span><br><span class="muted">' + c.official.by + '</span>' : '—') + '</td><td>' +
        (c.official.status === '납부 완료' ? '<button class="btn sm g" data-act="offPay" data-id="' + c.id + '" data-k="app">납부 내역</button>' : '<button class="btn sm ' + (c.official.status === '보류' ? 'o' : 'p') + '" data-act="offPay" data-id="' + c.id + '" data-k="app"' + lock('official', '관납료 납부 기록은 사무장·변리사 권한이 필요합니다') + '>납부 기록</button>') + '</td></tr>';
      if (c.reg) h += '<tr><td class="cell2"><b>' + U.esc(c.mark.text) + '</b><span>등록 단계</span></td><td>등록료</td><td>' + (c.reg.pay.status === 'paid' ? A.bdg('결제 완료', 'ok') : A.bdg('결제 대기', 'warn')) + '</td><td class="num">' + U.won(c.reg.fee.official) + '</td><td>' + (c.reg.official.status === '납부 완료' ? A.bdg('납부 완료', 'ok') : A.bdg('미납', 'warn')) + '</td><td>' + U.md(c.reg.official.due) + ' <b class="small">' + U.dday(c.reg.official.due) + '</b></td><td class="small">' + (c.reg.official.receipt ? '<span class="mono">' + U.esc(c.reg.official.receipt) + '</span>' : '—') + '</td><td>' + (c.reg.official.status === '납부 완료' ? '' : '<button class="btn sm s" data-act="offPay" data-id="' + c.id + '" data-k="reg"' + lock('official') + '>납부 기록</button>') + '</td></tr>';
    });
    h += '</tbody></table></div></div>';
    return h;
  };
  ACT.offPay = function (el) {
    var c = D.find(el.getAttribute('data-id')), k = el.getAttribute('data-k');
    var o = k === 'reg' ? c.reg.official : c.official;
    if (o.status === '납부 완료') { A.modal({ title: '중복 납부 방지', body: '<div class="big-alert"><span class="ic">' + ic('alert') + '</span><div><h4>이미 납부 기록이 있습니다</h4><p>영수증 <b class="mono">' + U.esc(o.receipt) + '</b> · ' + (o.by || '') + ' · ' + U.dt(o.at) + '<br>같은 건의 관납료를 다시 납부하지 않도록 기록을 막았습니다.</p></div></div>', foot: '<button class="btn p" data-close>확인</button>' }); return; }
    if (k === 'app' && (c.stage === 'unknown' || o.status === '보류')) { A.modal({ title: '납부 보류', body: '<div class="big-alert warn"><span class="ic">' + ic('clock') + '</span><div><h4>제출 확인 대기 건입니다</h4><p>제출 여부가 확정되지 않은 건은 재제출과 관납료 납부를 진행하지 않습니다. 자동 입력 콘솔에서 제출 여부를 먼저 판정해 주세요.</p></div></div>', foot: '<button class="btn g" data-close>닫기</button><button class="btn p" data-close data-go="#/admin/auto/' + c.id + '">콘솔로 이동</button>' }); return; }
    if (k === 'reg' && c.reg.pay.status !== 'paid') { A.toast('고객의 등록료 결제가 완료된 뒤 납부합니다', 'warn'); return; }
    var amt = k === 'reg' ? c.reg.fee.official : o.amount;
    var cl = A.modal({ title: (k === 'reg' ? '등록료' : '관납료') + ' 납부 기록', body: '<div class="note ok">' + ic('check', 's') + '<span>납부 전 대조: 이 건의 기존 납부 기록 <b>0건</b> · 고객 결제 ' + (k === 'reg' ? '등록료 결제 완료' : '완료') + '</span></div>' +
      '<dl class="kv mt16"><dt>출원 건</dt><dd>' + c.no + ' · ' + (c.receipt.appNo || c.receipt.no) + '</dd><dt>금액</dt><dd><b>' + U.won(amt) + '</b></dd><dt>기한</dt><dd>' + U.dt(o.due) + '</dd></dl>' +
      '<div class="fld mt16"><label>특허로 납부 영수증 번호</label><input class="inp mono" id="rcNo" value="R-' + new Date().getFullYear() % 100 + '-' + U.pad(new Date().getMonth() + 1) + U.pad(new Date().getDate()) + '-' + U.pad(Math.floor(1000 + Math.random() * 8999), 4) + '"></div><p class="hint mt8">실제 납부는 담당자가 특허로에서 진행하고, 이 화면에는 결과와 증빙을 기록합니다.</p>',
      foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="rcOk">납부 완료 기록</button>' });
    document.getElementById('rcOk').addEventListener('click', function () {
      var no = document.getElementById('rcNo').value.trim(); if (!no) { A.toast('영수증 번호를 입력해 주세요', 'err'); return; }
      cl(); o.status = '납부 완료'; o.receipt = no; o.by = who(); o.at = Date.now();
      D.hist(c, Date.now(), who(), (k === 'reg' ? '등록료' : '관납료') + ' 납부 기록 (영수증 ' + no + ')');
      audit((k === 'reg' ? '등록료' : '관납료') + ' 납부 기록', c.no, no);
      if (k === 'app' && c.stage === 'submitted') { c.stage = 'exam'; D.hist(c, Date.now() + 1, '시스템', '심사 대기 단계로 전환'); }
      A.toast('납부 완료를 기록했습니다', 'ok'); A.render(true);
    });
  };

  /* ================= 결제 · 환불 ================= */
  V.payments = function () {
    var list = C.filter(function (c) { return c.pay.status !== 'none'; });
    var h = head('결제 · 환불', 'PG 결제·가상계좌 입금·취소를 확인합니다. 같은 거래번호·입금 통지는 한 번만 반영합니다.');
    h += '<div class="card"><div class="tw"><table class="t"><thead><tr><th>거래번호</th><th>출원 건</th><th>수단</th><th class="num">금액</th><th>상태</th><th>시각</th><th></th></tr></thead><tbody>' + list.map(function (c) {
      var st = c.pay.status === 'refunded' ? A.bdg(c.pay.refund && c.pay.refund.amount < c.fee.total ? '부분 환불' : '전액 취소', 'mute') : c.pay.status === 'wait' ? A.bdg('입금 대기', 'warn') : A.bdg('승인', 'ok');
      var btn = c.pay.status === 'wait' ? '<button class="btn sm s" data-act="admDeposit" data-id="' + c.id + '">입금 통지 시연</button>' : c.pay.status === 'paid' ? '<button class="btn sm g" data-act="refund" data-id="' + c.id + '"' + lock('refund') + '>취소 · 환불</button>' : '<span class="tiny muted">' + U.esc(c.pay.refund ? c.pay.refund.reason : '') + '</span>';
      return '<tr><td class="mono small">' + (c.pay.tx || '—') + '</td><td class="cell2"><b>' + U.esc(c.mark.text) + '</b><span>' + c.no + '</span></td><td>' + (c.pay.method === 'vbank' ? '가상계좌' : '카드') + '</td><td class="num">' + U.won(c.fee.total) + '</td><td>' + st + '</td><td class="small muted">' + U.dt(c.pay.at) + '</td><td>' + btn + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
    h += '<div class="note">' + ic('info', 's') + '<span>환불은 귀사가 확정한 환불 정책을 따르며, 이미 납부한 관납료의 반환 확인과 고객 PG 환불을 구분해 기록해 같은 금액이 두 번 환불되지 않게 합니다.</span></div>';
    return h;
  };
  ACT.refund = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    var filed = !!c.receipt.no, offPaid = c.official.status === '납부 완료';
    if (['submitting', 'unknown'].indexOf(c.stage) >= 0) { A.toast('제출 확인 전에는 환불을 진행하지 않습니다', 'warn'); return; }
    var ref = filed ? c.fee.service + c.fee.vat : c.fee.total;
    var cl = A.modal({ title: '취소 · 환불 — ' + c.no, body: '<dl class="kv"><dt>출원 상태</dt><dd>' + A.badge(c.stage) + '</dd><dt>결제 금액</dt><dd>' + U.won(c.fee.total) + '</dd><dt>관납료 납부</dt><dd>' + offB(c) + '</dd></dl>' +
      '<div class="card pad mt16"><div class="feeline"><span>고객 PG 환불</span><b>' + U.won(ref) + '</b></div><div class="feeline"><span>관납료 반환 (기관 절차 · 별도 기록)</span><span>' + (offPaid ? '반환 신청 대상 ' + U.won(c.official.amount) : filed ? '납부 전 — 해당 없음' : '출원 전 — 전액 PG 취소에 포함') + '</span></div></div>' +
      '<p class="hint mt8">' + (filed ? '출원 이후 취소는 환불 규정에 따라 처리하며 아래 금액은 시연 예시입니다.' : '특허청 출원 전 취소이므로 결제 금액 전액을 취소합니다.') + '</p>',
      foot: '<button class="btn g" data-close>닫기</button><button class="btn d" id="rfOk">환불 처리</button>' });
    document.getElementById('rfOk').addEventListener('click', function () {
      cl(); if (c.pay.status === 'refunded') { A.toast('이미 환불된 거래입니다 — 중복 환불을 막았습니다', 'warn'); return; }
      if (['submitting', 'unknown'].indexOf(c.stage) >= 0) { A.toast('제출 확인 전에는 환불을 진행하지 않습니다', 'warn'); return; }
      stopJob(c); c.auto.approval = null;
      c.pay.status = 'refunded'; c.pay.refund = { at: Date.now(), amount: ref, reason: filed ? '출원 후 취소 (규정 적용)' : '출원 전 고객 요청 취소' };
      if (offPaid) c.official.status = '반환 신청';
      c.stage = 'cancel'; D.hist(c, Date.now(), who(), '취소 · PG 환불 ' + U.won(ref) + (offPaid ? ' · 관납료 반환 신청 별도 기록' : ''));
      D.alert(c, Date.now(), '취소 · 환불', '출원 신청이 취소되었고 ' + U.won(ref) + '이 환불됩니다.');
      audit('환불', c.no, U.won(ref)); A.toast('환불을 처리했습니다', 'ok'); A.render(true);
    });
  };

  /* ================= 심사 · 등록 단계 ================= */
  V.stages = function () {
    var list = C.filter(function (c) { return ['submitted', 'exam', 'decided', 'reg_paid', 'registered'].indexOf(c.stage) >= 0; });
    var h = head('심사 · 등록 단계', '접수 이후 단계는 담당자가 확인해 변경하면 고객 마이페이지와 알림톡에 반영됩니다.');
    h += '<div class="card"><div class="tw"><table class="t"><thead><tr><th>상표</th><th>접수번호 / 출원번호</th><th>현재 단계</th><th>관납료</th><th>다음 단계</th></tr></thead><tbody>' + list.map(function (c) {
      var nx = { submitted: ['exam', '심사 중으로 변경'], exam: ['decided', '등록 결정 반영'], decided: [null, '고객 등록료 결제 대기'], reg_paid: ['registered', '등록 완료 반영'], registered: [null, '완료'] }[c.stage];
      var cond = c.stage === 'reg_paid' && c.reg.official.status !== '납부 완료';
      return '<tr><td class="cell2"><b>' + U.esc(c.mark.text) + '</b><span>' + c.no + '</span></td><td class="small"><span class="mono">' + c.receipt.no + '</span><br>' + (c.receipt.appNo ? '<span class="mono">' + c.receipt.appNo + '</span>' : '<button class="btn sm s mt8" data-act="setAppNo" data-id="' + c.id + '">출원번호 확인 기록</button>') + '</td><td>' + A.badge(c.stage) + '</td><td>' + offB(c) + '</td><td>' + (nx[0] ? '<button class="btn sm ' + (cond ? 'o dis' : 'p') + '" data-act="stageNext" data-id="' + c.id + '" data-to="' + nx[0] + '"' + (cond ? ' data-why="등록료 납부 기록 후 등록 완료로 바꿀 수 있습니다"' : '') + lock('stage') + '>' + nx[1] + '</button>' : '<span class="small muted">' + nx[1] + '</span>') + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
    h += '<div class="note">' + ic('info', 's') + '<span>심사·등록 단계는 담당자가 확인한 결과를 반영합니다. 변경된 진행 상황은 고객 마이페이지와 알림에 함께 표시됩니다.</span></div>';
    return h;
  };
  ACT.setAppNo = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    var cl = A.modal({ title: '출원번호 확인 기록', body: '<p class="small muted">접수번호 <span class="mono">' + c.receipt.no + '</span>에 발급된 출원번호를 기록합니다.</p><div class="fld mt12"><label>출원번호</label><input class="inp mono" id="anIn" value="40-' + new Date().getFullYear() + '-0' + U.pad(180000 + c.seq * 97, 6) + '"></div>', foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="anOk">기록</button>' });
    document.getElementById('anOk').addEventListener('click', function () { c.receipt.appNo = document.getElementById('anIn').value.trim(); cl(); D.hist(c, Date.now(), who(), '출원번호 확인 기록 ' + c.receipt.appNo); D.alert(c, Date.now(), '출원번호 안내', '상표 「' + c.mark.text + '」 출원번호는 ' + c.receipt.appNo + '입니다.'); A.toast('출원번호를 기록하고 고객에게 안내했습니다', 'ok'); A.render(true); });
  };
  ACT.stageNext = function (el) {
    var c = D.find(el.getAttribute('data-id')), to = el.getAttribute('data-to');
    var msg = { exam: '심사 중으로 변경하고 고객에게 안내합니다.', decided: '등록 결정을 반영하고 등록료·대리 수수료 결제 안내를 보냅니다.', registered: '등록 완료를 반영하고 고객에게 안내합니다.' }[to];
    A.confirm('단계 변경', '<p>「' + U.esc(c.mark.text) + '」 — ' + msg + '</p><div class="kakao mt16"><div class="msg"><div class="h"><i>®</i>' + D.OFFICE.service + ' · 알림톡 미리보기</div>' + U.esc(tpl(to, c)) + '</div></div>', '변경하고 알림 보내기', function () {
      c.stage = to;
      if (to === 'decided') c.reg = { decidedAt: Date.now(), fee: D.calcRegFee(c.fee.classes), pay: { status: 'wait', at: null, tx: null }, official: { status: '미납', due: D.after(28), receipt: null } };
      D.hist(c, Date.now(), who(), D.STAGE[to].label + ' 반영');
      D.alert(c, Date.now(), D.STAGE[to].cust, tpl(to, c));
      audit('단계 변경', c.no, D.STAGE[to].label); A.toast('단계를 변경하고 알림톡을 보냈습니다', 'ok'); A.render(true);
    });
  };
  function tpl(to, c) {
    return { exam: '상표 「' + c.mark.text + '」의 심사 결과를 기다리고 있습니다. 심사 결과가 나오면 안내드리겠습니다.', decided: '축하합니다! 상표 「' + c.mark.text + '」의 등록이 결정되었습니다. 마이페이지에서 등록료를 결제하시면 대리인이 등록 절차를 진행합니다.', registered: '상표 「' + c.mark.text + '」 등록이 완료되었습니다. 마이페이지에서 진행 기록을 확인하실 수 있습니다.' }[to] || '';
  }

  /* ================= 알림톡 ================= */
  V.notify = function () {
    var all = []; C.forEach(function (c) { c.alerts.forEach(function (a) { all.push({ a: a, c: c }); }); });
    all.sort(function (x, y) { return y.a.t - x.a.t; });
    var tpls = [['결제 완료', '상표 「#{상표}」 출원 신청과 결제가 완료되었습니다. 변리사 검토 후 출원을 진행합니다.'], ['가상계좌 안내', '입금 기한 #{기한} · 금액 #{금액}'], ['출원 완료', '상표 「#{상표}」 출원이 완료되었습니다. 출원번호 #{출원번호}'], ['등록 결정', '축하합니다! 상표 「#{상표}」의 등록이 결정되었습니다. 등록료 결제 안내'], ['등록 완료', '상표 「#{상표}」 등록이 완료되었습니다.']];
    var h = head('알림톡 발송', '단계가 바뀌면 템플릿에 따라 자동으로 발송합니다. 알림톡이 실패하면 문자로 대체합니다.');
    h += '<div class="dash"><div class="card"><div class="card-h"><h3>발송 이력</h3><span class="muted small">' + all.length + '건</span></div><div class="tw"><table class="t"><thead><tr><th>시각</th><th>수신</th><th>템플릿</th><th>내용</th><th>결과</th></tr></thead><tbody>' + all.slice(0, 30).map(function (x) { return '<tr><td class="small muted">' + U.dt(x.a.t) + '</td><td class="small">' + name(x.c) + '<br><span class="muted">' + U.maskPhone(x.c.applicant.phone) + '</span></td><td>' + A.bdg(x.a.title, 'brand', true) + '</td><td class="small">' + U.esc(x.a.body) + '</td><td>' + A.bdg('성공', 'ok') + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
    h += '<div class="card"><div class="card-h"><h3>템플릿</h3>' + A.bdg('검수 완료 · 시연', 'ok', true) + '</div><div class="card-b col">' + tpls.map(function (t) { return '<div class="kakao" style="max-width:none"><div class="msg"><div class="h"><i>®</i>' + t[0] + '</div>' + U.esc(t[1]) + '</div></div>'; }).join('') + '</div></div></div>';
    return h;
  };

  /* ================= 회원 ================= */
  V.members = function () {
    var map = Object.create(null);
    C.forEach(function (c) { var k = c.applicant.name; map[k] = map[k] || { n: c.applicant.name, kind: c.applicant.kind, phone: c.applicant.phone, email: c.applicant.email, cases: 0, first: c.created }; map[k].cases++; map[k].first = Math.min(map[k].first, c.created); });
    var list = Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return b.first - a.first; });
    var h = head('회원 관리', '목록에서는 개인정보를 가려 보여 주며, 열람하면 사유와 함께 기록이 남습니다.');
    h += '<div class="card"><div class="tw"><table class="t"><thead><tr><th>회원</th><th>구분</th><th>연락처</th><th>이메일</th><th class="num">출원</th><th>가입</th><th></th></tr></thead><tbody>' + list.map(function (m) { return '<tr><td><b>' + U.esc(m.kind === '법인' ? m.n : U.maskName(m.n)) + '</b></td><td>' + m.kind + '</td><td class="mono small">' + U.esc(U.maskPhone(m.phone)) + '</td><td class="small">' + U.esc(U.maskEmail(m.email)) + '</td><td class="num">' + m.cases + '</td><td class="small muted">' + U.date(m.first) + '</td><td><button class="btn sm g" data-act="memReveal" data-n="' + U.esc(m.n) + '"' + lock('reveal') + '>' + ic('eye', 's') + '열람</button></td></tr>'; }).join('') + '</tbody></table></div></div>';
    return h;
  };
  ACT.memberReason = function (el) { S.memberReason = el.value; };
  ACT.memReveal = function (el) {
    S.memberReason = '고객 문의 응대';
    var n = el.getAttribute('data-n'); var c = C.filter(function (x) { return x.applicant.name === n; })[0];
    A.confirm('개인정보 열람', '<p class="small muted">열람자·시각·사유가 감사 로그에 기록됩니다.</p><div class="fld mt12"><label>열람 사유</label><select class="sel" id="mrW" data-ch="memberReason"><option>고객 문의 응대</option><option>관납료 납부 확인</option></select></div>', '열람', function () {
      audit('개인정보 열람', '회원 ' + U.maskName(n), '사유: ' + (S.memberReason || '고객 문의 응대'));
      A.modal({ title: '회원 정보', body: '<dl class="kv"><dt>성명</dt><dd>' + U.esc(c.applicant.name) + '</dd><dt>연락처</dt><dd>' + U.esc(c.applicant.phone) + '</dd><dt>이메일</dt><dd>' + U.esc(c.applicant.email) + '</dd></dl><p class="tiny muted mt12">열람 기록이 남았습니다.</p>', foot: '<button class="btn p" data-close>닫기</button>' });
    });
  };

  /* ================= 위임장 양식 ================= */
  var draft = null;
  V.forms = function () {
    var F = D.FORM;
    if (!draft) draft = F.get(F.current).map(function (f) { var o = {}; for (var k in f) o[k] = f[k]; return o; });
    var sample = D.find('C050') || C[0];
    var data = A.poaData(sample, { date: Date.now() });
    var h = head('위임장 양식', '사무소 표준 양식을 배경으로 두고, 칸마다 들어갈 값과 위치·길이 규칙을 양식 정의로 관리합니다.', '<button class="btn p sm" data-act="formSave"' + lock('form', '양식 정의 변경은 변리사 권한이 필요합니다') + '>' + ic('download', 's') + '새 버전으로 저장</button>');
    h += '<div class="card"><div class="card-b row wr">' + F.versions.slice().reverse().map(function (v) { return '<div class="ver ' + (v.ver === F.current ? 'cur' : '') + '"><span class="tag">' + v.ver + '</span><div><b>' + U.esc(v.note) + '</b><div class="tiny muted">' + U.date(v.at) + ' · ' + v.by + '</div></div>' + (v.ver === F.current ? A.bdg('사용 중', 'brand') : '') + '</div>'; }).join('') + '</div></div>';
    h += '<div class="fe"><div class="card"><div class="card-h"><h3>양식 정의 (편집 중 초안)</h3><span class="muted small">위치는 양식 크기 대비 %</span></div><div class="tw"><table class="t"><thead><tr><th>칸 ID</th><th>항목</th><th>X</th><th>Y</th><th>너비</th><th>최대 글자</th><th>줄</th></tr></thead><tbody>' + draft.map(function (f, i) {
      var inp = function (k, w) { return '<input class="inp" style="width:' + (w || 62) + 'px" type="number" step="0.1" value="' + (f[k] == null ? '' : f[k]) + '" data-ch="fdef" data-i="' + i + '" data-k="' + k + '">'; };
      return '<tr><td class="mono tiny">' + f.id + '</td><td class="small">' + f.label + (f.req ? ' <span style="color:var(--rose)">*</span>' : '') + '</td><td>' + inp('x') + '</td><td>' + inp('y') + '</td><td>' + inp('w') + '</td><td>' + (f.seal ? '—' : inp('max')) + '</td><td>' + (f.seal ? '—' : inp('lines', 50)) + '</td></tr>';
    }).join('') + '</tbody></table></div><div class="card-b"><div class="note">' + ic('info', 's') + '<span>저장하면 <b>새로 생성되는 위임장부터</b> 적용됩니다. 기존 출원 건은 작성 당시 양식 버전으로 그대로 재현됩니다.</span></div></div></div>';
    h += '<div class="col"><div class="row sb"><b>미리보기 · 긴 주소 시험 사례</b><span class="muted small">' + U.esc(sample.applicant.address.length + '자 주소') + '</span></div><div class="poa-wrap">' + A.poaHTML(data, { def: true, fields: draft, ver: 'v' + (F.versions.length + 1) + ' 초안' }) + '</div>' + checkNote(data) + '</div></div>';
    return h;
  };
  function checkNote(data) {
    var errs = [];
    draft.forEach(function (f) { if (f.seal) return; var v = String(data[f.id] || ''); var need = v.split('\n').reduce(function (a, l) { return a + A.wrapLine(l, f.max).length; }, 0); if (need > (f.lines || 1) + (f.id === 'appl_name' ? 1 : 0)) errs.push(f.label + ' — ' + f.max + '자 × ' + (f.lines || 1) + '줄을 넘습니다'); });
    return errs.length ? '<div class="note danger">' + ic('alert', 's') + '<span>시험 사례 검증 실패: ' + errs.join(', ') + '</span></div>' : '<div class="note ok">' + ic('check', 's') + '<span>시험 사례 검증 통과 — 모든 칸이 길이 규칙 안에 들어갑니다.</span></div>';
  }
  ACT.fdef = function (el) {
    var f = draft[+el.getAttribute('data-i')], k = el.getAttribute('data-k'), value = +el.value;
    var valid = el.value !== '' && Number.isFinite(value) && (['max','lines'].indexOf(k) >= 0 ? Number.isInteger(value) && value >= 1 && value <= 200 : value >= (k === 'w' ? 1 : 0) && value <= 100);
    if (valid && ['x','w'].indexOf(k) >= 0) valid = (k === 'x' ? value + f.w : f.x + value) <= 100;
    if (!valid) { A.toast('양식 범위를 확인해 주세요. 글자·줄 수는 1 이상, 위치와 너비는 용지 안으로 설정합니다.', 'err'); el.value = f[k] == null ? 1 : f[k]; return; }
    f[k] = value; A.render(true);
  };
  ACT.formSave = function () {
    var F = D.FORM, ver = 'v' + (F.versions.length + 1);
    F.defs[ver] = draft.map(function (f) { var o = {}; for (var k in f) o[k] = f[k]; return o; });
    F.versions.push({ ver: ver, at: Date.now(), by: who(), note: '양식 정의 조정' }); F.current = ver;
    audit('양식 버전 저장', '위임장 양식', ver); draft = null;
    A.toast('위임장 양식 ' + ver + ' 버전을 저장했습니다 — 새 위임장부터 적용됩니다', 'ok'); A.render(true);
  };

  /* ================= 요율표 ================= */
  V.rates = function () {
    var r = D.RATE;
    var rowsR = [['officialPerClass', '관납료 (출원료) · 류당'], ['freeItems', '류당 기본 지정상품 수 (개)'], ['extraPerItem', '초과 지정상품 1개당 가산'], ['servicePerClass', '서비스 이용료 · 류당'], ['regOfficialPerClass', '관납 등록료 · 류당'], ['regServicePerClass', '등록 대리 수수료 · 류당']];
    var ex = D.calcFee([{ cls: 30, ids: new Array(12).fill('x') }, { cls: 43, ids: ['x', 'y'] }]);
    var h = head('요율표', '관납료·서비스 이용료 규칙을 설정으로 관리합니다. 제도가 바뀌면 이 표만 수정합니다.', '<button class="btn p sm" data-act="rateSave"' + lock('rate', '요율 변경은 사무장·변리사 권한이 필요합니다') + '>' + ic('download', 's') + '저장</button>');
    h += '<div class="note warn">' + ic('info', 's') + '<span>' + r.note + ' 이미 결제된 출원 건은 결제 당시 적용 요율이 건별로 저장되어 바뀌지 않습니다.</span></div>';
    h += '<div class="dash"><div class="card"><div class="tw"><table class="t rate-tbl"><thead><tr><th>항목</th><th class="num">값</th></tr></thead><tbody>' + rowsR.map(function (x) { return '<tr><td>' + x[1] + '</td><td class="num"><input class="inp" type="number" value="' + r[x[0]] + '" data-k="' + x[0] + '"></td></tr>'; }).join('') + '<tr><td>서비스 이용료 부가세율</td><td class="num">10%</td></tr></tbody></table></div></div>' +
      '<div class="card"><div class="card-h"><h3>시험 사례</h3><span class="muted small">30류 12개 + 43류 2개</span></div><div class="card-b"><div class="feeline"><span>30류 관납료 (기본 + 초과 2개)</span><span>' + U.won(ex.lines[0].official) + '</span></div><div class="feeline"><span>43류 관납료</span><span>' + U.won(ex.lines[1].official) + '</span></div><div class="feeline"><span>서비스 이용료 + 부가세</span><span>' + U.won(ex.service + ex.vat) + '</span></div><div class="feeline tot"><span>고객 결제 합계</span><b>' + U.won(ex.total) + '</b></div></div></div></div>';
    return h;
  };
  ACT.rateSave = function () {
    var ch = []; document.querySelectorAll('.rate-tbl input[data-k]').forEach(function (i) { var k = i.getAttribute('data-k'), v = +i.value; if (v !== D.RATE[k]) { ch.push(k); D.RATE[k] = v; } });
    if (!ch.length) { A.toast('바뀐 값이 없습니다', 'warn'); return; }
    audit('요율 변경', '요율표', ch.join(', ')); A.toast('요율표를 저장했습니다 — 새 신청부터 적용됩니다', 'ok'); A.render(true);
  };

  /* ================= 대리인 · 규격 ================= */
  V.settings = function () {
    var ag = D.OFFICE.agent, sp = D.SPEC;
    var h = head('대리인 · 규격', '위임장에 들어갈 대리인 정보와 상표 이미지 제출 규격을 설정합니다.', '<button class="btn p sm" data-act="setSave"' + lock('agent', '대리인 정보 변경은 변리사 권한이 필요합니다') + '>' + ic('download', 's') + '저장</button>');
    h += '<div class="dash"><div class="card"><div class="card-h"><h3>대리인 정보</h3>' + A.bdg('위임장 자동 기재', 'brand', true) + '</div><div class="card-b col"><div class="g2"><div class="fld"><label>성명</label><input class="inp" id="agN" value="' + U.esc(ag.name) + '"></div><div class="fld"><label>대리인 코드</label><input class="inp mono" id="agC" value="' + U.esc(ag.code) + '"></div></div><div class="fld"><label>주소</label><input class="inp" id="agA" value="' + U.esc(ag.address) + '"></div><p class="hint">변경 내용은 새로 생성되는 위임장부터 적용되고, 기존 위임장은 작성 당시 정보로 보관됩니다.</p></div></div>' +
      '<div class="card"><div class="card-h"><h3>상표 이미지 제출 규격</h3>' + A.bdg('시연 가정', 'warn', true) + '</div><div class="card-b"><dl class="kv"><dt>파일 형식</dt><dd>' + sp.format + '</dd><dt>긴 변 최대</dt><dd>' + sp.maxPx + 'px</dd><dt>짧은 변 최소</dt><dd>' + sp.minPx + 'px</dd><dt>최대 용량</dt><dd>' + sp.maxKB + 'KB</dd><dt>배경</dt><dd>' + sp.bg + '</dd></dl><p class="hint mt12">' + sp.note + '</p></div></div></div>';
    return h;
  };
  ACT.setSave = function () { var ag = D.OFFICE.agent; ag.name = document.getElementById('agN').value; ag.code = document.getElementById('agC').value; ag.address = document.getElementById('agA').value; audit('대리인 정보 변경', '설정', ag.code); A.toast('저장했습니다 — 새 위임장부터 적용됩니다', 'ok'); A.render(true); };

  /* ================= 권한 · 감사 로그 ================= */
  V.audit = function () {
    var perms = [['review', '검토 완료 · 자동 입력 시작'], ['approve', '제출 승인'], ['auth', '사무소 PC 인증 확인'], ['judge', '제출 여부 판정'], ['start', '재처리'], ['edit', '정보 변경 (새 버전)'], ['official', '관납료 납부 기록'], ['refund', '취소 · 환불'], ['reveal', '개인정보 열람'], ['form', '위임장 양식 변경'], ['rate', '요율 변경'], ['stage', '심사 · 등록 단계 변경']];
    var h = head('권한 · 감사 로그', '역할별로 할 수 있는 일을 나누고, 승인·제출·납부·열람 기록을 남깁니다.');
    h += '<div class="dash"><div class="card"><div class="card-h"><h3>역할별 권한</h3></div><div class="tw"><table class="t"><thead><tr><th>작업</th>' + D.ADMINS.map(function (a) { return '<th style="text-align:center">' + a.name + '<br><span class="tiny">' + D.ROLE[a.role].label + '</span></th>'; }).join('') + '</tr></thead><tbody>' + perms.map(function (p) { return '<tr><td class="small">' + p[1] + '</td>' + D.ADMINS.map(function (a) { var ok = D.ROLE[a.role].can.indexOf(p[0]) >= 0; return '<td style="text-align:center;color:' + (ok ? 'var(--mint)' : 'var(--ink-4)') + '">' + (ok ? ic('check', 's') : '—') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></div>';
    h += '<div class="card"><div class="card-h"><h3>감사 로그</h3><span class="muted small">삭제 불가 · 시연</span></div><div class="card-b feed">' + D.AUDIT.slice(0, 18).map(function (l) { return '<div>' + ic('shield', 's') + '<span><b>' + U.esc(l.who) + '</b> · ' + U.esc(l.act) + ' · ' + U.esc(l.target) + '<br><span class="tiny muted">' + U.esc(l.detail) + '</span></span><span class="t">' + U.dt(l.t) + '</span></div>'; }).join('') + '</div></div></div>';
    return h;
  };
  V['404'] = function () { return '<div class="empty">화면을 찾을 수 없습니다. <a data-go="#/admin">대시보드</a></div>'; };

  /* ================= 시나리오 (사무소) ================= */
  function asAdm(id) { S.admin = id; }
  A.scenario({ t: '자동 입력 → 제출 승인 → 제출', d: '변리사 검토 → 모의 전자출원 화면 자동 입력·대조 → 승인 → 접수번호', run: function () { asAdm('a_jung'); A.go('#/admin/case/C049'); A.guide('<b>검토 완료 · 자동 입력 시작</b>을 누르면 연동 PC가 모의 전자출원 화면에 입력하고 값을 다시 읽어 대조합니다.'); A.spot('[data-act=startAuto]'); } });
  A.scenario({ t: '입력값 불일치 → 멈춤 → 재처리', d: '주소 40자 잘림을 감지해 즉시 중단, 원인 확인 후 같은 버전으로 재처리', run: function () { asAdm('a_jung'); A.go('#/admin/auto/C050'); A.guide('대조 표에서 <b>불일치</b> 항목을 확인한 뒤 <b>원인 확인 · 재처리</b>를 눌러 보세요.'); A.spot('[data-act=reproc]'); } });
  A.scenario({ t: '인증창 직접 인증', d: '사무소 PC에서 담당자가 인증하면 워커가 이어서 제출', run: function () { asAdm('a_lee'); A.go('#/admin/auto/C052'); A.guide('사무장 계정입니다. <b>사무소 PC 인증 완료</b>를 누르면 제출이 이어집니다.'); A.spot('[data-act=authDone]'); } });
  A.scenario({ t: '제출 응답 끊김 → 확인 대기 판정', d: '자동 재제출·납부를 막고, 제출 내역 대조로 판정', run: function () { asAdm('a_jung'); A.go('#/admin/auto/C051'); A.guide('<b>제출 여부 판정</b>에서 「제출됨」 또는 「미제출」을 고르면 다음 처리가 달라집니다.'); A.spot('[data-act=judge]'); } });
  A.scenario({ t: '승인 대기 중 정보 변경 → 새 버전', d: '이전 위임장·승인 무효, 다시 검토·자동 입력', run: function () { asAdm('a_jung'); tab = 'info'; A.go('#/admin/case/C047'); A.guide('<b>정보 변경</b>으로 주소를 바꾸면 v2가 생기고 이전 위임장·승인은 사용할 수 없게 됩니다. 「위임장」 탭에서 버전을 확인하세요.'); A.spot('[data-act=editCase]'); } });
  A.scenario({ t: '고객 결제 ≠ 관납료 납부', d: '별도 상태 · 기한 임박 · 중복 납부 차단', run: function () { asAdm('a_lee'); A.go('#/admin/official'); A.guide('「포근달」 건의 <b>납부 기록</b>, 이미 납부된 건의 <b>중복 납부 시도</b>, 확인 대기 건의 <b>납부 보류</b>를 비교해 보세요.'); } });
  A.scenario({ t: '역할별 권한', d: '출원 담당자는 제출 승인 버튼이 잠김', run: function () { asAdm('a_han'); A.go('#/admin/auto/C047'); A.guide('출원 담당자 계정입니다. <b>제출 승인</b>은 변리사만 할 수 있어 잠겨 있습니다. 「권한 · 감사 로그」에서 역할별 권한표를 볼 수 있습니다.'); A.spot('[data-act=approve]'); } });
  A.scenario({ t: '위임장 양식 정의 · 버전', d: '칸 위치·길이 규칙을 바꾸고 새 버전으로 저장', run: function () { asAdm('a_jung'); A.go('#/admin/forms'); A.guide('주소 칸의 <b>최대 글자</b>를 줄이면 긴 주소 시험 사례가 실패합니다. 양식이 바뀌어도 기존 위임장은 당시 버전으로 재현됩니다.'); } });
  A.scenario({ t: '연동 PC 매일 화면 점검', d: '화면 변경 감지 기록 · 연결 끊김 시 작업 중단', run: function () { asAdm('a_lee'); A.go('#/admin/worker'); A.guide('<b>지금 화면 점검</b>과 <b>연결 끊김 시연</b>을 눌러 보세요. 점검은 제출·납부를 실행하지 않습니다.'); } });
})();
