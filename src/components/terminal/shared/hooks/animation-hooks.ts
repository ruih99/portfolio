/**
 * アニメーション関連のカスタムフックと定数
 */

import { useState, useEffect, useRef, useMemo } from "react";

/**
 * prefers-reduced-motion メディアクエリを検出するフック
 * @returns ユーザーがモーション軽減を希望しているかどうか
 */
function usePrefersReducedMotion(): boolean {
  // 初期値をSSR対応のため、サーバーサイドではfalseとする
  const getInitialValue = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const [prefersReduced, setPrefersReduced] = useState(getInitialValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

/**
 * モバイル/タッチデバイスを検出するフック
 * @returns タッチデバイスかどうか
 */
function useIsMobile(): boolean {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);
}

export const TIMING = {
  COMMAND_CHAR_SPEED: 40,
  COMMAND_CHAR_JITTER: 20,
  POST_COMMAND_DELAY: 300,
  POST_OUTPUT_DELAY: 400,
  SOCIAL_LINK_DELAY: 300,
  PROMPT_DELAY: 300,
};

export const SKILLS_TIMING = {
  SKILL_ITEM_DELAY: 3,
  CATEGORY_HEADER_DELAY: 5,
  POST_COMMAND_DELAY: 20,
  OUTPUT_ITEM_COMPLETE_DELAY: 1,
};

/**
 * アニメーションフェーズの基本型
 */
export type AnimationPhase<T extends string = never> =
  | { type: "idle" }
  | { type: "line"; index: number }
  | ([T] extends [never] ? never : { type: T; index: number })
  | { type: "complete" };

/**
 * 標準的なアニメーションフェーズ型（行のみ）
 */
export type StandardPhase =
  | { type: "idle" }
  | { type: "line"; index: number }
  | { type: "complete" };

/**
 * タブがアクティブになった時にアニメーションを開始するフック
 * @param isActive - タブがアクティブかどうか
 * @param onStart - アニメーション開始時のコールバック
 * @param delay - 開始前の遅延時間（ミリ秒）
 */
export function useAnimationTrigger(
  isActive: boolean,
  onStart: () => void,
  delay: number = 300
): void {
  const hasStarted = useRef(false);

  useEffect(() => {
    if (isActive && !hasStarted.current) {
      hasStarted.current = true;
      const timeout = setTimeout(onStart, delay);
      return () => clearTimeout(timeout);
    }
  }, [isActive, onStart, delay]);
}

/**
 * タイプライター効果を実現するカスタムフック
 * - prefers-reduced-motion が有効な場合は即座に全文表示
 * - モバイルデバイスでは速度を2倍に高速化
 * - requestAnimationFrame ベースで CPU 負荷を軽減
 *
 * @param text - 表示するテキスト
 * @param baseSpeed - 基本タイピング速度（ミリ秒/文字）
 * @param jitter - タイピング速度のランダム変動幅（ミリ秒）
 * @param onComplete - タイピング完了時のコールバック関数
 * @param initialDelay - タイピング開始前の遅延時間（ミリ秒）
 * @returns 表示中のテキストと完了フラグを含むオブジェクト
 */
export function useTypewriter(
  text: string,
  baseSpeed: number = 40,
  jitter: number = 20,
  onComplete?: () => void,
  initialDelay: number = 0
) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(!text);
  const hasCalledComplete = useRef(false);
  const indexRef = useRef(0);

  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  // モバイルでは速度を2倍に（baseSpeed を半分に）
  const effectiveSpeed = isMobile ? baseSpeed / 2 : baseSpeed;
  const effectiveJitter = isMobile ? jitter / 2 : jitter;

  useEffect(() => {
    hasCalledComplete.current = false;
    indexRef.current = 0;
    // setState を非同期で実行して ESLint ルールに準拠
    const timeoutId = setTimeout(() => {
      setDisplayedText("");
      setIsComplete(!text);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [text]);

  useEffect(() => {
    if (!text) return;

    // prefers-reduced-motion が有効な場合は即座に全文表示
    if (prefersReducedMotion) {
      // setState を非同期で実行して ESLint ルールに準拠
      const timeoutId = setTimeout(() => {
        setDisplayedText(text);
        setIsComplete(true);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    let cancelled = false;
    let animationFrameId: number;
    let lastTime = 0;
    let nextCharDelay = initialDelay > 0 ? initialDelay : effectiveSpeed;

    const animate = (currentTime: number) => {
      if (cancelled) return;

      if (lastTime === 0) {
        lastTime = currentTime;
      }

      const elapsed = currentTime - lastTime;

      if (elapsed >= nextCharDelay) {
        if (indexRef.current < text.length) {
          indexRef.current++;
          setDisplayedText(text.slice(0, indexRef.current));
          lastTime = currentTime;
          // 次の文字までの遅延をランダムに設定
          nextCharDelay =
            effectiveSpeed + (Math.random() * 2 - 1) * effectiveJitter;
        } else {
          setIsComplete(true);
          return;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [text, effectiveSpeed, effectiveJitter, initialDelay, prefersReducedMotion]);

  useEffect(() => {
    if (isComplete && !hasCalledComplete.current && onComplete) {
      hasCalledComplete.current = true;
      onComplete();
    }
  }, [isComplete, onComplete]);

  return { displayedText, isComplete };
}

/**
 * 即座に完了を通知するフック（一度だけ実行）
 * @param onComplete - 完了時のコールバック関数
 * @param delay - 完了通知までの遅延時間（ミリ秒、デフォルト50）
 */
export function useInstantComplete(
  onComplete: () => void,
  delay: number = 50
): void {
  const hasCompleted = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hasCompleted.current) return;
      hasCompleted.current = true;
      onComplete();
    }, delay);
    return () => clearTimeout(timeout);
  }, [onComplete, delay]);
}
