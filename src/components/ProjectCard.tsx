import Image from "next/image";
import type { Project } from "@/content/projects";
import styles from "./ProjectCard.module.css";

type Props = {
  project: Project;
  /** 목록 내 순번 — 번호 표기용 */
  order: number;
};

export function ProjectCard({ project, order }: Props) {
  const { slug, title, tagline, role, period, stack, thumbnail, hue, featured } =
    project;

  return (
    <article
      className={`${styles.card} ${featured ? styles.featured : ""}`}
      style={{ "--hue": hue } as React.CSSProperties}
    >
      {/*
        next/link 대신 일반 앵커 — 전체 문서 내비게이션이라야 네이티브
        cross-document View Transition(@view-transition)이 발동한다.
        페이지는 전부 정적 생성이라 프리페치를 포기해도 체감 손해가 없다.
      */}
      <a href={`/projects/${slug}`} className={styles.hit}>
        <span className="visuallyHidden">{title} 상세 보기</span>
      </a>

      <div className={styles.media} aria-hidden="true">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.image}
            style={{ viewTransitionName: `media-${slug}` }}
          />
        ) : (
          <div
            className={styles.placeholder}
            style={{ viewTransitionName: `media-${slug}` }}
          >
            <span className={styles.placeholderNum}>
              {String(order).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{role}</span>
          <span className={styles.dot} />
          <span>{period}</span>
        </div>

        <h3 className={styles.title} style={{ viewTransitionName: `title-${slug}` }}>
          {title}
        </h3>
        <p className={styles.tagline}>{tagline}</p>

        <ul className={styles.stack}>
          {stack.slice(0, 5).map((tech) => (
            <li key={tech} className={styles.tag}>
              {tech}
            </li>
          ))}
        </ul>

        <span className={styles.more}>
          자세히 보기
          <svg
            className={styles.arrow}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}
