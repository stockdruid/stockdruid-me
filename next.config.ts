import type { NextConfig } from "next";

/**
 * 자택 서버 + Cloudflare Tunnel 운영 전제.
 * TLS는 Cloudflare가 종단하므로 여기서는 애플리케이션 레벨 헤더만 책임진다.
 */
// Content-Security-Policy 는 요청마다 nonce 가 달라져야 하므로 middleware.ts 에서 넣는다.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // 검색 결과에는 나오되 저장본은 남기지 않는다.
    // robots 메타 태그를 읽지 않는 수집기에도 같은 신호를 준다.
    key: "X-Robots-Tag",
    value: "noarchive, noimageindex",
  },
];

const nextConfig: NextConfig = {
  // 자체 서버 구동 — standalone 출력으로 배포 산출물을 최소화한다
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  // 문의 적재 파일이 빌드 산출물에 복사되지 않게 한다
  outputFileTracingExcludes: {
    "*": ["./data/**"],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // 관리자 화면과 그 API 는 색인도 캐시도 되면 안 된다.
        // ":path*" 는 /admin 자체를 잡지 못한다. 두 패턴을 모두 건다.
        source: "/admin{/:path}*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
