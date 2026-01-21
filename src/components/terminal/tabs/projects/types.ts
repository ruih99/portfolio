/**
 * プロジェクトタブ関連の型定義
 */

/**
 * プロジェクトタブのアニメーションフェーズ
 * StandardPhaseをベースに、プロジェクト固有のフェーズを追加
 * - idle: 初期状態
 * - command: コマンド入力中（indexなし）
 * - project: プロジェクト表示中（indexあり）
 * - complete: 完了
 */
export type ProjectsPhase =
  | { type: "idle" }
  | { type: "command" }
  | { type: "project"; index: number }
  | { type: "complete" };

/**
 * プロジェクトの型定義
 * JSON から読み込むため、description は単一の string
 */
export interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}
