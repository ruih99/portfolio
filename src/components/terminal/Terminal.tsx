"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TerminalTabs, TabId } from "./TerminalTabs";
import { TerminalContent } from "./TerminalContent";
import { useLanguage } from "@/components/providers/language-provider";
import { translations } from "./shared";

/**
 * 言語切替トグルボタンコンポーネント
 * 現在の言語の反対を表示する
 */
function LanguageToggle() {
  const { locale, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="text-xl font-mono px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
    >
      {locale === "ja" ? "🇺🇸" : "🇯🇵"}
    </button>
  );
}

/**
 * プロフィールセクションのメインコンポーネント
 * ターミナル風UIでポートフォリオ情報を表示する
 * @returns プロフィールセクションのJSX要素
 */
export function Profile() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const t = translations[locale];

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-12" aria-labelledby="profile-heading" suppressHydrationWarning>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            id="profile-heading"
            className="text-3xl md:text-4xl font-bold text-green-400 font-mono mb-4"
          >
            {t.portfolio.sectionTitles[activeTab]}
          </h2>
        </motion.div>
        <div className="rounded-2xl border border-gray-700 bg-gray-950 shadow-2xl overflow-hidden h-[calc(100vh-200px)] flex flex-col">
          <div className="bg-gray-800 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-gray-400 font-mono">
                  ruih99@portfolio - ~/{activeTab}
                </span>
              </div>
              <LanguageToggle />
            </div>
            <TerminalTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="flex-1 overflow-y-auto terminal-scroll">
            <TerminalContent activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>
    </section>
  );
}
