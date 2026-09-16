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
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export type SkillGroup = {
  group: string;
  items: { name: string; context: string }[];
};

/**
 * 로고 나열 대신 "무엇에 써봤는지"를 같이 적는다.
 * 숙련도 주장보다 사용 맥락이 검증 가능하다.
 */
export const skills: SkillGroup[] = [
  {
    group: "Security",
    items: [
      {
        name: "악성코드 분석",
        context: "CAPEv2 샌드박스 리포트 파싱, 행위 시퀀스 추출, 샘플 비교",
      },
      {
        name: "네트워크 스캐닝",
        context: "배너 수집 기반 서비스 식별, 스레드 풀 동시성 제어",
      },
      {
        name: "컴플라이언스 진단",
        context: "ISMS-P 요구사항 268건 매핑, 망분리 위반 탐지 룰 설계",
      },
      {
        name: "개인정보 처리",
        context: "PII 필드 정규화, 위험도 산정 체계 구현",
      },
      {
        name: "보안 설계",
        context: "권한 게이팅 정책, 공격 표면 축소, 시크릿 관리",
      },
    ],
  },
  {
    group: "Languages",
    items: [
      { name: "Python", context: "악성코드 분석 GUI, 컴플라이언스 진단 백엔드" },
      { name: "C++20", context: "서비스 식별 포트 스캐너" },
      { name: "TypeScript", context: "대시보드, 데스크탑 앱, 이 사이트" },
      { name: "SQL", context: "PostgreSQL 스키마 설계, 정규화 마이그레이션" },
    ],
  },
  {
    group: "Backend & Data",
    items: [
      { name: "FastAPI", context: "진단 API, 판정 인터페이스" },
      { name: "PostgreSQL", context: "단일 진실원 테이블 설계, alembic 마이그레이션" },
      { name: "Node.js", context: "외부 의존성 없는 파일 기반 백엔드" },
      { name: "Streamlit", context: "컴플라이언스 대시보드" },
    ],
  },
  {
    group: "AI",
    items: [
      {
        name: "로컬 추론",
        context: "망분리 환경에서 외부 반출 없이 Ollama로 로그 분석",
      },
      { name: "RAG", context: "Chroma 기반 정책 문서 검색" },
    ],
  },
];
