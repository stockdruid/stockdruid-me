import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST 로만 받는다. GET 이면 링크 프리페치나 이미지 태그로도 로그아웃이 일어난다. */
export async function POST() {
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
