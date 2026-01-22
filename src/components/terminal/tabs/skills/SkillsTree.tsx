/**
 * スキルツリー表示用のUIコンポーネント群
 */

/**
 * スキルデータの型定義
 */
interface Skill {
  name: string;
  level: string;
  isStrength?: boolean;
  children?: Skill[];
}

/**
 * ツリーの分岐（├──）を表示するコンポーネント
 * CSS borderでL字+横線を描画
 */
export function TreeBranch() {
  return (
    <span className="relative inline-flex w-12 md:w-16 h-6 shrink-0">
      {/* 縦線（上から中央まで） */}
      <span className="absolute left-0 top-0 h-full border-l border-gray-600" />
      {/* 横線（左から右へ） */}
      <span className="absolute left-0 top-1/2 w-full border-t border-gray-600" />
    </span>
  );
}

/**
 * ツリーの最終分岐（└──）を表示するコンポーネント
 * CSS borderでL字（角丸）+横線を描画
 */
export function TreeLast() {
  return (
    <span className="relative inline-flex w-12 md:w-16 h-6 shrink-0">
      {/* 縦線（上から中央まで） */}
      <span className="absolute left-0 top-0 h-1/2 border-l border-gray-600" />
      {/* 横線（左から右へ） */}
      <span className="absolute left-0 top-1/2 w-full border-t border-gray-600" />
    </span>
  );
}

/**
 * ツリーの縦線（│）を表示するコンポーネント
 * CSS borderで縦線を描画
 */
function TreeVertical() {
  return (
    <span className="relative inline-flex w-12 md:w-16 h-6 shrink-0">
      {/* 縦線（上から下まで） */}
      <span className="absolute left-0 top-0 h-full border-l border-gray-600" />
    </span>
  );
}

/**
 * ツリーのスペースを表示するコンポーネント
 * 同じ幅のスペースを維持
 */
function TreeSpace() {
  return <span className="inline-flex w-12 md:w-16 h-6 shrink-0" />;
}

/**
 * スキルレベルに応じたタグスタイルを取得
 */
function getTagStyle(level: string): { label: string; style: string } {
  const styles: Record<string, { label: string; style: string }> = {
    daily: { label: "Daily", style: "bg-red-500/20 text-red-400 border-red-500/50" },
    regular: { label: "Regular", style: "bg-blue-500/20 text-blue-400 border-blue-500/50" },
    learning: { label: "Learning", style: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" },
    unused: { label: "", style: "text-gray-500" },
  };
  return styles[level] || styles.learning;
}

/**
 * ツリー形式のスキルアイテム表示コンポーネント
 */
export function TreeSkillItem({
  skill,
  isLastInCategory,
  parentIsLast,
}: {
  skill: Skill;
  isLastInCategory: boolean;
  parentIsLast: boolean;
}) {
  const { label, style } = getTagStyle(skill.level);

  return (
    <div className="whitespace-pre font-mono flex items-center text-sm md:text-base">
      {parentIsLast ? <TreeSpace /> : <TreeVertical />}
      {isLastInCategory ? <TreeLast /> : <TreeBranch />}
      <span className={!label ? "text-gray-500" : "text-green-400"}>
        {skill.name}
      </span>
      {label && (
        <span
          className={`ml-1.5 md:ml-2 px-1 md:px-1.5 py-0 text-[9px] md:text-[10px] rounded border ${style}`}
        >
          {label}
        </span>
      )}
      {skill.isStrength && (
        <span className="text-amber-400 ml-1.5 md:ml-2">★</span>
      )}
    </div>
  );
}

/**
 * 子スキルアイテム表示コンポーネント
 */
export function TreeChildSkillItem({
  skill,
  isLastChild,
  parentIsLast,
  parentSkillIsLast,
}: {
  skill: Skill;
  isLastChild: boolean;
  parentIsLast: boolean;
  parentSkillIsLast: boolean;
}) {
  const { label, style } = getTagStyle(skill.level);

  return (
    <div className="whitespace-pre font-mono flex items-center text-sm md:text-base">
      {parentIsLast ? <TreeSpace /> : <TreeVertical />}
      {parentSkillIsLast ? <TreeSpace /> : <TreeVertical />}
      {isLastChild ? <TreeLast /> : <TreeBranch />}
      <span className={!label ? "text-gray-500" : "text-green-400"}>
        {skill.name}
      </span>
      {label && (
        <span
          className={`ml-1.5 md:ml-2 px-1 md:px-1.5 py-0 text-[9px] md:text-[10px] rounded border ${style}`}
        >
          {label}
        </span>
      )}
      {skill.isStrength && (
        <span className="text-amber-400 ml-1.5 md:ml-2">★</span>
      )}
    </div>
  );
}

/**
 * 孫スキルアイテム表示コンポーネント
 */
export function TreeGrandchildSkillItem({
  skill,
  isLastGrandchild,
  grandparentIsLast,
  parentSkillIsLast,
  parentChildIsLast,
}: {
  skill: Skill;
  isLastGrandchild: boolean;
  grandparentIsLast: boolean;
  parentSkillIsLast: boolean;
  parentChildIsLast: boolean;
}) {
  const { label, style } = getTagStyle(skill.level);

  return (
    <div className="whitespace-pre font-mono flex items-center text-sm md:text-base">
      {grandparentIsLast ? <TreeSpace /> : <TreeVertical />}
      {parentSkillIsLast ? <TreeSpace /> : <TreeVertical />}
      {parentChildIsLast ? <TreeSpace /> : <TreeVertical />}
      {isLastGrandchild ? <TreeLast /> : <TreeBranch />}
      <span className={!label ? "text-gray-500" : "text-green-400"}>
        {skill.name}
      </span>
      {label && (
        <span
          className={`ml-1.5 md:ml-2 px-1 md:px-1.5 py-0 text-[9px] md:text-[10px] rounded border ${style}`}
        >
          {label}
        </span>
      )}
      {skill.isStrength && (
        <span className="text-amber-400 ml-1.5 md:ml-2">★</span>
      )}
    </div>
  );
}
