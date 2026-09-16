"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Contact.module.css";

type Props = {
  label: string;
  value: string;
};

type State = "idle" | "copied" | "failed";

const RESET_MS = 1800;

/** 클립보드 API가 막힌 환경을 위한 폴백. 구식이지만 대부분의 브라우저가 아직 지원한다. */
function legacyCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-1000px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

/**
 * 링크로 열 수 없는 연락처(디스코드 태그 등)를 클릭 한 번으로 복사한다.
 * 링크가 있는 채널은 서버에서 앵커로 렌더하고, 이 컴포넌트는 복사가 필요한 항목에만 쓴다.
 *
 * 복사가 막히는 환경이 실제로 있다. 실패를 조용히 삼키면 눌러도 아무 일이
 * 없는 것처럼 보이므로, 실패도 화면에 표시하고 값을 선택 상태로 만들어 준다.
 */
export function CopyHandle({ label, value }: Props) {
  const [state, setState] = useState<State>("idle");
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function schedule(next: State) {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), RESET_MS);
  }

  function selectValue() {
    const node = valueRef.current;
    if (!node) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      schedule("copied");
      return;
    } catch {
      // 권한 거부, 비보안 컨텍스트, 인앱 브라우저 등. 폴백으로 넘어간다.
    }

    if (legacyCopy(value)) {
      schedule("copied");
      return;
    }

    selectValue();
    schedule("failed");
  }

  const hint =
    state === "copied" ? "복사됨" : state === "failed" ? "직접 복사" : "복사";

  return (
    <button
      type="button"
      className={styles.channel}
      onClick={copy}
      data-state={state === "idle" ? undefined : state}
    >
      <span className={styles.channelLabel}>{label}</span>
      <span className={styles.channelValue}>
        <span ref={valueRef}>{value}</span>
        <span className={styles.copyHint} aria-hidden="true">
          {hint}
        </span>
      </span>
      <span className="visuallyHidden" role="status" aria-live="polite">
        {state === "copied"
          ? `${label} 주소를 복사했습니다`
          : state === "failed"
            ? `복사하지 못했습니다. ${label} 주소를 선택해 두었으니 직접 복사하세요`
            : ""}
      </span>
    </button>
  );
}
