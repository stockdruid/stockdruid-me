"use client";

import { useMemo, useState } from "react";
import type { Inquiry } from "@/lib/inbox";
import styles from "./admin.module.css";

/** 저장된 ISO 문자열을 한국 시간 기준으로 읽기 좋게 바꾼다. */
function formatAt(iso: string): string {
  if (!iso) return "시각 없음";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(date);
}

export function Inbox({ inquiries }: { inquiries: Inquiry[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(inquiries.length > 0 ? 0 : null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter((item) =>
      [item.name, item.email, item.message].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }, [inquiries, query]);

  const undelivered = inquiries.filter((i) => !i.delivered).length;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            전체 <strong>{inquiries.length}</strong>
          </span>
          {undelivered > 0 && (
            <span className={`${styles.stat} ${styles.statWarn}`}>
              메일 미발송 <strong>{undelivered}</strong>
            </span>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <input
            type="search"
            className={styles.search}
            placeholder="이름, 메일, 내용 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="문의 검색"
          />
          <button type="button" className={styles.logout} onClick={logout}>
            로그아웃
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <section className={styles.panel}>
          <p className={styles.empty}>
            {inquiries.length === 0
              ? "아직 받은 문의가 없습니다."
              : "검색 결과가 없습니다."}
          </p>
        </section>
      ) : (
        <ul className={styles.list}>
          {filtered.map((item, i) => {
            const expanded = open === i;
            return (
              <li key={`${item.at}-${i}`} className={styles.item}>
                <button
                  type="button"
                  className={styles.itemHead}
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                >
                  <span className={styles.itemMain}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemEmail}>{item.email}</span>
                  </span>
                  <span className={styles.itemMeta}>
                    {!item.delivered && (
                      <span className={styles.badge} title="메일 발송에 실패했거나 SMTP 미설정">
                        미발송
                      </span>
                    )}
                    <span className={styles.itemAt}>{formatAt(item.at)}</span>
                    <span
                      className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
                      aria-hidden="true"
                    />
                  </span>
                </button>

                {expanded && (
                  <div className={styles.itemBody}>
                    <p className={styles.message}>{item.message}</p>
                    <a
                      className={styles.reply}
                      href={`mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(
                        "Re: stockdruid.me 문의",
                      )}`}
                    >
                      답장 쓰기
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
