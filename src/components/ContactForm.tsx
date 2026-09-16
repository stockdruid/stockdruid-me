"use client";

import { useState, type FormEvent } from "react";
import { contactSchema, type ContactResponse } from "@/lib/contact";
import styles from "./ContactForm.module.css";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "");
        if (field && !next[field]) next[field] = issue.message;
      }
      setFields(next);
      setStatus("error");
      setMessage("입력을 확인해 주세요.");
      return;
    }

    setFields({});
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result: ContactResponse = await response.json();

      if (result.ok) {
        setStatus("sent");
        setMessage("보냈습니다. 확인하는 대로 답장 드리겠습니다.");
        form.reset();
        return;
      }

      setStatus("error");
      setFields(result.fields ?? {});
      setMessage(result.error);
    } catch {
      setStatus("error");
      setMessage("네트워크 오류입니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  const busy = status === "sending";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <Field
          id="name"
          label="이름"
          type="text"
          autoComplete="name"
          error={fields.name}
          disabled={busy}
        />
        <Field
          id="email"
          label="이메일"
          type="email"
          autoComplete="email"
          error={fields.email}
          disabled={busy}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="message">
          내용
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={`${styles.input} ${styles.textarea} ${fields.message ? styles.invalid : ""}`}
          disabled={busy}
          aria-invalid={fields.message ? true : undefined}
          aria-describedby={fields.message ? "message-error" : undefined}
        />
        {fields.message && (
          <p id="message-error" className={styles.error}>
            {fields.message}
          </p>
        )}
      </div>

      {/* 허니팟 — 사람에게는 보이지 않고 포커스도 받지 않는다 */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="company">회사</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.footer}>
        <button className={styles.submit} type="submit" disabled={busy}>
          <span>{busy ? "보내는 중" : "보내기"}</span>
          {busy && <span className={styles.spinner} aria-hidden="true" />}
        </button>

        <p
          className={`${styles.status} ${status === "error" ? styles.statusError : ""} ${status === "sent" ? styles.statusOk : ""}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </form>
  );
}

type FieldProps = {
  id: "name" | "email";
  label: string;
  type: string;
  autoComplete: string;
  error?: string;
  disabled: boolean;
};

function Field({ id, label, type, autoComplete, error, disabled }: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`${styles.input} ${error ? styles.invalid : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
