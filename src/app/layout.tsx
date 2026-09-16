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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#141518" },
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
