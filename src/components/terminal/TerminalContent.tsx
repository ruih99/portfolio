import { ProfileTab, SkillsTab, CareersTab, ProjectsTab } from "./tabs";
import { TabId } from "./TerminalTabs";

interface TerminalContentProps {
  activeTab: TabId;
  onTabChange?: (tabId: TabId) => void;
}

/**
 * ターミナルコンテンツ表示コンポーネント
 * アクティブなタブに応じて適切なコンテンツを表示する
 * @param props - コンポーネントプロパティ
 * @param props.activeTab - 現在アクティブなタブID
 * @param props.onTabChange - タブ変更時のコールバック関数
 * @returns ターミナルコンテンツのJSX要素
 */
export function TerminalContent({ activeTab, onTabChange }: TerminalContentProps) {
  return (
    <div className="p-6 font-mono text-base">
      <div className={activeTab === "profile" ? "block" : "hidden"}>
        <ProfileTab onTabChange={onTabChange} isActive={activeTab === "profile"} />
      </div>
      <div className={activeTab === "skills" ? "block" : "hidden"}>
        <SkillsTab isActive={activeTab === "skills"} />
      </div>
      <div className={activeTab === "careers" ? "block" : "hidden"}>
        <CareersTab isActive={activeTab === "careers"} />
      </div>
      <div className={activeTab === "projects" ? "block" : "hidden"}>
        <ProjectsTab isActive={activeTab === "projects"} />
      </div>
    </div>
  );
}
