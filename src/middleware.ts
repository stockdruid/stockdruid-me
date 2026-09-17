import { NextResponse, type NextRequest } from "next/server";

/**
 * 요청마다 새 nonce 를 만들어 CSP 에 실어 보낸다.
 *
 * Next 는 페이지를 띄울 때 인라인 <script> 를 넣는다. script-src 를 'self' 로만
 * 묶으면 이 스크립트가 차단되어 하이드레이션이 실패하고, 화면은 보이지만
 * 폼과 버튼이 동작하지 않는다. 실제로 그 상태를 확인하고 이 방식으로 바꿨다.
 *
 * 'unsafe-inline' 을 넣으면 간단히 해결되지만, 그러면 주입된 스크립트도 함께
 * 허용되어 CSP 를 두는 의미가 크게 줄어든다. nonce 는 매 요청 달라지므로
 * 공격자가 미리 알 수 없다.
 *
 * Next 는 요청 헤더의 Content-Security-Policy 에서 nonce 를 읽어 자신이 넣는
 * 스크립트에 그대로 붙인다. 따라서 응답과 요청 양쪽에 같은 값을 넣어야 한다.
 *
 * 대가: nonce 를 쓰는 페이지는 정적 생성이 아니라 요청마다 렌더된다.
 * 방문량이 많지 않은 개인 사이트라 감수할 만하다고 보았다.
 */
export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replaceAll("-", "");

  const csp = [
    "default-src 'self'",
    // Cloudflare 가 방문 통계용 스크립트를 자동으로 끼워 넣는다.
    `script-src 'self' 'nonce-${nonce}' https://static.cloudflareinsights.com`,
    // Next 가 스타일을 인라인으로 주입하고, 뷰 전환 값도 style 속성으로 넘어온다.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    /*
     * 정적 파일에는 CSP 가 필요 없다. 문서 요청에만 건다.
     * _next/static, _next/image, 파비콘, 폰트, 이미지 확장자를 제외한다.
     */
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|fonts/|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
