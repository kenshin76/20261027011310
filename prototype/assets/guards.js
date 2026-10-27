/* 체험 환경의 화면·작업 권한 및 상태 검증. 실제 서비스의 서버 인증을 대체하지 않습니다. */
(function () {
  'use strict';
  var A = window.APP, D = window.DB, S = A.S, ACT = A.ACT;
  var permissions = { toReview: 'start', startAuto: 'review', approve: 'approve', authDone: 'auth', judge: 'judge', reproc: 'start', editCase: 'edit', offPay: 'official', refund: 'refund', reveal: 'reveal', memReveal: 'reveal', fdef: 'form', formSave: 'form', rateSave: 'rate', setSave: 'agent', setAppNo: 'stage', stageNext: 'stage', wkCheck: 'start', wkToggle: 'start', admDeposit: 'refund' };
  Object.keys(permissions).forEach(function (key) {
    var original = ACT[key];
    if (!original) return;
    ACT[key] = function (el, ev) {
      if (!A.admin() || !A.can(permissions[key])) { A.toast('이 작업을 수행할 사무소 권한이 없습니다.', 'warn'); return; }
      var id = el && el.getAttribute('data-id'), c = id && D.find(id);
      if (id && !c) { A.toast('출원 건을 찾을 수 없습니다.', 'warn'); return; }
      var allowed = { approve: ['approve'], authDone: ['auth'], judge: ['unknown'], reproc: ['error'], editCase: ['wait_deposit','paid','review','error','approve','auth'], toReview: ['paid'], startAuto: ['review'] }[key];
      if (c && allowed && allowed.indexOf(c.stage) < 0) { A.toast('출원 상태가 변경되었습니다. 현재 상태를 확인해 주세요.', 'warn'); return; }
      if (c && c.auto.job && c.auto.job.locked && ['editCase','reproc','startAuto'].indexOf(key) >= 0) { A.toast('진행 중인 작업을 먼저 확인해 주세요.', 'warn'); return; }
      if (key === 'rateSave') {
        var valid = Array.from(document.querySelectorAll('.rate-tbl input')).every(function (input) { var n = +input.value; return input.value !== '' && Number.isFinite(n) && Number.isInteger(n) && n >= 0 && n <= 1000000000; });
        if (!valid) { A.toast('요율은 0 이상의 정수로 입력해 주세요.', 'err'); return; }
      }
      if (key === 'setSave' && ['agN','agC','agA'].some(function (id) { return !document.getElementById(id).value.trim(); })) { A.toast('대리인 성명·코드·주소를 모두 입력해 주세요.', 'err'); return; }
      if (key === 'setAppNo') {
        original(el, ev);
        var input = document.getElementById('anIn'), ok = document.getElementById('anOk');
        ok.addEventListener('click', function (e) { if (!/^40-\d{4}-\d{7}$/.test(input.value.trim())) { e.stopImmediatePropagation(); A.toast('출원번호를 40-연도-7자리 형식으로 입력해 주세요.', 'err'); } }, true);
        return;
      }
      if (key === 'offPay' && (el.getAttribute('data-k') === 'reg' ? !c.reg : !c.receipt.no && c.stage !== 'unknown')) { A.toast('제출 결과와 납부 대상을 먼저 확인해 주세요.', 'warn'); return; }
      if (key === 'stageNext') {
        var next = el.getAttribute('data-to'), expected = { submitted: 'exam', exam: 'decided', reg_paid: 'registered' }[c.stage];
        if (next !== expected || !c.receipt.no || !c.receipt.appNo || (next === 'registered' && (!c.reg || c.reg.pay.status !== 'paid' || c.reg.official.status !== '납부 완료'))) { A.toast('출원번호와 현재 단계의 결제·납부 내역을 확인해 주세요.', 'warn'); return; }
      }
      original(el, ev);
    };
  });
  ['deposit','regPay','viewPoa'].forEach(function (key) {
    var original = ACT[key];
    ACT[key] = function (el, ev) {
      var c = D.find(el.getAttribute('data-id'));
      var adminAllowed = A.parse().area === 'admin' && A.admin() && (key === 'deposit' ? A.can('refund') : A.can('reveal'));
      if (!c || (!adminAllowed && (!A.cust() || c.owner !== A.cust().id))) { A.toast('이 출원 건을 처리할 권한이 없습니다.', 'warn'); return; }
      original(el, ev);
    };
  });
  document.addEventListener('dragover', function (e) { if (e.target.closest('.drop')) e.preventDefault(); });
  document.addEventListener('drop', function (e) {
    var drop = e.target.closest('.drop'); if (!drop) return;
    e.preventDefault();
    var input = drop.querySelector('input[type=file]'), files = e.dataTransfer && e.dataTransfer.files;
    if (input && files && files.length) { var fn = ACT[input.getAttribute('data-ch')]; if (fn) fn({ files: files }); }
  });
  // 폼을 키보드로 사용할 때 보이는 라벨과 입력란이 연결되도록 합니다.
  var observer = new MutationObserver(function () {
    document.querySelectorAll('.fld').forEach(function (field, i) {
      var label = field.querySelector('label'), input = field.querySelector('input,select,textarea');
      if (label && input && !label.contains(input)) { if (!input.id) input.id = 'field-' + i; label.htmlFor = input.id; }
    });
  });
  observer.observe(document.getElementById('app'), { childList: true, subtree: true });
})();
