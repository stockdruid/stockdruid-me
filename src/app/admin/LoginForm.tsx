"use client";

import { useState, type FormEvent } from "react";
import styles from "./admin.module.css";

export function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = event.currentTarget;
    const password = String(new FormData(form).get("password") ?? "");
    if (!password) {
      setError("비밀번호를 입력하세요.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };

      if (result.ok) {
        // 세션 쿠키가 붙은 상태로 서버 컴포넌트를 다시 그리게 한다.
        window.location.reload();
        return;
      }
      setError(result.error ?? "로그인에 실패했습니다.");
    } catch {
      setError("네트워크 오류입니다. 잠시 후 다시 시도하세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={styles.panel}>
      <form className={styles.loginForm} onSubmit={onSubmit}>
        <label className={styles.label} htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          disabled={busy}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
        />

        <button className={styles.submit} type="submit" disabled={busy}>
          <span>{busy ? "확인 중" : "로그인"}</span>
          {busy && <span className={styles.spinner} aria-hidden="true" />}
        </button>

        <p id="login-error" className={styles.error} role="status" aria-live="polite">
          {error}
        </p>
      </form>
    </section>
  );
}
