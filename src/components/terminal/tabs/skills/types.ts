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
 * - grandchild-skill-item: 孫スキルアイテム行
 */
export type SkillsLineType = "command" | "category" | "skill-item" | "child-skill-item" | "grandchild-skill-item";

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
  /** 祖親（カテゴリ）が最後かどうか（孫スキル用） */
  grandparentIsLast?: boolean;
  /** 親スキルが最後かどうか（孫スキル用） */
  parentChildIsLast?: boolean;
  /** 孫スキルが最後かどうか */
  isLastGrandchild?: boolean;
}
