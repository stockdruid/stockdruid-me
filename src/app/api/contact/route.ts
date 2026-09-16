import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { contactSchema, type ContactResponse } from "@/lib/contact";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

function json(body: ContactResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

/** SMTP가 없어도 문의가 유실되지 않도록 디스크에 남긴다. */
async function archive(entry: unknown) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(
    path.join(dir, "contact.jsonl"),
    `${JSON.stringify(entry)}\n`,
    "utf8",
  );
}

async function sendMail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) return false;

  // 요청 처리 경로에서만 로드 — 미설정 환경에서 불필요한 초기화를 피한다
  const nodemailer = (await import("nodemailer")).default;

  const port = Number(SMTP_PORT ?? 465);
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transport.sendMail({
    from: `"stockdruid.me" <${SMTP_USER}>`,
    to: CONTACT_TO,
    replyTo: `"${input.name}" <${input.email}>`,
    subject: `[stockdruid.me] ${input.name} 님의 문의`,
    text: `이름: ${input.name}\n이메일: ${input.email}\n\n${input.message}`,
  });

  return true;
}

export async function POST(request: Request) {
  const key = clientKey(request.headers);
  const limit = rateLimit(key);

  if (!limit.allowed) {
    return json(
      { ok: false, error: "요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "내용이 너무 깁니다." }, 413);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "");
      if (field && !fields[field]) fields[field] = issue.message;
    }
    return json({ ok: false, error: "입력을 확인해 주세요.", fields }, 400);
  }

  const { company, ...input } = parsed.data;

  // 허니팟이 채워졌으면 봇이다. 성공으로 응답해 탐지 사실을 알리지 않는다.
  if (company) return json({ ok: true }, 200);

  try {
    const delivered = await sendMail(input);
    await archive({ ...input, at: new Date().toISOString(), delivered });
    return json({ ok: true }, 200);
  } catch (error) {
    // 상세 원인은 서버 로그에만 남긴다
    console.error("[contact] delivery failed", error);
    try {
      await archive({ ...input, at: new Date().toISOString(), delivered: false });
      return json({ ok: true }, 200);
    } catch (archiveError) {
      console.error("[contact] archive failed", archiveError);
      return json(
        { ok: false, error: "전송에 실패했습니다. 이메일로 직접 연락 주세요." },
        500,
      );
    }
  }
}
