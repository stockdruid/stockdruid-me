import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
