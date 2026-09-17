import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth.server";
import { isSameOrigin } from "@/lib/origin.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST 로만 받는다. GET 이면 링크 프리페치나 이미지 태그로도 로그아웃이 일어난다. */
export async function POST(request: Request) {
  // 교차 출처에서 강제 로그아웃시키는 것을 막는다.
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
