import { skills } from "@/content/site";
import { Reveal } from "./Reveal";
import styles from "./About.module.css";

const paragraphs = [
  "문제를 먼저 보고 도구를 고릅니다. 격리망 안에서 도는 분석 도구는 데스크탑 GUI로, 현장에서 폰으로 쓰는 점검 앱은 의존성 없는 웹으로 만들었습니다. 스택이 목적을 정하는 게 아니라 목적이 스택을 정합니다.",
  "주 영역은 보안과 백엔드입니다. 악성코드 리포트 분석, 서비스 식별 기반 포트 스캐닝, 금융권 망분리·개인정보 컴플라이언스 진단을 다뤘습니다. 팀 프로젝트에서는 주로 데이터 모델과 API 경계를 맡습니다.",
  "AI는 도구로 씁니다. 로컬 추론이 필요한 규제 환경, 프로바이더를 갈아끼울 수 있는 추상화, 같은 모델이 쓰고 같은 모델이 리뷰하면 안 되는 이유 — 이런 것들이 실제로 부딪힌 문제였습니다.",
];

export function About() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <Reveal>
          <p className="sectionLabel">About</p>
        </Reveal>

        <div className={styles.grid}>
          <div className={styles.prose}>
            <Reveal index={0}>
              <h2 className={styles.heading}>
                만든 것으로 설명하는 편이<br />빠릅니다.
              </h2>
            </Reveal>

            {paragraphs.map((text, i) => (
              <Reveal key={i} index={i + 1}>
                <p className={styles.paragraph}>{text}</p>
              </Reveal>
            ))}
          </div>

          <div className={styles.skills}>
            {skills.map((group, gi) => (
              <Reveal key={group.group} index={gi} step={90}>
                <div className={styles.group}>
                  <h3 className={styles.groupTitle}>{group.group}</h3>
                  <ul className={styles.items}>
                    {group.items.map((item) => (
                      <li key={item.name} className={styles.item}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemContext}>{item.context}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
