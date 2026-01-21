"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import {
  TIMING,
  SKILLS_TIMING,
  useAnimationTrigger,
  translations,
  TerminalPrompt,
  createLineCompletionHandler,
  getLineDelay,
  DelayMap,
} from "../../shared";
import {
  CareersLine,
  CareersPhase,
  LocalizedCareer,
} from "./types";
import {
  CompletedCareersLine,
  ActiveCareersLine,
} from "./CareersLine";

/**
 * キャリア表示用の行データを生成する
 * @param locale - 表示言語（"ja" または "en"）
 * @returns キャリア行データの配列
 */
function generateCareersLines(locale: "ja" | "en"): CareersLine[] {
  const lines: CareersLine[] = [];
  const careersData = translations[locale].careers;
  const careerItems = careersData.items as Record<string, LocalizedCareer>;
  const careerIds = Object.keys(careerItems);

  // 稼働中（present）を上に、その中で開始日が新しい順にソート
  careerIds.sort((a, b) => {
    const careerA = careerItems[a];
    const careerB = careerItems[b];
    const aIsPresent = careerA.period.end === "present";
    const bIsPresent = careerB.period.end === "present";

    // 稼働中を優先
    if (aIsPresent && !bIsPresent) return -1;
    if (!aIsPresent && bIsPresent) return 1;

    // 同じ状態なら開始日が新しい順
    return careerB.period.start.localeCompare(careerA.period.start);
  });

  lines.push({ type: "command", command: careersData.command });

  careerIds.forEach((id, index) => {
    const localizedCareer = careerItems[id];
    lines.push({ type: "career-entry", careerId: id, localizedCareer, index });
  });

  return lines;
}

interface CareersTabProps {
  isActive?: boolean;
}

/**
 * キャリアタブコンポーネント
 * git log形式でキャリア履歴を表示する
 * @param props - コンポーネントプロパティ
 * @param props.isActive - タブがアクティブかどうか
 * @returns キャリアタブのJSX要素
 */
export function CareersTab({ isActive = false }: CareersTabProps) {
  const { locale, isHydrated } = useLanguage();
  const [careersPhase, setCareersPhase] = useState<CareersPhase>({ type: "idle" });
  const [careersCompletedLines, setCareersCompletedLines] = useState<number>(0);
  const [expandedCareerIds, setExpandedCareerIds] = useState<string[]>([]);

  const careersLines = useMemo(() => generateCareersLines(locale), [locale]);

  useAnimationTrigger(
    (isActive ?? false) && isHydrated,
    () => setCareersPhase({ type: "line", index: 0 }),
    300
  );

  // 行タイプごとの遅延時間マップ
  const delayMap: DelayMap = useMemo(() => ({
    "command": TIMING.POST_COMMAND_DELAY,
    "career-entry": SKILLS_TIMING.SKILL_ITEM_DELAY,
  }), []);

  const handleCareersLineComplete = useMemo(
    () =>
      createLineCompletionHandler<CareersPhase>(
        careersLines.length,
        (index) => getLineDelay(careersLines[index].type, delayMap),
        setCareersCompletedLines,
        setCareersPhase,
        { type: "complete" }
      ),
    [careersLines, delayMap]
  );

  if (!isHydrated) return null;

  return (
    <>
      {careersLines.slice(0, careersCompletedLines).map((line, index) => (
        <CompletedCareersLine
          key={index}
          line={line}
          locale={locale}
          isExpanded={line.type === "career-entry" && expandedCareerIds.includes(line.careerId ?? "")}
          onToggle={line.type === "career-entry" ? () => {
            const careerId = line.careerId;
            if (careerId) {
              setExpandedCareerIds(prev =>
                prev.includes(careerId)
                  ? prev.filter(id => id !== careerId)   // 閉じる
                  : [...prev, careerId]                  // 開く
              );
            }
          } : undefined}
        />
      ))}

      {careersPhase.type === "line" && (
        <ActiveCareersLine
          key={`careers-active-${careersPhase.index}`}
          line={careersLines[careersPhase.index]}
          locale={locale}
          onComplete={() => handleCareersLineComplete(careersPhase.index)}
        />
      )}

      {careersPhase.type === "complete" && <TerminalPrompt />}
    </>
  );
}
