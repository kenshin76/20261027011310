/* 고객·사무소 로그인. 외부 인증 없이 동작하는 체험용 계정입니다. */
(function () {
  'use strict';
  var A = window.APP, D = window.DB, S = A.S, U = D.U, ACT = A.ACT;
  D.CUSTOMERS.forEach(function (u) { u.password = 'ongyeol2026'; });
  D.ADMINS.forEach(function (u) { u.email = { a_jung: 'attorney', a_lee: 'office', a_han: 'staff' }[u.id] + '@demo.ongyeol'; u.password = 'office2026'; });
  var joining = false;
  function loginView(isAdmin) {
    var accounts = isAdmin ? D.ADMINS : D.CUSTOMERS;
    var join = !isAdmin && joining;
    return '<main class="auth-page"><section class="auth-card"><div class="auth-visual"><img src="assets/trademark-office-v3.webp" alt="상표 검토와 출원 서류를 준비하는 사무소 업무 공간"><div class="auth-story"><span>ONGYEOL · YOUR BRAND, YOUR WAY</span><h2>이름에 담은 시작을,<br>오래 지킬 수 있도록.</h2><p>신청부터 출원, 등록까지<br>온결이 함께하겠습니다.</p></div></div><div class="auth-content"><div class="row sb wr"><a class="logo" href="#/"><i>®</i>' + D.OFFICE.service + '</a><a class="btn sm o" href="#/">' + A.ic('back', 's') + '사용자 사이트로</a></div>' +
      '<div class="auth-heading"><span class="auth-kicker">' + (isAdmin ? 'OFFICE WORKSPACE' : 'MY TRADEMARK') + '</span><h1>' + (isAdmin ? '사무소 로그인' : join ? '회원가입' : '로그인') + '</h1><p>' + (isAdmin ? '계정 정보를 입력해 사무소 업무를 시작하세요.' : join ? '계정을 만들고 상표출원을 준비하세요.' : '내 출원과 진행 상황을 한곳에서 확인하세요.') + '</p></div>' +
      '<form id="authForm" data-area="' + (isAdmin ? 'admin' : 'cust') + '" data-join="' + join + '"><div class="col">' + (join ? '<div class="fld"><label for="authName">이름</label><input class="inp" id="authName" autocomplete="name" required maxlength="40"></div>' : '') +
      '<div class="fld"><label for="authEmail">이메일</label><input class="inp" id="authEmail" type="email" autocomplete="username" placeholder="이메일을 입력해 주세요" required></div>' +
      '<div class="fld"><label for="authPass">비밀번호</label><input class="inp" id="authPass" type="password" autocomplete="' + (join ? 'new-password' : 'current-password') + '" placeholder="' + (join ? '8자 이상 입력해 주세요' : '비밀번호를 입력해 주세요') + '" minlength="8" required></div>' +
      (join ? '<label class="chk"><input id="joinTerms" type="checkbox" required> <span>체험용 계정 생성과 이용 안내를 확인했습니다.</span></label>' : '') +
      '<p id="authError" class="hint err" role="alert"></p><button class="btn p lg blk" type="submit">' + (join ? '가입하고 시작하기' : '로그인') + A.ic('arrow', 's') + '</button></div></form>' +
      (!isAdmin ? '<div class="auth-switch"><span>' + (join ? '이미 계정이 있으신가요?' : '처음 방문하셨나요?') + '</span><button class="btn sm g" data-act="toggleJoin">' + (join ? '로그인' : '회원가입') + '</button></div>' : '') +
      '<section class="trial"><div class="row sb wr"><b>체험 계정</b><span class="hint">계정을 누르면 입력란에 채워집니다.</span></div><div class="col mt12">' + accounts.map(function (u) { return '<button type="button" class="trial-account" data-act="fillAccount" data-area="' + (isAdmin ? 'admin' : 'cust') + '" data-id="' + u.id + '"><span class="avatar">' + U.esc(u.name[0]) + '</span><span class="grow"><b>' + U.esc(u.name) + ' <small>' + (isAdmin ? D.ROLE[u.role].label : u.fresh ? '처음 신청하는 고객' : '출원 진행 중') + '</small></b><span>' + U.esc(u.email) + '</span></span><code>' + U.esc(u.password) + '</code></button>'; }).join('') + '</div><div class="trial-bottom"><p>가상 계정이며 실제 인증·결제·출원을 실행하지 않습니다.<br>작성 내역과 로그인 상태는 현재 브라우저에 저장됩니다. 실제 개인정보는 입력하지 마세요.</p><button class="btn sm o" data-act="resetTrial">' + A.ic('refresh', 's') + '체험 데이터 초기화</button></div></section></div></section></main>';
  }
  A.VIEWS.cust.login = function () { return loginView(false); };
  A.VIEWS.admin.login = function () { return loginView(true); };
  ACT.toggleJoin = function () { joining = !joining; A.render(true); };
  ACT.fillAccount = function (el) {
    var isAdmin = el.getAttribute('data-area') === 'admin';
    if (joining) { joining = false; A.render(true); }
    var u = (isAdmin ? D.ADMINS : D.CUSTOMERS).filter(function (x) { return x.id === el.getAttribute('data-id'); })[0];
    if (!u) return;
    document.getElementById('authEmail').value = u.email;
    document.getElementById('authPass').value = u.password;
    document.getElementById('authError').textContent = '';
    document.getElementById('authPass').focus();
  };
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'authForm') return;
    e.preventDefault();
    var f = e.target, isAdmin = f.getAttribute('data-area') === 'admin';
    var email = document.getElementById('authEmail').value.trim().toLowerCase();
    var password = document.getElementById('authPass').value;
    var err = document.getElementById('authError');
    var accounts = isAdmin ? D.ADMINS : D.CUSTOMERS;
    var u = accounts.filter(function (x) { return x.email.toLowerCase() === email; })[0];
    if (f.getAttribute('data-join') === 'true') {
      var name = document.getElementById('authName').value.trim();
      if (!name || !document.getElementById('joinTerms').checked || password.length < 8) { err.textContent = '이름·비밀번호와 필수 확인 항목을 확인해 주세요.'; return; }
      if (u) { err.textContent = '이미 등록된 이메일입니다. 로그인해 주세요.'; return; }
      u = { id: U.uid('u'), name: name, email: email, password: password, phone: '', joined: Date.now(), fresh: true, via: '이메일 가입' };
      accounts.push(u);
    }
    if (!u || u.password !== password) { err.textContent = '이메일과 비밀번호를 확인해 주세요.'; return; }
    if (isAdmin) { S.admin = u.id; var next = S.adminReturn || '#/admin'; S.adminReturn = null; A.go(next); }
    else { if (S.cust !== u.id) { if (A.store) A.store.stashDraft(); S.wiz = A.store ? A.store.getDraft(u.id) : null; S.lastCase = null; } S.cust = u.id; joining = false; var target = S.custReturn || (u.fresh ? '#/apply/' + (S.wiz ? S.wiz.step : 1) : '#/my'); S.custReturn = null; A.go(target); }
    if (A.store) A.store.flush();
    A.toast(U.esc(u.name) + '님, 환영합니다.');
  });
  ACT.logout = function () { if (A.store) A.store.stashDraft(); S.cust = null; S.wiz = null; S.lastCase = null; S.custReturn = null; A.go('#/login'); if (A.store) A.store.flush(); A.toast('로그아웃했습니다.'); };
  ACT.adminLogout = function () { S.admin = null; S.adminReturn = null; A.go('#/admin/login'); if (A.store) A.store.flush(); A.toast('사무소 계정에서 로그아웃했습니다.'); };
  ACT.resetTrial = function () {
    A.confirm('체험 데이터 초기화', '<p>이 브라우저에 저장한 신청서·이미지·처리 이력·설정과 고객·사무소 로그인 상태를 초기화합니다. 계속하시겠습니까?</p>', '초기화', function () { if (!A.store || A.store.reset()) location.reload(); });
  };
})();
