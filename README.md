# stockdruid.me

개인 소개 · 포트폴리오 사이트. 자택 PC에서 직접 운영하고 Cloudflare Tunnel로 공개한다.

기획 문서는 옵시디언 볼트 `work/active/stockdruid.me 개인 사이트.md`에 있다.

## 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | 정적 생성 + 문의 API 한 프로세스에서 처리 |
| 스타일 | CSS Modules + CSS 변수 | 토큰을 직접 통제. 유틸리티 클래스 문법이 디자인 의도를 가리지 않음 |
| 검증 | zod (서버 전용) + 순수 함수 (클라이언트) | 폼 하나 때문에 스키마 라이브러리를 브라우저 번들에 싣지 않는다 |
| 폰트 | Pretendard dynamic subset, 자체 호스팅 | 서드파티 CDN 동기 로드는 렌더를 2.7초 막았다 |
| 메일 | nodemailer | SMTP 직결. 외부 서비스 의존 없음 |
| 배포 | standalone 출력 + PM2 + cloudflared | 집 IP 비노출, 포트포워딩 불필요 |

## 구조

```
src/
├── app/
│   ├── page.tsx                  랜딩 (Hero → About → Projects → Contact)
│   ├── projects/[slug]/page.tsx  프로젝트 상세 (전부 정적 생성)
│   ├── api/contact/route.ts      문의 수신
│   ├── globals.css               리셋 + 공용 레이아웃
│   ├── sitemap.ts / robots.ts
│   └── not-found.tsx
├── components/                   Hero, About, Projects, Contact, Nav, Footer, Reveal
├── content/
│   ├── site.ts                   이름·연락처·기술 스택
│   └── projects.ts               프로젝트 데이터 (여기만 고치면 사이트가 바뀐다)
├── lib/
│   ├── contact.ts                공유 상수 + 클라이언트 검증 (zod 없음)
│   ├── contact.server.ts         서버 전용 zod 스키마
│   └── rate-limit.ts             프로세스 메모리 기반 제한
└── styles/tokens.css             디자인 토큰
```

## 프로젝트 추가하기

`src/content/projects.ts` 배열에 객체 하나 추가하면 끝이다. 카드·상세 페이지·사이트맵이 전부 따라온다.

썸네일은 `public/images/projects/` 에 넣고 `thumbnail` 에 경로를 적는다. 생략하면 `hue` 값으로 그라디언트 플레이스홀더가 자동 생성된다.

`body.decisions` 에는 **무엇을 썼는지가 아니라 왜 그걸 골랐는지**를 쓴다. 이게 이 사이트의 존재 이유다.

## 개발

```bash
npm install
npm run dev
```

`npm run lint` / `npm run build` 로 검증한다.

## 문의 폼

SMTP 환경변수가 설정되어 있으면 메일을 보내고, 없으면 `CONTACT_LOG_DIR` 의 `contact.jsonl` 에만 적재한다. **어느 쪽이든 사용자에게는 성공으로 응답한다** — 메일 실패가 문의 유실로 이어지지 않게 하기 위해서다.

`.env.example` 를 `.env.local` 로 복사해 채운다. Gmail은 계정 비밀번호가 아니라 앱 비밀번호를 쓴다.

`CONTACT_LOG_DIR` 은 반드시 빌드 산출물 **바깥**을 가리켜야 한다. standalone의 `server.js` 는 자기 디렉터리로 chdir하므로, 지정하지 않으면 접수된 문의가 `.next/standalone/data/` 에 쌓이고 다음 배포에서 통째로 사라진다. `deploy/deploy.ps1` 이 자동으로 설정한다.

방어 장치:

- 허니팟 `company` 필드 — 채워져 오면 조용히 성공 응답하고 버린다
- IP당 시간당 5회 제한 (`CF-Connecting-IP` 헤더 기준)
- 본문 16KB 상한, zod 스키마 검증

레이트 리밋은 프로세스 메모리에 있다. 다중 인스턴스로 가면 외부 저장소로 옮겨야 한다.

## 배포

### 1. Cloudflare에 도메인 연결

1. Cloudflare 계정 생성 → `stockdruid.me` 사이트 추가
2. 도메인 등록업체에서 네임서버를 Cloudflare 것으로 변경
3. 전파 완료까지 최대 24시간. **가장 먼저 시작할 것**

### 2. 터널 생성

```bash
cloudflared tunnel login
cloudflared tunnel create stockdruid
cloudflared tunnel route dns stockdruid stockdruid.me
```

`deploy/cloudflared-config.example.yml` 을 참고해 `%USERPROFILE%\.cloudflared\config.yml` 을 작성한다.

부팅 시 자동 시작:

```bash
cloudflared service install
```

### 3. 앱 구동

```powershell
powershell -ExecutionPolicy Bypass -File deploy\deploy.ps1
```

standalone 출력은 `.next/static` 과 `public` 을 자동 복사하지 않는다. 스크립트가 대신 처리한다. 직접 배포한다면 이 단계를 빠뜨리지 말 것 — 빠뜨리면 CSS 없는 페이지가 뜬다.

### 4. 운영 체크리스트

- [ ] PC 절전·최대 절전 모드 해제 (자면 사이트도 죽는다)
- [ ] 부팅 시 자동 시작 등록 — **`pm2 startup` 은 Windows에서 동작하지 않는다.** 작업 스케줄러에 "시스템 시작 시 `pm2 resurrect` 실행" 작업을 만들거나 `@jessety/pm2-installer` 로 서비스 등록한다. (`pm2 save` 는 이미 실행됨)
- [ ] 실제로 재부팅해서 복구되는지 확인
- [ ] 외부망(LTE)에서 `https://stockdruid.me` 접속 확인
- [ ] Cloudflare에서 캐시 규칙·레이트 리밋 설정

## 측정치

로컬 standalone 서버 기준 Lighthouse (모바일 에뮬레이션 · 1.6Mbps · CPU 4배 슬로틀):

| 항목 | 점수 |
|------|------|
| Performance | 72 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

FCP 3.9s · LCP 5.0s · CLS 0 · TBT 10ms. 전송량 620KB 중 **419KB가 한글 웹폰트**다.

절대값이 나빠 보이지만 측정 조건이 가혹하다. 실제 운영에서는 Cloudflare CDN + HTTP/2 멀티플렉싱이 붙어 16개 폰트 조각이 병렬로 내려간다. 로컬 HTTP/1.1 측정과는 다르다.

성능을 더 올리려면 Pretendard를 버리고 시스템 한글 폰트(`-apple-system` → iOS/macOS에서 Apple SD Gothic Neo)로 가야 한다. 폰트 전송량이 0이 되는 대신 Windows/Android에서 타이포그래피 품질이 떨어진다. 현재는 품질 쪽을 택했다.

## 알려진 제약

- PC가 꺼지면 사이트도 내려간다. 가용성이 필요해지면 정적 빌드본을 Cloudflare Pages에 폴백으로 올린다.
- 페이지 간 이동은 의도적으로 전체 문서 내비게이션이다. `next/link` 의 클라이언트 라우팅으로는 네이티브 cross-document View Transition이 발동하지 않는다. 모든 페이지가 정적이라 프리페치를 포기한 비용은 작다.
- CSP 헤더는 아직 설정하지 않았다. 나머지 보안 헤더(HSTS, nosniff, frame-deny, referrer, permissions)는 `next.config.ts` 에 있다.
- 한글 웹폰트가 전송량의 3분의 2를 차지한다. 위 **측정치** 참고.
