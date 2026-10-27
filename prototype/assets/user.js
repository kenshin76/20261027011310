/* 온결 셀프상표 — 고객 화면: 서비스 소개 · 로그인 · 6단계 출원 신청 · 내 출원 · 등록료 결제 · 알림 */
(function () {
  'use strict';
  var D = window.DB, U = D.U, A = window.APP, S = A.S, V = A.VIEWS.cust, ACT = A.ACT, ic = A.ic;

  /* ================= 서비스 소개 ================= */
  function landing() {
    var r = D.RATE;
    var h = '';
    h += '<section class="hero"><div class="wrap in"><div>' +
      '<span class="eyebrow">당신의 브랜드를 위한 첫걸음</span>' +
      '<h1>좋은 이름의 시작,<br><em>온결과 함께</em><br>지켜 나가세요.</h1>' +
      '<p class="lead">정보를 입력하고 도장 사진만 올리면 대리인 위임장이 자동으로 만들어집니다. ' + D.OFFICE.name + ' 변리사가 검토해 특허청 출원까지 진행하고, 진행 상황은 알림톡으로 알려 드립니다.</p>' +
      '<div class="cta"><button class="btn p lg" data-act="startApply">셀프 출원 시작하기 ' + ic('arrow') + '</button><button class="btn o lg" data-act="toPrice">요금 계산해 보기</button></div>' +
      '<div class="proof"><div><b>간편한 신청</b>단계별 입력 안내</div><div><b>변리사 검토</b>출원 전 내용 확인</div><div><b>진행 알림</b>출원부터 등록까지</div></div>' +
      '</div><div class="hero-photo"><img src="assets/trademark-review-v3.webp" alt="상표 검토 화면과 표장 견본을 대조하는 업무 공간" fetchpriority="high"><div class="photo-caption"><span>YOUR NEXT CHAPTER</span><b>이름에 담긴 생각이<br>당신의 브랜드가 되도록.</b></div></div></div></section>';

    h += '<section class="sec"><div class="wrap"><div class="sec-h"><span class="k">How it works</span><h2>신청은 고객이, 출원은 변리사가</h2><p>어려운 서식 작성과 특허청 제출은 사무소가 맡습니다. 고객은 화면 안내에 따라 필요한 정보만 입력하면 됩니다.</p></div>' +
      '<div class="flow">' +
      '<div><span class="who">고객</span><span class="n">1</span><h4>출원인 · 상표 입력</h4><p>개인·법인을 고르고 상표 이름이나 로고를 올리면 특허청 규격에 맞게 자동으로 변환합니다.</p></div>' +
      '<div><span class="who">고객</span><span class="n">2</span><h4>AI로 상품류 선택</h4><p>사업을 한 문장으로 설명하면 공식 지정상품 명칭 안에서 후보를 추천하고 비용을 바로 계산합니다.</p></div>' +
      '<div><span class="who">고객</span><span class="n">3</span><h4>도장 · 결제</h4><p>도장 사진의 배경을 깔끔하게 정리해 위임장에 합성합니다. 내용을 확인한 뒤 카드·가상계좌로 결제합니다.</p></div>' +
      '<div><span class="who us">변리사</span><span class="n">4</span><h4>검토 · 특허청 출원</h4><p>변리사가 내용을 검토하고 출원서를 제출합니다. 접수·출원번호와 심사 진행을 알림톡으로 안내합니다.</p></div>' +
      '</div></div></section>';

    h += '<section class="editorial-section"><div class="wrap"><div class="editorial-story"><img src="assets/trademark-documents-v3.webp" alt="상표 표장과 출원 정보가 정리된 신청서 및 디지털 검토 화면" loading="lazy" width="1536" height="1024"><div class="editorial-copy"><span class="k">MADE TO BE YOURS</span><h2>오래 준비한 이름,<br>이제 당신의 상표로.</h2><p>브랜드에 담은 생각은 그대로.<br>복잡한 서류 준비와 출원 절차는 온결이 함께합니다.</p><button class="btn o" data-act="startApply">내 상표 준비하기 ' + ic('arrow', 's') + '</button></div></div></div></section>';

    h += '<section class="sec alt"><div class="wrap"><div class="sec-h"><span class="k">Why us</span><h2>셀프 출원의 편리함, 대리 출원의 안심</h2></div><div class="bento">' +
      '<div class="bx w4 dk"><div class="ic">' + ic('spark') + '</div><h4>상품류가 어려워도 괜찮습니다</h4><p>AI가 고객의 설명을 이해하고 공식 지정상품 명칭 목록 안에서만 후보를 고릅니다. 목록에 없는 표현은 자동으로 제외해 출원서에 그대로 쓸 수 있는 명칭만 보여 드립니다.</p></div>' +
      '<div class="bx"><div class="ic">' + ic('doc') + '</div><h4>위임장 자동 작성</h4><p>워드·한글로 쓰던 위임장을 사무소 표준 양식 그대로 자동 생성합니다.</p></div>' +
      '<div class="bx"><div class="ic">' + ic('stamp') + '</div><h4>도장 사진 그대로</h4><p>휴대폰으로 찍은 도장 사진의 배경을 정리해 날인 위치에 맞춥니다.</p></div>' +
      '<div class="bx"><div class="ic">' + ic('bell') + '</div><h4>진행 상황 알림</h4><p>결제·출원·심사·등록 단계마다 알림톡으로 알려 드립니다.</p></div>' +
      '<div class="bx"><div class="ic">' + ic('shield') + '</div><h4>개인정보는 안전하게</h4><p>출원 정보와 서류의 열람 권한을 구분하고, 확인·변경 이력을 남깁니다.</p></div>' +
      '<div class="bx w3"><div class="ic">' + ic('flag') + '</div><h4>등록까지 이어서</h4><p>등록 결정이 나면 등록료 결제부터 등록 절차까지 대리인이 이어서 진행합니다.</p></div>' +
      '<div class="bx w3 photo-benefit"><img src="assets/trademark-documents-v3.webp" alt="표장 견본과 출원 신청 정보를 확인하는 서류 준비 과정" loading="lazy"><div><h4>브랜드에 집중하세요</h4><p>복잡한 서류와 출원 절차는 온결이 함께합니다.</p></div></div>' +
      '</div></div></section>';

    h += '<section class="sec" id="price"><div class="wrap"><div class="sec-h"><span class="k">Pricing</span><h2>신청 전에 비용부터 확인하세요</h2><p>출원 비용은 특허청 관납료와 서비스 이용료로 나뉩니다. 상품류와 지정상품 수를 고르면 바로 계산됩니다.</p></div>' +
      '<div class="price"><div class="pcard"><div class="row sb wr"><b>출원 비용 계산기</b>' + A.bdg('시연용 가정 요율', 'warn', true) + '</div>' +
      '<div class="g2 mt16"><div class="fld"><label>상품류 수</label><div class="seg" id="pcCls">' + [1, 2, 3].map(function (n) { return '<button data-act="pcCls" data-n="' + n + '" class="' + (n === PC.cls ? 'on' : '') + '">' + n + '개 류</button>'; }).join('') + '</div></div>' +
      '<div class="fld"><label>류당 지정상품 수 <span class="muted" id="pcItemsV">' + PC.items + '개</span></label><input type="range" class="rng" min="1" max="20" value="' + PC.items + '" data-in="pcItems" id="pcItems"></div></div>' +
      '<div class="mt16" id="pcOut"></div></div>' +
      '<div class="pcard registration-cost"><b style="font-size:13px;opacity:.8">등록 결정 이후</b><h3>등록료 + 대리 수수료</h3><p>심사를 통과해 등록 결정이 나면 마이페이지와 알림톡으로 안내드립니다. 결제하시면 대리인이 등록 절차를 진행합니다.</p>' +
      '<div class="mt16" style="font-size:14px;line-height:2">등록 관납료 류당 <b>' + U.won(r.regOfficialPerClass) + '</b><br>대리 수수료 류당 <b>' + U.won(r.regServicePerClass) + '</b> + 부가세</div><p class="tiny mt16">' + r.note + '</p></div></div></div></section>';

    h += '<section class="sec alt"><div class="wrap" style="max-width:860px"><div class="sec-h"><span class="k">FAQ</span><h2>자주 묻는 질문</h2></div><div class="faq">' +
      faq('셀프 출원과 무엇이 다른가요?', '고객이 직접 정보를 입력하는 점은 같지만, ' + D.OFFICE.name + '가 대리인으로 지정되어 변리사가 내용을 검토하고 출원서를 제출합니다. 출원 이후 보정·의견서 등 절차도 대리인이 이어서 안내합니다.') +
      faq('도장 사진은 어디에 쓰이나요?', '대리인 위임장의 위임인 날인 위치에만 합성합니다. 원본과 변환본을 구분하고, 정리된 날인 이미지를 위임장에서 확인할 수 있습니다. 화면에 직접 서명하는 방식도 선택할 수 있습니다.') +
      faq('상품류를 잘 모르겠어요.', '사업 내용을 한두 문장으로 적어 주시면 AI가 공식 지정상품 명칭 안에서 후보를 추천합니다. 최종 선택은 고객이 하고, 변리사가 출원 전에 다시 검토합니다.') +
      faq('진행 상황은 어떻게 확인하나요?', '마이페이지에서 신청·결제·출원·심사·등록 단계를 확인할 수 있고, 단계가 바뀔 때마다 알림톡으로 안내드립니다.') +
      faq('취소하면 환불되나요?', '특허청 출원 전에는 결제 금액 전액을 취소합니다. 출원 이후에는 이미 납부한 관납료와 서비스 이용료를 구분해 환불 규정에 따라 처리합니다.') +
      '</div></div></section>';
    h += '<section class="sec"><div class="wrap"><div class="band"><div><h3>브랜드의 다음 걸음을 준비하세요</h3><p>출원할 이름과 상품·서비스를 확인하고, 변리사와 함께 신청을 시작하세요.</p></div><button class="btn w lg" data-act="startApply">셀프 출원 시작하기 ' + ic('arrow') + '</button></div></div></section>';
    A.after(function () { pcCalc(); });
    return h;
  }
  function faq(q, a) { return '<details><summary>' + q + '</summary><p>' + a + '</p></details>'; }
  var PC = { cls: 1, items: 5 };
  function pcCalc() {
    var out = document.getElementById('pcOut'); if (!out) return;
    var sel = []; for (var i = 0; i < PC.cls; i++) sel.push({ cls: 30 + i, ids: new Array(PC.items).fill('x') });
    var f = D.calcFee(sel);
    out.innerHTML = '<div class="pline"><span>특허청 관납료 (출원료)</span><b>' + U.won(f.official) + '</b></div><div class="pline"><span>서비스 이용료</span><b>' + U.won(f.service) + '</b></div><div class="pline"><span>부가세 (서비스 이용료)</span><b>' + U.won(f.vat) + '</b></div>' +
      '<div class="row sb mt12"><span class="muted">합계</span><span class="big fee-anim">' + U.won(f.total) + '</span></div>' +
      (PC.items > D.RATE.freeItems ? '<p class="hint mt8">류당 지정상품이 ' + D.RATE.freeItems + '개를 넘으면 1개당 ' + U.won(D.RATE.extraPerItem) + '이 가산됩니다.</p>' : '<p class="hint mt8">' + D.RATE.note + '</p>');
  }
  ACT.pcCls = function (el) { PC.cls = +el.getAttribute('data-n'); document.querySelectorAll('#pcCls button').forEach(function (b) { b.classList.toggle('on', b === el); }); pcCalc(); };
  ACT.pcItems = function (el) { PC.items = +el.value; document.getElementById('pcItemsV').textContent = PC.items + '개'; pcCalc(); };
  ACT.toPrice = function () { var p = document.getElementById('price'); if (p) p.scrollIntoView({ behavior: 'smooth' }); };
  ACT.startApply = function () { if (!A.cust()) { S.custReturn = '#/apply/1'; A.go('#/login'); return; } if (S.wiz) { A.go('#/apply/' + S.wiz.step); return; } newWiz(); A.go('#/apply/1'); };
  V[''] = landing;
  V.price = function () { var h = landing(); A.after(function () { setTimeout(function () { var p = document.getElementById('price'); if (p) p.scrollIntoView(); }, 30); }); return h; };

  /* ================= 출원 신청 위저드 ================= */
  var STEPS = ['출원인 정보', '상표 입력', '상품류 선택', '도장 · 서명', '내용 확인', '결제'];
  function newWiz(from) {
    var u = A.cust();
    S.wiz = {
      step: 1, max: 1, kind: '개인',
      ap: { name: u ? u.name : '', rrn1: '', rrn2: '', phone: u ? u.phone : '', verified: false, email: u ? u.email : '', address: u && u.id === 'u_kim' ? '서울특별시 마포구 성미산로 00, 2층' : '', addressDetail: '', hasCust: 'no', custNo: '', bizNo: '', crn: '', rep: '' },
      mark: { type: 'text', text: '', img: null, orig: null, conv: null },
      desc: '', ai: null, aiLoading: false, sel: {}, search: '',
      sign: { type: 'stamp', raw: null, img: null, rot: 0, th: 60, meta: null },
      agree: { poa: false, terms: false, privacy: false }, def: false,
      pay: { method: 'card' }, caseId: null
    };
    if (from) Object.keys(from).forEach(function (k) { S.wiz[k] = from[k]; });
  }
  function W() { if (!S.wiz) newWiz(); return S.wiz; }
  function selArr(w) { return Object.keys(w.sel).map(function (c) { return { cls: +c, ids: w.sel[c] }; }).filter(function (s) { return s.ids.length; }).sort(function (a, b) { return a.cls - b.cls; }); }
  function confirmationHash(w) {
    return U.hash(JSON.stringify({ kind: w.kind, applicant: w.ap, mark: { type: w.mark.type, text: w.mark.text, image: w.mark.conv && w.mark.conv.url }, goods: selArr(w), seal: w.sign.img, agent: D.OFFICE.agent, form: D.FORM.current, fee: D.calcFee(selArr(w)) }));
  }
  function wizCase(w) {
    return {
      applicant: w.kind === '법인' ? { kind: '법인', name: w.ap.name, rep: w.ap.rep, address: w.ap.address, addressDetail: w.ap.addressDetail, custNo: w.ap.hasCust === 'yes' ? w.ap.custNo : null, custNoReq: w.ap.hasCust !== 'yes' }
        : { kind: '개인', name: w.ap.name, address: w.ap.address, addressDetail: w.ap.addressDetail, custNo: w.ap.hasCust === 'yes' ? w.ap.custNo : null, custNoReq: w.ap.hasCust !== 'yes' },
      mark: { type: w.mark.type, text: w.mark.text }, sign: { img: w.sign.img }
    };
  }
  function stepValid(n, w, quiet) {
    var e = [];
    if (n === 1) {
      if (!w.ap.name.trim()) e.push(w.kind === '법인' ? '법인명을 입력해 주세요' : '성명을 입력해 주세요');
      if (w.kind === '개인') { if (!/^\d{6}$/.test(w.ap.rrn1) || !/^\d{7}$/.test(w.ap.rrn2)) e.push('주민등록번호 13자리를 입력해 주세요'); if (!w.ap.verified) e.push('휴대폰 본인인증을 완료해 주세요'); }
      else { if (!w.ap.rep.trim()) e.push('대표자 성명을 입력해 주세요'); if (!/^\d{3}-?\d{2}-?\d{5}$/.test(w.ap.bizNo)) e.push('사업자등록번호 10자리를 입력해 주세요'); if (!w.ap.verified) e.push('담당자 휴대폰 본인인증을 완료해 주세요'); }
      if (!w.ap.address.trim()) e.push('주소를 입력해 주세요');
      if (w.ap.hasCust === 'yes' && !/^\d-\d{4}-\d{6}$/.test(w.ap.custNo)) e.push('특허고객번호 형식은 4-2020-123456 입니다');
    }
    if (n === 2) {
      if (!w.mark.text.trim()) e.push('상표 명칭(문자)을 입력해 주세요');
      if (w.mark.type !== 'text' && !w.mark.conv) e.push('로고 이미지를 올려 주세요');
      if (w.mark.conv && w.mark.conv.bad) e.push(w.mark.conv.bad);
    }
    if (n === 3 && !selArr(w).length) e.push('지정상품을 1개 이상 선택해 주세요');
    if (n === 4 && !w.sign.img) e.push(w.sign.type === 'sign' ? '서명을 그려 주세요' : '도장 이미지를 올려 주세요');
    if (n === 5) {
      if (!w.agree.poa || !w.agree.terms || !w.agree.privacy) e.push('필수 동의 항목을 확인해 주세요');
      else if (w.agree.reviewHash !== confirmationHash(w)) e.push('신청 내용이나 요금이 변경되었습니다. 위임장과 비용을 다시 확인하고 동의해 주세요.');
      var errs = A.poaCheck(A.poaData(wizCase(w)));
      errs.forEach(function (x) { e.push('위임장: ' + x.msg); });
    }
    if (e.length && !quiet) A.toast(e[0], 'err');
    return !e.length;
  }

  V.apply = function (n) {
    if (!A.cust()) { S.pendingApply = true; return V.login(); }
    if (n === 'done') return wizDone();
    var w = W();
    n = Math.max(1, Math.min(6, +n || w.step));
    if (n > w.max) n = w.max;
    w.step = n;
    var body = [null, st1, st2, st3, st4, st5, st6][n](w);
    var tops = [null,
      ['STEP 1', '출원인 정보를 입력해 주세요', '출원서와 위임장에 들어갈 정보입니다. 개인·법인에 따라 필요한 항목만 묻습니다.'],
      ['STEP 2', '어떤 상표를 출원하시나요?', '문자만 쓰는 상표인지, 로고가 있는지 골라 주세요. 로고는 특허청 규격에 맞게 자동 변환합니다.'],
      ['STEP 3', '상표를 쓸 상품·서비스를 고르세요', '사업을 설명하면 AI가 공식 지정상품 명칭 안에서 후보를 추천합니다. 선택에 따라 비용이 바로 계산됩니다.'],
      ['STEP 4', '위임장에 사용할 도장·서명을 준비해 주세요', '도장 사진을 올리거나 화면에 직접 서명할 수 있습니다. 도장 사진은 배경을 정리해 날인 위치에 맞춥니다.'],
      ['STEP 5', '위임장과 신청 내용을 확인해 주세요', '아래 위임장은 사무소 표준 양식에 입력하신 정보를 합성한 미리보기입니다.'],
      ['STEP 6', '결제하고 신청을 마무리하세요', '결제가 완료되면 변리사 검토 후 특허청 출원을 진행합니다.']][n];
    var steps = '<div class="wz-steps"><div class="t">출원 신청</div>' + STEPS.map(function (s, i) {
      var k = i + 1, cls = k === n ? 'on' : k < w.max || (k < n) ? 'done' : '';
      return '<button class="wst ' + cls + '" ' + (k <= w.max ? 'data-act="wizGo" data-n="' + k + '"' : 'disabled') + '><i>' + (cls === 'done' ? '✓' : k) + '</i><span>' + s + '</span></button>';
    }).join('') + '<button class="btn sm g mt12" data-act="wizSave">' + ic('download', 's') + '중간 저장</button></div>';
    var foot = '<div class="wz-foot">' + (n > 1 ? '<button class="btn g" data-act="wizGo" data-n="' + (n - 1) + '">' + ic('back', 's') + '이전</button>' : '<button class="btn g" data-go="#/">' + ic('back', 's') + '처음으로</button>') +
      '<div class="sp">' + (n < 6 ? '<button class="btn p" data-act="wizNext" id="wizNext">다음 단계 ' + ic('arrow', 's') + '</button>' : '') + '</div></div>';
    var h = '<div class="wrap"><div class="wz">' + steps +
      '<section class="wz-panel"><div class="wz-prog"><i style="width:' + (n / 6 * 100) + '%"></i></div><div class="wz-top"><div class="k">' + tops[0] + ' / 6</div><h2>' + tops[1] + '</h2><p>' + tops[2] + '</p></div><div class="wz-body">' + body + '</div>' + foot + '</section>' +
      '<aside class="sum">' + summary(w) + '</aside></div></div>';
    return h;
  };
  function summary(w) {
    var f = D.calcFee(selArr(w));
    var mkImg = w.mark.conv ? w.mark.conv.url : (w.mark.text ? D.markSVG(w.mark.text, { size: 56 }) : null);
    var h = '<div class="card"><div class="card-b"><div class="row sb"><b>신청 요약</b><span class="tiny muted">' + (w.caseId ? '저장됨 · ' + w.caseId : '작성 중') + '</span></div>' +
      '<div class="mk mt12">' + (mkImg ? '<img src="' + mkImg + '" alt="상표 미리보기">' : '<span class="muted small">상표 미리보기</span>') + '</div>' +
      '<dl class="kv mt12" style="grid-template-columns:72px 1fr;font-size:13px"><dt>출원인</dt><dd>' + (U.esc(w.ap.name) || '<span class="muted">—</span>') + (w.kind === '법인' ? ' ' + A.bdg('법인', 'info', true) : '') + '</dd><dt>대리인</dt><dd>' + D.OFFICE.agent.title + ' ' + U.esc(D.OFFICE.agent.name) + '</dd><dt>상품류</dt><dd>' + (selArr(w).map(function (s) { return '<span class="tag">' + s.cls + '류 · ' + s.ids.length + '</span>'; }).join(' ') || '<span class="muted">—</span>') + '</dd></dl></div></div>';
    h += '<div class="card"><div class="card-b" id="feeBox">' + feeBox(f) + '</div></div>';
    h += '<div class="note info">' + ic('shield', 's') + '<span>출원에 필요한 정보만 확인합니다. 이 체험에서는 입력한 정보를 외부로 전송하지 않습니다.</span></div>';
    h += '<figure class="application-photo"><img src="assets/trademark-documents-v3.webp" alt="" loading="lazy" width="1536" height="1024"><figcaption>당신의 브랜드가 시작되는 순간,<br>온결이 함께합니다.</figcaption></figure>';
    return h;
  }
  function feeBox(f) {
    return '<b>예상 비용</b><div class="mt8"><div class="feeline"><span>관납료 (' + f.classes + '개 류)</span><span>' + U.won(f.official) + '</span></div><div class="feeline"><span>서비스 이용료</span><span>' + U.won(f.service) + '</span></div><div class="feeline"><span>부가세</span><span>' + U.won(f.vat) + '</span></div><div class="feeline tot"><span>합계</span><b class="fee-anim">' + U.won(f.total) + '</b></div></div><p class="tiny muted mt8">' + D.RATE.note + '</p>';
  }
  function refreshSummary() { var s = document.querySelector('.sum'); if (s) s.innerHTML = summary(W()); }

  ACT.wizGo = function (el) { var n = +el.getAttribute('data-n'); A.go('#/apply/' + n); };
  ACT.wizNext = function () {
    var w = W(); if (!stepValid(w.step, w)) return;
    w.max = Math.max(w.max, w.step + 1);
    A.go('#/apply/' + (w.step + 1));
  };
  ACT.wizSave = function () {
    var w = W(), previousId = w.caseId;
    w.caseId = w.caseId || ('TM-임시-' + U.pad(D.nextSeq(), 4));
    if (!A.store || !A.store.flush()) { w.caseId = previousId; A.toast('중간 저장을 완료하지 못했습니다. 저장 공간과 화면의 안내를 확인해 주세요.', 'err'); refreshSummary(); return; }
    A.toast('중간 저장했습니다. 새로고침 후에도 내 출원에서 이어서 작성할 수 있습니다', 'ok');
    refreshSummary();
  };
  function fieldSet(path, val) { var w = W(), p = path.split('.'), o = w; for (var i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p[p.length - 1]] = val; if (path === 'ap.phone' || path === 'ap.name') w.ap.verified = false; w.agree.poa = false; }
  ACT.wf = function (el) { fieldSet(el.getAttribute('data-f'), el.type === 'checkbox' ? el.checked : el.value); if (el.hasAttribute('data-sum')) refreshSummary(); if (el.hasAttribute('data-poa')) poaRefresh(); };

  /* --- STEP 1 --- */
  function st1(w) {
    var a = w.ap, isB = w.kind === '법인';
    var h = '<div class="g2"><div class="opt ' + (!isB ? 'on' : '') + '" data-act="kind" data-k="개인"><span class="oi">' + ic('user') + '</span><div><b>개인</b><span>개인 · 개인사업자 명의</span></div></div><div class="opt ' + (isB ? 'on' : '') + '" data-act="kind" data-k="법인"><span class="oi">' + ic('bank') + '</span><div><b>법인</b><span>주식회사 등 법인 명의</span></div></div></div>';
    if (!isB) {
      h += '<div class="g2"><div class="fld"><label>성명 <span class="req">*</span></label><input class="inp" data-in="wf" data-f="ap.name" data-sum value="' + U.esc(a.name) + '" placeholder="홍길동"></div>' +
        '<div class="fld"><label>주민등록번호 <span class="req">*</span></label><div class="row"><input class="inp" inputmode="numeric" maxlength="6" data-in="wf" data-f="ap.rrn1" value="' + U.esc(a.rrn1) + '" placeholder="앞 6자리"><span class="muted">-</span><input class="inp" type="password" inputmode="numeric" maxlength="7" autocomplete="off" data-in="wf" data-f="ap.rrn2" value="' + U.esc(a.rrn2) + '" placeholder="뒤 7자리"></div><span class="hint">체험용 숫자만 입력하세요. 실제 주민등록번호는 입력하지 마세요.</span></div></div>';
    } else {
      h += '<div class="g2"><div class="fld"><label>법인명 <span class="req">*</span></label><input class="inp" data-in="wf" data-f="ap.name" data-sum value="' + U.esc(a.name) + '" placeholder="주식회사 ○○"></div><div class="fld"><label>대표자 성명 <span class="req">*</span></label><input class="inp" data-in="wf" data-f="ap.rep" value="' + U.esc(a.rep) + '"></div>' +
        '<div class="fld"><label>사업자등록번호 <span class="req">*</span></label><input class="inp" data-in="wf" data-f="ap.bizNo" value="' + U.esc(a.bizNo) + '" placeholder="000-00-00000"></div><div class="fld"><label>법인등록번호</label><input class="inp" data-in="wf" data-f="ap.crn" value="' + U.esc(a.crn) + '" placeholder="000000-0000000"></div></div>';
    }
    h += '<div class="fld"><label>' + (isB ? '담당자 ' : '') + '휴대폰 본인인증 <span class="req">*</span></label><div class="row"><input class="inp" data-in="wf" data-f="ap.phone" value="' + U.esc(a.phone) + '" ' + (a.verified ? 'disabled' : '') + '>' +
      (a.verified ? '<span class="bdg ok" style="height:46px;padding:0 14px">인증 완료</span>' : '<button class="btn s" data-act="verify" style="min-height:46px">본인인증</button>') + '</div></div>';
    h += '<div class="fld"><label>주소 <span class="req">*</span></label><div class="row"><input class="inp grow" data-in="wf" data-f="ap.address" data-poa value="' + U.esc(a.address) + '" placeholder="도로명 주소"><button class="btn o" data-act="addrFind" style="min-height:46px">주소 찾기</button></div><input class="inp mt8" data-in="wf" data-f="ap.addressDetail" value="' + U.esc(a.addressDetail) + '" placeholder="상세 주소 (동·호수)"></div>';
    h += '<div class="fld"><label>특허고객번호</label><div class="seg"><button class="' + (a.hasCust === 'yes' ? 'on' : '') + '" data-act="hasCust" data-v="yes">있어요</button><button class="' + (a.hasCust !== 'yes' ? 'on' : '') + '" data-act="hasCust" data-v="no">없어요 · 모르겠어요</button></div>' +
      (a.hasCust === 'yes' ? '<input class="inp mt8" data-in="wf" data-f="ap.custNo" value="' + U.esc(a.custNo) + '" placeholder="4-2020-123456">' : '<div class="note mt8">' + ic('info', 's') + '<span>특허고객번호가 없으면 대리인이 <b>부여 신청을 함께 진행</b>합니다. 처리 절차는 사무소 실무 기준에 따라 안내드립니다.</span></div>') + '</div>';
    return h;
  }
  ACT.kind = function (el) { var w = W(); w.kind = el.getAttribute('data-k'); w.ap.verified = false; if (w.kind === '법인') { w.ap.name = ''; } else { var u = A.cust(); w.ap.name = u ? u.name : ''; } A.render(true); };
  ACT.hasCust = function (el) { W().ap.hasCust = el.getAttribute('data-v'); A.render(true); };
  ACT.addrFind = function () {
    var list = ['서울특별시 마포구 월드컵로 00, 3층', '서울특별시 강남구 테헤란로 00, 12층', '경기도 수원시 영통구 광교중앙로 00', '부산광역시 해운대구 센텀동로 00, 센텀리버뷰오피스텔 B동 1702호 (우동)'];
    var cl = A.modal({ title: '주소 찾기 (시연)', body: '<p class="muted small mb8">실제 서비스에서는 도로명 주소 검색 서비스를 연동합니다.</p><div class="col">' + list.map(function (x) { return '<button class="opt" data-addr="' + U.esc(x) + '"><span class="oi">' + ic('home') + '</span><div><b style="font-size:14px">' + U.esc(x) + '</b>' + (x.length > 40 ? '<span>긴 주소 — 위임장 칸 줄바꿈 규칙 확인용</span>' : '') + '</div></button>'; }).join('') + '</div>',
      onMount: function (bg) { bg.querySelectorAll('[data-addr]').forEach(function (b) { b.addEventListener('click', function () { W().ap.address = b.getAttribute('data-addr'); cl(); A.render(true); }); }); } });
  };
  ACT.verify = function () {
    var w = W();
    if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(w.ap.phone.trim())) { A.toast('휴대폰 번호를 확인해 주세요.', 'err'); return; }
    var cl = A.modal({ title: '휴대폰 본인인증 (시연)', body: '<p class="muted small">실제 서비스에서는 본인확인 기관의 인증창이 열립니다. 시연에서는 인증번호 <b>123456</b>을 입력하세요.</p><div class="fld mt16"><label>휴대폰 번호</label><input class="inp" value="' + U.esc(w.ap.phone) + '" disabled></div><div class="fld mt12"><label>인증번호</label><input class="inp" id="vcode" inputmode="numeric" maxlength="6" placeholder="6자리"></div>',
      foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="vOk">인증 확인</button>' });
    var ok = document.getElementById('vOk'), inp = document.getElementById('vcode');
    function done() { if (inp.value.trim() !== '123456') { A.toast('인증번호가 올바르지 않습니다 (시연: 123456)', 'err'); return; } w.ap.verified = true; cl(); A.toast('본인인증이 완료되었습니다', 'ok'); A.render(true); }
    ok.addEventListener('click', done); inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') done(); });
  };

  /* --- STEP 2 --- */
  function st2(w) {
    var m = w.mark;
    var h = '<div class="g3">' + [['text', 'type', '문자 상표', '이름·문구만 출원'], ['image', 'image', '도형 상표', '로고 그림만 출원'], ['combo', 'layers', '결합 상표', '로고 + 문자 함께']].map(function (t) {
      return '<div class="opt ' + (m.type === t[0] ? 'on' : '') + '" data-act="mtype" data-t="' + t[0] + '"><span class="oi">' + ic(t[1]) + '</span><div><b>' + t[2] + '</b><span>' + t[3] + '</span></div></div>';
    }).join('') + '</div>';
    h += '<div class="fld"><label>상표 명칭 <span class="req">*</span> <span class="muted">(' + (m.type === 'text' ? '출원할 문자 그대로' : '로고의 읽는 법 · 위임장 표기용') + ')</span></label><input class="inp" data-in="mtext" value="' + U.esc(m.text) + '" placeholder="예: 모아담" maxlength="30"></div>';
    if (m.type === 'text') {
      h += '<div class="markbox" id="mkPrev">' + (m.text ? '<img src="' + D.markSVG(m.text, { size: 60 }) + '" alt="문자 상표 미리보기">' : '<span class="muted small">입력하신 문자로 표장 이미지를 자동으로 만듭니다</span>') + '</div>';
      h += '<div class="note">' + ic('info', 's') + '<span>문자 상표는 입력한 글자로 출원합니다. 글꼴·색상이 중요하다면 「결합 상표」로 로고 이미지를 올려 주세요.</span></div>';
    } else {
      h += '<label class="drop" id="drop"><input type="file" accept="image/*" class="sr" data-ch="mfile">' + ic('upload', 'l') + '<div class="mt8"><b>로고 이미지를 끌어오거나 눌러서 선택</b></div><div class="hint">PNG · JPG · WebP, 최대 10MB · 예시 규격에 맞게 변환합니다</div></label>' +
        '<div class="row wr"><button class="btn s sm" data-act="msample">' + ic('spark', 's') + '샘플 로고로 체험하기</button><span class="hint">큰 PNG(투명 배경)를 규격 JPG로 바꾸는 과정을 확인할 수 있습니다</span></div>';
      if (m.conv) {
        h += '<div class="g2"><div class="col"><span class="lbl">고객 원본</span><div class="markbox" style="background:var(--surface-2)"><img src="' + m.orig.url + '" alt="원본"></div><div class="spec">원본 파일<b>' + m.orig.fmt + ' · ' + m.orig.w + '×' + m.orig.h + ' · ' + kb(m.orig.kb) + '</b></div></div>' +
          '<div class="col"><span class="lbl">제출용 변환본 (자동)</span><div class="markbox"><img src="' + m.conv.url + '" alt="변환본"></div><div class="spec ok">특허청 제출용<b>JPG · ' + m.conv.w + '×' + m.conv.h + ' · ' + kb(m.conv.kb) + '</b></div></div></div>';
        var sp = D.SPEC;
        var checks = [['파일 형식 ' + sp.format, true], ['긴 변 ' + sp.maxPx + 'px 이하', Math.max(m.conv.w, m.conv.h) <= sp.maxPx], ['짧은 변 ' + sp.minPx + 'px 이상', Math.min(m.conv.w, m.conv.h) >= sp.minPx], ['용량 ' + sp.maxKB + 'KB 이하', m.conv.kb <= sp.maxKB], [sp.bg + ' 처리', true]];
        h += '<div class="row wr">' + checks.map(function (c) { return A.bdg(c[0], c[1] ? 'ok' : 'danger'); }).join('') + '</div>';
        h += m.conv.bad ? '<div class="note danger">' + ic('alert', 's') + '<span>' + m.conv.bad + '</span></div>' : '<div class="note ok">' + ic('check', 's') + '<span>원본은 따로 보관하고, 제출용 변환본만 출원에 사용합니다. 그림의 모양·색은 바꾸지 않았습니다. <span class="muted">(규격 값은 시연 가정 — ' + sp.note + ')</span></span></div>';
      }
    }
    return h;
  }
  function kb(n) { return n >= 1024 ? (n / 1024).toFixed(1) + 'MB' : Math.round(n) + 'KB'; }
  var markTask = 0, sealTask = 0;
  function imageTask(w, seal) {
    var owner = S.cust, id = seal ? ++sealTask : ++markTask, type = seal ? w.sign.type : w.mark.type;
    return function () { return S.cust === owner && S.wiz === w && id === (seal ? sealTask : markTask) && type === (seal ? w.sign.type : w.mark.type); };
  }
  function imageRefresh(w) {
    if (A.store) A.store.schedule();
    var route = A.parse();
    if (S.wiz === w && route.area === 'cust' && route.name === 'apply' && route.args[0] !== 'done') A.render(true);
  }
  ACT.mtype = function (el) { markTask++; var w = W(); w.mark.type = el.getAttribute('data-t'); if (w.mark.type === 'text') { w.mark.conv = null; w.mark.orig = null; } A.render(true); };
  ACT.mtext = function (el) {
    var w = W(); w.mark.text = el.value;
    var p = document.getElementById('mkPrev');
    if (p) p.innerHTML = w.mark.text ? '<img src="' + D.markSVG(w.mark.text, { size: 60 }) + '" alt="문자 상표 미리보기">' : '<span class="muted small">입력하신 문자로 표장 이미지를 자동으로 만듭니다</span>';
    refreshSummary();
  };
  function convert(url, meta, wizard, current) {
    var im = new Image();
    im.onload = function () {
      if (!current()) return;
      var w = im.naturalWidth, h = im.naturalHeight, sp = D.SPEC;
      var sc = Math.min(1, sp.maxPx / Math.max(w, h)), cw = Math.round(w * sc), ch = Math.round(h * sc);
      var cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
      var x = cv.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, cw, ch); x.drawImage(im, 0, 0, cw, ch);
      var out = cv.toDataURL('image/jpeg', .9);
      var m = wizard.mark;
      m.orig = { url: url, w: w, h: h, kb: meta.kb, fmt: meta.fmt };
      m.conv = { url: out, w: cw, h: ch, kb: Math.round(out.length * .75 / 1024) };
      if (Math.min(cw, ch) < sp.minPx) m.conv.bad = '이미지 해상도가 낮습니다(짧은 변 ' + Math.min(cw, ch) + 'px). 더 선명한 원본을 올려 주세요.';
      if (m.conv.kb > sp.maxKB) m.conv.bad = '변환한 이미지가 최대 용량(' + sp.maxKB + 'KB)을 넘습니다. 용량이 작은 원본을 선택해 주세요.';
      if (!m.text) m.text = meta.name || '';
      imageRefresh(wizard);
      A.toast(m.conv.bad || '예시 제출 규격의 JPG로 변환했습니다', m.conv.bad ? 'warn' : 'ok');
    };
    im.onerror = function () { if (current()) A.toast('이미지를 읽지 못했습니다. 정상적인 PNG·JPG·WebP 파일을 다시 선택해 주세요.', 'err'); };
    im.src = url;
  }
  ACT.mfile = function (el) {
    var f = el.files && el.files[0]; if (!f) return;
    if (!/^image\/(png|jpeg|webp)$/.test(f.type) || f.size > 10 * 1024 * 1024) { A.toast('10MB 이하의 PNG·JPG·WebP 파일을 선택해 주세요', 'err'); return; }
    var wizard = W(), current = imageTask(wizard, false), rd = new FileReader();
    rd.onload = function () { if (current()) convert(rd.result, { kb: f.size / 1024, fmt: (f.type.split('/')[1] || 'IMG').toUpperCase().replace('JPEG', 'JPG') }, wizard, current); };
    rd.onerror = function () { if (current()) A.toast('파일을 읽지 못했습니다. 이미지를 다시 선택해 주세요.', 'err'); };
    rd.readAsDataURL(f);
  };
  ACT.msample = function () {
    var cv = document.createElement('canvas'); cv.width = 2400; cv.height = 1200;
    var x = cv.getContext('2d');
    var g = x.createLinearGradient(0, 0, 1000, 1000); g.addColorStop(0, '#3D5AFE'); g.addColorStop(1, '#00B894');
    x.fillStyle = g; x.beginPath(); x.arc(560, 600, 360, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.moveTo(420, 760); x.quadraticCurveTo(560, 330, 760, 470); x.quadraticCurveTo(640, 640, 420, 760); x.fill();
    x.fillStyle = '#121845'; x.font = '900 330px Pretendard, sans-serif'; x.textBaseline = 'middle'; x.fillText('LEAFO', 1000, 620);
    var url = cv.toDataURL('image/png');
    var w = W(); if (!w.mark.text) w.mark.text = 'LEAFO';
    convert(url, { kb: url.length * .75 / 1024, fmt: 'PNG', name: 'LEAFO' }, w, imageTask(w, false));
  };

  /* --- STEP 3 --- */
  function st3(w) {
    var h = '<div class="ai-box"><div class="ai-h"><span class="spark">' + ic('spark') + '</span>AI 상품류 추천<span class="bdg brand nodot" style="margin-left:auto">공식 명칭 안에서만 추천</span></div>' +
      '<div class="fld mt12"><textarea class="ta" data-in="wdesc" placeholder="예: 동네에서 베이커리 카페를 열고 직접 구운 빵과 케이크를 매장과 온라인으로 판매해요" maxlength="300">' + U.esc(w.desc) + '</textarea></div>' +
      '<div class="row sb wr mt12"><div class="row wr">' + ['베이커리 카페에서 빵과 케이크, 커피를 팔아요', '비건 화장품과 수제 비누를 온라인 쇼핑몰에서 판매', '반려견 산책용품과 강아지 미용실 운영', '초등학생 대상 온라인 코딩 교육 앱'].map(function (s) { return '<button class="chip" data-act="descEx" data-v="' + U.esc(s) + '">' + U.esc(s.length > 16 ? s.slice(0, 15) + '…' : s) + '</button>'; }).join('') + '</div>' +
      '<button class="btn p" data-act="aiRun" id="aiRun">' + ic('spark', 's') + 'AI 추천 받기</button></div></div>';
    if (w.aiLoading) h += '<div class="ai-think">' + '<i></i><i></i><i></i>공식 지정상품 명칭 목록에서 후보를 찾는 중…</div>';
    if (w.ai) {
      if (w.ai.masked) h += '<div class="note warn">' + ic('shield', 's') + '<span>설명에 개인정보로 보이는 내용이 있어 <b>가린 뒤</b> 추천에 사용했습니다.</span></div>';
      if (!w.ai.groups.length) h += '<div class="note">' + ic('info', 's') + '<span>추천할 명칭을 찾지 못했습니다. 판매하는 상품이나 제공하는 서비스를 조금 더 구체적으로 적어 주세요.</span></div>';
      else h += '<div class="row sb wr"><b>추천 결과 · ' + w.ai.reason + '</b><span class="hint">눌러서 선택 · 다시 누르면 해제</span></div>';
      w.ai.groups.forEach(function (g) { h += clsBlock(g.cls, g.items, w); });
      if (w.ai.excluded.length) h += '<div class="col"><span class="lbl">공식 명칭 목록에 없어 제외한 표현</span>' + w.ai.excluded.map(function (x) { return '<div class="xout">' + ic('x', 's') + '<s>' + U.esc(x) + '</s><span>— 목록 ID와 대조되지 않아 후보에서 제외</span></div>'; }).join('') + '</div>';
    }
    h += '<div class="fld"><label>직접 찾기</label><input class="inp" data-in="gsearch" value="' + U.esc(w.search) + '" placeholder="명칭으로 검색 (예: 티셔츠, 카페, 소프트웨어)"></div><div id="gres">' + gResults(w) + '</div>';
    var sel = selArr(w);
    h += '<div class="card"><div class="card-h"><h3>선택한 지정상품</h3><span class="muted small">' + sel.length + '개 류 · ' + sel.reduce(function (a, s) { return a + s.ids.length; }, 0) + '개</span></div><div class="card-b col" id="selList">' + selList(w) + '</div></div>';
    h += '<div class="note">' + ic('info', 's') + '<span>추천은 선택을 돕는 자료입니다. 최종 출원 내용은 고객님의 확인과 <b>변리사 검토</b>를 거칩니다. 류마다 관납료가 붙고, 류당 지정상품이 ' + D.RATE.freeItems + '개를 넘으면 가산됩니다.</span></div>';
    return h;
  }
  function clsBlock(cls, items, w) {
    var on = w.sel[cls] || [];
    return '<div class="cls"><div class="cls-h"><span class="no">' + cls + '류</span>' + D.CLASS[cls] + '</div><div class="cls-b">' + items.map(function (it) {
      var f = it.fit ? '<span class="fit ' + (it.fit === '높음' ? '' : it.fit === '보통' ? 'm' : 'l') + '">' + it.fit + '</span>' : '';
      return '<button class="gi ' + (on.indexOf(it.id) >= 0 ? 'on' : '') + '" data-act="gpick" data-id="' + it.id + '">' + (on.indexOf(it.id) >= 0 ? ic('check', 's') : ic('plus', 's')) + it.name + f + '<span class="id">' + it.id + '</span></button>';
    }).join('') + '</div></div>';
  }
  function gResults(w) {
    var q = w.search.trim(); if (!q) return '';
    var list = D.G.filter(function (g) { return g.name.indexOf(q) >= 0 || g.kw.some(function (k) { return k.indexOf(q) >= 0; }); }).slice(0, 12);
    if (!list.length) return '<p class="hint">「' + U.esc(q) + '」와 일치하는 공식 명칭이 없습니다.</p>';
    var by = {}; list.forEach(function (g) { (by[g.cls] = by[g.cls] || []).push({ id: g.id, name: g.name }); });
    return Object.keys(by).map(function (c) { return clsBlock(+c, by[c], w); }).join('');
  }
  function selList(w) {
    var sel = selArr(w);
    if (!sel.length) return '<p class="muted small">아직 선택한 지정상품이 없습니다.</p>';
    return sel.map(function (s) {
      var extra = Math.max(0, s.ids.length - D.RATE.freeItems);
      return '<div class="row top"><span class="tag">' + s.cls + '류</span><div class="grow small">' + s.ids.map(function (id) { return D.GMAP[id].name; }).join(', ') + (extra ? '<div class="hint err">' + D.RATE.freeItems + '개 초과 ' + extra + '개 · 가산 ' + U.won(extra * D.RATE.extraPerItem) + '</div>' : '') + '</div><button class="btn sm g" data-act="gcls" data-c="' + s.cls + '" aria-label="' + s.cls + '류 지정상품 전체 삭제" title="' + s.cls + '류 지정상품 전체 삭제">' + ic('trash', 's') + '</button></div>';
    }).join('');
  }
  ACT.wdesc = function (el) { W().desc = el.value; };
  ACT.descEx = function (el) { var w = W(); w.desc = el.getAttribute('data-v'); var t = document.querySelector('[data-in="wdesc"]'); if (t) t.value = w.desc; };
  ACT.aiRun = function () {
    var w = W(); if (!w.desc.trim()) { A.toast('사업 내용을 한두 문장으로 적어 주세요', 'err'); return; }
    var raw = w.desc, masked = raw.replace(/\d{6}-?\d{7}/g, '******-*******').replace(/01\d-?\d{3,4}-?\d{4}/g, '010-****-****');
    w.aiLoading = true; w.ai = null; A.render(true);
    A.onLeave(function () { w.aiLoading = false; });
    A.later(1300, function () {
      w.aiLoading = false; w.ai = D.aiSuggest(masked); w.ai.masked = masked !== raw;
      w.ai.groups.forEach(function (g) { g.items.forEach(function (it) { if (it.fit === '높음') { w.sel[g.cls] = w.sel[g.cls] || []; if (w.sel[g.cls].indexOf(it.id) < 0) w.sel[g.cls].push(it.id); } }); });
      A.render(true); A.toast('적합도 「높음」 후보를 먼저 선택해 두었습니다. 필요한 것만 남겨 주세요');
    });
  };
  ACT.gpick = function (el) {
    var w = W(), id = el.getAttribute('data-id'), g = D.GMAP[id];
    var arr = w.sel[g.cls] = w.sel[g.cls] || [];
    var i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1); else arr.push(id);
    if (!arr.length) delete w.sel[g.cls];
    var y = window.scrollY; A.render(true); window.scrollTo(0, y);
  };
  ACT.gcls = function (el) { delete W().sel[el.getAttribute('data-c')]; A.render(true); };
  ACT.gsearch = function (el) { var w = W(); w.search = el.value; var r = document.getElementById('gres'); if (r) r.innerHTML = gResults(w); };

  /* --- STEP 4 --- */
  function st4(w) {
    var s = w.sign, isB = w.kind === '법인';
    if (s.type === 'stamp' && s.raw && !s.img) A.after(function () { stampRun(); });
    var h = '<div class="seg"><button class="' + (s.type === 'stamp' ? 'on' : '') + '" data-act="stype" data-t="stamp">' + (isB ? '법인 인감 이미지' : '도장 이미지') + '</button><button class="' + (s.type === 'sign' ? 'on' : '') + '" data-act="stype" data-t="sign">화면에 서명</button></div>';
    if (s.type === 'stamp') {
      h += '<label class="drop"><input type="file" accept="image/*" class="sr" data-ch="sfile">' + ic('stamp', 'l') + '<div class="mt8"><b>도장 사진을 올려 주세요</b></div><div class="hint">흰 종이에 찍어 휴대폰으로 촬영해도 됩니다</div></label>' +
        '<div class="row wr"><button class="btn s sm" data-act="ssample">' + ic('spark', 's') + '샘플 도장 사진으로 체험하기</button><span class="hint">누런 종이·잡티가 있는 사진의 배경을 정리하는 과정을 볼 수 있습니다</span></div>';
      if (s.raw) {
        h += '<div class="stamp-wrap"><div class="stamp-pane"><span class="lbl">고객 원본 (별도 보관)</span><div class="cv mt8"><img src="' + s.raw + '" alt="도장 원본"></div></div>' +
          '<div class="stamp-pane"><span class="lbl">배경 정리 · 날인용</span><div class="cv chk mt8" id="stOut">' + (s.img ? '<img src="' + s.img + '" alt="정리된 도장">' : '<span class="ai-think"><i></i><i></i><i></i>처리 중</span>') + '</div></div></div>' +
          '<div class="g2"><div class="fld"><label>기울기 보정 <span class="muted" id="rotV">' + s.rot + '°</span></label><input type="range" class="rng" min="-30" max="30" value="' + s.rot + '" data-ch="srot" data-in="srotV"></div>' +
          '<div class="fld"><label>배경 정리 강도 <span class="muted" id="thV">' + s.th + '</span></label><input type="range" class="rng" min="25" max="120" value="' + s.th + '" data-ch="sth" data-in="sthV"></div></div>' +
          (s.meta ? '<div class="note ok">' + ic('check', 's') + '<span>배경을 투명하게 정리하고 도장 영역(' + s.meta.kept + 'px)만 남겼습니다. 도장의 모양과 글자는 바꾸지 않습니다.</span></div>' : '');
      }
    } else {
      h += '<div class="stamp-pane"><div class="row sb"><span class="lbl">아래 칸에 서명해 주세요</span><button class="btn sm g" data-act="sclear">' + ic('refresh', 's') + '지우기</button></div><canvas class="sigpad mt8" id="sigpad"></canvas></div>' +
        '<div class="note">' + ic('info', 's') + '<span>화면 서명 허용 여부와 법인 날인 방식은 사무소 실무·제출 요건에 맞춰 확정합니다.</span></div>';
      A.after(sigInit);
    }
    if (s.img) h += '<div class="col"><span class="lbl">위임장 날인 위치 미리보기</span><div class="poa-wrap" style="max-height:340px">' + A.poaHTML(A.poaData(wizCase(w)), { id: 'poaMini' }) + '</div></div>';
    return h;
  }
  function startStamp(w) {
    var route = A.parse();
    if (route.area === 'cust' && route.name === 'apply' && w.step === 4) imageRefresh(w);
    else stampRun();
  }
  function stampRun() {
    var w = W(), s = w.sign, current = imageTask(w, true);
    A.cleanStamp(s.raw, { rot: s.rot, th: s.th }, function (url, meta) {
      if (!current()) return;
      if (!url) { A.toast('도장 영역을 읽지 못했습니다. 붉은 인주가 선명한 사진을 다시 선택해 주세요.', 'err'); s.img = null; s.raw = null; s.meta = null; imageRefresh(w); return; }
      s.img = url; s.meta = meta;
      imageRefresh(w);
    });
  }
  ACT.stype = function (el) { sealTask++; var s = W().sign; s.type = el.getAttribute('data-t'); s.img = null; s.raw = null; s.meta = null; A.render(true); };
  ACT.sfile = function (el) { var f = el.files && el.files[0]; if (!f) return; if (!/^image\/(png|jpeg|webp)$/.test(f.type) || f.size > 10 * 1024 * 1024) { A.toast('10MB 이하의 PNG·JPG·WebP 도장 사진을 선택해 주세요', 'err'); return; } var w = W(), current = imageTask(w, true), rd = new FileReader(); rd.onload = function () { if (!current()) return; w.sign.raw = rd.result; w.sign.img = null; startStamp(w); }; rd.onerror = function () { if (current()) A.toast('도장 파일을 읽지 못했습니다. 사진을 다시 선택해 주세요.', 'err'); }; rd.readAsDataURL(f); };
  ACT.ssample = function () { var w = W(); w.sign.raw = A.sampleStamp(w.kind === '법인' ? '법인인감' : w.ap.name || '홍길동'); w.sign.img = null; startStamp(w); };
  ACT.srotV = function (el) { document.getElementById('rotV').textContent = el.value + '°'; };
  ACT.sthV = function (el) { document.getElementById('thV').textContent = el.value; };
  ACT.srot = function (el) { W().sign.rot = +el.value; stampRun(); };
  ACT.sth = function (el) { W().sign.th = +el.value; stampRun(); };
  function sigInit() {
    var cv = document.getElementById('sigpad'); if (!cv) return;
    var r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    cv.width = r.width * dpr; cv.height = r.height * dpr;
    var x = cv.getContext('2d'); x.scale(dpr, dpr); x.lineWidth = 3; x.lineCap = 'round'; x.lineJoin = 'round'; x.strokeStyle = '#0B1240';
    if (W().sign.img) { var saved = new Image(); saved.onload = function () { x.drawImage(saved, 0, 0, r.width, r.height); }; saved.src = W().sign.img; }
    var down = false, last = null, drew = false;
    function pt(e) { var b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }
    cv.addEventListener('pointerdown', function (e) { down = true; last = pt(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', function (e) { if (!down) return; var p = pt(e); x.beginPath(); x.moveTo(last.x, last.y); x.lineTo(p.x, p.y); x.stroke(); last = p; drew = true; });
    function end() { if (!down) return; down = false; if (drew) { W().sign.img = cv.toDataURL('image/png'); var m = document.getElementById('poaMini'); if (!m) { var y = window.scrollY; A.render(true); window.scrollTo(0, y); } else poaRefresh(); } }
    cv.addEventListener('pointerup', end); cv.addEventListener('pointerleave', end);
  }
  ACT.sclear = function () { W().sign.img = null; A.render(true); };

  /* --- STEP 5 --- */
  function st5(w) {
    if (w.agree.reviewHash && w.agree.reviewHash !== confirmationHash(w)) { w.agree.poa = false; w.agree.reviewHash = null; }
    var wc = wizCase(w), data = A.poaData(wc), errs = A.poaCheck(data), f = D.calcFee(selArr(w));
    var h = '<div class="row sb wr"><div class="row"><b>위임장 미리보기</b>' + A.bdg('사무소 표준 양식 ' + D.FORM.current, 'brand', true) + '</div><label class="chk" style="font-size:13px"><input type="checkbox" data-ch="wdef"' + (w.def ? ' checked' : '') + '> 양식 정의(칸 위치) 보기</label></div>';
    h += '<div class="poa-wrap" id="poaHost">' + A.poaHTML(data, { def: w.def, errs: errs }) + '</div>';
    h += errs.length ? '<div class="note danger" id="poaErr">' + ic('alert', 's') + '<span>' + errs.map(function (e) { return e.msg; }).join('<br>') + ' — 수정 전에는 위임장을 만들지 않습니다. <a data-go="#/apply/1">출원인 정보로 이동</a></span></div>'
      : '<div class="note ok" id="poaErr">' + ic('check', 's') + '<span>필수 항목과 길이 규칙을 확인했습니다. 결제 후 입력값·양식 버전·확인값을 기록하며, 위임장 보기에서 인쇄 기능으로 PDF를 저장할 수 있습니다.</span></div>';
    h += '<div class="card"><div class="card-h"><h3>신청 내용</h3><button class="btn sm g" data-act="wizGo" data-n="1">' + ic('edit', 's') + '수정</button></div><div class="card-b"><dl class="kv">' +
      '<dt>출원인</dt><dd>' + U.esc(w.ap.name) + ' (' + w.kind + ')' + (w.kind === '개인' ? ' · ' + U.esc(w.ap.rrn1) + '-' + (w.ap.rrn2 ? w.ap.rrn2[0] : '') + '******' : '') + '</dd>' +
      '<dt>주소</dt><dd>' + U.esc((w.ap.address + ' ' + w.ap.addressDetail).trim()) + '</dd>' +
      '<dt>특허고객번호</dt><dd>' + (w.ap.hasCust === 'yes' ? U.esc(w.ap.custNo) : '없음 · 대리인이 부여 신청 진행') + '</dd>' +
      '<dt>상표</dt><dd>' + U.esc(w.mark.text) + ' · ' + { text: '문자', image: '도형', combo: '결합' }[w.mark.type] + ' 상표</dd>' +
      '<dt>지정상품</dt><dd>' + selArr(w).map(function (s) { return '<b>' + s.cls + '류</b> ' + s.ids.map(function (id) { return D.GMAP[id].name; }).join(', '); }).join('<br>') + '</dd>' +
      '<dt>대리인</dt><dd>' + D.OFFICE.agent.title + ' ' + U.esc(D.OFFICE.agent.name) + ' (' + D.OFFICE.name + ')</dd>' +
      '<dt>결제 금액</dt><dd><b>' + U.won(f.total) + '</b> <span class="muted small">관납료 ' + U.won(f.official) + ' · 서비스 이용료 ' + U.won(f.service + f.vat) + '</span></dd></dl></div></div>';
    h += '<div class="col"><label class="chk"><input type="checkbox" data-ch="agree" data-k="poa"' + (w.agree.poa ? ' checked' : '') + '> <span>[필수] 위 위임장의 내용을 확인했으며, ' + D.OFFICE.name + ' 변리사를 대리인으로 선임하는 데 동의합니다.</span></label>' +
      '<label class="chk"><input type="checkbox" data-ch="agree" data-k="terms"' + (w.agree.terms ? ' checked' : '') + '> <span>[필수] 서비스 이용약관 및 환불 규정에 동의합니다.</span></label>' +
      '<label class="chk"><input type="checkbox" data-ch="agree" data-k="privacy"' + (w.agree.privacy ? ' checked' : '') + '> <span>[필수] 출원 절차 진행을 위한 개인정보(고유식별정보 포함) 수집·이용에 동의합니다. <span class="muted">보관 기간과 파기 시점은 처리방침에 따릅니다.</span></span></label>' +
      '<button class="btn sm g" style="align-self:flex-start" data-act="agreeAll">' + ic('check', 's') + '전체 동의</button></div>';
    return h;
  }
  function poaRefresh() {
    var w = W(), host = document.getElementById('poaHost'), mini = document.getElementById('poaMini');
    var data = A.poaData(wizCase(w));
    if (host) host.innerHTML = A.poaHTML(data, { def: w.def, errs: A.poaCheck(data) });
    if (mini) mini.outerHTML = A.poaHTML(data, { id: 'poaMini' });
  }
  ACT.wdef = function (el) { W().def = el.checked; poaRefresh(); };
  ACT.agree = function (el) { var w = W(), key = el.getAttribute('data-k'); w.agree[key] = el.checked; if (key === 'poa') w.agree.reviewHash = el.checked ? confirmationHash(w) : null; };
  ACT.agreeAll = function () { var w = W(), a = w.agree; a.poa = a.terms = a.privacy = true; a.reviewHash = confirmationHash(w); A.render(true); };

  /* --- STEP 6 --- */
  function st6(w) {
    var f = D.calcFee(selArr(w)), m = w.pay.method;
    var h = '<div class="paybox"><div class="opt ' + (m === 'card' ? 'on' : '') + '" data-act="pmethod" data-m="card"><span class="oi">' + ic('card') + '</span><div><b>신용·체크카드</b><span>바로 결제 · 즉시 검토 시작</span></div></div><div class="opt ' + (m === 'vbank' ? 'on' : '') + '" data-act="pmethod" data-m="vbank"><span class="oi">' + ic('bank') + '</span><div><b>무통장입금 (가상계좌)</b><span>계좌 발급 후 입금 확인 시 진행</span></div></div></div>';
    h += '<div class="card"><div class="card-b">' + feeBox(f) + '</div></div>';
    h += '<div class="note">' + ic('info', 's') + '<span>결제 전에 선택한 항목으로 금액을 다시 계산합니다. <b>고객 결제</b>와 사무소의 <b>특허청 관납료 납부</b>는 별도로 관리되며, 납부 내역은 마이페이지에서 확인할 수 있습니다.</span></div>';
    h += '<button class="btn p lg blk" data-act="pay">' + ic('lock', 's') + U.won(f.total) + ' ' + (m === 'card' ? '결제하기' : '가상계좌 발급받기') + '</button>';
    return h;
  }
  ACT.pmethod = function (el) { W().pay.method = el.getAttribute('data-m'); A.render(true); };
  ACT.pay = function () {
    var w = W();
    for (var i = 1; i <= 5; i++) if (!stepValid(i, w)) { A.go('#/apply/' + i); return; }
    var f = D.calcFee(selArr(w));
    if (w.pay.method === 'card') {
      var cl = A.modal({ title: '결제 (시연용 결제창)', body: '<div class="note warn">' + ic('info', 's') + '<span>실제 서비스에서는 PG사 결제창이 열립니다. 시연에서는 카드 정보를 받지 않습니다.</span></div><div class="pline mt16"><span>결제 금액</span><b>' + U.won(f.total) + '</b></div><div class="pline"><span>상품명</span><span>상표 출원 「' + U.esc(w.mark.text) + '」</span></div>',
        foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="pgOk">' + ic('check', 's') + '결제 승인 (시연)</button>' });
      document.getElementById('pgOk').addEventListener('click', function () { cl(); finishApply('paid'); });
    } else finishApply('wait_deposit');
  };
  function finishApply(stage) {
    var w = W(), u = A.cust(), seqn = D.nextSeq();
    var wc = wizCase(w);
    var ap = wc.applicant;
    ap.rrn = w.kind === '개인' ? w.ap.rrn1 + '-' + w.ap.rrn2[0] + '******' : null;
    ap.phone = w.ap.phone; ap.email = w.ap.email;
    if (w.kind === '법인') { ap.bizNo = w.ap.bizNo; ap.crn = w.ap.crn ? w.ap.crn.slice(0, 6) + '-*******' : ''; }
    var c = D.mkCase({
      id: 'C' + seqn, seq: seqn, owner: u.id, created: Date.now(), stage: stage, applicant: ap,
      mark: { type: w.mark.type, text: w.mark.text, img: w.mark.conv ? w.mark.conv.url : D.markSVG(w.mark.text, { size: 58 }), spec: w.mark.conv ? { orig: w.mark.orig.fmt + ' ' + w.mark.orig.w + '×' + w.mark.orig.h + ' · ' + kb(w.mark.orig.kb), conv: 'JPG ' + w.mark.conv.w + '×' + w.mark.conv.h + ' · ' + kb(w.mark.conv.kb) } : { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 자동' } },
      goods: selArr(w), desc: w.desc,
      pay: stage === 'paid' ? { method: 'card', status: 'paid', tx: 'PG-' + U.hash('n' + seqn + Date.now()).slice(0, 10).toUpperCase(), at: Date.now() } : { method: 'vbank', status: 'wait', tx: null, at: null, vbank: { bank: '시연은행', acct: '000-0000-' + U.pad(seqn * 37 % 10000, 4) + '-' + U.pad(seqn % 100), due: D.after(2) } }
    });
    c.ai = w.ai ? { query: w.ai.query, picked: [].concat.apply([], selArr(w).map(function (s) { return s.ids; })), excluded: w.ai.excluded, at: w.ai.at } : null;
    c.sign = { type: w.sign.type, img: w.sign.img, raw: w.sign.raw, gen: false };
    D.hist(c, Date.now() - 6e5, ap.name, '출원 신청서 작성 시작');
    if (w.ai) D.hist(c, Date.now() - 4e5, '시스템', 'AI 상품류 추천 ' + w.ai.groups.reduce(function (a, g) { return a + g.items.length; }, 0) + '건 · 목록 밖 표현 ' + w.ai.excluded.length + '건 제외');
    D.hist(c, Date.now() - 6e4, ap.name, '위임장 미리보기 확인 · 필수 동의 3건');
    if (stage === 'paid') {
      D.hist(c, Date.now(), 'PG', '카드 결제 승인 · 신청 금액 재계산 일치 (' + U.won(c.fee.total) + ')');
      c.poa = { formVer: D.FORM.current, hash: U.hash(JSON.stringify(A.poaData(c)) + c.id), at: Date.now() };
      D.hist(c, Date.now() + 1, '시스템', '위임장 PDF 생성 (양식 ' + D.FORM.current + ' · 해시 ' + U.short(c.poa.hash) + ')');
      D.alert(c, Date.now(), '결제 완료', '상표 「' + c.mark.text + '」 출원 신청과 결제가 완료되었습니다. 변리사 검토 후 출원을 진행합니다.');
      D.AUDIT.unshift({ t: Date.now(), who: ap.name, act: '신청 · 결제', target: c.no, detail: '카드 ' + U.won(c.fee.total) });
    } else {
      D.hist(c, Date.now(), '시스템', '가상계좌 발급 (' + c.pay.vbank.bank + ' ' + c.pay.vbank.acct + ')');
      D.alert(c, Date.now(), '가상계좌 안내', '입금 기한 ' + U.date(c.pay.vbank.due) + ' 18:00 · 금액 ' + U.won(c.fee.total));
    }
    A.capturePoa(c);
    D.CASES.unshift(c);
    u.fresh = false; S.lastCase = c.id; S.wiz = null;
    A.go('#/apply/done');
  }
  function wizDone() {
    var c = D.find(S.lastCase);
    if (!c || !A.cust() || c.owner !== A.cust().id) return '<div class="wrap"><div class="empty">확인할 신청 내역이 없습니다. <a data-go="#/my">내 출원으로 이동</a></div></div>';
    var vb = c.stage === 'wait_deposit';
    var h = '<div class="wrap" style="max-width:760px;padding:30px 0 80px"><div class="card pad"><div class="done-hero"><div class="ok">' + ic('check') + '</div><h1 style="font-size:28px">' + (vb ? '가상계좌가 발급되었습니다' : '출원 신청이 완료되었습니다') + '</h1><p class="muted mt8">신청번호 <b class="mono">' + c.no + '</b> · 상표 「' + U.esc(c.mark.text) + '」</p></div>';
    if (vb) h += '<div class="vacct mt16"><span class="muted small">입금 계좌 (' + c.pay.vbank.bank + ')</span><div class="acct">' + c.pay.vbank.acct + '</div><div class="row sb wr"><span>입금 금액 <b>' + U.won(c.fee.total) + '</b></span><span class="muted small">입금 기한 ' + U.dt(c.pay.vbank.due) + '</span></div><button class="btn s sm mt12" data-act="deposit" data-id="' + c.id + '">' + ic('bank', 's') + '입금 완료 통지 받기 (시연)</button></div>';
    h += '<div class="mt24"><b>다음 진행</b><div class="tl mt12">' + [['결제 ' + (vb ? '확인' : '완료'), vb ? '입금 통지를 받으면 자동으로 진행합니다' : '결제 금액 대조 완료', !vb], ['위임장 PDF 생성', vb ? '입금 확인 후 생성' : '양식 ' + D.FORM.current + ' · 해시 ' + U.short(c.poa && c.poa.hash), !vb], ['변리사 검토', '신청 내용과 위임장을 변리사가 검토합니다', false], ['특허청 출원', '출원서 제출 후 접수번호를 알림톡으로 안내합니다', false]].map(function (x, i) {
      return '<div class="tl-i ' + (x[2] ? 'done' : i === (vb ? 0 : 2) ? 'cur' : '') + '"><span class="d">' + (x[2] ? '✓' : i + 1) + '</span><div><b>' + x[0] + '</b><span>' + x[1] + '</span></div></div>';
    }).join('') + '</div></div>';
    h += '<div class="row wr mt16"><button class="btn p" data-go="#/case/' + c.id + '">내 출원에서 보기 ' + ic('arrow', 's') + '</button>' + (c.poa ? '<button class="btn o" data-act="viewPoa" data-id="' + c.id + '">' + ic('doc', 's') + '위임장 보기</button>' : '') + '</div></div></div>';
    return h;
  }
  ACT.deposit = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    if (c.stage !== 'wait_deposit') { A.toast('이미 입금이 확인된 건입니다 — 같은 통지는 한 번만 반영합니다', 'warn'); return; }
    c.pay.status = 'paid'; c.pay.at = Date.now(); c.pay.tx = 'PG-VB' + c.id; c.stage = 'paid';
    c.poa = { formVer: D.FORM.current, hash: U.hash(JSON.stringify(A.poaData(c)) + c.id), at: Date.now() };
    A.capturePoa(c);
    D.hist(c, Date.now(), 'PG', '가상계좌 입금 통지 수신 · 금액 대조 일치 (' + U.won(c.fee.total) + ')');
    D.hist(c, Date.now() + 1, '시스템', '위임장 PDF 생성 (양식 ' + D.FORM.current + ' · 해시 ' + U.short(c.poa.hash) + ')');
    D.alert(c, Date.now(), '입금 확인', '입금이 확인되었습니다. 변리사 검토 후 출원을 진행합니다.');
    A.toast('입금 통지를 받아 결제 완료로 바뀌었습니다', 'ok');
    A.render(true);
  };
  ACT.viewPoa = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    if (!c || !c.poa || (!A.admin() && (!A.cust() || c.owner !== A.cust().id))) { A.toast('이 위임장을 열람할 권한이 없습니다', 'warn'); return; }
    A.modal({ title: '위임장 PDF', wide: true, body: '<div class="row sb wr mb8"><span class="small muted">양식 ' + c.poa.formVer + ' · 생성 ' + U.dt(c.poa.at) + ' · 해시 <span class="mono">' + U.short(c.poa.hash) + '</span></span></div><div class="poa-wrap">' + A.poaHTML(A.poaData(c, { date: c.poa.at }), { hash: c.poa.hash, ver: c.poa.formVer }) + '</div>',
      foot: '<button class="btn g" data-close>닫기</button><button class="btn o" onclick="window.print()">' + ic('print', 's') + 'PDF로 저장 (인쇄)</button>' });
  };
  // 시드 건의 도장 이미지 미리 만들기 (배경 정리까지 실제로 실행)
  function prepSeeds() {
    D.CASES.forEach(function (c) {
      if (c.sign.img || !c.sign.gen || c.stage === 'draft') return;
      A.cleanStamp(A.sampleStamp(c.applicant.kind === '법인' ? '법인인감' : c.applicant.name), { rot: 0, th: 60 }, function (url) { c.sign.img = url; if (c.poa && c.poa.data) { c.poa.data.seal = url; var v = c.versions.filter(function (x) { return x.v === c.ver; })[0]; if (v && v.poa) v.poa.data.seal = url; } if (A.store) A.store.schedule(); });
    });
  }
  setTimeout(prepSeeds, 50);

  /* ================= 내 출원 ================= */
  function myCases() { var u = A.cust(); return D.CASES.filter(function (c) { return u && c.owner === u.id; }); }
  V.my = function () {
    var u = A.cust(); if (!u) return V.login();
    var list = myCases();
    var draft = S.wiz && S.wiz.caseId;
    var h = '<div class="wrap" style="padding-bottom:80px"><div class="account-cover"><div class="mp-head row sb wr"><div><span class="muted small">' + U.esc(u.name) + '님의</span><h1>내 출원</h1></div><button class="btn p" data-act="startApply">' + ic('plus', 's') + '새 상표 출원</button></div><img src="assets/trademark-review-v3.webp" alt="" width="1536" height="1024"></div>';
    var act = list.filter(function (c) { return ['decided', 'wait_deposit'].indexOf(c.stage) >= 0; });
    act.forEach(function (c) {
      if (c.stage === 'decided') h += '<div class="regcta mt16"><span class="em">🎉</span><div class="grow"><b style="font-size:17px">상표 「' + U.esc(c.mark.text) + '」의 등록이 결정되었습니다</b><p class="muted small mt8">등록료를 결제하시면 대리인이 등록 절차를 이어서 진행합니다. 납부 기한 ' + U.date(c.reg.official.due) + '</p></div><button class="btn p" data-go="#/regpay/' + c.id + '">등록료 결제하기 ' + ic('arrow', 's') + '</button></div>';
      else h += '<div class="note warn mt16">' + ic('bank', 's') + '<span>「' + U.esc(c.mark.text) + '」 가상계좌 입금을 기다리고 있습니다. ' + c.pay.vbank.bank + ' <b class="mono">' + c.pay.vbank.acct + '</b> · ' + U.won(c.fee.total) + ' · 기한 ' + U.dt(c.pay.vbank.due) + ' <a data-act="deposit" data-id="' + c.id + '">입금 통지 시연</a></span></div>';
    });
    if (draft) h += '<div class="note info mt16">' + ic('doc', 's') + '<span>작성 중인 신청서(' + S.wiz.caseId + ')가 있습니다. <a data-go="#/apply/' + S.wiz.step + '">이어서 작성하기</a></span></div>';
    h += '<div class="case-cards mt24">';
    if (!list.length) h += '<div class="card empty" style="grid-column:1/-1">' + ic('doc', 'l') + '<p class="mt8">아직 출원한 상표가 없습니다.</p><button class="btn p mt16" data-act="startApply">첫 상표 출원하기</button></div>';
    list.forEach(function (c) {
      var st = D.custStep(c.stage), pct = st < 0 ? 0 : (st + 1) / 8 * 100;
      h += '<div class="ccard' + (S.lastCase === c.id ? ' hl' : '') + '" data-go="#/case/' + c.id + '"><div class="row sb"><span class="mono tiny muted">' + c.no + '</span>' + A.badge(c.stage, true) + '</div><div class="mk">' + A.mk(c) + '</div>' +
        '<div><b style="font-size:16px">' + U.esc(c.mark.text) + '</b><div class="small muted">' + A.clsText(c) + ' · 지정상품 ' + A.goodsCount(c) + '개</div></div><div class="bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="row sb small"><span class="muted">' + (c.receipt.appNo ? '출원번호 ' + c.receipt.appNo : c.receipt.no ? '접수번호 ' + c.receipt.no : '신청 ' + U.date(c.created)) + '</span>' + ic('chev', 's') + '</div></div>';
    });
    h += '</div></div>';
    return h;
  };
  V.case = function (id) {
    var c = D.find(id), u = A.cust();
    if (!c || !u || c.owner !== u.id) return '<div class="wrap"><div class="empty">출원 건을 찾을 수 없습니다. <a data-go="#/my">내 출원으로</a></div></div>';
    var st = D.custStep(c.stage);
    var h = '<div class="wrap" style="padding:26px 0 90px"><button class="btn sm g" data-go="#/my">' + ic('back', 's') + '내 출원</button>';
    h += '<div class="card pad mt12"><div class="dhead"><div class="mk">' + A.mk(c) + '</div><div class="grow"><div class="row wr"><h1 style="font-size:26px">' + U.esc(c.mark.text) + '</h1>' + A.badge(c.stage, true) + '</div><p class="muted small mt8">' + c.no + ' · ' + A.clsText(c) + ' · 대리인 ' + U.esc(A.poaData(c).agent_name) + '</p></div></div>';
    if (st >= 0) h += '<div class="htrack mt24">' + D.CUST_STEPS.map(function (s, i) { return '<div class="' + (i < st || (i === st && c.stage === 'registered') ? 'done' : i === st ? 'cur' : '') + '"><i></i>' + s.label + '</div>'; }).join('') + '</div>';
    h += '</div>';
    if (c.stage === 'decided') h += '<div class="regcta mt16"><span class="em">🎉</span><div class="grow"><b style="font-size:17px">등록 결정을 축하드립니다</b><p class="muted small mt8">등록료와 대리 수수료를 결제하시면 대리인이 등록 절차를 진행합니다.</p></div><button class="btn p" data-go="#/regpay/' + c.id + '">등록료 결제하기 ' + ic('arrow', 's') + '</button></div>';
    h += '<div class="dgrid mt16"><div class="col" style="gap:16px">';
    h += '<div class="card"><div class="card-h"><h3>출원 정보</h3></div><div class="card-b"><dl class="kv">' +
      '<dt>출원인</dt><dd>' + U.esc(c.applicant.name) + ' (' + c.applicant.kind + ')</dd>' +
      '<dt>접수번호</dt><dd>' + (c.receipt.no ? '<span class="mono">' + c.receipt.no + '</span>' : c.stage === 'cancel' ? '—' : A.bdg('출원 후 안내', 'mute')) + '</dd>' +
      '<dt>출원번호</dt><dd>' + (c.receipt.appNo ? '<span class="mono">' + c.receipt.appNo + '</span>' : c.receipt.no ? A.bdg('확인 중', 'warn') : '—') + '</dd>' +
      '<dt>지정상품</dt><dd>' + c.goods.map(function (g) { return '<b>' + g.cls + '류</b> ' + g.ids.map(function (i) { return D.GMAP[i].name; }).join(', '); }).join('<br>') + '</dd></dl></div></div>';
    h += '<div class="card"><div class="card-h"><h3>진행 기록</h3></div><div class="card-b"><div class="tl">' + custTimeline(c) + '</div></div></div>';
    h += '</div><div class="col" style="gap:16px">';
    h += '<div class="card"><div class="card-h"><h3>결제 · 납부</h3></div><div class="card-b"><div class="feeline"><span>내 결제</span><span>' + payText(c) + '</span></div><div class="feeline"><span>결제 금액</span><b>' + U.won(c.fee.total) + '</b></div><div class="feeline"><span>특허청 관납료 납부 (사무소)</span><span>' + offText(c) + '</span></div>' +
      (c.reg ? '<div class="feeline"><span>등록료 결제</span><span>' + (c.reg.pay.status === 'paid' ? A.bdg('완료', 'ok') : A.bdg('대기', 'warn')) + '</span></div>' : '') + '<p class="tiny muted mt8">고객님의 결제와 사무소의 관납료 납부는 따로 기록합니다.</p></div></div>';
    if (c.poa) h += '<div class="card"><div class="card-h"><h3>위임장</h3>' + A.bdg('양식 ' + c.poa.formVer, 'brand', true) + '</div><div class="card-b"><p class="small muted">생성 ' + U.dt(c.poa.at) + ' · 해시 <span class="mono">' + U.short(c.poa.hash) + '</span></p><button class="btn o sm mt12" data-act="viewPoa" data-id="' + c.id + '">' + ic('doc', 's') + '위임장 PDF 보기</button></div></div>';
    h += '<div class="card"><div class="card-h"><h3>알림톡</h3><a class="small" data-go="#/alerts">전체 보기</a></div><div class="card-b"><div class="kakao">' + c.alerts.slice(-2).reverse().map(function (a) { return '<div class="msg mt8"><div class="h"><i>®</i>' + D.OFFICE.service + ' · ' + a.title + '</div>' + U.esc(a.body) + '</div><div class="t">' + U.dt(a.t) + '</div>'; }).join('') + '</div></div></div>';
    h += '</div></div></div>';
    c.alerts.forEach(function (a) { a.read = true; });
    return h;
  };
  function payText(c) { return { paid: A.bdg('결제 완료', 'ok'), wait: A.bdg('입금 대기', 'warn'), refunded: A.bdg('취소 · 환불', 'mute'), none: A.bdg('미결제', 'mute') }[c.pay.status] || '—'; }
  function offText(c) { var s = c.official.status; return s === '납부 완료' ? A.bdg('납부 완료', 'ok') : s === '보류' ? A.bdg('확인 후 납부', 'violet') : c.receipt.no ? A.bdg('납부 예정', 'warn') : A.bdg('출원 시 납부', 'mute'); }
  function custTimeline(c) {
    var items = [];
    items.push(['신청 접수', U.dt(c.created), true]);
    if (c.pay.status === 'paid' || c.pay.status === 'refunded') items.push(['결제 완료', U.dt(c.pay.at), true]);
    else if (c.pay.status === 'wait') items.push(['입금 대기', '기한 ' + U.dt(c.pay.vbank.due), false]);
    if (c.poa) items.push(['위임장 생성', U.dt(c.poa.at) + ' · 양식 ' + c.poa.formVer, true]);
    if (c.stage === 'cancel') { items.push(['취소 · 환불', U.dt(c.pay.refund && c.pay.refund.at), true]); }
    else if (D.custStep(c.stage) >= 3) items.push(['변리사 검토 · 출원 준비', D.custStep(c.stage) > 3 ? '완료' : '진행 중', D.custStep(c.stage) > 3]);
    if (c.receipt.no) items.push(['특허청 출원', U.dt(c.receipt.at) + (c.receipt.appNo ? ' · ' + c.receipt.appNo : ' · 출원번호 확인 중'), true]);
    if (['exam', 'submitted'].indexOf(c.stage) >= 0) items.push(['심사 진행', '심사 결과가 나오면 알림톡으로 안내합니다', false]);
    if (c.reg) items.push(['등록 결정', U.dt(c.reg.decidedAt), true]);
    if (c.reg && c.reg.pay.status === 'paid') items.push(['등록료 결제', U.dt(c.reg.pay.at), true]);
    if (c.stage === 'registered') items.push(['등록 완료', '상표권이 발생했습니다', true]);
    return items.map(function (x, i) { var last = i === items.length - 1; return '<div class="tl-i ' + (x[2] ? 'done' : last ? 'cur' : '') + '"><span class="d">' + (x[2] ? '✓' : '•') + '</span><div><b>' + x[0] + '</b><span>' + x[1] + '</span></div></div>'; }).join('');
  }
  V.alerts = function () {
    var u = A.cust(); if (!u) return V.login();
    var all = []; myCases().forEach(function (c) { c.alerts.forEach(function (a) { all.push({ a: a, c: c }); }); });
    all.sort(function (x, y) { return y.a.t - x.a.t; });
    var h = '<div class="wrap" style="max-width:760px;padding-bottom:80px"><div class="mp-head"><span class="muted small">알림톡으로 보내 드린 안내</span><h1>알림</h1></div><div class="kakao" style="max-width:none">' +
      (all.length ? all.map(function (x) { return '<div class="msg mt12"><div class="h"><i>®</i>' + D.OFFICE.service + ' · ' + x.a.title + '<span class="muted" style="margin-left:auto;font-weight:600">' + U.esc(x.c.mark.text) + '</span></div>' + U.esc(x.a.body) + '<div class="mt8"><a class="small" data-go="#/case/' + x.c.id + '">진행 상황 보기 ›</a></div></div><div class="t">' + U.dt(x.a.t) + '</div>'; }).join('') : '<div class="empty">받은 알림이 없습니다.</div>') + '</div></div>';
    all.forEach(function (x) { x.a.read = true; });
    return h;
  };

  /* ================= 등록료 결제 ================= */
  V.regpay = function (id) {
    var c = D.find(id); if (!c || !c.reg || !A.cust() || c.owner !== A.cust().id) return '<div class="wrap"><div class="empty">등록 결정 건이 아닙니다.</div></div>';
    var f = c.reg.fee, paid = c.reg.pay.status === 'paid';
    return '<div class="wrap" style="max-width:760px;padding:26px 0 90px"><button class="btn sm g" data-go="#/case/' + c.id + '">' + ic('back', 's') + '출원 상세</button>' +
      '<div class="card pad mt12"><div class="row wr"><div class="mkth" style="width:120px;height:52px">' + A.mk(c) + '</div><div><span class="small muted">' + c.receipt.appNo + '</span><h2 style="font-size:22px">「' + U.esc(c.mark.text) + '」 등록료 결제</h2></div></div>' +
      '<div class="mt16"><div class="pline"><span>등록 관납료 (' + f.classes + '개 류 · 10년)</span><b>' + U.won(f.official) + '</b></div><div class="pline"><span>대리 수수료</span><b>' + U.won(f.service) + '</b></div><div class="pline"><span>부가세</span><b>' + U.won(f.vat) + '</b></div><div class="row sb mt12"><span class="muted">합계</span><span class="big" style="font-size:30px;font-weight:900">' + U.won(f.total) + '</span></div></div>' +
      '<div class="note mt16">' + ic('info', 's') + '<span>결제 후 사무소가 특허청에 등록료를 납부하고 등록 절차를 진행합니다. 등록료 납부 기한은 ' + U.date(c.reg.official.due) + '이며, 고객 결제와 사무소 납부는 각각 기록됩니다. <span class="muted">' + D.RATE.note + '</span></span></div>' +
      (paid ? '<div class="note ok mt16">' + ic('check', 's') + '<span>결제가 완료되었습니다. 등록 절차가 진행 중입니다.</span></div>' : '<button class="btn p lg blk mt16" data-act="regPay" data-id="' + c.id + '">' + ic('lock', 's') + U.won(f.total) + ' 결제하기</button>') + '</div></div>';
  };
  ACT.regPay = function (el) {
    var c = D.find(el.getAttribute('data-id'));
    if (!A.cust() || c.owner !== A.cust().id || !c.reg || ['decided','reg_paid'].indexOf(c.stage) < 0) { A.toast('결제할 등록 건을 확인해 주세요', 'warn'); return; }
    if (c.reg.pay.status === 'paid') { A.toast('이미 결제된 건입니다', 'warn'); return; }
    var cl = A.modal({ title: '결제 (시연용 결제창)', body: '<div class="note warn">' + ic('info', 's') + '<span>시연에서는 카드 정보를 받지 않습니다.</span></div><div class="pline mt16"><span>결제 금액</span><b>' + U.won(c.reg.fee.total) + '</b></div>', foot: '<button class="btn g" data-close>취소</button><button class="btn p" id="rgOk">결제 승인 (시연)</button>' });
    document.getElementById('rgOk').addEventListener('click', function () {
      cl();
      if (c.reg.pay.status === 'paid') return;
      c.reg.pay = { status: 'paid', at: Date.now(), tx: 'PG-REG' + c.id }; c.stage = 'reg_paid';
      D.hist(c, Date.now(), c.applicant.name, '등록료·대리 수수료 결제 (' + U.won(c.reg.fee.total) + ')');
      D.alert(c, Date.now(), '등록료 결제 완료', '등록료 결제가 완료되었습니다. 대리인이 등록료 납부와 등록 절차를 진행합니다.');
      D.AUDIT.unshift({ t: Date.now(), who: c.applicant.name, act: '등록료 결제', target: c.no, detail: U.won(c.reg.fee.total) });
      A.toast('등록료 결제가 완료되었습니다', 'ok'); A.go('#/case/' + c.id);
    });
  };

  V['404'] = function () { return '<div class="wrap"><div class="empty" style="padding:120px 0">' + ic('search', 'l') + '<p class="mt8">페이지를 찾을 수 없습니다.</p><button class="btn p mt16" data-go="#/">처음으로</button></div></div>'; };

  /* ================= 시나리오 (고객) ================= */
  A.scenario({ t: '셀프 출원 처음부터', d: '새 고객으로 가입하고 6단계 신청을 진행', run: function () { S.cust = null; S.wiz = null; A.go('#/'); A.guide('<b>셀프 출원 시작하기</b>를 누르면 간편 가입 후 6단계 신청서가 열립니다.'); A.spot('.hero .btn.p'); } });
  A.scenario({ t: 'AI 상품류 추천', d: '사업 설명 → 공식 명칭 안에서 후보 · 목록 밖 표현 제외', run: function () {
    S.cust = 'u_kim'; newWiz(); var w = S.wiz;
    w.ap.rrn1 = '920314'; w.ap.rrn2 = '2000000'; w.ap.verified = true; w.ap.hasCust = 'yes'; w.ap.custNo = '4-2021-034218';
    w.mark.text = '모아담 베이커리'; w.max = 3; w.desc = '동네에서 베이커리 카페를 열고 직접 구운 빵과 케이크, 커피를 팔아요. 원두 정기구독도 준비 중이에요';
    A.go('#/apply/3'); A.guide('<b>AI 추천 받기</b>를 눌러 보세요. 공식 명칭 목록에 없는 표현(정기구독 등)은 후보에서 제외됩니다.'); A.spot('#aiRun');
  } });
  A.scenario({ t: '도장 배경 정리 · 위임장 합성', d: '누런 종이에 찍힌 도장 사진 → 투명 배경 → 날인 위치', run: function () {
    S.cust = 'u_kim'; newWiz(); var w = S.wiz;
    w.ap.rrn1 = '920314'; w.ap.rrn2 = '2000000'; w.ap.verified = true; w.ap.hasCust = 'yes'; w.ap.custNo = '4-2021-034218';
    w.mark.text = '모아담 베이커리'; w.sel = { 30: [D.G.filter(function (g) { return g.name === '빵'; })[0].id], 43: [D.G.filter(function (g) { return g.name === '카페업'; })[0].id] }; w.max = 5;
    A.go('#/apply/4'); setTimeout(function () { ACT.ssample(); }, 200);
    A.guide('샘플 도장 사진의 <b>배경을 투명하게 정리</b>하고 기울기를 보정합니다. 아래에서 위임장 날인 위치를 확인하세요.');
  } });
  A.scenario({ t: '등록 결정 → 등록료 결제', d: '마이페이지 안내 → 등록료·대리 수수료 결제 (수익화 흐름)', run: function () { S.cust = 'u_kim'; A.go('#/my'); A.guide('등록 결정된 <b>DALMOON</b> 건의 <b>등록료 결제하기</b>를 눌러 보세요.'); A.spot('.regcta .btn'); } });
})();
