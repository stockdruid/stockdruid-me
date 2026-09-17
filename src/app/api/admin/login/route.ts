import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  clearFailures,
  createSession,
  isAdminConfigured,
  loginAllowed,
  recordFailure,
  verifyPassword,
} from "@/lib/auth.server";
import { isSameOrigin } from "@/lib/origin.server";
import { clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4 * 1024;

export async function POST(request: Request) {
  // 다른 사이트에서 로그인 시도를 대신 보내는 것을 막는다.
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "관리자 계정이 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  const key = clientKey(request.headers);
  const gate = loginAllowed(key);
  if (!gate.allowed) {
    return NextResponse.json(
      { ok: false, error: "시도가 너무 많습니다. 잠시 후 다시 시도하세요." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfter) } },
    );
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "요청이 too large." }, { status: 413 });
  }

  let password: unknown;
  try {
    const body = (await request.json()) as { password?: unknown };
    password = body.password;
  } catch {
    return NextResponse.json(
      { ok: false, error: "요청 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    recordFailure(key);
    return NextResponse.json(
      { ok: false, error: "비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const valid = await verifyPassword(password);
  if (!valid) {
    recordFailure(key);
    // 실패 사유를 나누지 않는다. 어떤 정보도 더 주지 않기 위해서다.
    return NextResponse.json(
      { ok: false, error: "비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  clearFailures(key);

  const session = createSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    // Cloudflare 가 TLS 를 종단하고 앱은 평문 HTTP 로 받는다.
    // 따라서 secure 판단은 요청 프로토콜이 아니라 배포 환경 기준으로 한다.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.maxAge,
  });
  return response;
}
