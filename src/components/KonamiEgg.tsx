"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./KonamiEgg.module.css";

/**
 * 물리 키 위치(`event.code`)로 판정한다.
 *
 * 처음에는 `event.key` 로 비교했는데, 한글 입력 상태에서는 b 를 눌러도
 * 브라우저가 'ㅠ' 로 읽어 코드가 성립하지 않았다. `code` 는 입력기와 무관하게
 * 물리 키를 가리키므로 한영 전환 여부를 신경 쓰지 않아도 된다.
 */
const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
] as const;

/** `code` 를 주지 않는 환경을 위한 대체 비교값 */
const FALLBACK: Record<string, string> = {
  ArrowUp: "arrowup",
  ArrowDown: "arrowdown",
  ArrowLeft: "arrowleft",
  ArrowRight: "arrowright",
  KeyB: "b",
  KeyA: "a",
};

/** 이만큼 맞히면 진행 표시를 보여 준다 */
const HINT_FROM = 3;
/**
 * 이 시간 동안 입력이 없으면 처음부터.
 * 4초로 잡았더니 천천히 누르는 사람이 중간에 초기화됐다. 넉넉하게 둔다.
 */
const IDLE_RESET_MS = 12000;

/**
 * 코나미 코드를 입력하면 Aero 부팅 모드가 켜진다.
 *
 * 화면 변화는 전부 CSS 가 맡는다. 이 컴포넌트는 html 요소에 data-aero 를
 * 붙였다 떼기만 한다. 덕분에 번들에 들어가는 코드가 얼마 되지 않는다.
 *
 * 입력칸에 타자를 칠 때는 반응하지 않아야 한다. 연락처 폼에 b 나 a 를
 * 적다가 배경이 바뀌면 곤란하다.
 */
export function KonamiEgg() {
  const [on, setOn] = useState(false);
  const [hint, setHint] = useState(0);

  const progress = useRef(0);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function setProgress(n: number) {
      progress.current = n;
      setHint(n);

      if (idle.current) clearTimeout(idle.current);
      if (n > 0) {
        // 중간까지 치다 만 상태가 남아 다음 시도를 망치지 않게 한다.
        idle.current = setTimeout(() => {
          progress.current = 0;
          setHint(0);
        }, IDLE_RESET_MS);
      }
    }

    function isTyping(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable === true
      );
    }

    function matches(event: KeyboardEvent, step: string) {
      if (event.code === step) return true;
      // code 가 비어 있는 환경(일부 가상 키보드)에서는 key 로 비교한다.
      return !event.code && event.key.toLowerCase() === FALLBACK[step];
    }

    function onKey(event: KeyboardEvent) {
      // 키를 살짝만 길게 눌러도 keydown 이 반복해서 발생한다. 방향키에서 특히
      // 잦다. 이걸 세면 한 번 누른 것이 두 번으로 잡혀 순서가 어긋난다.
      if (event.repeat) return;
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if (isTyping(event.target)) return;

      if (on && event.key === "Escape") {
        setOn(false);
        setProgress(0);
        return;
      }

      if (matches(event, SEQUENCE[progress.current])) {
        const next = progress.current + 1;

        // 순서를 밟는 중에는 방향키로 화면이 흔들리지 않게 한다.
        // 첫 입력까지는 막지 않는다. 평소 방향키 스크롤을 뺏으면 안 된다.
        if (next > 1) event.preventDefault();

        if (next === SEQUENCE.length) {
          setProgress(0);
          setOn((v) => !v);
          return;
        }
        setProgress(next);
        return;
      }

      // 틀렸을 때 첫 키와 같으면 거기서 다시 센다.
      setProgress(matches(event, SEQUENCE[0]) ? 1 : 0);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (idle.current) clearTimeout(idle.current);
    };
  }, [on]);

  useEffect(() => {
    const root = document.documentElement;
    if (on) root.dataset.aero = "on";
    else delete root.dataset.aero;
    return () => {
      delete root.dataset.aero;
    };
  }, [on]);

  return (
    <>
      {/* 절반쯤 맞히면 진행 상황을 보여 준다. 어디서 끊겼는지 알 수 있다. */}
      {!on && hint >= HINT_FROM && (
        <div className={styles.progress} aria-hidden="true">
          {SEQUENCE.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i < hint ? styles.dotOn : ""}`}
            />
          ))}
        </div>
      )}

      {on && (
        <div className={styles.notice} role="status">
          <span className={styles.orb} aria-hidden="true" />
          <span className={styles.text}>
            Aero 부팅 모드
            <span className={styles.hint}>Esc 로 끄기</span>
          </span>
        </div>
      )}
    </>
  );
}
