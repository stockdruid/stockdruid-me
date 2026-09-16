import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isAdminConfigured, verifySession } from "@/lib/auth.server";
import { readInquiries } from "@/lib/inbox.server";
import { site } from "@/content/site";
import { LoginForm } from "./LoginForm";
import { Inbox } from "./Inbox";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

/** 관리자 화면은 검색엔진에 절대 올라가면 안 된다. */
export const metadata: Metadata = {
  title: "관리자",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage() {
  const configured = isAdminConfigured();
  const jar = await cookies();
  const authed = configured && verifySession(jar.get(SESSION_COOKIE)?.value);

  return (
    <main className={styles.page}>
      <div className={`shell ${styles.inner}`}>
        <header className={styles.header}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className={styles.home}>
            {site.domain}
          </a>
          <h1 className={styles.title}>
            {authed ? "문의함" : "관리자"}
          </h1>
        </header>

        {!configured ? (
          <section className={styles.panel}>
            <h2 className={styles.notice}>아직 설정되지 않았습니다</h2>
            <p className={styles.noticeBody}>
              터미널에서 <code className={styles.code}>npm run admin:hash</code> 를 실행해
              비밀번호를 정하고, 출력된 두 줄을{" "}
              <code className={styles.code}>.env.local</code> 에 붙여넣은 뒤 서버를
              재시작하세요.
            </p>
          </section>
        ) : authed ? (
          <Inbox inquiries={await readInquiries()} />
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
