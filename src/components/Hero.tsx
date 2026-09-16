import { site } from "@/content/site";
import styles from "./Hero.module.css";

/**
 * 페이지당 1회만 재생되는 진입 시퀀스.
 * 순수 CSS 애니메이션이라 JS 번들에 잡히지 않고 하이드레이션을 기다리지 않는다.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.mesh} aria-hidden="true">
        <span className={styles.blobA} />
        <span className={styles.blobB} />
        <span className={styles.blobC} />
      </div>
      <div className={styles.grain} aria-hidden="true" />

      <div className={`shell ${styles.inner}`}>
        <p className={styles.eyebrow} style={{ "--i": 0 } as React.CSSProperties}>
          {site.role}
        </p>

        <h1 id="hero-heading" className={styles.heading}>
          {site.tagline.map((line, i) => (
            <span key={line} className={styles.lineMask}>
              <span
                className={styles.line}
                style={{ "--i": i + 1 } as React.CSSProperties}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          className={styles.summary}
          style={{ "--i": site.tagline.length + 1 } as React.CSSProperties}
        >
          {site.summary}
        </p>

        <div
          className={styles.actions}
          style={{ "--i": site.tagline.length + 2 } as React.CSSProperties}
        >
          <a className={styles.primary} href="#projects">
            프로젝트 보기
          </a>
          <a className={styles.secondary} href="#contact">
            연락하기
          </a>
        </div>
      </div>

      <a className={styles.scrollHint} href="#about" aria-label="아래로 이동">
        <span className={styles.scrollTrack}>
          <span className={styles.scrollDot} />
        </span>
        <span className={styles.scrollText}>Scroll</span>
      </a>
    </section>
  );
}
