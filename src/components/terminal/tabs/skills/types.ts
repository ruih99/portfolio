/**
 * スキルタブ関連の型定義
 */

/**
 * スキルデータの構造
 */
export interface Skill {
  /** スキル名 */
  name: string;
  /** スキルレベル */
  level: string;
  /** 経験年数 */
  yearsOfExperience: number;
  /** 強みかどうか */
  isStrength?: boolean;
  /** 子スキル */
  children?: Skill[];
}

/**
 * スキル行のタイプ
 * - command: コマンド入力行
 * - category: カテゴリヘッダー行
 * - skill-item: スキルアイテム行
 * - child-skill-item: 子スキルアイテム行
 */
export type SkillsLineType = "command" | "category" | "skill-item" | "child-skill-item";

/**
 * スキル行データの構造
 */
export interface SkillsLine {
  type: SkillsLineType;
  categoryName?: string;
  skill?: Skill;
  isLastCategory?: boolean;
  isLastInCategory?: boolean;
  parentIsLast?: boolean;
  parentSkillIsLast?: boolean;
  isLastChild?: boolean;
}
