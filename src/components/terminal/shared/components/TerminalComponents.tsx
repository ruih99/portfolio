"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { TIMING, useTypewriter } from "../hooks/animation-hooks";

/**
 * アクティブなコマンドライン表示コンポーネント（タイピングアニメーション付き）
 * @param props - コンポーネントプロパティ
 * @param props.command - 表示するコマンド文字列（緑色で表示）
 * @param props.commandArg - コマンド引数文字列（シアン色で表示、オプション）
 * @param props.onComplete - アニメーション完了時のコールバック関数
 * @returns コマンドラインのJSX要素
 */
export function ActiveCommandLine({
  command,
  commandArg,
  onComplete,
}: {
  command: string;
  commandArg?: string;
  onComplete: () => void;
}) {
  // 全体のテキスト（command + commandArg）でタイプライターを実行
  const fullText = commandArg ? `${command} ${commandArg}` : command;
  const { displayedText, isComplete } = useTypewriter(
    fullText,
    TIMING.COMMAND_CHAR_SPEED,
    TIMING.COMMAND_CHAR_JITTER,
    onComplete,
    TIMING.PROMPT_DELAY
  );

  // command部分とcommandArg部分に分けて表示
  const cmdLen = command.length;
  const displayedCmd = displayedText.slice(0, cmdLen);
  const displayedArg = displayedText.length > cmdLen + 1 ? displayedText.slice(cmdLen + 1) : "";

  return (
    <div className="font-mono">
      <span className="text-gray-400">$</span>
      <span className="text-green-400 ml-2">{displayedCmd}</span>
      {displayedArg && <span className="text-cyan-400 ml-2">{displayedArg}</span>}
      {!isComplete && <span className="animate-blink">▋</span>}
    </div>
  );
}

/**
 * 即時表示のアクティブライン表示コンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.children - 表示する子要素
 * @param props.onComplete - 表示完了時のコールバック関数
 * @returns アクティブラインのJSX要素
 */
export function ActiveInstantLine({
  children,
  onComplete,
}: {
  children: ReactNode;
  onComplete: () => void;
}) {
  const hasCompleted = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hasCompleted.current) return;
      hasCompleted.current = true;
      onComplete();
    }, 50);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return <>{children}</>;
}

/**
 * 完了済みコマンドライン表示コンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.command - 表示するコマンド文字列（緑色で表示）
 * @param props.commandArg - コマンド引数文字列（シアン色で表示、オプション）
 * @param props.className - 追加のCSSクラス名（オプション）
 * @returns 完了済みコマンドラインのJSX要素
 */
export function CompletedCommandLine({
  command,
  commandArg,
  className,
}: {
  command: string;
  commandArg?: string;
  className?: string;
}) {
  return (
    <div className={`font-mono ${className ?? ""}`}>
      <span className="text-gray-400">$</span>
      <span className="text-green-400 ml-2">{command}</span>
      {commandArg && <span className="text-cyan-400 ml-2">{commandArg}</span>}
    </div>
  );
}

/**
 * ターミナルプロンプト表示コンポーネント（待機状態のカーソル付き）
 * @param props - コンポーネントプロパティ
 * @param props.className - 追加のCSSクラス（オプション、デフォルト: "mt-4"）
 * @returns プロンプトのJSX要素
 */
export function TerminalPrompt({ className }: { className?: string }) {
  return (
    <div className={`font-mono ${className ?? "mt-4"}`}>
      <span className="text-gray-400">$</span>
      <span className="animate-blink ml-2">▋</span>
    </div>
  );
}
