/**
 * アニメーション関連のカスタムフックと定数
 */

import { useState, useEffect, useRef } from "react";

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

  useEffect(() => {
    hasCalledComplete.current = false;
    indexRef.current = 0;
    const resetTimeout = setTimeout(() => {
      setDisplayedText("");
      setIsComplete(!text);
    }, 0);
    return () => clearTimeout(resetTimeout);
  }, [text]);

  useEffect(() => {
    if (!text) return;

    let cancelled = false;

    const typeNextChar = () => {
      if (cancelled) return;
      if (indexRef.current < text.length) {
        indexRef.current++;
        setDisplayedText(text.slice(0, indexRef.current));
        const randomDelay = baseSpeed + (Math.random() * 2 - 1) * jitter;
        setTimeout(typeNextChar, Math.max(10, randomDelay));
      } else {
        setIsComplete(true);
      }
    };

    setTimeout(typeNextChar, initialDelay > 0 ? initialDelay : baseSpeed);

    return () => {
      cancelled = true;
    };
  }, [text, baseSpeed, jitter, initialDelay]);

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
