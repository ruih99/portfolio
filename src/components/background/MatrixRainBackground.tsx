"use client";

import { useSyncExternalStore } from "react";
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
 * マトリックス風の雨が降る背景コンポーネント
 * 全画面固定背景として表示される
 * モバイルではパフォーマンス最適化のため静的背景のみ表示
 */
export function MatrixRainBackground() {
  // useSyncExternalStoreでSSR対応しながら画面サイズを監視
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // 共通のスタイル
  const containerStyle = {
    top: "calc(-1 * env(safe-area-inset-top, 0px))",
    right: "calc(-1 * env(safe-area-inset-right, 0px))",
    bottom: "calc(-1 * env(safe-area-inset-bottom, 0px))",
    left: "calc(-1 * env(safe-area-inset-left, 0px))",
  };

  // SSR時（初期値true）とモバイル時は静的背景のみ
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{
          ...containerStyle,
          backgroundColor: "#0d1117",
        }}
        aria-hidden="true"
      />
    );
  }

  // デスクトップではマトリックスアニメーションを表示
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
