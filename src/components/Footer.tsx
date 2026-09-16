import { site } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <span className={styles.brand}>{site.domain}</span>
        <span className={styles.note}>
          직접 구축한 서버에서 운영하고 있습니다 · Next.js
        </span>
        <span className={styles.year}>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
