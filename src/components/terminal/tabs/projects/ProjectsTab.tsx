"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { TIMING, ActiveCommandLine, GitHubIcon, CompletedCommandLine, TerminalPrompt, useAnimationTrigger, translations } from "../../shared";
import { ProjectsPhase, Project } from "./types";

/**
 * 外部リンクアイコンコンポーネント
 */
function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

/**
 * プロジェクトカードコンポーネント
 */
function ProjectCard({
  project,
}: {
  project: Project;
}) {
  return (
    <div className="border border-gray-700 rounded-lg p-2 md:p-4 bg-gray-900/50 space-y-2 md:space-y-3">
      {/* プロジェクトヘッダー */}
      <div className="flex items-center justify-between flex-wrap gap-1.5 md:gap-2">
        <h3 className="text-cyan-400 font-semibold">{project.name}</h3>
        <div className="flex gap-1.5 md:gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xs md:text-sm flex items-center gap-1"
            >
              <GitHubIcon className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-xs md:text-sm flex items-center gap-1"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Live
            </a>
          )}
        </div>
      </div>

      {/* 説明 */}
      <p className="text-gray-400 text-xs md:text-sm break-words">{project.description}</p>

      {/* 技術スタック */}
      <div className="flex flex-wrap gap-1 md:gap-1.5">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded border bg-green-500/10 text-green-400 border-green-500/30"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

interface ProjectsTabProps {
  isActive?: boolean;
}

/**
 * プロジェクトタブコンポーネント
 * ターミナル風アニメーションでプロジェクト一覧を表示する
 * @param props - コンポーネントプロパティ
 * @param props.isActive - タブがアクティブかどうか
 * @returns プロジェクトタブのJSX要素
 */
export function ProjectsTab({ isActive = false }: ProjectsTabProps) {
  const { locale, isHydrated } = useLanguage();
  const [phase, setPhase] = useState<ProjectsPhase>({ type: "idle" });
  const [completedProjects, setCompletedProjects] = useState<number>(0);

  // 翻訳データからプロジェクト情報を取得
  const projectsData = useMemo(() => translations[locale].projects, [locale]);
  const projects = projectsData.items as Project[];
  const comingSoon = projectsData.comingSoon;

  // アニメーション開始
  useAnimationTrigger(
    isActive && isHydrated,
    () => setPhase({ type: "command" }),
    300
  );

  // コマンド完了時のハンドラー
  const handleCommandComplete = useCallback(() => {
    setTimeout(() => {
      setPhase({ type: "project", index: 0 });
    }, TIMING.POST_COMMAND_DELAY);
  }, []);

  // プロジェクト表示完了時のハンドラー
  const handleProjectComplete = useCallback((index: number) => {
    const nextIndex = index + 1;
    setCompletedProjects(nextIndex);

    if (nextIndex < projects.length) {
      setTimeout(() => {
        setPhase({ type: "project", index: nextIndex });
      }, TIMING.POST_OUTPUT_DELAY);
    } else {
      setTimeout(() => {
        setPhase({ type: "complete" });
      }, TIMING.POST_OUTPUT_DELAY);
    }
  }, [projects.length]);

  // アクティブなプロジェクトの表示
  useEffect(() => {
    if (phase.type === "project") {
      const timeout = setTimeout(() => {
        handleProjectComplete(phase.index);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [phase, handleProjectComplete]);

  if (!isHydrated) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide-x">
      {/* コマンドライン */}
      {phase.type === "command" && (
        <ActiveCommandLine
          command="ls -la "
          commandArg="projects/"
          onComplete={handleCommandComplete}
        />
      )}

      {/* 完了したコマンドライン */}
      {(phase.type === "project" || phase.type === "complete") && (
        <CompletedCommandLine command="ls -la " commandArg="projects/" />
      )}

      {/* プロジェクト一覧 */}
      {completedProjects > 0 && (
        <div className="space-y-4 md:space-y-6 mt-3 md:mt-4">
          {projects.slice(0, completedProjects).map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      )}

      {/* Coming soonメッセージ */}
      {phase.type === "complete" && (
        <div className="text-gray-500 text-sm md:text-base mt-3 md:mt-4">
          {comingSoon}
        </div>
      )}

      {/* 最終プロンプト */}
      {phase.type === "complete" && <TerminalPrompt />}
    </div>
  );
}
