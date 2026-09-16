/**
 * 문의 레코드 타입.
 *
 * 서버 전용 모듈(inbox.server.ts)과 클라이언트 컴포넌트가 함께 쓰므로
 * 타입만 따로 둔다. `server-only` 가 붙은 모듈을 클라이언트 그래프에서
 * 참조하면 빌드가 막힌다.
 */
export type Inquiry = {
  name: string;
  email: string;
  message: string;
  at: string;
  delivered: boolean;
};
