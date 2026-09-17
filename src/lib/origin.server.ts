import "server-only";
import { site } from "@/content/site";

/**
 * 상태를 바꾸는 요청의 출처를 검증한다.
 *
 * SameSite=lax 쿠키만으로는 부족하다. Content-Type 을 text/plain 으로 보내면
 * 프리플라이트 없이 교차 출처 POST 가 그대로 들어온다. 실제로 찔러 보니
 * 로그아웃이 그 경로로 동작했다.
 *
 * Origin 헤더는 브라우저가 붙이며 스크립트로 위조할 수 없다. 헤더가 아예 없는
 * 요청(curl 등 비브라우저)은 CSRF 가 성립하지 않으므로 통과시킨다.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }

  const allowed = new Set([new URL(site.url).host]);

  // 자체 서버에서 직접 열어 확인할 때를 위해 로컬 주소도 허용한다.
  if (process.env.NODE_ENV !== "production") {
    allowed.add("localhost:3000");
    allowed.add("127.0.0.1:3000");
  }

  return allowed.has(host);
}
