"use client";

import { useState, useSyncExternalStore } from "react";
import { ReactMatrixAnimation } from "react-matrix-animation";

// 英語のアルファベットと数字のみのタイルセット
const TILE_SET = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
];

// モバイル判定のブレークポイント
const MOBILE_BREAKPOINT = 768;

// useSyncExternalStore用の関数
const mediaQueryString = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(mediaQueryString);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(mediaQueryString).matches;
}

function getServerSnapshot() {
  // SSR時はtrue（モバイル想定 = 静的背景）を返す
  return true;
}

/**
 * モバイル用アニメーショントグルボタン
 */
function MobileAnimationToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-gray-800/80 border border-green-500/50 text-green-400 flex items-center justify-center hover:bg-gray-700/80 transition-colors"
      aria-label={enabled ? "アニメーションを停止" : "アニメーションを再生"}
    >
      {enabled ? "■" : "▶"}
    </button>
  );
}

/**
 * マトリックス風の雨が降る背景コンポーネント
 * 全画面固定背景として表示される
 * モバイルではパフォーマンス最適化のためデフォルトは静的背景、トグルで切り替え可能
 */
export function MatrixRainBackground() {
  // useSyncExternalStoreでSSR対応しながら画面サイズを監視
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // モバイル時のアニメーション有効/無効状態
  const [mobileAnimationEnabled, setMobileAnimationEnabled] = useState(false);

  // 共通のスタイル
  const containerStyle = {
    top: "calc(-1 * env(safe-area-inset-top, 0px))",
    right: "calc(-1 * env(safe-area-inset-right, 0px))",
    bottom: "calc(-1 * env(safe-area-inset-bottom, 0px))",
    left: "calc(-1 * env(safe-area-inset-left, 0px))",
  };

  // デスクトップ: 従来通りアニメーション表示
  if (!isMobile) {
    return (
      <div
        className="fixed z-0 opacity-30 pointer-events-none"
        style={containerStyle}
        aria-hidden="true"
      >
        <ReactMatrixAnimation
          tileSet={TILE_SET}
          fontColor="#00ff88"
          backgroundColor="#0d1117"
        />
      </div>
    );
  }

  // モバイル: トグルボタン付きの表示
  return (
    <>
      {mobileAnimationEnabled ? (
        // アニメーション表示
        <div
          className="fixed z-0 opacity-30 pointer-events-none"
          style={containerStyle}
          aria-hidden="true"
        >
          <ReactMatrixAnimation
            tileSet={TILE_SET}
            fontColor="#00ff88"
            backgroundColor="#0d1117"
          />
        </div>
      ) : (
        // 静的背景
        <div
          className="fixed inset-0 z-0 opacity-30 pointer-events-none"
          style={{
            ...containerStyle,
            backgroundColor: "#0d1117",
          }}
          aria-hidden="true"
        />
      )}
      <MobileAnimationToggle
        enabled={mobileAnimationEnabled}
        onToggle={() => setMobileAnimationEnabled((prev) => !prev)}
      />
    </>
  );
}
