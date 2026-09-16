"use client";

import { useEffect, useState } from "react";
import { navItems, site } from "@/content/site";
import styles from "./Nav.module.css";

/**
 * 떠 있는 유리 알약 내비. 스크롤 위치에 따라 현재 섹션을 표시한다.
 * 랜딩이 아닌 페이지에서는 앵커가 없으므로 홈으로 되돌아가는 링크로 동작한다.
 */
export function Nav({ standalone = false }: { standalone?: boolean }) {
  const [active, setActive] = useState<string>("");
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (standalone) return;

    const sections = navItems
      .map(({ href }) => document.querySelector<HTMLElement>(href))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [standalone]);

  return (
    <header className={styles.wrap}>
      <nav
        className={`${styles.pill} ${condensed ? styles.condensed : ""}`}
        aria-label="주요 내비게이션"
      >
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className={styles.brand}>
          {site.domain}
        </a>

        <ul className={styles.list}>
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <a
                href={standalone ? `/${href}` : href}
                className={`${styles.link} ${active === href ? styles.active : ""}`}
                aria-current={active === href ? "true" : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          className={styles.cta}
          href={standalone ? "/#contact" : "#contact"}
        >
          연락하기
        </a>
      </nav>
    </header>
  );
}
