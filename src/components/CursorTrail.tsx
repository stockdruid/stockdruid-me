"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./CursorTrail.module.css";

const TEXT = "뉴진스 화이팅";

/** 글자 덩어리 개수. 늘릴수록 꼬리가 길어진다. */
const COUNT = 9;

/**
 * 앞 점을 따라가는 비율. 1 이면 즉시 따라붙어 꼬리가 생기지 않고,
 * 0 에 가까울수록 늘어진다.
 */
const LAG = 0.34;

/** 커서를 가리지 않도록 조금 비껴 놓는다. */
const OFFSET_X = 16;
const OFFSET_Y = 12;

const AUDIO_SRC = "/audio/newjeans.mp3";
const VOLUME = 0.4;

/**
 * 커서를 따라다니는 글자 꼬리.
 *
 * 매 프레임 React 상태를 갱신하면 60번씩 리렌더가 돈다. 위치는 ref 로 잡은
 * DOM 노드의 transform 에 직접 쓴다. 이 컴포넌트는 처음 한 번만 렌더된다.
 *
 * 각 덩어리는 앞 덩어리의 위치를 쫓는다. 커서를 쫓는 것은 맨 앞 하나뿐이다.
 * 이래야 꼬리가 곡선을 그린다.
 */
export function CursorTrail() {
  const nodes = useRef<(HTMLSpanElement | null)[]>([]);

  /*
   * 음원은 이 컴포넌트가 붙을 때 처음 만들어진다. 순서를 맞히기 전에는
   * 요청조차 하지 않으므로 첫 화면 전송량에 영향이 없다.
   *
   * 키 입력으로 붙는 컴포넌트라 사용자 제스처가 이미 있었다. 자동 재생
   * 차단에 걸리지 않는다. 그래도 막히는 환경이 있을 수 있으니 실패는
   * 조용히 넘긴다. 꼬리는 그대로 돌아야 한다.
   */
  useEffect(() => {
    const player = new Audio(AUDIO_SRC);
    player.volume = VOLUME;
    player.loop = true;
    void player.play().catch(() => {});

    return () => {
      player.pause();
      player.src = "";
    };
  }, []);

  useEffect(() => {
    // 터치 기기에는 따라다닐 커서가 없다.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const points = Array.from({ length: COUNT }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }));

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let awake = false;
    let raf = 0;

    function onMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!awake) {
        awake = true;
        // 첫 움직임 전에는 화면 한가운데에 뭉쳐 있으므로 거기서 시작하지
        // 않도록 커서 위치로 한 번에 옮긴다.
        for (const point of points) {
          point.x = targetX;
          point.y = targetY;
        }
        for (const node of nodes.current) node?.classList.add(styles.awake);
      }
    }

    function frame() {
      let leadX = targetX;
      let leadY = targetY;

      for (let i = 0; i < COUNT; i += 1) {
        const point = points[i];
        point.x += (leadX - point.x) * LAG;
        point.y += (leadY - point.y) * LAG;

        const node = nodes.current[i];
        if (node) {
          node.style.transform = `translate3d(${point.x + OFFSET_X}px, ${
            point.y + OFFSET_Y
          }px, 0)`;
        }

        leadX = point.x;
        leadY = point.y;
      }

      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.trail} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            nodes.current[i] = el;
          }}
          className={styles.word}
          style={{ "--i": i } as CSSProperties}
        >
          {TEXT}
        </span>
      ))}
    </div>
  );
}
