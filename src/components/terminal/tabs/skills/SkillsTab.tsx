"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import {
  SKILLS_TIMING,
  useAnimationTrigger,
  TerminalPrompt,
  createLineCompletionHandler,
  getLineDelay,
  DelayMap,
  StandardPhase,
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
  const [phase, setPhase] = useState<StandardPhase>({ type: "idle" });
  const [completedLines, setCompletedLines] = useState<number>(0);

  const lines = useMemo(() => generateSkillsLines(locale), [locale]);

  // 行タイプごとの遅延マップ
  const lineDelayMap: DelayMap = useMemo(
    () => ({
      command: SKILLS_TIMING.POST_COMMAND_DELAY,
      category: SKILLS_TIMING.CATEGORY_HEADER_DELAY,
      "skill-item": SKILLS_TIMING.SKILL_ITEM_DELAY,
      "child-skill-item": SKILLS_TIMING.SKILL_ITEM_DELAY,
    }),
    []
  );

  useAnimationTrigger(
    isActive && isHydrated,
    () => setPhase({ type: "line", index: 0 }),
    300
  );

  const handleLineComplete = useMemo(
    () =>
      createLineCompletionHandler<StandardPhase>(
        lines.length,
        (index) => getLineDelay(lines[index].type, lineDelayMap),
        setCompletedLines,
        setPhase,
        { type: "complete" }
      ),
    [lines, lineDelayMap]
  );

  // 完了済み行のリストをキャッシュ
  const completedLinesElements = useMemo(
    () =>
      lines.slice(0, completedLines).map((line, index) => (
        <CompletedSkillsLine key={`completed-${line.type}-${index}`} line={line} />
      )),
    [lines, completedLines]
  );

  if (!isHydrated) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide-x">
      {/* 完了済み行 */}
      {completedLinesElements}

      {/* アクティブな行 */}
      {phase.type === "line" && phase.index < lines.length && (
        <ActiveSkillsLine
          key={`active-${phase.index}`}
          line={lines[phase.index]}
          onComplete={() => handleLineComplete(phase.index)}
        />
      )}

      {/* 完了後のプロンプト */}
      {phase.type === "complete" && <TerminalPrompt />}
    </div>
  );
}
