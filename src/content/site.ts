export const site = {
  domain: "stockdruid.me",
  url: "https://stockdruid.me",
  name: "stockdruid",
  // TODO: 실명 쓸지 핸들만 쓸지 정하기
  displayName: "stockdruid",
  role: "Backend / Security Engineer",
  tagline: ["보안과 AI 사이를", "오가며 만드는", "개발자"],
  summary:
    "악성코드 분석 도구부터 금융권 컴플라이언스 진단 시스템까지, 문제의 형태에 맞는 도구를 골라 만듭니다. 팀 프로젝트에서는 주로 백엔드와 인프라를 맡습니다.",
  email: "clef1733@gmail.com",
  links: {
    github: "https://github.com/stockdruid",
    // TODO: LinkedIn 계정 있으면 채우기, 없으면 이 줄 삭제
    linkedin: "",
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
    group: "Languages",
    items: [
      { name: "Python", context: "악성코드 분석 GUI, 컴플라이언스 진단 백엔드" },
      { name: "TypeScript", context: "Next.js 대시보드, Electron 데스크탑 앱" },
      { name: "C++20", context: "service-aware 포트 스캐너" },
      { name: "SQL", context: "PostgreSQL 스키마 설계, 정규화 마이그레이션" },
    ],
  },
  {
    group: "Backend & Data",
    items: [
      { name: "FastAPI", context: "진단 API, 판정 인터페이스" },
      { name: "PostgreSQL", context: "단일 진실원 테이블 설계, alembic 마이그레이션" },
      { name: "Node.js", context: "의존성 없는 파일 기반 백엔드" },
      { name: "Streamlit", context: "컴플라이언스 대시보드" },
    ],
  },
  {
    group: "Security",
    items: [
      { name: "Malware Analysis", context: "CAPEv2 리포트 구조 분석·시각화" },
      { name: "Network Scanning", context: "서비스 식별 기반 포트 스캐너 설계" },
      { name: "Compliance", context: "ISMS-P 매핑, 망분리 위반 탐지 룰" },
    ],
  },
  {
    group: "AI",
    items: [
      { name: "LLM Orchestration", context: "5개 프로바이더 추상화, 역할별 에이전트 팀" },
      { name: "RAG", context: "Chroma 기반 정책 문서 검색" },
      { name: "Ollama", context: "로컬 모델 추론, 망분리 환경 대응" },
    ],
  },
];
