export const site = {
  domain: "stockdruid.me",
  url: "https://stockdruid.me",
  name: "stockdruid",
  // TODO: 실명 쓸지 핸들만 쓸지 정하기
  displayName: "stockdruid",
  role: "Security / Backend Engineer",
  tagline: ["악성코드를 분석하고", "보안 규정을 코드로", "옮기는 개발자입니다"],
  summary:
    "샌드박스가 남긴 분석 기록에서 필요한 내용만 골라 보여 주는 도구를 만들었고, 사내 챗봇 대화에서 망분리와 개인정보 규정에 어긋나는 부분을 찾아내는 시스템을 설계했습니다. 팀으로 일할 때에는 주로 백엔드와 데이터 모델을 담당했습니다.",
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
  "주로 악성코드와 네트워크 쪽을 들여다보았습니다. CAPE 샌드박스가 남기는 분석 기록은 수천 줄에 이르지만 실제로 확인해야 하는 부분은 그중 일부였고, 그래서 필요한 항목만 골라 보여 주는 도구를 만들었습니다. 포트 스캐너를 만들 때에도 번호만 알려 주는 방식으로는 부족하다고 판단하여, 응답 내용을 읽고 어떤 서비스가 동작하고 있는지까지 확인하도록 구현했습니다.",
  "규정을 코드로 옮기는 작업도 해 보았습니다. 금융권의 망분리 기준과 개인정보 처리 요건은 수백 건에 이르는데, 문서 형태로만 두면 어느 부분이 비어 있는지 확인하기 어렵습니다. 이를 조회할 수 있는 표 구조로 정리한 다음, 챗봇 대화 기록에서 규정에 어긋나는 사례를 찾아내는 기능을 덧붙였습니다. 정책을 담당하는 쪽에서 자료를 수정하더라도 코드를 고치지 않고 반영할 수 있도록 만드는 것이 목표였습니다.",
  "혼자 진행할 때에는 기획부터 배포까지 전부 맡았고, 팀으로 일할 때에는 주로 데이터 모델과 API 설계를 담당했습니다. 어느 경우든 사용할 기술을 먼저 정하기보다 무엇을 지켜야 하는지를 먼저 확인하려고 합니다.",
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
    title: "쓰임새를 먼저 확인하고 기술을 고릅니다",
    body: "사용할 기술이 목적을 정하지는 않는다고 생각합니다. 외부와 연결되지 않은 환경에서 쓰는 분석 도구는 서버를 두지 않는 데스크톱 프로그램으로 만들었고, 개발자가 아닌 분이 직접 설치해야 하는 현장용 앱은 외부 라이브러리를 사용하지 않는 방식으로 구성했습니다.",
    evidence: "순회점검 시스템은 외부 라이브러리와 데이터베이스 없이 구성했습니다",
  },
  {
    title: "도구 자체가 규정을 어기지 않도록 합니다",
    body: "망분리 위반을 찾아내는 시스템이 검사 대상인 기록을 외부 서비스로 전송한다면, 그 도구가 먼저 규정을 어기는 셈이 됩니다. 처리 속도를 어느 정도 포기하더라도 내부에서만 동작하는 모델을 사용하기로 했습니다.",
    evidence: "외부 API 대신 내부에 설치한 모델을 사용했습니다",
  },
  {
    title: "검토는 형식이 아니라 실제 확인 절차여야 합니다",
    body: "같은 모델이 코드를 작성하고 그 코드를 다시 검토하면 동일한 부분을 놓치게 됩니다. 포트 번호만 보고 판단하는 스캐너가 표준과 다른 설정 앞에서 그대로 틀리는 것과 비슷한 문제라고 보았습니다. 판단의 근거를 따로 확보해야 검토가 의미를 가진다고 생각합니다.",
    evidence: "검토용 모델을 작성에 사용한 모델과 다른 것으로 지정했습니다",
  },
  {
    title: "오류를 숨기지 않습니다",
    body: "이 사이트의 문의 기능도 같은 기준으로 만들었습니다. 메일 발송에 실패하더라도 문의 내용은 서버에 남도록 했고, 브라우저에서 복사 기능이 동작하지 않는 경우에는 실패했다는 사실을 표시하고 값을 선택해 드리도록 했습니다.",
    evidence: "메일 발송이 실패해도 문의 내용은 남습니다",
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
    summary: "분석과 진단을 다룹니다. 가장 오래 공부한 분야입니다.",
    accent: "lime",
    items: [
      {
        name: "악성코드 분석",
        context: "CAPEv2 분석 기록 해석, 동작 순서 추출, 검체 간 비교",
      },
      {
        name: "네트워크 스캐닝",
        context: "응답 내용을 이용한 서비스 식별, 동시 처리와 시간 제한 설계",
      },
      {
        name: "컴플라이언스 진단",
        context: "ISMS-P 요구사항 268건 연결, 망분리 위반 탐지 규칙 설계",
      },
      {
        name: "개인정보 처리",
        context: "개인정보 항목 정규화, 위험도 산정 체계 구현",
      },
      {
        name: "보안 설계",
        context: "권한 3단계 분리, 공격 범위 축소, 비밀값 분리와 해시 저장",
      },
    ],
  },
  {
    group: "Languages",
    summary: "다루는 문제의 성격에 따라 선택합니다.",
    accent: "aqua",
    items: [
      { name: "Python", context: "분석 프로그램, 진단 서버, 데이터 정리 스크립트" },
      { name: "C++20", context: "서비스 식별 포트 스캐너. 동시 처리와 시간 제한을 직접 제어" },
      { name: "TypeScript", context: "대시보드, 데스크톱 프로그램, 이 사이트" },
      { name: "SQL", context: "표 구조 설계, 정규화 작업, 누락 여부 조회" },
    ],
  },
  {
    group: "Backend & Data",
    summary: "API 설계와 데이터 모델을 주로 담당했습니다.",
    accent: "aqua",
    items: [
      { name: "FastAPI", context: "진단 API, ISMS-P 판정 기능, 일괄 처리 기능" },
      {
        name: "PostgreSQL",
        context: "기준이 되는 표 구조를 v1부터 v4까지 설계, alembic 으로 변경 관리",
      },
      { name: "Node.js", context: "외부 라이브러리 없이 파일로 저장하는 서버, Next.js 라우트" },
      { name: "Next.js", context: "App Router, 정적 생성, 서버 전용 모듈 구분" },
      { name: "Streamlit", context: "컴플라이언스 대시보드에 실제 자료 연결" },
    ],
  },
  {
    group: "Frontend & Desktop",
    summary: "사용자가 보는 화면도 직접 만들었습니다.",
    accent: "aqua",
    items: [
      { name: "React", context: "서버와 클라이언트 컴포넌트 구분, 전송량 관리" },
      { name: "CSS", context: "디자인 값 정리, CSS Modules, 명도 대비 계산" },
      { name: "PyQt6", context: "외부와 연결되지 않은 환경에서 쓰는 분석 프로그램" },
      { name: "Canvas API", context: "마크다운을 이미지로 합성, PWA 형태로 배포" },
    ],
  },
  {
    group: "AI",
    summary: "도구로 사용합니다. 제약이 있는 환경에서 어떻게 활용할지를 중요하게 봅니다.",
    accent: "aqua",
    items: [
      {
        name: "로컬 추론",
        context: "망분리 환경에서 자료를 내보내지 않고 기록을 분석",
      },
      { name: "RAG", context: "Chroma 를 이용한 규정 문서 검색" },
      { name: "Vision API", context: "현장 사진에서 위험 요인 확인, 선택 기능으로 구성" },
      {
        name: "프로바이더 추상화",
        context: "다섯 개 서비스의 사용량을 같은 형식으로 정리하고 잔여량 확인",
      },
    ],
  },
  {
    group: "Infra & Ops",
    summary: "만든 것을 직접 서버에 올려 운영하고 있습니다.",
    accent: "aqua",
    items: [
      { name: "Cloudflare", context: "Tunnel, DNS, 메일 전달, 캐시와 방화벽 설정" },
      { name: "PM2", context: "서버 상시 구동, 부팅 시 자동 실행, 환경 변수 관리" },
      { name: "Git / GitHub", context: "브랜치 운영, 충돌 해결, 배포 관리" },
      { name: "Windows / Linux", context: "직접 구축한 서버 운영, 서비스 등록, 기록 확인" },
    ],
  },
];
