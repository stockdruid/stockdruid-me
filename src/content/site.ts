export const site = {
  domain: "stockdruid.me",
  url: "https://stockdruid.me",
  name: "stockdruid",
  // TODO: 실명 쓸지 핸들만 쓸지 정하기
  displayName: "stockdruid",
  role: "Security / Backend Engineer",
  tagline: ["악성코드를 뜯어보고", "망분리 위반을 잡는", "백엔드 개발자"],
  summary:
    "CAPE 샌드박스 리포트에서 악성코드 행위를 추려내는 분석 도구를 만들었고, 금융권 챗봇 로그에서 망분리와 개인정보 규정 위반을 찾아내는 진단 시스템을 설계했습니다. 팀 프로젝트에서는 백엔드와 데이터 모델을 맡습니다.",
  email: "me@stockdruid.me",
  links: {
    github: "https://github.com/stockdruid",
    // TODO: LinkedIn 계정 있으면 채우기, 없으면 이 줄 삭제
    linkedin: "",
  },
  /** 링크로 열 수 없는 연락처. 클릭하면 복사된다. */
  handles: {
    discord: "@stockdruid",
  },
} as const;

export const navItems = [
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

/* ------------------------------------------------------------------ */
/* 어떤 사람인가                                                        */
/* ------------------------------------------------------------------ */

export const aboutParagraphs = [
  "악성코드와 네트워크를 주로 들여다봤습니다. CAPE 샌드박스가 뱉는 수천 줄짜리 JSON에서 분석가가 실제로 봐야 할 행위만 추려내는 도구를 만들었고, 포트 번호만 알려주는 스캐너로는 부족해서 응답 배너를 읽고 서비스를 직접 식별하는 스캐너를 C++로 짰습니다.",
  "규정을 코드로 옮기는 일도 했습니다. 금융권 망분리 기준과 개인정보 처리 요건 수백 건을 조인 가능한 테이블로 정규화하고, 사내 챗봇 로그에서 위반을 자동으로 잡아내는 진단 엔진을 붙였습니다. 정책팀이 만든 자료가 코드 수정 없이 흡수되는 구조를 만드는 게 목표였습니다.",
  "혼자 만들 때는 처음부터 끝까지, 팀에서는 주로 데이터 모델과 API 경계를 맡습니다. 어느 쪽이든 먼저 정하는 건 스택이 아니라 지켜야 할 것입니다.",
];

export type Principle = {
  title: string;
  body: string;
  /** 말이 아니라 실제로 그렇게 한 사례 */
  evidence: string;
};

/**
 * 원칙은 구호가 아니라 실제 결정에서 뽑았다.
 * 각 항목의 evidence 는 프로젝트에서 그 원칙 때문에 무엇을 포기했는지를 적는다.
 */
export const principles: Principle[] = [
  {
    title: "도구는 지킬 것에 맞춰 고른다",
    body: "스택이 목적을 정하지 않습니다. 격리망 안에서 도는 분석기는 서버를 끼우지 않는 데스크탑 GUI로, 설치하는 사람이 개발자가 아닌 현장 앱은 외부 의존성을 전부 걷어낸 웹으로 만들었습니다.",
    evidence: "순회점검 시스템은 npm 의존성 0개, DB도 파일 기반",
  },
  {
    title: "도구가 스스로 규정을 어기면 안 된다",
    body: "망분리 위반을 잡는 시스템이 로그를 외부 API로 보내면 그 도구 자체가 위반입니다. 성능을 일부 포기하고 로컬 추론으로 갔습니다.",
    evidence: "클라우드 LLM 대신 Ollama 로컬 모델",
  },
  {
    title: "검증은 형식이 아니라 방어선",
    body: "같은 모델이 코드를 쓰고 그 코드를 리뷰하면 맹점을 공유한 채로 통과시킵니다. 포트 번호만 보는 스캐너가 비표준 포트 앞에서 그대로 틀리는 것과 같습니다. 판단의 근거를 따로 확보해야 검증이 성립합니다.",
    evidence: "검증 모델을 개발 모델과 다른 프로바이더로 강제",
  },
  {
    title: "실패를 조용히 삼키지 않는다",
    body: "이 사이트의 문의 폼도 같은 기준으로 만들었습니다. 메일 발송이 실패해도 문의는 디스크에 남고, 클립보드 복사가 막힌 환경에서는 실패를 표시하고 값을 선택해 줍니다.",
    evidence: "메일 실패 시 파일 적재로 유실 방지",
  },
];

/* ------------------------------------------------------------------ */
/* 기술 스택                                                            */
/* ------------------------------------------------------------------ */

export type StackItem = {
  name: string;
  /** 어디에 써봤는지. 숙련도 주장보다 사용 맥락이 검증 가능하다. */
  context: string;
};

export type StackGroup = {
  group: string;
  summary: string;
  accent: "lime" | "aqua";
  items: StackItem[];
};

export const stack: StackGroup[] = [
  {
    group: "Security",
    summary: "분석과 진단. 가장 오래 붙잡고 있는 영역입니다.",
    accent: "lime",
    items: [
      {
        name: "악성코드 분석",
        context: "CAPEv2 샌드박스 리포트 파싱, 행위 시퀀스 추출, 샘플 간 비교",
      },
      {
        name: "네트워크 스캐닝",
        context: "배너 수집 기반 서비스 식별, 스레드 풀과 타임아웃 정책 설계",
      },
      {
        name: "컴플라이언스 진단",
        context: "ISMS-P 요구사항 268건 매핑, 망분리 위반 탐지 룰 설계",
      },
      {
        name: "개인정보 처리",
        context: "PII 필드 정규화 리졸버, 위험도 산정 체계 구현",
      },
      {
        name: "보안 설계",
        context: "권한 3단계 게이팅, 공격 표면 축소, 시크릿 분리와 해시 저장",
      },
    ],
  },
  {
    group: "Languages",
    summary: "문제의 성격에 따라 고릅니다.",
    accent: "aqua",
    items: [
      { name: "Python", context: "분석 GUI, 진단 백엔드, 데이터 정규화 스크립트" },
      { name: "C++20", context: "서비스 식별 포트 스캐너. 동시성과 타임아웃 직접 제어" },
      { name: "TypeScript", context: "대시보드, 데스크탑 앱, 이 사이트" },
      { name: "SQL", context: "스키마 설계, 정규화 마이그레이션, 커버리지 질의" },
    ],
  },
  {
    group: "Backend & Data",
    summary: "API 경계와 데이터 모델을 주로 맡습니다.",
    accent: "aqua",
    items: [
      { name: "FastAPI", context: "진단 API, ISMS-P 판정 인터페이스, 배치 엔드포인트" },
      {
        name: "PostgreSQL",
        context: "단일 진실원 테이블 v1~v4 설계, alembic 마이그레이션",
      },
      { name: "Node.js", context: "외부 의존성 없는 파일 기반 백엔드, Next.js 라우트" },
      { name: "Next.js", context: "App Router, 정적 생성, 서버 전용 모듈 분리" },
      { name: "Streamlit", context: "컴플라이언스 대시보드 실데이터 연동" },
    ],
  },
  {
    group: "Frontend & Desktop",
    summary: "보여주는 쪽도 직접 만듭니다.",
    accent: "aqua",
    items: [
      { name: "React", context: "서버/클라이언트 컴포넌트 분리, 번들 크기 관리" },
      { name: "CSS", context: "디자인 토큰 설계, CSS Modules, 접근성 대비 계산" },
      { name: "PyQt6", context: "격리망용 데스크탑 분석 GUI" },
      { name: "Canvas API", context: "마크다운 합성 렌더링, PWA 패키징" },
    ],
  },
  {
    group: "AI",
    summary: "도구로 씁니다. 제약이 있는 환경에서 어떻게 쓸지가 핵심입니다.",
    accent: "aqua",
    items: [
      {
        name: "로컬 추론",
        context: "망분리 환경에서 외부 반출 없이 Ollama 로 로그 분석",
      },
      { name: "RAG", context: "Chroma 기반 정책 문서 검색" },
      { name: "Vision API", context: "현장 사진에서 위험요인 추출, 기능 플래그 뒤 배치" },
      {
        name: "프로바이더 추상화",
        context: "5종 프로바이더 usage 정규화, 할당량 추적",
      },
    ],
  },
  {
    group: "Infra & Ops",
    summary: "만든 것은 직접 띄워서 운영합니다.",
    accent: "aqua",
    items: [
      { name: "Cloudflare", context: "Tunnel, DNS, Email Routing, 엣지 캐시와 WAF" },
      { name: "PM2", context: "프로세스 상시 구동, 부팅 자동 시작, 환경변수 관리" },
      { name: "Git / GitHub", context: "브랜치 전략, 충돌 해소, 릴리스 관리" },
      { name: "Windows / Linux", context: "자택 서버 운영, 서비스 등록, 로그 추적" },
    ],
  },
];
