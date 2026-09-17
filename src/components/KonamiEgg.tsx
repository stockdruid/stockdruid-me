"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CursorTrail } from "./CursorTrail";
import styles from "./KonamiEgg.module.css";

/**
 * 방향키만으로 판정한다.
 *
 * 정방향 ↑ ↑ ↓ ↓ ← → ← → 은 Aero 부팅 모드,
 * 역방향 → ← → ← ↓ ↓ ↑ ↑ 은 숨은 손님을 부른다.
 *
 * 원래는 코나미 코드 그대로 B, A 로 끝냈는데 실제 키보드에서 끝까지 들어가지
 * 않는 일이 잦았다. 한글 입력 상태에서 글자 키가 엉키는 문제를 물리 키
 * 판정으로 고쳤는데도 마찬가지였다. 방향키는 입력기의 영향을 받지 않으므로
 * 글자 키를 빼고 방향키만 남겼다. 외우기도 더 쉽다.
 *
 * 판정은 `event.code`(물리 키 위치)로 한다. 자판 배열과 무관하게 동작한다.
 */
const AERO_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
] as const;

/** 정방향을 그대로 뒤집은 순서 */
const SANS_SEQUENCE = [...AERO_SEQUENCE].reverse();

/**
 * 커서 꼬리를 켜는 순서. 물리 키 위치로 판정하므로 한글 입력 상태에서도
 * 그대로 통한다. 화면에 보이는 글자는 ㅜㅓㅋ 가 되더라도 상관없다.
 */
const TRAIL_SEQUENCE = ["KeyN", "KeyJ", "KeyZ"] as const;

/** `code` 를 주지 않는 환경을 위한 대체 비교값 */
const FALLBACK: Record<string, string> = {
  ArrowUp: "arrowup",
  ArrowDown: "arrowdown",
  ArrowLeft: "arrowleft",
  ArrowRight: "arrowright",
  KeyN: "n",
  KeyJ: "j",
  KeyZ: "z",
};

/** 이만큼 맞히면 진행 표시를 보여 준다 */
const HINT_FROM = 3;
/**
 * 이 시간 동안 입력이 없으면 처음부터.
 * 4초로 잡았더니 천천히 누르는 사람이 중간에 초기화됐다. 넉넉하게 둔다.
 */
const IDLE_RESET_MS = 12000;

const SANS_AUDIO_SRC = "/audio/megalovania.mp3";
const SANS_VOLUME = 0.45;

/**
 * 방향키 순서를 입력하면 숨은 기능이 열린다.
 *
 * Aero 모드의 화면 변화는 전부 CSS 가 맡는다. 이 컴포넌트는 html 요소에
 * data-aero 를 붙였다 떼기만 한다. 덕분에 번들에 들어가는 코드가 얼마 되지
 * 않는다.
 *
 * 음원은 순서를 다 맞힌 뒤에야 내려받는다. 평소에는 요청조차 하지 않으므로
 * 첫 화면 성능에 영향이 없다.
 *
 * 입력칸에 타자를 칠 때는 반응하지 않아야 한다. 연락처 폼에 방향키를
 * 누르다가 배경이 바뀌면 곤란하다.
 */
export function KonamiEgg() {
  const [aero, setAero] = useState(false);
  const [sans, setSans] = useState(false);
  const [trail, setTrail] = useState(false);
  const [hint, setHint] = useState(0);

  const aeroStep = useRef(0);
  const sansStep = useRef(0);
  const trailStep = useRef(0);
  /** 키를 누르고 있는 동안 자동 반복을 한 번 받았는지 */
  const repeatUsed = useRef(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const stopSans = useCallback(() => {
    setSans(false);
    const player = audio.current;
    if (!player) return;
    player.pause();
    player.currentTime = 0;
  }, []);

  useEffect(() => {
    function clearSteps() {
      aeroStep.current = 0;
      sansStep.current = 0;
      trailStep.current = 0;
      setHint(0);
    }

    function resetLater() {
      if (idle.current) clearTimeout(idle.current);
      if (aeroStep.current === 0 && sansStep.current === 0) return;
      // 중간까지 치다 만 상태가 남아 다음 시도를 망치지 않게 한다.
      idle.current = setTimeout(clearSteps, IDLE_RESET_MS);
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

    const tracks = [
      { sequence: AERO_SEQUENCE as readonly string[], cursor: aeroStep },
      { sequence: SANS_SEQUENCE as readonly string[], cursor: sansStep },
      { sequence: TRAIL_SEQUENCE as readonly string[], cursor: trailStep },
    ];

    /**
     * 지금 누른 키가 "같은 키를 한 번 더" 기다리는 자리인지 본다.
     * ↓ ↓ 나 ↑ ↑ 처럼 같은 키가 연달아 오는 자리를 말한다.
     */
    function expectsSameKeyAgain(event: KeyboardEvent) {
      return tracks.some(({ sequence, cursor }) => {
        const i = cursor.current;
        return (
          i > 0 && matches(event, sequence[i]) && matches(event, sequence[i - 1])
        );
      });
    }

    /** 한 순서의 진행도를 갱신하고, 방금 완성됐는지 알려 준다. */
    function advance(
      event: KeyboardEvent,
      sequence: readonly string[],
      cursor: { current: number },
    ) {
      if (matches(event, sequence[cursor.current])) {
        cursor.current += 1;
        if (cursor.current === sequence.length) {
          cursor.current = 0;
          return true;
        }
        return false;
      }
      // 틀렸을 때 첫 키와 같으면 거기서 다시 센다.
      cursor.current = matches(event, sequence[0]) ? 1 : 0;
      return false;
    }

    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      if (isTyping(event.target)) return;

      /*
       * 키를 조금만 길게 눌러도 keydown 이 반복해서 발생한다. 방향키에서
       * 특히 잦다. 반복을 그대로 세면 한 번 누른 것이 여러 번으로 잡혀
       * 순서가 어긋난다.
       *
       * 그렇다고 전부 버리면 ↓ ↓ 처럼 같은 키가 연달아 오는 자리에서
       * 키를 누른 채로 두 번을 채우려는 사람이 막힌다. 실제로 여기서
       * 걸렸다. 그래서 그 자리에서만, 누르고 있는 동안 딱 한 번 받아 준다.
       */
      if (event.repeat) {
        if (repeatUsed.current) return;
        if (!expectsSameKeyAgain(event)) return;
        repeatUsed.current = true;
      } else {
        repeatUsed.current = false;
      }

      if (event.key === "Escape") {
        const anything = sans || aero || trail;
        if (sans) stopSans();
        if (aero) setAero(false);
        if (trail) setTrail(false);
        if (anything) {
          clearSteps();
          return;
        }
      }

      const before = Math.max(aeroStep.current, sansStep.current);

      // 세 순서를 나란히 센다. 첫 키가 서로 달라 동시에 완성될 일은 없다.
      const aeroDone = advance(event, AERO_SEQUENCE, aeroStep);
      const sansDone = advance(event, SANS_SEQUENCE, sansStep);
      const trailDone = advance(event, TRAIL_SEQUENCE, trailStep);

      const after = Math.max(aeroStep.current, sansStep.current);

      // 방향키 순서를 밟는 중에는 화면이 흔들리지 않게 한다. 첫 입력까지는
      // 막지 않는다. 평소 방향키 스크롤을 뺏으면 안 된다. 글자 키는 애초에
      // 기본 동작이 없으므로 여기 들어오지 않는다.
      if (before > 0 && after > 0) event.preventDefault();

      if (aeroDone) {
        setAero((v) => !v);
      } else if (sansDone) {
        setSans(true);
      } else if (trailDone) {
        setTrail((v) => !v);
      }

      setHint(aeroDone || sansDone ? 0 : after);
      resetLater();
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (idle.current) clearTimeout(idle.current);
    };
  }, [aero, sans, trail, stopSans]);

  useEffect(() => {
    const root = document.documentElement;
    if (aero) root.dataset.aero = "on";
    else delete root.dataset.aero;
    return () => {
      delete root.dataset.aero;
    };
  }, [aero]);

  // 음원은 여기서 처음 만들어진다. 순서를 맞히기 전에는 내려받지 않는다.
  useEffect(() => {
    if (!sans) return;

    if (!audio.current) {
      audio.current = new Audio(SANS_AUDIO_SRC);
      audio.current.volume = SANS_VOLUME;
    }
    const player = audio.current;
    player.currentTime = 0;
    // 자동 재생이 막히는 경우에도 화면은 그대로 둔다.
    void player.play().catch(() => {});

    const onEnded = () => setSans(false);
    player.addEventListener("ended", onEnded);
    return () => player.removeEventListener("ended", onEnded);
  }, [sans]);

  useEffect(() => {
    return () => {
      audio.current?.pause();
      audio.current = null;
    };
  }, []);

  const hintTotal = AERO_SEQUENCE.length;
  const modes = [aero ? "Aero 부팅 모드" : null, trail ? "뉴진스 화이팅" : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {/*
        상시로 켜 두고 싶다면 조건을 떼고 <CursorTrail /> 만 남기면 된다.
        기본값은 꺼짐이다. 채용 담당자가 열었을 때 커서에 글자가 줄줄
        따라다니면 곤란하다.
      */}
      {trail && <CursorTrail />}

      {/* 절반쯤 맞히면 진행 상황을 보여 준다. 어디서 끊겼는지 알 수 있다. */}
      {!aero && !sans && hint >= HINT_FROM && (
        <div className={styles.progress} aria-hidden="true">
          {Array.from({ length: hintTotal }, (_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i < hint ? styles.dotOn : ""}`}
            />
          ))}
        </div>
      )}

      {/* 켜진 모드를 한 줄에 모은다. 표시가 겹치면 읽을 수 없다. */}
      {!sans && modes.length > 0 && (
        <div className={styles.notice} role="status">
          <span className={styles.orb} aria-hidden="true" />
          <span className={styles.text}>
            {modes}
            <span className={styles.hint}>Esc 로 끄기</span>
          </span>
        </div>
      )}

      {sans && (
        <div
          className={styles.stage}
          role="dialog"
          aria-modal="true"
          aria-label="숨은 손님"
        >
          <button
            type="button"
            className={styles.backdrop}
            onClick={stopSans}
            aria-label="닫기"
          />

          {/* 무대 조명. 도는 속도와 색이 제각각이라 주기가 쉽게 겹치지 않는다. */}
          <div className={styles.lasers} aria-hidden="true">
            <span className={`${styles.beam} ${styles.beamCyan}`} />
            <span className={`${styles.beam} ${styles.beamMagenta}`} />
            <span className={`${styles.beam} ${styles.beamLime}`} />
          </div>
          <div className={styles.strobe} aria-hidden="true" />

          <div className={styles.figure} aria-hidden="true">
            <span className={styles.halo} />
            <Image
              src="/images/sans.webp"
              alt=""
              width={1000}
              height={1314}
              className={styles.sprite}
              unoptimized
            />
          </div>
          <p className={styles.caption} aria-hidden="true">
            Esc 로 닫기
          </p>
        </div>
      )}
    </>
  );
}
