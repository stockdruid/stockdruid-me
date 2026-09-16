import "server-only";
import {
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";
import { promisify } from "node:util";

/**
 * promisify 는 scrypt 의 첫 오버로드(옵션 없는 3인자)만 보고 타입을 잡는다.
 * 우리는 N/r/p 를 넘겨야 하므로 시그니처를 직접 지정한다.
 */
const scryptAsync = promisify(scrypt) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: ScryptOptions,
) => Promise<Buffer>;

export const SESSION_COOKIE = "sd_admin";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

/**
 * 관리자 인증.
 *
 * 비밀번호 원문은 서버 어디에도 없다. `.env.local` 에는 scrypt 해시만 둔다.
 * 해시는 `npm run admin:hash` 로 만든다. 그 스크립트는 입력을 저장하지 않는다.
 *
 * 세션은 DB 없이 HMAC 서명 쿠키로 유지한다. 관리자가 한 명뿐이고 상태를 둘 이유가 없다.
 * 서명 키(ADMIN_SESSION_SECRET)를 바꾸면 기존 세션이 전부 무효가 된다.
 */

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET);
}

function secret(): Buffer {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET 이 설정되지 않았습니다.");
  return Buffer.from(value, "base64");
}

/** 길이가 달라도 타이밍이 새지 않도록 항상 같은 폭으로 비교한다. */
function safeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    // 길이 불일치도 상수 시간으로 처리한다.
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) return false;

  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, nRaw, rRaw, pRaw, saltRaw, hashRaw] = parts;
  const N = Number(nRaw);
  const r = Number(rRaw);
  const p = Number(pRaw);
  if (!Number.isFinite(N) || !Number.isFinite(r) || !Number.isFinite(p)) return false;

  const salt = Buffer.from(saltRaw, "base64");
  const expected = Buffer.from(hashRaw, "base64");

  const actual = await scryptAsync(candidate, salt, expected.length, {
    N,
    r,
    p,
    maxmem: 256 * 1024 * 1024,
  });

  return safeEqual(actual, expected);
}

/* ---------- 세션 ---------- */

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSession(): { value: string; maxAge: number } {
  const expires = Date.now() + SESSION_TTL_MS;
  // nonce 를 넣어 같은 만료 시각이라도 토큰이 겹치지 않게 한다.
  const payload = `${expires}.${randomBytes(12).toString("base64url")}`;
  return {
    value: `${payload}.${sign(payload)}`,
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;

  const index = token.lastIndexOf(".");
  if (index <= 0) return false;

  const payload = token.slice(0, index);
  const signature = token.slice(index + 1);

  let expectedSig: string;
  try {
    expectedSig = sign(payload);
  } catch {
    return false;
  }

  if (!safeEqual(Buffer.from(signature), Buffer.from(expectedSig))) return false;

  const expires = Number(payload.split(".")[0]);
  return Number.isFinite(expires) && Date.now() < expires;
}

/* ---------- 로그인 시도 제한 ---------- */

type Attempt = { count: number; until: number };
const attempts = new Map<string, Attempt>();

/**
 * 프로세스 메모리 기반이라 재시작하면 초기화된다.
 * 단일 프로세스 자택 운영이 전제다. 무차별 대입을 늦추는 게 목적이지
 * 완전한 방벽은 아니다.
 */
export function loginAllowed(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.until <= now) return { allowed: true, retryAfter: 0 };
  if (entry.count < MAX_ATTEMPTS) return { allowed: true, retryAfter: 0 };

  return { allowed: false, retryAfter: Math.ceil((entry.until - now) / 1000) };
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.until <= now) {
    attempts.set(key, { count: 1, until: now + LOCKOUT_MS });
    return;
  }
  entry.count += 1;
  entry.until = now + LOCKOUT_MS;
}

export function clearFailures(key: string): void {
  attempts.delete(key);
}
