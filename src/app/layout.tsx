import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.displayName} — ${site.role}`,
    template: `%s · ${site.domain}`,
  },
  description: site.summary,
  keywords: ["포트폴리오", "백엔드", "보안", "개발자", site.displayName],
  authors: [{ name: site.displayName, url: site.url }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.domain,
    title: `${site.displayName} — ${site.role}`,
    description: site.summary,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.displayName} — ${site.role}`,
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
    <html lang="ko" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
