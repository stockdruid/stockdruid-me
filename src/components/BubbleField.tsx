"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./BubbleField.module.css";

type Bubble = {
  id: number;
  left: number;
  size: number;
  delay: number;
  dur: number;
};

/**
 * 초기 배치는 고정값이다. 난수를 쓰면 서버와 클라이언트 결과가 달라져
 * 하이드레이션이 어긋난다.
 */
const SEED: Omit<Bubble, "id">[] = [
  { left: 6, size: 14, delay: 0, dur: 17 },
  { left: 14, size: 26, delay: 5, dur: 23 },
  { left: 23, size: 9, delay: 9, dur: 14 },
  { left: 34, size: 18, delay: 2, dur: 20 },
  { left: 45, size: 11, delay: 12, dur: 16 },
  { left: 57, size: 30, delay: 7, dur: 26 },
  { left: 66, size: 13, delay: 15, dur: 19 },
  { left: 76, size: 21, delay: 3, dur: 22 },
  { left: 85, size: 10, delay: 11, dur: 15 },
  { left: 93, size: 24, delay: 6, dur: 24 },
];

/** 터뜨린 뒤 다시 떠오르기까지 */
const RESPAWN_MS = 900;
/** 이만큼 터뜨리면 한 번 크게 쏟아진다 */
const SHOWER_AT = 10;

export function BubbleField() {
  const [bubbles, setBubbles] = useState<Bubble[]>(() =>
    SEED.map((b, i) => ({ ...b, id: i })),
  );
  const [popped, setPopped] = useState<Set<number>>(() => new Set());
  const [showerKey, setShowerKey] = useState(0);

  const nextId = useRef(SEED.length);
  const popCount = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const running = timers.current;
    return () => running.forEach(clearTimeout);
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  const pop = useCallback(
    (bubble: Bubble) => {
      if (popped.has(bubble.id)) return;

      setPopped((prev) => new Set(prev).add(bubble.id));
      popCount.current += 1;

      // 열 번째마다 한 번 쏟아진다. 계속 터뜨린 사람에게만 보이는 보상.
      if (popCount.current % SHOWER_AT === 0) {
        setShowerKey((k) => k + 1);
      }

      schedule(() => {
        setPopped((prev) => {
          const next = new Set(prev);
          next.delete(bubble.id);
          return next;
        });
        // 같은 자리에 다시 띄우되 id 를 바꿔 애니메이션을 처음부터 재생시킨다.
        setBubbles((prev) =>
          prev.map((b) =>
            b.id === bubble.id ? { ...b, id: nextId.current++, delay: 0 } : b,
          ),
        );
      }, RESPAWN_MS);
    },
    [popped, schedule],
  );

  return (
    <div className={styles.field} aria-hidden="true">
      {bubbles.map((b) => (
        <button
          key={b.id}
          type="button"
          tabIndex={-1}
          className={`${styles.bubble} ${popped.has(b.id) ? styles.popped : ""}`}
          style={
            {
              "--left": `${b.left}%`,
              "--size": `${b.size}px`,
              "--delay": `${b.delay}s`,
              "--dur": `${b.dur}s`,
            } as React.CSSProperties
          }
          onClick={() => pop(b)}
        />
      ))}

      {showerKey > 0 && <Shower key={showerKey} />}
    </div>
  );
}

/** 보상용 일회성 기포 무리. 애니메이션이 끝나면 스스로 사라진다. */
function Shower() {
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setAlive(false), 6000);
    return () => clearTimeout(t);
  }, []);

  if (!alive) return null;

  return (
    <>
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          className={styles.showerBubble}
          style={
            {
              "--left": `${(i * 37) % 100}%`,
              "--size": `${8 + ((i * 13) % 22)}px`,
              "--delay": `${(i % 8) * 0.12}s`,
              "--dur": `${4 + ((i * 7) % 4)}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  );
}
