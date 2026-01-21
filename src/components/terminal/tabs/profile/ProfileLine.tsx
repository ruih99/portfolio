/**
 * プロフィールタブの行表示コンポーネント
 */

import { TabId } from "@/components/terminal/TerminalTabs";
import {
  translations,
  XIcon,
  GitHubIcon,
  LinkedInIcon,
  CompletedCommandLine,
  useInstantComplete,
} from "../../shared";
import { TerminalLine, SocialLink } from "./types";

const iconMap = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
} as const;

/**
 * ターミナル表示用の行データを生成する
 * @param locale - 表示言語（"ja" または "en"）
 * @returns ターミナル行データの配列
 */
export function getTerminalLines(locale: "ja" | "en"): TerminalLine[] {
  const t = translations[locale].profileTab;
  return [
    { type: "command", command: "cat", commandArg: "about-me.txt" },
    { type: "output", content: t.aboutMe },
    { type: "command", command: "cd .. &&", commandArg: "skills" },
    { type: "tab-link", content: t.skills, tabId: "skills" },
    { type: "command", command: "cd .. &&", commandArg: "careers" },
    { type: "tab-link", content: t.career, tabId: "careers" },
    { type: "command", command: "cd .. &&", commandArg: "projects" },
    { type: "tab-link", content: t.projects, tabId: "projects" },
    { type: "command", command: "cat", commandArg: "sns.lnk" },
  ];
}

/**
 * ソーシャルリンクを取得する
 * @param locale - 表示言語（"ja" または "en"）
 * @returns ソーシャルリンク配列
 */
export function getSocialLinks(locale: "ja" | "en"): SocialLink[] {
  return translations[locale].social.links as SocialLink[];
}

/**
 * 完了済みターミナル行の表示コンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.line - 表示する行データ
 * @param props.onTabChange - タブ変更時のコールバック関数
 * @returns 完了済み行のJSX要素
 */
export function CompletedLine({ line, onTabChange }: { line: TerminalLine; onTabChange?: (tabId: TabId) => void }) {
  if (line.type === "command" && line.command) {
    return (
      <CompletedCommandLine
        command={line.command}
        commandArg={line.commandArg}
        className="mt-4 first:mt-0"
      />
    );
  }

  if (line.type === "tab-link" && line.tabId) {
    const handleTabChange = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onTabChange) {
        onTabChange(line.tabId!);
      }
    };

    return (
      <button
        onClick={handleTabChange}
        className="block text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors mt-1 text-left"
      >
        {line.content}
      </button>
    );
  }

  return (
    <div className="text-gray-300 mt-1">
      {line.content?.split('\n').map((text, i) => (
        <div key={i}>{text}</div>
      ))}
    </div>
  );
}

/**
 * アクティブな出力行の表示コンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.line - 表示する行データ
 * @param props.onComplete - 表示完了時のコールバック関数
 * @param props.onTabChange - タブ変更時のコールバック関数
 * @returns アクティブな出力行のJSX要素
 */
export function ActiveOutputLine({
  line,
  onComplete,
  onTabChange,
}: {
  line: TerminalLine;
  onComplete: () => void;
  onTabChange?: (tabId: TabId) => void;
}) {
  useInstantComplete(onComplete);

  if (line.type === "tab-link" && line.tabId) {
    const handleTabChange = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onTabChange) {
        onTabChange(line.tabId!);
      }
    };

    return (
      <button
        onClick={handleTabChange}
        className="block text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors mt-1 text-left"
      >
        {line.content}
      </button>
    );
  }

  return (
    <div className="text-gray-300 mt-1">
      {line.content?.split('\n').map((text, i) => (
        <div key={i}>{text}</div>
      ))}
    </div>
  );
}

/**
 * アクティブなソーシャルリンク行の表示コンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.link - ソーシャルリンクデータ
 * @param props.onComplete - 表示完了時のコールバック関数
 * @returns アクティブなソーシャルリンク行のJSX要素
 */
export function ActiveSocialLine({
  link,
  onComplete,
}: {
  link: SocialLink;
  onComplete: () => void;
}) {
  useInstantComplete(onComplete);
  const Icon = iconMap[link.iconType];

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="grid grid-cols-[auto_1fr] gap-2 items-start text-white hover:text-white transition-colors"
    >
      <Icon className={`h-4 w-4 ${link.color}`} strokeWidth={1.5} />
      <span className="hover:underline underline-offset-4 break-all">{link.href}</span>
    </a>
  );
}

/**
 * 完了済みソーシャルリンク行の表示コンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.link - ソーシャルリンクデータ
 * @returns 完了済みソーシャルリンク行のJSX要素
 */
export function CompletedSocialLine({ link }: { link: SocialLink }) {
  const Icon = iconMap[link.iconType];
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="grid grid-cols-[auto_1fr] gap-2 items-start text-white hover:text-white transition-colors"
    >
      <Icon className={`h-4 w-4 mt-0.5 ${link.color}`} strokeWidth={1.5} />
      <span className="hover:underline underline-offset-4 break-all">{link.href}</span>
    </a>
  );
}
