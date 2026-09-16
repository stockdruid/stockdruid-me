import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";
import styles from "./Contact.module.css";

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "GitHub", value: "@stockdruid", href: site.links.github },
  ...(site.links.linkedin
    ? [{ label: "LinkedIn", value: "프로필 보기", href: site.links.linkedin }]
    : []),
];

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="shell">
        <Reveal>
          <p className="sectionLabel">Contact</p>
        </Reveal>

        <div className={styles.grid}>
          <div>
            <Reveal index={0}>
              <h2 className={styles.heading}>
                같이 만들 게 있다면<br />편하게 보내주세요.
              </h2>
            </Reveal>

            <Reveal index={1}>
              <p className={styles.note}>
                채용, 협업, 프로젝트 문의 모두 환영합니다. 보통 하루 안에 답장합니다.
              </p>
            </Reveal>

            <Reveal index={2}>
              <ul className={styles.channels}>
                {channels.map((channel) => (
                  <li key={channel.label}>
                    <a
                      className={styles.channel}
                      href={channel.href}
                      target={channel.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        channel.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <span className={styles.channelLabel}>{channel.label}</span>
                      <span className={styles.channelValue}>{channel.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal index={1} step={120}>
            <div className={styles.panel}>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
