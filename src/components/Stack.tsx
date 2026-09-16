import { stack } from "@/content/site";
import { Reveal } from "./Reveal";
import styles from "./Stack.module.css";

export function Stack() {
  return (
    <section id="stack" className="section">
      <div className="shell">
        <Reveal>
          <p className="sectionLabel">Stack</p>
        </Reveal>

        <Reveal index={1}>
          <div className={styles.head}>
            <h2 className={styles.heading}>
              실제로 사용해 본 기술들
            </h2>
            <p className={styles.note}>
              이름만 적어 두면 어느 정도로 다루는지 알기 어렵다고 생각하여, 각
              항목마다 어떤 작업에 사용했는지를 함께 적었습니다.
            </p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {stack.map((group, gi) => (
            <Reveal
              key={group.group}
              as="div"
              index={gi}
              step={70}
              className={gi === 0 ? styles.spanTwo : undefined}
            >
              <article
                className={`${styles.group} ${group.accent === "lime" ? styles.lime : ""}`}
              >
                <header className={styles.groupHead}>
                  <h3 className={styles.groupTitle}>{group.group}</h3>
                  <p className={styles.groupSummary}>{group.summary}</p>
                </header>

                <ul className={styles.items}>
                  {group.items.map((item) => (
                    <li key={item.name} className={styles.item}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemContext}>{item.context}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
