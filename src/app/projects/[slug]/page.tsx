import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { getProject, projects } from "@/content/projects";
import styles from "./project.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "찾을 수 없음" };

  return {
    title: project.title,
    description: project.tagline,
    openGraph: { title: project.title, description: project.tagline },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <Nav standalone />
      <main className={styles.page} style={{ "--hue": project.hue } as React.CSSProperties}>
        <article>
          <header className={`shell ${styles.header}`}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#projects" className={styles.back}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M13 8H4m3.5-3.5L4 8l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              프로젝트 목록
            </a>

            <div className={styles.meta}>
              <span>{project.role}</span>
              <span className={styles.dot} />
              <span>{project.period}</span>
            </div>

            <h1
              className={styles.title}
              style={{ viewTransitionName: `title-${project.slug}` }}
            >
              {project.title}
            </h1>
            <p className={styles.tagline}>{project.tagline}</p>

            <ul className={styles.stack}>
              {project.stack.map((tech) => (
                <li key={tech} className={styles.tag}>
                  {tech}
                </li>
              ))}
            </ul>

            {(project.links.github || project.links.demo) && (
              <div className={styles.links}>
                {project.links.github && (
                  <a
                    className={styles.link}
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    소스 코드
                  </a>
                )}
                {project.links.demo && (
                  <a
                    className={styles.link}
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    데모
                  </a>
                )}
              </div>
            )}
          </header>

          <div className={`shell ${styles.mediaWrap}`}>
            <div className={styles.media}>
              {project.thumbnail ? (
                <Image
                  src={project.thumbnail}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1180px) 100vw, 1180px"
                  className={styles.image}
                  style={{ viewTransitionName: `media-${project.slug}` }}
                />
              ) : (
                <div
                  className={styles.placeholder}
                  style={{ viewTransitionName: `media-${project.slug}` }}
                  aria-hidden="true"
                >
                  <span className={styles.placeholderNum}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={`shell ${styles.content}`}>
            <Reveal>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>문제 상황</h2>
                <p className={styles.prose}>{project.body.problem}</p>
              </section>
            </Reveal>

            <Reveal index={1}>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>맡은 부분</h2>
                <ul className={styles.list}>
                  {project.body.contribution.map((item) => (
                    <li key={item} className={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal index={2}>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>기술 선택</h2>
                <div className={styles.decisions}>
                  {project.body.decisions.map((decision, i) => (
                    <div key={decision.choice} className={styles.decision}>
                      <span className={styles.decisionNum}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className={styles.decisionChoice}>{decision.choice}</h3>
                        <p className={styles.decisionWhy}>{decision.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal index={3}>
              <section className={styles.block}>
                <h2 className={styles.blockTitle}>결과</h2>
                <p className={styles.prose}>{project.body.outcome}</p>
              </section>
            </Reveal>
          </div>
        </article>

        <nav className={`shell ${styles.nextWrap}`} aria-label="다음 프로젝트">
          <a href={`/projects/${next.slug}`} className={styles.next}>
            <span className={styles.nextLabel}>다음 프로젝트</span>
            <span className={styles.nextTitle}>{next.title}</span>
          </a>
        </nav>
      </main>
      <Footer />
    </>
  );
}
