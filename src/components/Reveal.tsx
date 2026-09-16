"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Reveal.module.css";

type RevealProps = {
  children: ReactNode;
  /** stagger 순번. 한 그룹 안에서 0, 1, 2... */
  index?: number;
  /** 한 스텝당 지연(ms) */
  step?: number;
  as?: "div" | "section" | "li" | "article" | "header" | "footer";
  className?: string;
};

const MAX_STAGGER_MS = 420;

/**
 * 스크롤 진입 시 1회만 등장. transform/opacity/filter만 건드린다.
 *
 * 상태 대신 DOM 클래스를 직접 조작한다. 등장 여부는 React가 렌더에 쓰는 값이 아니라
 * 브라우저 쪽 상태라서, 리렌더를 유발할 이유가 없다.
 * 서버 렌더 결과는 '보이는' 상태이므로 JS가 죽어도 내용은 읽힌다.
 */
export function Reveal({
  children,
  index = 0,
  step = 70,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 하이드레이션 이후에 숨긴다 → JS 미실행 환경에서 빈 화면이 되지 않는다
    node.classList.add(styles.hidden);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.style.transitionDelay = `${Math.min(index * step, MAX_STAGGER_MS)}ms`;
          target.classList.remove(styles.hidden);
          target.classList.add(styles.shown);
          observer.unobserve(target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [index, step]);

  return (
    <Tag
      ref={ref as never}
      className={[styles.reveal, className].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
}
