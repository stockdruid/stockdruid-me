import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { CopyHandle } from "./CopyHandle";
import { Reveal } from "./Reveal";
import styles from "./Contact.module.css";

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "GitHub", value: "@stockdruid", href: site.links.github },
  ...(site.links.linkedin
    ? [{ label: "LinkedIn", value: "프로필 보기", href: site.links.linkedin }]
    : []),
];

/** 링크가 없어 복사만 되는 연락처 */
const handles = [{ label: "Discord", value: site.handles.discord }];

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
                연락은 편하게 주시면 됩니다
              </h2>
            </Reveal>

            <Reveal index={1}>
              <p className={styles.note}>
                채용이나 협업, 프로젝트와 관련한 문의를 환영합니다. 확인하는 대로
                답장드리겠습니다.
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
                {handles.map((handle) => (
                  <li key={handle.label}>
                    <CopyHandle label={handle.label} value={handle.value} />
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
