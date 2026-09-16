import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.wrap}>
      <div className="shell">
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>여기엔 아무것도 없습니다.</h1>
        <p className={styles.note}>주소를 다시 확인하거나 첫 화면으로 돌아가세요.</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className={styles.link}>
          홈으로
        </a>
      </div>
    </main>
  );
}
