import { projects } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import styles from "./Projects.module.css";

export function Projects() {
  return (
    <section id="projects" className="section">
      <div className="shell">
        <Reveal>
          <p className="sectionLabel">Projects</p>
        </Reveal>

        <Reveal index={1}>
          <div className={styles.head}>
            <h2 className={styles.heading}>
              프로젝트에서 내린 선택들
            </h2>
            <p className={styles.note}>
              상세 페이지에는 어떤 기술을 선택했는지와 그 이유, 그리고 그 선택으로
              무엇을 포기했는지를 함께 적어 두었습니다.
            </p>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <Reveal
              key={project.slug}
              as="div"
              index={i}
              step={80}
              className={project.featured ? styles.spanTwo : undefined}
            >
              <ProjectCard project={project} order={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
