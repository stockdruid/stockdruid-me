/**
 * 문의 입력 규칙.
 *
 * zod는 **서버에서만** 쓴다 (`contact.server.ts`). 클라이언트는 아래 순수 함수로
 * 검증한다 — 폼 하나 때문에 스키마 라이브러리를 브라우저 번들에 싣는 건 손해다.
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

  const email = typeof input.email === "string" ? input.email.trim() : "";
  if (!EMAIL.test(email)) errors.email = MESSAGES.emailInvalid;
  else if (email.length > LIMITS.emailMax) errors.email = MESSAGES.emailTooLong;

  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (message.length < LIMITS.messageMin) errors.message = MESSAGES.messageTooShort;
  else if (message.length > LIMITS.messageMax) errors.message = MESSAGES.messageTooLong;

  return errors;
}
