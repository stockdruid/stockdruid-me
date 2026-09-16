type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;
/** 맵이 무한히 자라지 않도록 상한을 둔다 */
const MAX_KEYS = 10_000;

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * 프로세스 메모리 기반 레이트 리밋.
 * 자택 PC 단일 프로세스 운영이 전제다. 다중 인스턴스로 가면 Redis 등으로 옮겨야 한다.
 */
export function rateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();

  if (buckets.size > MAX_KEYS) sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= MAX_HITS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

/** 프록시(Cloudflare Tunnel) 뒤에 있으므로 원본 IP는 헤더에서 읽는다. */
export function clientKey(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
