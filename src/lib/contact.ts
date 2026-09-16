/**
 * 문의 입력 규칙.
 *
 * zod는 **서버에서만** 쓴다 (`contact.server.ts`). 클라이언트는 아래 순수 함수로
 * 검증한다. 폼 하나 때문에 스키마 라이브러리를 브라우저 번들에 싣는 건 손해다.
 * 두 경로가 같은 메시지 상수를 공유하므로 문구가 갈라지지 않는다.
 *
 * 진실원은 언제나 서버다. 클라이언트 검증은 왕복을 아끼기 위한 편의일 뿐이다.
 */

export const LIMITS = {
  nameMax: 60,
  emailMax: 254,
  messageMin: 10,
  messageMax: 4000,
  companyMax: 200,
} as const;

export const MESSAGES = {
  nameRequired: "이름을 입력해 주세요.",
  nameTooLong: "이름이 너무 깁니다.",
  nameUnsafe: "이름에 줄바꿈이나 제어 문자를 넣을 수 없습니다.",
  emailInvalid: "이메일 형식이 올바르지 않습니다.",
  emailTooLong: "이메일이 너무 깁니다.",
  messageTooShort: `${LIMITS.messageMin}자 이상 입력해 주세요.`,
  messageTooLong: `${LIMITS.messageMax}자를 넘을 수 없습니다.`,
} as const;

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  company?: string;
};

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> };

/** 과하게 엄격한 정규식은 유효한 주소를 거른다. 형태만 확인하고 판정은 발송에 맡긴다. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 메일 헤더로 들어가는 값에서 금지하는 문자 (C0 제어 문자 + DEL).
 *
 * name 은 Subject 와 Reply-To 로 조립된다. CRLF 가 살아 있으면 고전적인 헤더
 * 인젝션(`이름\r\nBcc: victim@evil.com`)의 입구가 된다. 실제로 찔러 보니
 * nodemailer 가 encoded-word 로 감싸서 주입은 막혔지만, 그건 라이브러리의
 * 구현 세부사항이라 기댈 근거가 못 된다. 경계에서 직접 막는다.
 *
 * message 는 본문으로만 들어가므로 줄바꿈을 허용한다.
 */
export function hasHeaderUnsafe(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

export type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function validateContact(input: {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}): FieldErrors {
  const errors: FieldErrors = {};

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name) errors.name = MESSAGES.nameRequired;
  else if (name.length > LIMITS.nameMax) errors.name = MESSAGES.nameTooLong;
  else if (hasHeaderUnsafe(name)) errors.name = MESSAGES.nameUnsafe;

  const email = typeof input.email === "string" ? input.email.trim() : "";
  // EMAIL 정규식이 \s 를 이미 막지만, 제어 문자 전반을 명시적으로 걸러 둔다.
  if (!EMAIL.test(email) || hasHeaderUnsafe(email)) {
    errors.email = MESSAGES.emailInvalid;
  } else if (email.length > LIMITS.emailMax) {
    errors.email = MESSAGES.emailTooLong;
  }

  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (message.length < LIMITS.messageMin) errors.message = MESSAGES.messageTooShort;
  else if (message.length > LIMITS.messageMax) errors.message = MESSAGES.messageTooLong;

  return errors;
}
