/**
 * プロフィールタブ関連の型定義
 */

import { TabId } from "@/components/terminal/TerminalTabs";
import { AnimationPhase } from "../../shared";

/**
 * プロフィール固有のアニメーションフェーズ
 * - social: ソーシャルリンクを表示中
 */
export type ProfileExtraPhase = "social";

/**
 * プロフィールタブのアニメーションフェーズ
 * StandardPhaseを拡張し、"social"フェーズを追加
 * - idle: 初期状態
 * - line: 行を表示中
 * - social: ソーシャルリンクを表示中
 * - complete: 完了
 */
export type ProfilePhase = AnimationPhase<ProfileExtraPhase>;

/**
 * ターミナル行データの構造
 */
export interface TerminalLine {
  /** 行のタイプ */
  type: "command" | "output" | "tab-link";
  /** コマンド文字列（type="command"の場合） */
  command?: string;
  /** コマンド引数（別色で表示する部分、type="command"の場合） */
  commandArg?: string;
  /** 表示するコンテンツ */
  content?: string;
  /** リンク先のタブID（type="tab-link"の場合） */
  tabId?: TabId;
}

/**
 * ソーシャルリンクの構造
 */
export interface SocialLink {
  /** サービス名 */
  name: string;
  /** リンクURL */
  href: string;
  /** アイコンタイプ */
  iconType: "github" | "linkedin" | "x";
  /** アイコンの色クラス */
  color: string;
}
