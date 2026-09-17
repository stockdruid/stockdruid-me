import type { Metadata, Viewport } from "next";
import { KonamiEgg } from "@/components/KonamiEgg";
import { site } from "@/content/site";
import "./globals.css";

/**
 * 문서를 요청마다 렌더한다.
 *
 * CSP nonce 는 요청마다 값이 달라야 하는데, 정적 생성된 HTML 은 빌드 시점에
 * 고정되어 nonce 를 넣을 자리가 없다. 실제로 정적 상태에서는 미들웨어가 헤더에
 * nonce 를 실어도 스크립트에 붙지 않아 하이드레이션이 실패했다.
 *
 * 개인 사이트 규모에서 페이지 렌더 비용은 크지 않다고 보고, 정적 생성 대신
 * nonce 기반 CSP 를 택했다. 정적 자원(_next/static, 폰트, 이미지)은 그대로
 * 캐시된다.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.displayName} · ${site.role}`,
    template: `%s · ${site.domain}`,
  },
  description: site.summary,
  keywords: ["포트폴리오", "백엔드", "보안", "개발자", site.displayName],
  authors: [{ name: site.displayName, url: site.url }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.domain,
    title: `${site.displayName} · ${site.role}`,
    description: site.summary,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: `${site.displayName} · ${site.role}`,
    description: site.summary,
  },
  alternates: { canonical: site.url },
  robots: {
    index: true,
    follow: true,
    // 검색 결과에 저장본이 남지 않도록 한다. 내용을 고쳐도 과거 판이 남는 것을 막는다.
    noarchive: true,
    nocache: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#bfe0f5" },
    { media: "(prefers-color-scheme: dark)", color: "#1b2434" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {children}
        {/* 어느 페이지에서 입력하든 반응하도록 최상위에 둔다 */}
        <KonamiEgg />
      </body>
    </html>
  );
}
