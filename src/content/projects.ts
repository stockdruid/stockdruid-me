export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  period: string;
  stack: string[];
  /** public/ 기준 경로. 없으면 카드가 생성 그라디언트로 대체한다. */
  thumbnail?: string;
  /** 카드 폴백 그라디언트 색상각 (0–360) */
  hue: number;
  featured?: boolean;
  links: { github?: string; demo?: string };
  body: {
    problem: string;
    contribution: string[];
    /** "무엇을 썼다"가 아니라 "왜 그것을 골랐다" */
    decisions: { choice: string; why: string }[];
    outcome: string;
  };
};

export const projects: Project[] = [
  {
    slug: "finai-compliance",
    title: "금융 AI 망분리 컴플라이언스 진단 시스템",
    tagline:
      "금융권 AI 챗봇 로그에서 망분리·개인정보 규정 위반을 자동으로 잡아내는 진단 엔진",
    role: "백엔드 · DB 스키마 · 대시보드",
    period: "2026.05 – 2026.07",
    stack: ["Python", "FastAPI", "PostgreSQL", "Streamlit", "Ollama", "Chroma"],
    hue: 250,
    featured: true,
    links: {},
    body: {
      problem:
        "금융권은 망분리 규정과 개인정보 처리 기준을 동시에 만족해야 하는데, 사내 AI 챗봇이 오가는 대화에서 어떤 규정이 어떻게 깨지는지 사람이 일일이 검토할 방법이 없었다. 규정 문서는 수백 개 요구사항으로 흩어져 있고, 로그는 계속 쌓인다.",
      contribution: [
        "챗봇 로그를 단일 진실원으로 삼는 PostgreSQL 스키마를 v1부터 v4까지 설계·마이그레이션",
        "정책팀이 XLSX로 관리하던 컴플라이언스 매핑을 공통통제 25종 / Detector 12종 / 요구사항 268건의 정규화 테이블로 이관",
        "개인정보 필드 정규화 리졸버 구현 — 정확 일치 → 별칭 사전 → 키워드 fallback 3단계",
        "ISMS-P 판정 API(개별 PATCH + 배치 bulk-verdict)와 Streamlit 대시보드 실데이터 연동",
      ],
      decisions: [
        {
          choice: "컴플라이언스 매핑을 YAML이 아니라 DB 정규화 테이블로",
          why: "요구사항이 268건까지 늘자 YAML은 diff 검토가 불가능해졌다. 테이블로 옮기니 조인으로 커버리지 공백을 바로 질의할 수 있었다. 레거시 16종만 YAML로 남겼다.",
        },
        {
          choice: "PII 필드 매핑에 별도 테이블 대신 Python 리졸버",
          why: "필드명 변종은 무한한데 매핑 테이블은 변종마다 행이 늘어난다. 3단계 fallback 함수로 두면 별칭 추가가 코드 PR로 처리되고 리뷰 이력이 남는다.",
        },
        {
          choice: "LLM은 클라우드 API가 아니라 Ollama 로컬 추론",
          why: "망분리 위반을 잡는 도구가 스스로 외부로 로그를 내보내면 도구 자체가 위반이다. 성능을 일부 포기하고 로컬로 갔다.",
        },
        {
          choice: "배치 판정 API는 부분 성공을 허용",
          why: "수백 건 배치에서 한 건 실패로 전체를 롤백하면 진단팀이 원인 건을 찾지 못한다. 성공/실패를 건별로 반환해 재시도 범위를 좁혔다.",
        },
      ],
      outcome:
        "5인 팀 파이널 프로젝트. Phase 1·2를 예정보다 6일 앞당겨 마감했고, 정책팀이 만든 매핑 자료가 코드 수정 없이 스키마에 흡수되는 구조를 만들었다.",
    },
  },
  {
    slug: "agent-orchestrator",
    title: "웹 AI 에이전트 오케스트레이터",
    tagline:
      "역할별 AI 팀과 감시자 에이전트를 붙여, 다섯 개 프로바이더 할당량을 한 화면에서 굴리는 작업 환경",
    role: "설계 · 전체 구현",
    period: "2026.08",
    stack: ["Next.js", "TypeScript", "Vercel AI SDK", "Claude Agent SDK", "Tailscale"],
    hue: 285,
    featured: true,
    links: {},
    body: {
      problem:
        "AI 코딩 도구를 여러 개 쓰다 보면 어느 프로바이더 한도가 얼마나 남았는지 알 수 없고, 같은 모델이 코드를 쓰고 그 코드를 리뷰하면 같은 맹점을 공유한 채로 통과시킨다.",
      contribution: [
        "다섯 개 프로바이더를 단일 추상화로 묶고 usage를 정규화해 할당량 대시보드 구현",
        "개발팀 / 검증팀 역할 분리와 감시자 페르소나 설계",
        "PC 접근을 safe · elevated · forbidden 3단계 정책으로 게이팅",
        "볼트 자동 기록 — 덮어쓰기 전 자동 백업 + 저장 전 diff 확인",
      ],
      decisions: [
        {
          choice: "5종 SDK 직접 연동 대신 Vercel AI SDK 단일 추상화",
          why: "프로바이더마다 usage 필드 이름이 다르다. 추상화 레이어에서 정규화해야 할당량 추적이 성립한다. SDK를 직접 붙였으면 대시보드가 프로바이더 수만큼 분기했을 것이다.",
        },
        {
          choice: "검증팀 모델은 개발팀과 다른 프로바이더로 강제",
          why: "동일 모델 자가리뷰는 맹점을 공유한다. 리뷰를 형식이 아니라 실제 방어선으로 만들려면 모델을 갈라야 한다.",
        },
        {
          choice: "원격 접속은 Tailscale Serve만, Funnel은 금지",
          why: "Funnel은 퍼블릭 노출이라 'VPN 켠 사람만 접근'이라는 요구와 정면으로 충돌한다. 편의보다 요구사항을 택했다.",
        },
        {
          choice: "자체 셸 실행기 대신 Agent SDK 내장 도구 + canUseTool 훅",
          why: "직접 만든 셸 래퍼는 이스케이프 구멍을 내가 전부 막아야 한다. 검증된 도구 위에 권한 정책만 얹는 쪽이 공격 표면이 작다.",
        },
      ],
      outcome:
        "P0~P5 전 단계 완료. 프로바이더를 갈아끼워도 대시보드는 그대로 동작하고, 리뷰 통과율이 자가리뷰 때보다 유의미하게 떨어졌다 — 즉 리뷰가 실제로 걸러내고 있다는 뜻.",
    },
  },
  {
    slug: "cape-report-analyzer",
    title: "CAPEv2 Report Analyzer",
    tagline: "CAPE 샌드박스 리포트의 구조적 한계를 메우는 PyQt6 악성코드 분석 GUI",
    role: "단독 개발",
    period: "2026.04",
    stack: ["Python", "PyQt6", "JSON"],
    hue: 20,
    links: {},
    body: {
      problem:
        "CAPEv2가 뱉는 리포트는 JSON 수천 줄인데, 분석가가 실제로 보고 싶은 건 행위 시퀀스 몇 개다. 기본 웹 UI로는 샘플 간 비교가 안 되고 중요한 신호가 노이즈에 묻힌다.",
      contribution: [
        "리포트 파싱 레이어와 표시 레이어를 분리해 CAPE 스키마 변경에 대응",
        "행위·네트워크·드롭 파일을 탭으로 나눠 분석 동선에 맞춘 GUI 구성",
        "샘플 간 비교 뷰 구현",
      ],
      decisions: [
        {
          choice: "웹 앱이 아니라 데스크탑 GUI",
          why: "분석 대상 리포트는 격리망 안에 있다. 브라우저·서버를 끼우면 배포 경로가 하나 더 늘고 그게 곧 규정 문제가 된다.",
        },
        {
          choice: "파싱 결과를 중간 모델로 정규화",
          why: "CAPE 버전마다 필드가 바뀐다. 파서만 고치면 UI는 건드리지 않아도 되게 경계를 그었다.",
        },
      ],
      outcome:
        "리포트 하나를 훑는 데 걸리던 시간이 크게 줄었고, CAPE 리포트 자체의 한계(무엇을 기록하지 않는가)를 문서로 정리했다.",
    },
  },
  {
    slug: "service-port-scanner",
    title: "Service Port Scanner",
    tagline: "열린 포트가 아니라 '무슨 서비스가 떠 있는지'를 말해주는 C++20 스캐너",
    role: "7인 팀 · 설계 및 구현 참여",
    period: "2026.04 – 2026.05",
    stack: ["C++20", "Socket", "Multithreading"],
    hue: 160,
    links: {},
    body: {
      problem:
        "포트 번호만 알려주는 스캐너는 실무에서 쓸모가 제한적이다. 3306이 열려 있다는 사실보다 거기 붙은 게 정말 MySQL인지가 중요하다.",
      contribution: [
        "서비스 배너 수집과 지문 매칭 로직 설계",
        "스캔 동시성 제어 — 스레드 풀과 타임아웃 정책",
        "7인 팀 기획 발표 대본 작성 및 발표",
      ],
      decisions: [
        {
          choice: "C++20으로 직접 구현",
          why: "스캔은 I/O 대기가 지배적이라 동시성 제어가 성능 전부다. 런타임이 가려주지 않는 언어로 타임아웃과 스레드 수명을 직접 다루는 게 학습 목표이자 요구사항이었다.",
        },
        {
          choice: "포트-서비스 고정 매핑 대신 배너 기반 식별",
          why: "고정 매핑은 비표준 포트 앞에서 그대로 틀린다. 응답을 읽고 판단해야 '서비스를 안다'고 말할 수 있다.",
        },
      ],
      outcome: "7인 팀 프로젝트로 설계부터 발표까지 완주.",
    },
  },
  {
    slug: "safety-inspection",
    title: "안전보건 순회점검 시스템",
    tagline: "현장에서 폰으로 바로 등록하는 점검 웹앱 — 외부 의존성 없는 Node 백엔드",
    role: "단독 개발",
    period: "2026.09",
    stack: ["Node.js", "Vanilla JS", "Claude Vision API"],
    hue: 200,
    links: {},
    body: {
      problem:
        "순회점검 결과를 현장에서 종이에 적고 사무실에서 다시 입력하는 이중 작업. 담당자는 개발자가 아니고, 설치와 운영을 스스로 해야 한다.",
      contribution: [
        "점검 항목을 리치 객체로 재설계하고 법적 근거를 함께 보관",
        "옵션 CRUD API와 인라인 항목 추가 UI 구현",
        "사진 분석 엔드포인트 — Claude Vision으로 현장 사진에서 위험요인 추출",
        "비전문가용 자체 서버 설치·실행 매뉴얼 작성",
      ],
      decisions: [
        {
          choice: "npm 의존성 없이 Node 표준 라이브러리만으로 백엔드 구성",
          why: "설치 주체가 개발자가 아니다. 의존성이 하나라도 있으면 설치 단계에서 막히고, 그때 도와줄 사람이 없다. 파일 기반 저장으로 DB도 없앴다.",
        },
        {
          choice: "레코드 생성 시점에 항목 메타데이터를 스냅샷",
          why: "점검 항목은 법 개정에 따라 바뀐다. 참조만 걸어두면 과거 점검 기록의 의미가 소급해서 변한다. 기록은 그 시점 기준으로 고정되어야 한다.",
        },
        {
          choice: "사진 분석은 기능 플래그 뒤에 배치",
          why: "API 키가 없거나 비용을 안 쓰고 싶은 상황에서도 본 기능은 온전히 돌아가야 한다.",
        },
      ],
      outcome:
        "현장 등록과 사무실 정리 사이의 이중 입력을 제거. 설치 매뉴얼만으로 담당자가 직접 서버를 띄웠다.",
    },
  },
  {
    slug: "liquid-glass-composer",
    title: "Liquid Glass Text Composer",
    tagline: "마크다운을 Liquid Glass 배경 위에 얹어 이미지로 뽑는 웹앱",
    role: "단독 개발",
    period: "2026.05",
    stack: ["TypeScript", "Canvas API", "PWA", "GitHub Pages"],
    hue: 310,
    links: {},
    body: {
      problem:
        "메모나 인용을 공유할 때마다 캡처하고 자르고 배경을 붙이는 수작업이 반복됐다.",
      contribution: [
        "마크다운 → Canvas 합성 렌더링 파이프라인",
        "Liquid Glass 계열 배경 프리셋과 블러·굴절 표현",
        "PWA 설정으로 오프라인 동작 및 홈 화면 설치",
      ],
      decisions: [
        {
          choice: "서버 렌더링 없이 전부 클라이언트 Canvas",
          why: "이미지 생성은 상태가 없다. 서버를 두면 호스팅 비용과 콜드스타트를 떠안고 얻는 게 없다. GitHub Pages로 무료·무중단이 됐다.",
        },
        {
          choice: "PWA로 패키징",
          why: "쓰는 순간이 대부분 모바일이다. 브라우저 주소창을 거치는 마찰을 없애야 실제로 쓰게 된다.",
        },
      ],
      outcome: "GitHub Pages 배포. 설치형 앱처럼 오프라인에서도 동작.",
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
