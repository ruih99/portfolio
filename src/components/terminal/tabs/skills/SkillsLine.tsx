/**
 * スキルタブの行表示コンポーネント
 */

import { memo } from "react";
import {
  SKILLS_TIMING,
  useInstantComplete,
  translations,
  CompletedCommandLine,
  ActiveCommandLine,
} from "../../shared";
import {
  TreeBranch,
  TreeLast,
  TreeSkillItem,
  TreeChildSkillItem,
} from "./SkillsTree";
import { SkillsLine, Skill } from "./types";

/**
 * スキル表示用の行データを生成する
 * @param locale - 表示言語
 * @returns スキル行データの配列
 */
export function generateSkillsLines(locale: "ja" | "en"): SkillsLine[] {
  const lines: SkillsLine[] = [];
  const skillsData = translations[locale].skills;
  const totalCategories = skillsData.categories.length;

  lines.push({ type: "command" });

  skillsData.categories.forEach((category, categoryIndex) => {
    const isLastCategory = categoryIndex === totalCategories - 1;

    lines.push({
      type: "category",
      categoryName: category.name,
      isLastCategory,
    });

    category.skills.forEach((skill, skillIndex) => {
      const typedSkill = skill as Skill;
      const isLastInCategory = skillIndex === category.skills.length - 1;
      const children = typedSkill.children;
      const hasChildren = children && children.length > 0;

      lines.push({
        type: "skill-item",
        skill: typedSkill,
        isLastInCategory,
        parentIsLast: isLastCategory,
      });

      if (hasChildren) {
        children.forEach((childSkill: Skill, childIndex: number) => {
          const isLastChild = childIndex === children.length - 1;
          lines.push({
            type: "child-skill-item",
            skill: childSkill,
            parentIsLast: isLastCategory,
            parentSkillIsLast: isLastInCategory,
            isLastChild,
          });
        });
      }
    });
  });

  return lines;
}

/**
 * 完了済みスキル行の表示コンポーネント
 * memo化により、propsが変更されない限り再レンダリングを防ぐ
 */
export const CompletedSkillsLine = memo(function CompletedSkillsLine({ line }: { line: SkillsLine }) {
  switch (line.type) {
    case "command":
      return <CompletedCommandLine command="tree" />;
    case "category":
      return (
        <div className="whitespace-pre font-mono flex items-center text-sm md:text-base">
          {line.isLastCategory ? <TreeLast /> : <TreeBranch />}
          <span className="text-cyan-400">{line.categoryName}/</span>
        </div>
      );
    case "skill-item":
      return (
        <TreeSkillItem
          skill={line.skill!}
          isLastInCategory={line.isLastInCategory!}
          parentIsLast={line.parentIsLast!}
        />
      );
    case "child-skill-item":
      return (
        <TreeChildSkillItem
          skill={line.skill!}
          isLastChild={line.isLastChild!}
          parentIsLast={line.parentIsLast!}
          parentSkillIsLast={line.parentSkillIsLast!}
        />
      );
    default:
      return null;
  }
});

/**
 * アクティブな出力アイテム表示コンポーネント
 */
function ActiveOutputItem({
  line,
  onComplete,
}: {
  line: SkillsLine;
  onComplete: () => void;
}) {
  useInstantComplete(onComplete, SKILLS_TIMING.OUTPUT_ITEM_COMPLETE_DELAY);
  return <CompletedSkillsLine line={line} />;
}

/**
 * アクティブなスキル行の表示コンポーネント
 */
export function ActiveSkillsLine({
  line,
  onComplete,
}: {
  line: SkillsLine;
  onComplete: () => void;
}) {
  switch (line.type) {
    case "command":
      return <ActiveCommandLine command="tree" onComplete={onComplete} />;
    case "category":
    case "skill-item":
    case "child-skill-item":
      return <ActiveOutputItem line={line} onComplete={onComplete} />;
    default:
      return null;
  }
}
