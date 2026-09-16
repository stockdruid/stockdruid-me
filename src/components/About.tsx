import { skills } from "@/content/site";
import { Reveal } from "./Reveal";
import styles from "./About.module.css";

const paragraphs = [
  "악성코드와 네트워크를 주로 들여다봤습니다. CAPE 샌드박스가 뱉는 수천 줄짜리 JSON에서 분석가가 실제로 봐야 할 행위만 추려내는 도구를 만들었고, 포트 번호만 알려주는 스캐너로는 부족해서 응답 배너를 읽고 서비스를 직접 식별하는 스캐너를 C++로 짰습니다.",
  "규정을 코드로 옮기는 일도 했습니다. 금융권 망분리 기준과 개인정보 처리 요건 수백 건을 조인 가능한 테이블로 정규화하고, 사내 챗봇 로그에서 위반을 자동으로 잡아내는 진단 엔진을 붙였습니다. 정책팀이 만든 자료가 코드 수정 없이 흡수되는 구조를 만드는 게 목표였습니다.",
  "도구는 지킬 것에 맞춰 고릅니다. 격리망 안에서 도는 분석기는 서버를 끼우지 않는 데스크탑 GUI로 만들었고, 현장 점검 앱은 설치하는 사람이 개발자가 아니라서 외부 의존성을 전부 걷어냈습니다. AI도 같은 기준으로 씁니다. 망분리 위반을 잡는 도구가 로그를 외부로 보내면 그 도구 자체가 위반이라, 성능을 일부 포기하고 로컬 추론으로 갔습니다.",
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
