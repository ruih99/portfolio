"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { translations } from "./shared";
import type { TabId } from "@/types/i18n";

export type { TabId };

const tabs: { id: TabId }[] = [
  { id: "profile" },
  { id: "skills" },
  { id: "careers" },
  { id: "projects" },
];

interface TerminalTabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

/**
 * ターミナルタブバーコンポーネント
 * タブ切り替え機能を提供する（shadcn風デザイン）
 * @param props - コンポーネントプロパティ
 * @param props.activeTab - 現在アクティブなタブID
 * @param props.onTabChange - タブ変更時のコールバック関数
 * @returns タブバーのJSX要素
 */
export function TerminalTabs({ activeTab, onTabChange }: TerminalTabsProps) {
  const { locale } = useLanguage();
  const t = translations[locale];

  return (
    <div className="flex items-center px-1 md:px-2 pb-0 border-t border-gray-700">
      <div className="flex flex-1 gap-0.5 md:gap-1 min-w-0 overflow-x-auto scrollbar-hide-x">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-2 md:px-3 py-1.5 text-sm md:text-base font-mono rounded-none transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-green-300"
            }`}
          >
            {t.tabs[tab.id]}
          </button>
        ))}
      </div>
    </div>
  );
}
