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
              무엇을 썼는지보다<br />왜 그걸 골랐는지
            </h2>
            <p className={styles.note}>
              각 프로젝트의 상세 페이지에는 기술 선택의 이유와 그때 포기한 것이
              함께 적혀 있습니다.
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
