"use client";

import { useEffect, useState } from "react";
import styles from "./KonamiEgg.module.css";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

/**
 * 코나미 코드를 입력하면 Aero 부팅 모드가 켜진다.
 *
 * 화면 변화는 전부 CSS 가 맡는다. 이 컴포넌트는 html 요소에 data-aero 를
 * 붙였다 떼기만 한다. 덕분에 번들에 들어가는 코드가 얼마 되지 않는다.
 *
 * 입력칸에 타자를 칠 때는 반응하지 않아야 한다. 연락처 폼에 'b' 나 'a' 를
 * 적다가 배경이 바뀌면 곤란하다.
 */
export function KonamiEgg() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let progress = 0;

    function isTyping(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable === true
      );
    }

    function onKey(event: KeyboardEvent) {
      if (isTyping(event.target)) return;

      if (on && event.key === "Escape") {
        setOn(false);
        return;
      }

      const expected = SEQUENCE[progress];
      const pressed = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (pressed === expected) {
        progress += 1;
        if (progress === SEQUENCE.length) {
          progress = 0;
          setOn((v) => !v);
        }
        return;
      }

      // 틀렸을 때 첫 글자와 같으면 거기서 다시 센다.
      progress = pressed === SEQUENCE[0] ? 1 : 0;
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on]);

  useEffect(() => {
    const root = document.documentElement;
    if (on) root.dataset.aero = "on";
    else delete root.dataset.aero;
    return () => {
      delete root.dataset.aero;
    };
  }, [on]);

  if (!on) return null;

  return (
    <div className={styles.notice} role="status">
      <span className={styles.orb} aria-hidden="true" />
      <span className={styles.text}>
        Aero 부팅 모드
        <span className={styles.hint}>Esc 로 끄기</span>
      </span>
    </div>
  );
}
