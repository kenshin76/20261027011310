/* 온결 셀프상표 — 시연용 데이터와 업무 규칙
   사무소·인물·상표·번호·요율은 모두 시연용 가상 정보이며, 체험 자료는 프로젝트 전용 브라우저 저장소에 보관합니다. */
(function () {
  'use strict';

  var DAY = 864e5;
  var NOW = new Date(); NOW.setSeconds(0, 0);
  function at(daysAgo, h, m) { var t = new Date(NOW.getTime() - daysAgo * DAY); t.setHours(h == null ? 10 : h, m || 0, 0, 0); return t.getTime(); }
  function after(daysLater, h) { var t = new Date(NOW.getTime() + daysLater * DAY); t.setHours(h == null ? 18 : h, 0, 0, 0); return t.getTime(); }

  /* ---------- 공통 도구 ---------- */
  var U = {
    won: function (n) { return (Math.round(n) || 0).toLocaleString('ko-KR') + '원'; },
    num: function (n) { return (n || 0).toLocaleString('ko-KR'); },
    pad: function (n, l) { n = String(n); while (n.length < (l || 2)) n = '0' + n; return n; },
    date: function (t) { if (!t) return '—'; var d = new Date(t); return d.getFullYear() + '.' + U.pad(d.getMonth() + 1) + '.' + U.pad(d.getDate()); },
    md: function (t) { if (!t) return '—'; var d = new Date(t); return U.pad(d.getMonth() + 1) + '.' + U.pad(d.getDate()); },
    time: function (t) { if (!t) return '—'; var d = new Date(t); return U.pad(d.getHours()) + ':' + U.pad(d.getMinutes()); },
    dt: function (t) { return t ? U.date(t) + ' ' + U.time(t) : '—'; },
    clock: function (t) { var d = new Date(t || Date.now()); return U.pad(d.getHours()) + ':' + U.pad(d.getMinutes()) + ':' + U.pad(d.getSeconds()); },
    ago: function (t) {
      var s = Math.max(0, (Date.now() - t) / 1000);
      if (s < 60) return '방금'; if (s < 3600) return Math.floor(s / 60) + '분 전';
      if (s < 86400) return Math.floor(s / 3600) + '시간 전'; return Math.floor(s / 86400) + '일 전';
    },
    dday: function (t) { var d = Math.ceil((t - Date.now()) / DAY); return d === 0 ? 'D-day' : d > 0 ? 'D-' + d : 'D+' + (-d); },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    maskName: function (n) { if (!n) return ''; if (n.length <= 2) return n[0] + '*'; return n[0] + '*'.repeat(n.length - 2) + n[n.length - 1]; },
    maskPhone: function (p) { return p ? p.replace(/(\d{3})-?(\d{3,4})-?(\d{4})/, '$1-****-$3') : ''; },
    maskEmail: function (e) { if (!e) return ''; var a = e.split('@'); return a[0].slice(0, 2) + '***@' + a[1]; },
    /* 시연용 해시 — 실제 서비스는 SHA-256을 사용합니다 */
    hash: function (str) {
      str = String(str);
      function f(seed) { var h = seed >>> 0; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
      return f(2166136261) + f(0x9dc5ab1f) + f(0x1b873593) + f(0x85ebca6b);
    },
    short: function (h) { return h ? h.slice(0, 8) + '…' + h.slice(-4) : '—'; },
    uid: function (p) { return (p || 'ID') + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(); }
  };

  /* ---------- 사무소 · 계정 ---------- */
  var OFFICE = {
    name: '온결 특허법률사무소', service: '온결 셀프상표',
    agent: { name: '정하윤', title: '변리사', code: '9-2019-000417', address: '서울특별시 마포구 월드컵북로 00, 7층' },
    tel: '02-000-0000'
  };
  var ADMINS = [
    { id: 'a_jung', name: '정하윤', title: '대표 변리사', role: 'attorney', color: '#405D77' },
    { id: 'a_lee', name: '이도현', title: '사무장', role: 'manager', color: '#586F86' },
    { id: 'a_han', name: '한소율', title: '출원 담당', role: 'staff', color: '#6D6B7D' }
  ];
  var ROLE = {
    attorney: { label: '변리사', can: ['review', 'start', 'approve', 'auth', 'judge', 'edit', 'stage', 'notify', 'form', 'agent', 'reveal', 'official', 'refund', 'rate'] },
    manager: { label: '사무장', can: ['start', 'auth', 'judge', 'official', 'refund', 'rate', 'reveal', 'stage', 'notify', 'edit'] },
    staff: { label: '출원 담당', can: ['start', 'notify', 'stage'] }
  };
  var CUSTOMERS = [
    { id: 'u_kim', name: '김서연', email: 'seoyeon.k@example.com', phone: '010-2481-3307', joined: at(41), via: '이메일 가입' },
    { id: 'u_new', name: '이준서', email: 'junseo.lee@example.com', phone: '010-7712-0458', joined: at(0, 9, 12), via: '간편 가입', fresh: true }
  ];

  /* ---------- 요율 (시연용 가정 요율 — 실제 값은 관리자 요율표에서 설정) ---------- */
  var RATE = {
    officialPerClass: 62000, freeItems: 10, extraPerItem: 2000,
    servicePerClass: 39000, vat: 0.1,
    regOfficialPerClass: 200000, regServicePerClass: 150000,
    note: '체험용 예시 요율입니다. 실제 결제·납부는 이루어지지 않습니다.'
  };

  /* ---------- 상표 이미지 규격 (시연 가정) ---------- */
  var SPEC = { format: 'JPG', maxPx: 1000, minPx: 300, maxKB: 500, bg: '흰색 배경', note: '체험용 예시 규격이며 실제 제출 요건과 다를 수 있습니다.' };

  /* ---------- 지정상품 명칭 목록 (시연용 예시 — 실제 서비스는 공식 명칭 자료를 기준 데이터로 구축) ---------- */
  var CLASS = {
    3: '화장품·향수·세정제', 9: '소프트웨어·전자기기', 16: '문구·종이·인쇄물', 18: '가방·지갑·반려동물 용품', 25: '의류·신발·모자',
    29: '가공식품·유제품', 30: '커피·빵·과자', 32: '음료', 35: '광고·도소매업', 41: '교육·출판·공연', 42: 'IT·디자인 서비스', 43: '음식점·카페·숙박', 44: '미용·피부관리'
  };
  var G = [];
  function g(cls, list) { list.forEach(function (x, i) { G.push({ id: 'G' + U.pad(cls) + '-' + U.pad(i + 1, 3), cls: cls, name: x[0], kw: x[1] }); }); }
  g(3, [['화장품', ['화장품', '코스메틱', '뷰티', '스킨케어']], ['기초화장품', ['스킨', '로션', '토너', '세럼', '기초']], ['향수', ['향수', '퍼퓸', '향']], ['샴푸', ['샴푸', '헤어']], ['비누', ['비누', '솝', '수제비누']], ['립스틱', ['립', '색조']], ['자외선 차단용 화장품', ['선크림', '자외선']], ['화장용 팩', ['마스크팩', '팩']], ['바디로션', ['바디', '로션']]]);
  g(9, [['컴퓨터 소프트웨어', ['소프트웨어', '프로그램', 'SaaS']], ['스마트폰용 애플리케이션 소프트웨어', ['앱', '어플', '애플리케이션', '모바일']], ['내려받기 가능한 전자출판물', ['전자책', '이북', 'PDF']], ['이어폰', ['이어폰', '오디오']], ['스마트워치', ['워치', '웨어러블']], ['휴대폰 케이스', ['케이스', '폰케이스']]]);
  g(16, [['노트', ['노트', '다이어리', '문구']], ['스티커', ['스티커', '굿즈', '문구']], ['포장용 종이봉투', ['포장', '봉투', '쇼핑백']], ['달력', ['달력', '캘린더']], ['인쇄물', ['인쇄', '엽서', '포스터']], ['필기구', ['펜', '필기', '연필']]]);
  g(18, [['핸드백', ['핸드백', '가방', '백']], ['배낭', ['백팩', '배낭']], ['지갑', ['지갑', '카드지갑']], ['여행가방', ['캐리어', '여행']], ['반려동물용 목줄', ['반려', '강아지', '목줄', '펫']], ['반려동물용 옷', ['반려', '펫', '강아지옷']]]);
  g(25, [['티셔츠', ['티셔츠', '의류', '옷', '패션']], ['셔츠', ['셔츠', '의류']], ['바지', ['바지', '팬츠', '의류']], ['원피스', ['원피스', '여성복']], ['모자', ['모자', '캡']], ['운동화', ['운동화', '신발', '스니커즈']], ['양말', ['양말', '삭스']], ['아동복', ['아동', '키즈', '유아']]]);
  g(29, [['김치', ['김치', '반찬', '발효']], ['육포', ['육포', '간식']], ['우유', ['우유', '유제품', '밀크']], ['치즈', ['치즈', '유제품']], ['요구르트', ['요거트', '요구르트', '유제품']], ['잼', ['잼', '과일']]]);
  g(30, [['커피', ['커피', '카페', '음료', '원두']], ['원두커피', ['원두', '로스팅', '로스터리', '드립']], ['차', ['차', '티', '허브']], ['빵', ['빵', '베이커리', '제과', '디저트']], ['케이크', ['케이크', '디저트', '베이커리']], ['과자', ['과자', '쿠키', '스낵']], ['떡', ['떡', '한과']], ['아이스크림', ['아이스크림', '젤라또']], ['초콜릿', ['초콜릿', '디저트']], ['소스', ['소스', '드레싱']]]);
  g(32, [['생수', ['생수', '물']], ['탄산음료', ['탄산', '음료']], ['과일주스', ['주스', '과일', '음료']], ['맥주', ['맥주', '수제맥주', '브루어리']]]);
  g(35, [['온라인 광고업', ['광고', '마케팅', '온라인']], ['화장품 소매업', ['화장품', '판매', '쇼핑몰', '뷰티']], ['의류 소매업', ['의류', '판매', '쇼핑몰', '패션']], ['커피 소매업', ['커피', '원두', '판매']], ['온라인 종합쇼핑몰업', ['쇼핑몰', '온라인', '판매', '스토어', '커머스']], ['마케팅 대행업', ['마케팅', '대행', '홍보']], ['프랜차이즈 경영 자문업', ['프랜차이즈', '가맹']], ['반려동물 용품 소매업', ['반려', '펫', '판매']]]);
  g(41, [['온라인 교육업', ['교육', '강의', '클래스', '코딩', '온라인']], ['학원 경영업', ['학원', '교습']], ['요가 교육업', ['요가', '필라테스', '운동']], ['출판업', ['출판', '책']], ['공연 기획업', ['공연', '콘서트']], ['원데이 클래스 교육업', ['클래스', '공방', '체험', '원데이']]]);
  g(42, [['소프트웨어 개발업', ['개발', '소프트웨어', '코딩', '앱']], ['웹사이트 디자인업', ['웹', '디자인', '홈페이지']], ['클라우드 컴퓨팅업', ['클라우드', '서버']], ['서비스형 소프트웨어 제공업', ['SaaS', '플랫폼', '구독']]]);
  g(43, [['카페업', ['카페', '커피', '디저트']], ['커피전문점업', ['커피', '카페', '로스터리']], ['음식점업', ['음식점', '식당', '레스토랑', '한식', '맛집']], ['제과점업', ['베이커리', '빵', '제과']], ['숙박업', ['숙박', '게스트하우스', '펜션', '호텔']], ['케이터링업', ['케이터링', '도시락']]]);
  g(44, [['미용실업', ['미용실', '헤어', '살롱']], ['네일숍업', ['네일']], ['피부관리업', ['피부', '에스테틱', '관리']], ['반려동물 미용업', ['반려', '강아지', '애견', '미용', '펫']]]);
  var GMAP = {}; G.forEach(function (x) { GMAP[x.id] = x; });

  /* 공식 명칭 목록 밖의 표현 예시 — 모델이 이런 표현을 내놓아도 목록 ID와 대조해 제외합니다 */
  var OFFLIST = [
    ['구독', '정기구독 박스 서비스업'], ['배달', '배달 대행 플랫폼업'], ['굿즈', '캐릭터 굿즈 큐레이션업'], ['클래스', '취미 클래스 매칭 서비스업'],
    ['앱', '모바일 라이프스타일 서비스업'], ['로스터리', '스페셜티 커피 문화 공간업'], ['비건', '비건 뷰티 컨설팅업'], ['반려', '펫 라이프 토털 케어업']
  ];

  /* AI 추천 시뮬레이션 — 사업 설명을 공식 명칭 목록과 대조해 후보를 고르고, 목록 밖 표현은 제외합니다 */
  function aiSuggest(desc) {
    var q = String(desc || '').replace(/\s+/g, ' ').trim();
    var low = q.toLowerCase();
    var scored = [];
    G.forEach(function (x) {
      var s = 0;
      x.kw.forEach(function (k) { if (low.indexOf(k.toLowerCase()) >= 0) s += k.length >= 3 ? 3 : 2; });
      if (low.indexOf(x.name) >= 0) s += 4;
      if (s > 0) scored.push({ id: x.id, cls: x.cls, name: x.name, score: s });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    var byCls = {};
    scored.forEach(function (x) { (byCls[x.cls] = byCls[x.cls] || []).push(x); });
    var clsOrder = Object.keys(byCls).map(Number).sort(function (a, b) {
      var sa = byCls[a].reduce(function (s, x) { return s + x.score; }, 0), sb = byCls[b].reduce(function (s, x) { return s + x.score; }, 0);
      return sb - sa;
    }).slice(0, 4);
    var groups = clsOrder.map(function (c) {
      var items = byCls[c].slice(0, 5);
      var top = items[0].score;
      return { cls: c, title: CLASS[c], items: items.map(function (x) { return { id: x.id, name: x.name, fit: x.score >= top ? '높음' : x.score >= top - 2 ? '보통' : '참고' }; }) };
    });
    var excluded = [];
    OFFLIST.forEach(function (p) { if (low.indexOf(p[0].toLowerCase()) >= 0 && excluded.length < 2) excluded.push(p[1]); });
    if (!excluded.length && groups.length) excluded.push(CLASS[groups[0].cls].split('·')[0] + ' 토털 브랜딩 서비스업');
    var reason = groups.length ? groups.map(function (gr) { return gr.cls + '류(' + gr.title + ')'; }).join(', ') : '';
    return { query: q, groups: groups, excluded: excluded, reason: reason, at: Date.now() };
  }

  /* 수수료 계산 — sel: [{cls, ids:[]}] */
  function calcFee(sel, rate) {
    rate = rate || RATE;
    var lines = (sel || []).filter(function (s) { return s.ids && s.ids.length; }).map(function (s) {
      var extra = Math.max(0, s.ids.length - rate.freeItems);
      return { cls: s.cls, items: s.ids.length, official: rate.officialPerClass + extra * rate.extraPerItem, extra: extra };
    });
    var official = lines.reduce(function (a, l) { return a + l.official; }, 0);
    var service = lines.length * rate.servicePerClass;
    var vat = Math.round(service * rate.vat);
    return { classes: lines.length, lines: lines, official: official, service: service, vat: vat, total: official + service + vat };
  }
  function calcRegFee(classes, rate) {
    rate = rate || RATE;
    var official = classes * rate.regOfficialPerClass, service = classes * rate.regServicePerClass, vat = Math.round(service * rate.vat);
    return { classes: classes, official: official, service: service, vat: vat, total: official + service + vat };
  }

  /* ---------- 상태 ---------- */
  var STAGE = {
    draft: { label: '작성 중', tone: 'mute', cust: '작성 중' },
    wait_deposit: { label: '입금 대기', tone: 'warn', cust: '입금 대기' },
    paid: { label: '결제 완료 · 서류 생성', tone: 'info', cust: '서류 준비 중' },
    review: { label: '변리사 검토 대기', tone: 'violet', cust: '변리사 검토 중' },
    auto: { label: '자동 입력 중', tone: 'info', cust: '출원 준비 중' },
    error: { label: '자동화 중단', tone: 'danger', cust: '출원 준비 중' },
    approve: { label: '제출 승인 대기', tone: 'warn', cust: '출원 준비 중' },
    auth: { label: '인증 대기', tone: 'warn', cust: '출원 준비 중' },
    submitting: { label: '제출 중', tone: 'info', cust: '출원 준비 중' },
    unknown: { label: '제출 확인 대기', tone: 'danger', cust: '출원 준비 중' },
    submitted: { label: '제출 완료', tone: 'teal', cust: '출원 완료' },
    exam: { label: '심사 중', tone: 'teal', cust: '심사 중' },
    decided: { label: '등록 결정 · 등록료 대기', tone: 'brand', cust: '등록 결정' },
    reg_paid: { label: '등록료 결제 완료', tone: 'info', cust: '등록 진행 중' },
    registered: { label: '등록 완료', tone: 'ok', cust: '등록 완료' },
    cancel: { label: '취소 · 환불', tone: 'mute', cust: '취소됨' }
  };
  var ORDER = ['draft', 'wait_deposit', 'paid', 'review', 'auto', 'error', 'approve', 'auth', 'submitting', 'unknown', 'submitted', 'exam', 'decided', 'reg_paid', 'registered', 'cancel'];
  var CUST_STEPS = [
    { key: 'apply', label: '신청 접수' }, { key: 'pay', label: '결제 완료' }, { key: 'doc', label: '위임장 생성' }, { key: 'review', label: '변리사 검토' },
    { key: 'file', label: '특허청 출원' }, { key: 'exam', label: '심사' }, { key: 'decide', label: '등록 결정' }, { key: 'reg', label: '등록 완료' }
  ];
  function custStep(stage) {
    return { draft: 0, wait_deposit: 0, paid: 2, review: 3, auto: 3, error: 3, approve: 3, auth: 3, submitting: 3, unknown: 3, submitted: 5, exam: 5, decided: 6, reg_paid: 6, registered: 7, cancel: -1 }[stage];
  }

  var AUTO_STEPS = [
    { n: 1, label: '작업 수신', check: '출원 건·버전별 작업 ID, 중복 수신·동시 실행 차단' },
    { n: 2, label: '출원 정보 입력', check: '입력 후 화면 값을 해당 버전의 원본과 대조' },
    { n: 3, label: '파일 첨부', check: '원본·변환본 대응, 파일 해시·첨부 목록 대조' },
    { n: 4, label: '증적 저장', check: '단계별 화면을 관리자 화면에 저장' },
    { n: 5, label: '제출 승인', check: '승인자·시각·승인 버전·파일 해시 기록' },
    { n: 6, label: '인증 · 제출', check: '승인 버전 재대조, 중복 제출 명령 차단' },
    { n: 7, label: '결과 수집', check: '접수번호·출원번호를 별도 필드로 기록' }
  ];

  /* ---------- 위임장 양식 정의 (시연용 v2) ---------- */
  var FORM = {
    current: 'v2',
    versions: [
      { ver: 'v1', at: at(120), by: '정하윤', note: '최초 등록 (사무소 표준 양식)' },
      { ver: 'v2', at: at(18), by: '정하윤', note: '위임 사항 문구 갱신 · 주소 칸 2줄 허용' }
    ],
    fields: [
      { id: 'appl_name', label: '위임인 성명(명칭)', x: 30, y: 23.6, w: 60, size: 12.5, max: 30, req: true },
      { id: 'appl_cust', label: '특허고객번호', x: 30, y: 27.6, w: 60, size: 12, max: 20, req: false },
      { id: 'appl_addr', label: '위임인 주소', x: 30, y: 31.6, w: 60, size: 12, max: 38, lines: 2, req: true },
      { id: 'agent_name', label: '대리인 성명', x: 30, y: 45.6, w: 60, size: 12.5, max: 20, req: true },
      { id: 'agent_code', label: '대리인 코드', x: 30, y: 49.6, w: 60, size: 12, max: 20, req: true },
      { id: 'agent_addr', label: '대리인 주소', x: 30, y: 53.6, w: 60, size: 12, max: 38, req: true },
      { id: 'mark', label: '상표(표장)', x: 30, y: 64.2, w: 60, size: 12.5, max: 40, req: true },
      { id: 'date', label: '작성일', x: 30, y: 81.4, w: 30, size: 12, max: 14, req: true },
      { id: 'seal', label: '위임인 날인', x: 60, y: 83.2, w: 13, size: 0, max: 0, req: true, seal: true }
    ]
  };
  FORM.defs = { v2: FORM.fields, v1: FORM.fields.map(function (f) { var o = {}; for (var k in f) o[k] = f[k]; if (f.id === 'appl_addr') { o.max = 44; o.lines = 1; } return o; }) };
  FORM.get = function (ver) { return FORM.defs[ver] || FORM.defs[FORM.current]; };

  /* ---------- 표장 그림 (시드용 SVG) ---------- */
  function markSVG(text, style) {
    var t = U.esc(text);
    var s = style || {};
    var c1 = s.c1 || '#3D5AFE', c2 = s.c2 || '#7B5CFF';
    var emblem = '';
    if (s.emblem === 'leaf') emblem = '<path d="M60 92c-20-6-26-30-12-46 14 8 24 26 12 46z" fill="' + c1 + '"/><path d="M60 92c4-20 18-30 36-30-2 18-16 30-36 30z" fill="' + c2 + '"/>';
    else if (s.emblem === 'cup') emblem = '<rect x="38" y="52" width="40" height="36" rx="8" fill="' + c1 + '"/><path d="M78 60h8a10 10 0 010 20h-8" fill="none" stroke="' + c1 + '" stroke-width="6"/><path d="M48 42c0-8 8-8 8-16M62 42c0-8 8-8 8-16" stroke="' + c2 + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    else if (s.emblem === 'paw') emblem = '<circle cx="60" cy="74" r="16" fill="' + c1 + '"/><circle cx="40" cy="52" r="8" fill="' + c2 + '"/><circle cx="54" cy="42" r="8" fill="' + c2 + '"/><circle cx="68" cy="42" r="8" fill="' + c2 + '"/><circle cx="80" cy="52" r="8" fill="' + c2 + '"/>';
    else if (s.emblem === 'moon') emblem = '<path d="M74 34a30 30 0 100 52 26 26 0 010-52z" fill="' + c1 + '"/><circle cx="82" cy="44" r="4" fill="' + c2 + '"/>';
    var hasE = !!emblem;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160" width="480" height="160"><rect width="480" height="160" fill="#fff"/>' +
      (hasE ? '<g transform="translate(14,16)">' + emblem + '</g>' : '') +
      '<text x="' + (hasE ? 150 : 240) + '" y="98" font-family="Pretendard, Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="' + (s.size || 52) + '" font-weight="800" letter-spacing="' + (s.ls || 0) + '" fill="' + (s.ink || '#151A3B') + '" text-anchor="' + (hasE ? 'start' : 'middle') + '">' + t + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---------- 출원 건 시드 ---------- */
  var seq = 55;
  function sel(map) { return Object.keys(map).map(function (c) { return { cls: +c, ids: map[c] }; }); }
  function ids(cls, names) { return names.map(function (n) { var f = G.filter(function (x) { return x.cls === cls && x.name === n; })[0]; return f.id; }); }

  function mkCase(o) {
    var c = {
      id: o.id, seq: o.seq, no: 'TM-' + (new Date(o.created).getFullYear() % 100) + U.pad(new Date(o.created).getMonth() + 1) + '-' + U.pad(o.seq, 4),
      owner: o.owner || null, created: o.created, updated: o.updated || o.created,
      applicant: o.applicant, mark: o.mark, goods: o.goods, desc: o.desc || '', ai: o.ai || null,
      sign: { type: o.signType || 'stamp', img: null, raw: null, gen: true },
      ver: o.ver || 1, versions: [], poa: null,
      fee: calcFee(o.goods),
      pay: o.pay || { method: 'card', status: 'paid', tx: 'PG-' + U.hash(o.id).slice(0, 10).toUpperCase(), at: o.created + 36e5 },
      official: o.official || { status: '미납', amount: 0, due: null, receipt: null, by: null, at: null },
      stage: o.stage,
      auto: { job: null, steps: AUTO_STEPS.map(function (s) { return { n: s.n, state: 'wait', at: null }; }), log: [], approval: null, submitTries: [], err: null, invalid: [] },
      receipt: { no: null, appNo: null, at: null },
      reg: null, history: [], alerts: [], flags: o.flags || {}
    };
    c.official.amount = c.fee.official;
    for (var v = 1; v <= c.ver; v++) {
      c.versions.push({ v: v, at: o.created + (v - 1) * 2 * 36e5, reason: v === 1 ? '최초 신청' : (o.verReason || '고객 요청으로 주소 변경'), hash: U.hash(c.id + ':' + v + ':' + JSON.stringify(c.applicant) + JSON.stringify(c.goods)) });
    }
    return c;
  }

  var CASES = [];
  function add(c) { CASES.push(c); return c; }

  // 1. 심사 중 — 김서연(고객 계정)
  add(mkCase({ id: 'C031', seq: 31, owner: 'u_kim', created: at(26, 14, 20), stage: 'exam',
    applicant: { kind: '개인', name: '김서연', rrn: '920314-2******', phone: '010-2481-3307', email: 'seoyeon.k@example.com', address: '서울특별시 마포구 성미산로 00, 2층', custNo: '4-2021-034218' },
    mark: { type: 'text', text: '모아담', img: markSVG('모아담', { size: 64 }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
    goods: sel({ 30: ids(30, ['빵', '케이크', '과자']), 43: ids(43, ['제과점업', '카페업']) }), desc: '동네 베이커리 카페를 운영하며 빵과 케이크를 판매합니다.',
    official: { status: '납부 완료', due: at(18), receipt: 'R-26-0418-2291', by: '이도현', at: at(19, 15) } }));
  // 2. 등록 결정 — 김서연, 등록료 결제 대기
  add(mkCase({ id: 'C022', seq: 22, owner: 'u_kim', created: at(39, 11), stage: 'decided',
    applicant: { kind: '개인', name: '김서연', rrn: '920314-2******', phone: '010-2481-3307', email: 'seoyeon.k@example.com', address: '서울특별시 마포구 성미산로 00, 2층', custNo: '4-2021-034218' },
    mark: { type: 'combo', text: 'DALMOON', img: markSVG('DALMOON', { emblem: 'moon', c1: '#F4B400', c2: '#3D5AFE', ls: 3, size: 46 }), spec: { orig: 'PNG 2048×680 · 1.2MB', conv: 'JPG 1000×332 · 168KB' } },
    goods: sel({ 30: ids(30, ['케이크', '초콜릿']) }), desc: '달 모양 디저트 케이크 브랜드',
    official: { status: '납부 완료', due: at(30), receipt: 'R-26-0331-1043', by: '이도현', at: at(31, 11) } }));
  // 3. 제출 승인 대기 — 법인
  add(mkCase({ id: 'C047', seq: 47, created: at(3, 10, 5), stage: 'approve',
    applicant: { kind: '법인', name: '주식회사 온빛로스터리', rep: '문하람', bizNo: '000-81-00000', crn: '110111-*******', phone: '02-000-1180', email: 'office@onbit.example.com', address: '경기도 고양시 덕양구 원당로 00', custNo: '5-2024-011736' },
    mark: { type: 'combo', text: 'ONBIT ROASTERS', img: markSVG('ONBIT ROASTERS', { emblem: 'cup', c1: '#6B3E26', c2: '#E07A2E', size: 38, ls: 2 }), spec: { orig: 'PNG 3000×1000 · 2.4MB', conv: 'JPG 1000×333 · 174KB' } },
    goods: sel({ 30: ids(30, ['커피', '원두커피']), 35: ids(35, ['커피 소매업', '온라인 종합쇼핑몰업']) }), desc: '스페셜티 원두를 로스팅해 온라인 스토어와 매장에서 판매합니다.' }));
  // 4. 변리사 검토 대기 — 자동 입력 시연 기본 건
  add(mkCase({ id: 'C049', seq: 49, created: at(1, 16, 40), stage: 'review',
    applicant: { kind: '개인', name: '박준호', rrn: '880725-1******', phone: '010-3390-1127', email: 'junho.park@example.com', address: '서울특별시 은평구 통일로 00, 101동 1203호', custNo: '4-2023-087312' },
    mark: { type: 'text', text: '숲결', img: markSVG('숲결', { size: 70, ink: '#145A43' }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
    goods: sel({ 3: ids(3, ['화장품', '기초화장품', '비누']) }), desc: '숲 향을 담은 비건 기초화장품과 수제 비누를 만듭니다.' }));
  // 5. 자동화 중단 — 주소 길이 불일치
  add(mkCase({ id: 'C050', seq: 50, created: at(1, 11, 5), stage: 'error',
    applicant: { kind: '개인', name: '이하린', rrn: '950211-2******', phone: '010-5521-0093', email: 'harin.lee@example.com', address: '부산광역시 해운대구 센텀동로 00, 센텀리버뷰오피스텔 B동 1702호 (우동)', custNo: '4-2022-019844' },
    mark: { type: 'combo', text: 'PAWLY', img: markSVG('PAWLY', { emblem: 'paw', c1: '#FF7A59', c2: '#FFB199', size: 56, ls: 4 }), spec: { orig: 'PNG 1600×600 · 640KB', conv: 'JPG 1000×375 · 121KB' } },
    goods: sel({ 18: ids(18, ['반려동물용 목줄', '반려동물용 옷']), 44: ids(44, ['반려동물 미용업']) }), desc: '반려견 산책 용품과 반려동물 미용 서비스', flags: { mismatch: true } }));
  // 6. 제출 확인 대기 — 응답 끊김
  add(mkCase({ id: 'C051', seq: 51, created: at(2, 9, 30), stage: 'unknown',
    applicant: { kind: '개인', name: '최민재', rrn: '900102-1******', phone: '010-8812-6630', email: 'minjae.c@example.com', address: '대전광역시 유성구 대학로 00, 3층', custNo: '4-2025-002176' },
    mark: { type: 'text', text: '코딩마루', img: markSVG('코딩마루', { size: 60, ink: '#1B2A6B' }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
    goods: sel({ 41: ids(41, ['온라인 교육업', '학원 경영업']), 42: ids(42, ['소프트웨어 개발업']) }), desc: '초등학생 대상 온라인 코딩 교육과 학원 운영',
    official: { status: '보류', due: after(3), receipt: null, by: null, at: null } }));
  // 7. 인증 대기 — 사무소 PC 직접 인증
  add(mkCase({ id: 'C052', seq: 52, created: at(1, 13, 10), stage: 'auth',
    applicant: { kind: '개인', name: '정다온', rrn: '970830-2******', phone: '010-2207-4415', email: 'daon.j@example.com', address: '서울특별시 성동구 왕십리로 00, 4층', custNo: '4-2024-055302' },
    mark: { type: 'text', text: '다온공방', img: markSVG('다온공방', { size: 60, ink: '#7A3E9D' }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
    goods: sel({ 16: ids(16, ['스티커', '노트', '포장용 종이봉투']) }), desc: '손그림 스티커와 노트를 만드는 문구 공방' }));
  // 8. 결제 완료 · 서류 생성 — 법인
  add(mkCase({ id: 'C053', seq: 53, created: at(0, 9, 48), stage: 'paid',
    applicant: { kind: '법인', name: '한결커머스 주식회사', rep: '오지안', bizNo: '000-86-00000', crn: '110111-*******', phone: '031-000-2280', email: 'ip@hangyeol.example.com', address: '경기도 성남시 분당구 판교역로 00, 8층', custNo: null, custNoReq: true },
    mark: { type: 'text', text: 'HANGYEOL', img: markSVG('HANGYEOL', { size: 54, ls: 6 }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
    goods: sel({ 25: ids(25, ['티셔츠', '셔츠', '모자']) }), desc: '데일리 셔츠와 티셔츠 의류 브랜드', pay: { method: 'vbank', status: 'paid', tx: 'PG-VB2611C053', at: at(0, 9, 52), vbank: { bank: '시연은행', acct: '000-0000-5310-22', due: after(2) } } }));
  // 9. 입금 대기 — 가상계좌
  add(mkCase({ id: 'C054', seq: 54, created: at(0, 8, 15), stage: 'wait_deposit',
    applicant: { kind: '개인', name: '윤서아', rrn: '010419-4******', phone: '010-6631-9102', email: 'seoa.y@example.com', address: '광주광역시 동구 문화전당로 00', custNo: null, custNoReq: true },
    mark: { type: 'text', text: '봄내음', img: markSVG('봄내음', { size: 64, ink: '#C2185B' }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
    goods: sel({ 3: ids(3, ['향수', '바디로션']) }), desc: '봄꽃 향의 향수와 바디로션', pay: { method: 'vbank', status: 'wait', tx: null, at: null, vbank: { bank: '시연은행', acct: '000-0000-7718-54', due: after(1) } } }));
  // 10. 심사 중
  add(mkCase({ id: 'C038', seq: 38, created: at(20, 15), stage: 'exam',
    applicant: { kind: '개인', name: '오세훈', rrn: '860611-1******', phone: '010-4410-7731', email: 'sehoon.o@example.com', address: '인천광역시 연수구 송도과학로 00', custNo: '4-2020-061190' },
    mark: { type: 'text', text: 'NUBI', img: markSVG('NUBI', { size: 72, ls: 10, ink: '#0F766E' }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
    goods: sel({ 25: ids(25, ['운동화', '양말']) }), desc: '러닝화와 기능성 양말',
    official: { status: '납부 완료', due: at(12), receipt: 'R-26-1015-3307', by: '이도현', at: at(13, 10) } }));
  // 11. 등록 완료
  add(mkCase({ id: 'C016', seq: 16, created: at(58, 10), stage: 'registered',
    applicant: { kind: '개인', name: '강지우', rrn: '780930-1******', phone: '010-9031-2205', email: 'jiwoo.k@example.com', address: '충청남도 공주시 웅진로 00', custNo: '4-2019-077641' },
    mark: { type: 'combo', text: '새솔농원', img: markSVG('새솔농원', { emblem: 'leaf', c1: '#2E7D32', c2: '#9CCC65', size: 54 }), spec: { orig: 'JPG 1800×600 · 820KB', conv: 'JPG 1000×333 · 140KB' } },
    goods: sel({ 29: ids(29, ['김치', '잼']) }), desc: '직접 재배한 배추로 담근 김치와 과일잼',
    official: { status: '납부 완료', due: at(50), receipt: 'R-26-0902-0815', by: '이도현', at: at(51, 9) } }));
  // 12. 작성 중 (중간 저장)
  add(mkCase({ id: 'C055', seq: 55, created: at(0, 7, 40), stage: 'draft',
    applicant: { kind: '개인', name: '신예린', rrn: '', phone: '010-1180-4426', email: 'yerin.s@example.com', address: '', custNo: null },
    mark: { type: 'text', text: 'LUMIQ', img: markSVG('LUMIQ', { size: 66, ls: 8, ink: '#5B21B6' }), spec: { orig: '문자 상표 (자동 생성)', conv: '—' } },
    goods: sel({ 3: ids(3, ['화장품']) }), desc: '', pay: { method: null, status: 'none', tx: null, at: null } }));
  // 13. 취소 · 환불 (관납료 반환과 구분)
  add(mkCase({ id: 'C044', seq: 44, created: at(6, 14), stage: 'cancel',
    applicant: { kind: '개인', name: '문태오', rrn: '830505-1******', phone: '010-7720-3381', email: 'taeo.m@example.com', address: '경상북도 경주시 원화로 00', custNo: '4-2022-090313' },
    mark: { type: 'text', text: '토담골', img: markSVG('토담골', { size: 62, ink: '#8D5524' }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
    goods: sel({ 43: ids(43, ['음식점업']) }), desc: '한식 음식점',
    pay: { method: 'card', status: 'refunded', tx: 'PG-CARD2610C044', at: at(6, 14, 20), refund: { at: at(4, 11), amount: 0, reason: '출원 전 고객 요청 취소' } },
    official: { status: '미납', due: null, receipt: null, by: null, at: null } }));

  /* 시드 이력 · 증적 · 결과 채우기 */
  function hist(c, t, who, msg) { c.history.push({ t: t, who: who, msg: msg }); }
  function alert(c, t, title, body) { c.alerts.push({ t: t, title: title, body: body }); }
  CASES.forEach(function (c) {
    var t0 = c.created, ap = c.applicant.name;
    hist(c, t0, ap, '출원 신청서 작성 시작');
    if (c.stage === 'draft') { hist(c, t0 + 9e5, ap, '중간 저장 (3단계 · 상품류 선택)'); return; }
    hist(c, t0 + 18e5, ap, '신청 내용 확인 · 위임장 미리보기 동의');
    if (c.pay.method === 'vbank') { hist(c, t0 + 20e5, '시스템', '가상계좌 발급 (' + c.pay.vbank.bank + ' ' + c.pay.vbank.acct + ')'); alert(c, t0 + 20e5, '가상계좌 안내', '입금 기한 ' + U.date(c.pay.vbank.due) + ' 18:00 · 금액 ' + U.won(c.fee.total)); }
    if (c.stage === 'wait_deposit') return;
    if (c.pay.method === 'vbank') hist(c, c.pay.at, 'PG', '가상계좌 입금 통지 수신 · 금액 대조 일치 (' + U.won(c.fee.total) + ')');
    else hist(c, c.pay.at, 'PG', '카드 결제 승인 · 서버 금액 재계산 일치 (' + U.won(c.fee.total) + ')');
    alert(c, c.pay.at, '결제 완료', '상표 「' + c.mark.text + '」 출원 신청과 결제가 완료되었습니다. 변리사 검토 후 출원을 진행합니다.');
    c.poa = { formVer: FORM.current, hash: U.hash('POA:' + c.id + ':v' + c.ver), at: c.pay.at + 6e4 };
    hist(c, c.pay.at + 6e4, '시스템', '위임장 PDF 생성 (양식 ' + FORM.current + ' · 해시 ' + U.short(c.poa.hash) + ')');
    if (c.stage === 'cancel') {
      hist(c, at(4, 11), '이도현', '고객 요청 취소 · 카드 결제 전액 취소 (관납료 미납 상태 확인)');
      c.pay.refund.amount = c.fee.total;
      alert(c, at(4, 11), '취소 완료', '출원 신청이 취소되었고 결제가 전액 취소되었습니다.');
      return;
    }
    if (c.stage === 'paid') return;
    // 진행 이후 공통
    var tr = c.pay.at + 3 * 36e5;
    if (['review'].indexOf(c.stage) < 0) {
      hist(c, tr, '정하윤', '변리사 검토 완료 · 자동 입력 시작');
      var job = 'JOB-' + c.id.slice(1) + '-v' + c.ver;
      c.auto.job = { id: job, ver: c.ver };
      var done = { error: 1, approve: 4, auth: 5, unknown: 5 }[c.stage];
      if (done == null) done = 7;
      for (var i = 0; i < 7; i++) {
        var s = c.auto.steps[i];
        if (i < done) { s.state = 'done'; s.at = tr + (i + 1) * 9e4; }
      }
      c.auto.log.push({ t: tr + 3e4, lvl: 'info', msg: '[' + job + '] 작업 수신 · 출원 건 잠금 획득' });
      if (c.stage === 'error') {
        c.auto.steps[1].state = 'stop'; c.auto.steps[1].at = tr + 18e4;
        c.auto.err = { step: 2, field: '출원인 주소', expect: c.applicant.address, got: c.applicant.address.slice(0, 40), msg: '입력값 대조 불일치 — 화면 입력 칸이 40자에서 잘림' };
        c.auto.log.push({ t: tr + 12e4, lvl: 'info', msg: '출원인 성명·특허고객번호 입력 · 대조 일치' });
        c.auto.log.push({ t: tr + 18e4, lvl: 'error', msg: '출원인 주소 대조 불일치 (원본 ' + c.applicant.address.length + '자 / 화면 40자) → 자동화 중단, 관리자 알림' });
        hist(c, tr + 18e4, '연동 워커', '② 출원 정보 입력에서 중단 — 출원인 주소 대조 불일치');
        return;
      }
      c.auto.log.push({ t: tr + 12e4, lvl: 'info', msg: '출원인·상표·지정상품·대리인 정보 입력 · 대조 ' + '일치' });
      c.auto.log.push({ t: tr + 21e4, lvl: 'info', msg: '위임장 PDF·상표 이미지 첨부 · 해시 대조 일치' });
      c.auto.log.push({ t: tr + 27e4, lvl: 'info', msg: '단계별 증적 화면 3장 저장' });
      hist(c, tr + 27e4, '연동 워커', '자동 입력·첨부 완료 · 제출 승인 대기');
      if (c.stage === 'approve') return;
      c.auto.approval = { ver: c.ver, by: '정하윤', at: tr + 5 * 36e5, hash: c.versions[c.ver - 1].hash };
      hist(c, tr + 5 * 36e5, '정하윤', '제출 승인 (v' + c.ver + ' · 해시 ' + U.short(c.auto.approval.hash) + ')');
      c.auto.steps[4].state = 'done'; c.auto.steps[4].at = tr + 5 * 36e5;
      if (c.stage === 'auth') {
        c.auto.steps[5].state = 'wait-auth';
        c.auto.log.push({ t: tr + 5 * 36e5 + 6e4, lvl: 'warn', msg: '인증창 직접 조작 필요 — 사무소 PC에서 담당자 인증 대기' });
        hist(c, tr + 5 * 36e5 + 6e4, '연동 워커', '인증 대기 — 사무소 담당자 인증 필요');
        return;
      }
      if (c.stage === 'unknown') {
        c.auto.steps[5].state = 'unknown';
        c.auto.submitTries.push({ at: tr + 5 * 36e5 + 12e4, result: '응답 끊김' });
        c.auto.log.push({ t: tr + 5 * 36e5 + 12e4, lvl: 'error', msg: '제출 명령 후 응답 끊김 → 자동 재제출하지 않음 · 확인 대기 전환' });
        hist(c, tr + 5 * 36e5 + 12e4, '연동 워커', '제출 응답 끊김 — 확인 대기 (재제출·납부 보류)');
        return;
      }
      var ts = tr + 5 * 36e5 + 12e4;
      c.auto.submitTries.push({ at: ts, result: '제출 완료' });
      c.receipt = { no: '1-1-' + new Date(ts).getFullYear() + '-' + U.pad(Math.floor(1e5 + (c.seq * 7919) % 899999), 7) + '-' + U.pad(c.seq % 90 + 10), appNo: '40-' + new Date(ts).getFullYear() + '-' + U.pad(Math.floor(1e5 + (c.seq * 104729) % 899999), 7), at: ts };
      c.auto.log.push({ t: ts, lvl: 'ok', msg: '제출 완료 · 접수번호 ' + c.receipt.no + ' / 출원번호 ' + c.receipt.appNo });
      hist(c, ts, '연동 워커', '제출 완료 · 접수번호·출원번호 기록');
      alert(c, ts + 6e4, '출원 완료', '상표 「' + c.mark.text + '」 출원이 완료되었습니다. 출원번호 ' + c.receipt.appNo);
      if (c.official.status === '납부 완료') hist(c, c.official.at, c.official.by, '관납료 납부 기록 (영수증 ' + c.official.receipt + ')');
      if (c.stage === 'decided' || c.stage === 'registered') {
        var td = c.stage === 'decided' ? at(1, 10) : at(12, 10);
        hist(c, td, '정하윤', '등록 결정 반영 · 등록료 안내 발송');
        c.reg = { decidedAt: td, fee: calcRegFee(c.fee.classes), pay: { status: c.stage === 'registered' ? 'paid' : 'wait', at: c.stage === 'registered' ? at(10, 15) : null, tx: c.stage === 'registered' ? 'PG-REG' + c.id : null }, official: { status: c.stage === 'registered' ? '납부 완료' : '미납', due: c.stage === 'registered' ? at(8) : after(28), receipt: c.stage === 'registered' ? 'R-REG-' + c.id : null } };
        alert(c, td, '등록 결정', '축하합니다! 상표 「' + c.mark.text + '」의 등록이 결정되었습니다. 등록료 결제 후 대리인이 등록 절차를 진행합니다.');
        if (c.stage === 'registered') { hist(c, at(10, 15), c.applicant.name, '등록료·대리 수수료 결제'); hist(c, at(8, 11), '이도현', '등록료 납부 기록'); hist(c, at(5, 10), '정하윤', '등록 완료 반영'); alert(c, at(5, 10), '등록 완료', '상표 「' + c.mark.text + '」 등록이 완료되었습니다.'); }
      }
    }
  });
  // 승인 대기 건의 미납 관납료 기한 · 제출 완료 건 기본값
  CASES.forEach(function (c) {
    if (['approve', 'auth', 'review', 'error', 'paid'].indexOf(c.stage) >= 0) { c.official.status = '미납'; c.official.due = null; }
    if (c.stage === 'exam' && c.official.status !== '납부 완료') { c.official.status = '미납'; c.official.due = after(2); }
  });
  // 오늘 제출된 건 하나 — 관납료 기한 임박 시연
  (function () {
    var c = add(mkCase({ id: 'C048', seq: 48, created: at(2, 15, 10), stage: 'submitted',
      applicant: { kind: '개인', name: '서은채', rrn: '990120-2******', phone: '010-4471-0389', email: 'eunchae.s@example.com', address: '서울특별시 송파구 올림픽로 00, 5층', custNo: '4-2025-071165' },
      mark: { type: 'text', text: '포근달', img: markSVG('포근달', { size: 62, ink: '#3949AB' }), spec: { orig: '문자 상표 (자동 생성)', conv: 'JPG 1000×333 · 시연' } },
      goods: sel({ 25: ids(25, ['아동복', '모자']), 18: ids(18, ['배낭']) }), desc: '아이 옷과 아동용 가방' }));
    var t = c.created; hist(c, t, c.applicant.name, '출원 신청서 작성 시작'); hist(c, c.pay.at, 'PG', '카드 결제 승인 · 서버 금액 재계산 일치 (' + U.won(c.fee.total) + ')');
    c.poa = { formVer: FORM.current, hash: U.hash('POA:' + c.id + ':v1'), at: c.pay.at + 6e4 };
    c.auto.job = { id: 'JOB-048-v1', ver: 1 }; c.auto.steps.forEach(function (s, i) { s.state = 'done'; s.at = at(0, 9, 10 + i * 3); });
    c.auto.approval = { ver: 1, by: '정하윤', at: at(0, 9, 20), hash: c.versions[0].hash };
    c.receipt = { no: '1-1-' + new Date().getFullYear() + '-0' + '518204-31', appNo: null, at: at(0, 9, 26) };
    c.auto.submitTries.push({ at: at(0, 9, 26), result: '제출 완료' });
    c.auto.log.push({ t: at(0, 9, 26), lvl: 'ok', msg: '제출 완료 · 접수번호 기록 · 출원번호 확인 대기' });
    hist(c, at(0, 9, 26), '연동 워커', '제출 완료 · 접수번호 기록 (출원번호 확인 대기)');
    c.official = { status: '미납', amount: c.fee.official, due: after(0, 18), receipt: null, by: null, at: null };
    alert(c, at(0, 9, 30), '출원 제출 완료', '상표 「포근달」 출원서가 제출되었습니다. 출원번호는 확인되는 대로 안내드립니다.');
  })();
  CASES.sort(function (a, b) { return b.created - a.created; });

  /* ---------- 연동 워커 ---------- */
  var WORKER = {
    id: 'OFFICE-PC-01', name: '사무소 연동 PC 1', place: '마포 사무소 3층 출원실', online: true, beat: Date.now() - 2e4,
    mode: '웹출원 자동화 (1순위 방식)', def: '입력 위치 정의 v3', ver: 'worker 1.4.2',
    checks: [
      { t: at(0, 7, 0), ok: true, msg: '화면 구조 점검 정상 · 입력 위치 22곳 일치 (제출·납부 미실행)' },
      { t: at(1, 7, 0), ok: true, msg: '화면 구조 점검 정상 · 입력 위치 22곳 일치' },
      { t: at(2, 7, 0), ok: true, msg: '화면 구조 점검 정상' },
      { t: at(3, 7, 0), ok: false, msg: '화면 변경 감지 — 지정상품 입력 영역 위치 변경 → 입력 위치 정의 v3 반영 후 재점검 정상', fix: '이도현 확인 · 09:12 조치' },
      { t: at(4, 7, 0), ok: true, msg: '화면 구조 점검 정상' }
    ]
  };

  /* ---------- 감사 로그 ---------- */
  var AUDIT = [
    { t: at(0, 9, 26), who: '연동 워커', act: '제출', target: 'TM-' + '…0048', detail: '접수번호 기록' },
    { t: at(0, 9, 20), who: '정하윤', act: '제출 승인', target: '…0048', detail: 'v1 · 해시 대조 일치' },
    { t: at(0, 8, 41), who: '이도현', act: '개인정보 열람', target: '회원 최민재', detail: '사유: 관납료 납부 확인' },
    { t: at(1, 17, 5), who: '한소율', act: '알림 발송', target: '…0047', detail: '서류 준비 안내' },
    { t: at(1, 14, 30), who: '정하윤', act: '양식 열람', target: '위임장 양식 v2', detail: '—' },
    { t: at(3, 9, 12), who: '이도현', act: '점검 조치 확인', target: '연동 워커', detail: '입력 위치 정의 v3 반영' }
  ];

  window.DB = {
    U: U, NOW: NOW, DAY: DAY, at: at, after: after,
    OFFICE: OFFICE, ADMINS: ADMINS, ROLE: ROLE, CUSTOMERS: CUSTOMERS, RATE: RATE, SPEC: SPEC,
    CLASS: CLASS, G: G, GMAP: GMAP, aiSuggest: aiSuggest, calcFee: calcFee, calcRegFee: calcRegFee,
    STAGE: STAGE, ORDER: ORDER, CUST_STEPS: CUST_STEPS, custStep: custStep, AUTO_STEPS: AUTO_STEPS,
    FORM: FORM, markSVG: markSVG, CASES: CASES, WORKER: WORKER, AUDIT: AUDIT,
    nextSeq: function () { seq = Math.max(seq, CASES.reduce(function (max, c) { return Math.max(max, c.seq); }, 55)) + 1; return seq; },
    getSequence: function () { return seq; },
    setSequence: function (n) { if (Number.isInteger(n) && n >= 55) seq = Math.max(seq, n); },
    find: function (id) { return CASES.filter(function (c) { return c.id === id; })[0]; },
    hist: hist, alert: alert, mkCase: mkCase, sel: sel
  };
})();
