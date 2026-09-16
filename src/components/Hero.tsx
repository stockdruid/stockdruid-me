import { site } from "@/content/site";
import styles from "./Hero.module.css";

/** 물속에서 올라오는 기포. 위치와 크기를 고르게 흩어 놓는다. */
const BUBBLES = [
  { left: 6, size: 14, delay: 0, dur: 17 },
  { left: 14, size: 26, delay: 5, dur: 23 },
  { left: 23, size: 9, delay: 9, dur: 14 },
  { left: 34, size: 18, delay: 2, dur: 20 },
  { left: 45, size: 11, delay: 12, dur: 16 },
  { left: 57, size: 30, delay: 7, dur: 26 },
  { left: 66, size: 13, delay: 15, dur: 19 },
  { left: 76, size: 21, delay: 3, dur: 22 },
  { left: 85, size: 10, delay: 11, dur: 15 },
  { left: 93, size: 24, delay: 6, dur: 24 },
];

/**
 * 페이지당 1회만 재생되는 진입 시퀀스와 상시 배경.
 * 순수 CSS 애니메이션이라 JS 번들에 잡히지 않고 하이드레이션을 기다리지 않는다.
 */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/* 구름층. 느리게 흘러간다 */}
      <div className={styles.clouds} aria-hidden="true">
        <span className={styles.cloudA} />
        <span className={styles.cloudB} />
        <span className={styles.cloudC} />
      </div>

      {/* 위에서 비스듬히 떨어지는 빛줄기 */}
      <div className={styles.rays} aria-hidden="true" />

      {/* 기포 */}
      <div className={styles.bubbles} aria-hidden="true">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className={styles.bubble}
            style={
              {
                "--left": `${b.left}%`,
                "--size": `${b.size}px`,
                "--delay": `${b.delay}s`,
                "--dur": `${b.dur}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className={`shell ${styles.inner}`}>
        <p className={styles.eyebrow} style={{ "--i": 0 } as React.CSSProperties}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
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
            <span>프로젝트 보기</span>
          </a>
          <a className={styles.secondary} href="#contact">
            <span>연락하기</span>
          </a>
        </div>
      </div>

      <a className={styles.scrollHint} href="#about" aria-label="아래로 이동">
        <span className={styles.scrollOrb}>
          <span className={styles.scrollArrow} />
        </span>
        <span className={styles.scrollText}>Scroll</span>
      </a>

      {/* 아래쪽 물결. 히어로와 다음 섹션의 경계를 자연스럽게 만든다 */}
      <div className={styles.waves} aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            className={styles.waveBack}
            d="M0,64 C240,110 480,10 720,48 C960,86 1200,30 1440,62 L1440,120 L0,120 Z"
          />
          <path
            className={styles.waveFront}
            d="M0,82 C180,44 420,104 720,74 C1020,44 1260,96 1440,70 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
