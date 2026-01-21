/**
 * キャリアタブ関連の型定義
 */

import { StandardPhase } from "../../shared";

/**
 * キャリア行のタイプ
 * - command: コマンド入力行
 * - career-entry: キャリアエントリ行
 */
export type CareersLineType = "command" | "career-entry";

/**
 * キャリア行データの構造
 */
export interface CareersLine {
  /** 行のタイプ */
  type: CareersLineType;
  /** コマンド文字列（type="command"の場合） */
  command?: string;
  /** キャリアID */
  careerId?: string;
  /** ローカライズされたキャリアデータ */
  localizedCareer?: LocalizedCareer;
  /** キャリアのインデックス */
  index?: number;
}

/**
 * キャリアタブのアニメーションフェーズ
 * StandardPhaseのエイリアス（後方互換性のため維持）
 */
export type CareersPhase = StandardPhase;

/**
 * ローカライズされたキャリア情報
 */
export interface LocalizedCareer {
  /** 会社名 */
  company: string;
  /** 役職 */
  position: string;
  /** 期間 */
  period: {
    start: string;
    end: string;
  };
  /** 使用技術 */
  technologies: string[];
}
