import "server-only";
import { z } from "zod";
import { hasHeaderUnsafe, LIMITS, MESSAGES } from "./contact";

/**
 * 서버 측 검증. 클라이언트 검증과 같은 상수·문구를 쓰되, 신뢰의 기준은 여기다.
 * `server-only`를 붙여 클라이언트 번들로 새어 들어가는 경로를 컴파일 단계에서 막는다.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MESSAGES.nameRequired)
    .max(LIMITS.nameMax, MESSAGES.nameTooLong)
    // 메일 헤더로 조립되는 값이다. 제어 문자를 남기면 헤더 인젝션의 입구가 된다.
    .refine((v) => !hasHeaderUnsafe(v), MESSAGES.nameUnsafe),
  email: z
    .email(MESSAGES.emailInvalid)
    .max(LIMITS.emailMax, MESSAGES.emailTooLong)
    .refine((v) => !hasHeaderUnsafe(v), MESSAGES.emailInvalid),
  message: z
    .string()
    .trim()
    .min(LIMITS.messageMin, MESSAGES.messageTooShort)
    .max(LIMITS.messageMax, MESSAGES.messageTooLong),
  /**
   * 허니팟. 사람은 볼 수 없는 필드이고, 채워져 오면 봇이다.
   * 스키마에서 거절하지 않는다. 검증 오류로 돌려주면 봇에게 탐지 사실을 알려주는 꼴이고,
   * 자동완성 등으로 값이 들어간 실사용자에게는 고칠 수 없는 오류가 된다.
   * 판정은 핸들러가 조용히 처리한다.
   */
  company: z.string().max(LIMITS.companyMax).optional(),
});
