import { ReactMatrixAnimation } from "react-matrix-animation";

// 英語のアルファベットと数字のみのタイルセット
const TILE_SET = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
];

/**
 * マトリックス風の雨が降る背景コンポーネント
 * 全画面固定背景として表示される
 */
export function MatrixRainBackground() {
  return (
    <div
      className="fixed z-0 opacity-30 pointer-events-none"
      style={{
        top: "calc(-1 * env(safe-area-inset-top, 0px))",
        right: "calc(-1 * env(safe-area-inset-right, 0px))",
        bottom: "calc(-1 * env(safe-area-inset-bottom, 0px))",
        left: "calc(-1 * env(safe-area-inset-left, 0px))",
      }}
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
