"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import {
  SKILLS_TIMING,
  StandardPhase,
  useAnimationTrigger,
  TerminalPrompt,
  createLineCompletionHandler,
  getLineDelay,
  DelayMap,
} from "../../shared";
import {
  generateSkillsLines,
  CompletedSkillsLine,
  ActiveSkillsLine,
} from "./SkillsLine";

interface SkillsTabProps {
  isActive?: boolean;
}

/**
 * スキルタブコンポーネント
 * ツリー形式でスキル一覧を表示する
 * @param props - コンポーネントプロパティ
 * @param props.isActive - タブがアクティブかどうか
 * @returns スキルタブのJSX要素
 */
export function SkillsTab({ isActive = false }: SkillsTabProps) {
  const { locale, isHydrated } = useLanguage();
  const [skillsPhase, setSkillsPhase] = useState<StandardPhase>({ type: "idle" });
  const [skillsCompletedLines, setSkillsCompletedLines] = useState<number>(0);

  const skillsLines = useMemo(() => generateSkillsLines(locale), [locale]);

  useAnimationTrigger(
    (isActive ?? false) && isHydrated,
    () => setSkillsPhase({ type: "line", index: 0 }),
    300
  );

  const skillsDelayMap: DelayMap = useMemo(() => ({
    command: SKILLS_TIMING.POST_COMMAND_DELAY,
    category: SKILLS_TIMING.CATEGORY_HEADER_DELAY,
    "skill-item": SKILLS_TIMING.SKILL_ITEM_DELAY,
  }), []);

  const handleSkillsLineComplete = useMemo(
    () =>
      createLineCompletionHandler<StandardPhase>(
        skillsLines.length,
        (index) =>
          getLineDelay(
            skillsLines[index].type,
            skillsDelayMap,
            SKILLS_TIMING.SKILL_ITEM_DELAY
          ),
        setSkillsCompletedLines,
        setSkillsPhase,
        { type: "complete" }
      ),
    [skillsLines, skillsDelayMap]
  );

  if (!isHydrated) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide-x">
      {skillsLines.slice(0, skillsCompletedLines).map((line, index) => (
        <CompletedSkillsLine key={index} line={line} />
      ))}

      {skillsPhase.type === "line" && (
        <ActiveSkillsLine
          key={`skills-active-${skillsPhase.index}`}
          line={skillsLines[skillsPhase.index]}
          onComplete={() => handleSkillsLineComplete(skillsPhase.index)}
        />
      )}

      {skillsPhase.type === "complete" && <TerminalPrompt />}
    </div>
  );
}
