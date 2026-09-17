import { site } from "@/content/site";

export const dynamic = "force-static";

/**
 * RFC 9116 security.txt.
 *
 * 취약점을 발견한 사람이 어디로 알려야 할지 찾을 수 있게 한다.
 * Expires 는 규격상 필수 항목이고, 기한이 지난 문서는 무시되므로 1년 뒤로 둔다.
 */
export function GET() {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);

  const lines = [
    `Contact: mailto:${site.email}`,
    `Expires: ${expires.toISOString()}`,
    "Preferred-Languages: ko, en",
    `Canonical: ${site.url}/.well-known/security.txt`,
    "",
    "# 이 사이트에서 취약점을 발견하셨다면 위 주소로 알려 주십시오.",
    "# 개인이 운영하는 사이트라 포상 제도는 없지만, 확인하는 대로 회신드리겠습니다.",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
