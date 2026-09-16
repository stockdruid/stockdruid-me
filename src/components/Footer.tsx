import { site } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <span className={styles.brand}>{site.domain}</span>
        <span className={styles.note}>
          자택 서버에서 직접 운영합니다 · Next.js
        </span>
        <span className={styles.year}>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
