/**
 * タブビューヘルパー関数
 * タブコンポーネントで共通して使用される処理を提供する
 */

/**
 * 遅延マップの型定義
 * 行タイプと遅延時間（ミリ秒）のマッピング
 */
export type DelayMap = Record<string, number>;

/**
 * 行タイプに基づいて遅延時間を取得する
 * @param lineType - 行のタイプ（例: "command", "output", "skill-item"）
 * @param delayMap - 行タイプと遅延時間のマッピング
 * @param defaultDelay - 遅延マップに該当がない場合のデフォルト値（デフォルト: 0）
 * @returns 遅延時間（ミリ秒）
 */
export function getLineDelay(
  lineType: string,
  delayMap: DelayMap,
  defaultDelay: number = 0
): number {
  return delayMap[lineType] ?? defaultDelay;
}

/**
 * 行完了ハンドラーを生成する汎用関数
 * タブコンポーネントで使用する行ごとのアニメーション完了処理を自動化する
 *
 * @param totalLines - 全行数
 * @param getDelay - インデックスから遅延時間を取得する関数
 * @param setCompleted - 完了行数を更新する関数
 * @param setPhase - フェーズを更新する関数
 * @param nextPhase - 全行完了時に遷移するフェーズ
 * @returns 行完了時に呼び出すハンドラー関数
 *
 * @example
 * const handler = createLineCompletionHandler(
 *   lines.length,
 *   (index) => lines[index].type === "command" ? 1000 : 500,
 *   setCompletedLines,
 *   setPhase,
 *   { type: "complete" }
 * );
 */
export function createLineCompletionHandler<TPhase>(
  totalLines: number,
  getDelay: (index: number) => number,
  setCompleted: (count: number) => void,
  setPhase: (phase: TPhase) => void,
  nextPhase: TPhase
): (index: number) => void {
  return (index: number) => {
    const nextIndex = index + 1;
    const delay = getDelay(index);

    if (nextIndex < totalLines) {
      setTimeout(() => {
        setCompleted(nextIndex);
        setPhase({ type: "line", index: nextIndex } as TPhase);
      }, delay);
    } else {
      setTimeout(() => {
        setCompleted(nextIndex);
        setPhase(nextPhase);
      }, delay);
    }
  };
}
