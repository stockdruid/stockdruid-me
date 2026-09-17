import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * 일반 검색 엔진에는 노출하되, AI 학습 수집과 웹 보관 서비스는 거부한다.
 *
 * robots.txt 는 어디까지나 요청이다. 규칙을 지키지 않는 수집기도 있으므로
 * 이것만으로 충분하다고 볼 수 없다. Cloudflare 쪽에서 실제 차단을 함께 걸어 두었다.
 */

/** 모델 학습용 자료를 모으는 수집기 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "FacebookBot",
  "cohere-ai",
  "Diffbot",
  "omgilibot",
  "omgili",
  "ImagesiftBot",
  "YouBot",
  "Timpibot",
  "AI2Bot",
  "Kangaroo Bot",
  "Scrapy",
];

/**
 * 웹 보관 서비스.
 * 한 번 저장되면 이후에 내용을 고치거나 지워도 과거 판이 남는다.
 */
const ARCHIVE_CRAWLERS = [
  "ia_archiver",
  "archive.org_bot",
  "Wayback",
  "wayback",
  "heritrix",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
      {
        userAgent: AI_CRAWLERS,
        disallow: "/",
      },
      {
        userAgent: ARCHIVE_CRAWLERS,
        disallow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
