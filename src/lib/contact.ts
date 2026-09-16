import { z } from "zod";

/** 클라이언트와 서버가 같은 규칙을 쓴다. 검증의 진실원은 서버지만 형태는 공유한다. */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(60, "이름이 너무 깁니다."),
  email: z.email("이메일 형식이 올바르지 않습니다.").max(254),
  message: z
    .string()
    .trim()
    .min(10, "10자 이상 입력해 주세요.")
    .max(4000, "4000자를 넘을 수 없습니다."),
  /**
   * 허니팟 — 사람은 볼 수 없는 필드. 채워져 오면 봇이다.
   * 스키마에서 거절하지 않는다. 검증 오류로 돌려주면 봇에게 탐지 사실을 알려주는 꼴이고,
   * 자동완성 등으로 값이 들어간 실사용자에게는 고칠 수 없는 오류가 된다.
   * 판정은 서버 핸들러가 조용히 처리한다.
   */
  company: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> };
