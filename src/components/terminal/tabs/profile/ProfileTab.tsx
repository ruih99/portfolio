"use client";

import { useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { TabId } from "@/components/terminal/TerminalTabs";
import {
  TIMING,
  ActiveCommandLine,
  useAnimationTrigger,
  TerminalPrompt,
  createLineCompletionHandler,
  getLineDelay,
  DelayMap,
} from "../../shared";
import { ProfilePhase } from "./types";
import {
  CompletedLine,
  ActiveOutputLine,
  ActiveSocialLine,
  CompletedSocialLine,
  getTerminalLines,
  getSocialLinks,
} from "./ProfileLine";

interface ProfileTabProps {
  onTabChange?: (tabId: TabId) => void;
  isActive?: boolean;
}

/**
 * プロフィールタブコンポーネント
 * ターミナル風アニメーションでプロフィール情報を表示する
 * @param props - コンポーネントプロパティ
 * @param props.onTabChange - タブ変更時のコールバック関数
 * @param props.isActive - タブがアクティブかどうか
 * @returns プロフィールタブのJSX要素
 */
export function ProfileTab({ onTabChange, isActive = false }: ProfileTabProps) {
  const { locale, isHydrated } = useLanguage();
  const [phase, setPhase] = useState<ProfilePhase>({ type: "idle" });
  const [completedLines, setCompletedLines] = useState<number>(0);
  const [completedSocials, setCompletedSocials] = useState<number>(0);

  const terminalLines = useMemo(() => getTerminalLines(locale), [locale]);
  const socialLinks = useMemo(() => getSocialLinks(locale), [locale]);

  // 行タイプごとの遅延マップ
  const lineDelayMap: DelayMap = useMemo(() => ({
    command: TIMING.POST_COMMAND_DELAY,
    output: TIMING.POST_OUTPUT_DELAY,
    "tab-link": TIMING.POST_OUTPUT_DELAY,
  }), []);

  useAnimationTrigger(
    isActive && isHydrated,
    () => setPhase({ type: "line", index: 0 }),
    300
  );

  const handleLineComplete = useMemo(
    () =>
      createLineCompletionHandler<ProfilePhase>(
        terminalLines.length,
        (index) => getLineDelay(terminalLines[index].type, lineDelayMap),
        setCompletedLines,
        setPhase,
        { type: "social", index: 0 }
      ),
    [terminalLines, lineDelayMap]
  );

  const handleSocialComplete = useCallback((index: number) => {
    const nextIndex = index + 1;

    if (nextIndex < socialLinks.length) {
      setTimeout(() => {
        setCompletedSocials(nextIndex);
        setPhase({ type: "social", index: nextIndex });
      }, TIMING.SOCIAL_LINK_DELAY);
    } else {
      setTimeout(() => {
        setCompletedSocials(nextIndex);
        setPhase({ type: "complete" });
      }, TIMING.SOCIAL_LINK_DELAY);
    }
  }, [socialLinks.length]);

  if (!isHydrated) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide-x">
      {terminalLines.slice(0, completedLines).map((line, index) => (
        <CompletedLine key={`completed-${index}`} line={line} onTabChange={onTabChange} />
      ))}

      {phase.type === "line" && phase.index < terminalLines.length && (
        terminalLines[phase.index].type === "command" ? (
          <div className={phase.index > 0 ? "mt-4" : ""}>
            <ActiveCommandLine
              key={`active-${phase.index}`}
              command={terminalLines[phase.index].command || ""}
              commandArg={terminalLines[phase.index].commandArg}
              onComplete={() => handleLineComplete(phase.index)}
            />
          </div>
        ) : (
          <ActiveOutputLine
            key={`active-${phase.index}`}
            line={terminalLines[phase.index]}
            onComplete={() => handleLineComplete(phase.index)}
            onTabChange={onTabChange}
          />
        )
      )}

      {(phase.type === "social" || phase.type === "complete" || completedSocials > 0) && (
        <div className="space-y-2 mt-2">
          {socialLinks.slice(0, completedSocials).map((link, index) => (
            <CompletedSocialLine key={`social-completed-${index}`} link={link} />
          ))}

          {phase.type === "social" && phase.index < socialLinks.length && (
            <ActiveSocialLine
              key={`social-active-${phase.index}`}
              link={socialLinks[phase.index]}
              onComplete={() => handleSocialComplete(phase.index)}
            />
          )}
        </div>
      )}

      {phase.type === "complete" && <TerminalPrompt />}
    </div>
  );
}
