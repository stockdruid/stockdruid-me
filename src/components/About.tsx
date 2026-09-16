import { aboutParagraphs, principles } from "@/content/site";
import { Reveal } from "./Reveal";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <Reveal>
          <p className="sectionLabel">About</p>
        </Reveal>

        <Reveal index={1}>
          <div className={styles.prose}>
            <h2 className={styles.heading}>
              만든 것으로 설명하는 편이<br />빠릅니다.
            </h2>
            {aboutParagraphs.map((text, i) => (
              <p key={i} className={styles.paragraph}>
                {text}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal index={2}>
          <h3 className={styles.subheading}>일할 때 지키는 것</h3>
        </Reveal>

        <ul className={styles.principles}>
          {principles.map((item, i) => (
            <Reveal key={item.title} as="li" index={i} step={80}>
              <article className={styles.principle}>
                <span className={styles.principleNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className={styles.principleTitle}>{item.title}</h4>
                <p className={styles.principleBody}>{item.body}</p>
                <p className={styles.evidence}>
                  <span className={styles.evidenceLabel}>실제로</span>
                  {item.evidence}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
