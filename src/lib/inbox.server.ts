import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Inquiry } from "./inbox";

export type { Inquiry };

/**
 * 문의 적재 파일을 읽는다.
 *
 * 경로 규칙은 API 라우트와 같아야 한다. standalone 빌드의 server.js 는 자기
 * 디렉터리로 chdir 하므로 운영에서는 CONTACT_LOG_DIR 이 반드시 필요하다.
 */
export function logDir(): string {
  return process.env.CONTACT_LOG_DIR ?? path.join(process.cwd(), "data");
}

export async function readInquiries(): Promise<Inquiry[]> {
  const file = path.join(logDir(), "contact.jsonl");

  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch (error) {
    // 파일이 아직 없는 것은 정상이다. 문의가 한 건도 없는 상태.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const rows: Inquiry[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line) as Partial<Inquiry>;
      if (typeof parsed.name !== "string" || typeof parsed.email !== "string") continue;
      rows.push({
        name: parsed.name,
        email: parsed.email,
        message: typeof parsed.message === "string" ? parsed.message : "",
        at: typeof parsed.at === "string" ? parsed.at : "",
        delivered: parsed.delivered === true,
      });
    } catch {
      // 깨진 줄 하나 때문에 전체를 못 읽으면 안 된다. 그 줄만 건너뛴다.
      continue;
    }
  }

  // 최신이 위로
  return rows.reverse();
}
