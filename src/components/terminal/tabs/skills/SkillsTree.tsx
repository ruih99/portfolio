/**
 * スキルツリー表示用のUIコンポーネント群
 */

/**
 * スキルデータの型定義
 */
interface Skill {
  name: string;
  level: string;
  yearsOfExperience: number;
  isStrength?: boolean;
  children?: Skill[];
}

/**
 * 経験年数を年月形式でフォーマット
 * @param years - 小数の年数 (例: 3.5, 0.5, 2.25)
 * @returns 年月形式の文字列 (例: "3y6m", "6m", "2y3m")
 */
function formatExperience(years: number): string {
  const totalMonths = Math.round(years * 12);
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;

  if (y === 0) {
    return `${m}m`;
  }
  if (m === 0) {
    return `${y}y`;
  }
  return `${y}y${m}m`;
}

/**
 * ツリー表示用の文字コンポーネント
 */
function TreeChar({ char }: { char: string }) {
  return <span className="inline-block w-4 text-center">{char}</span>;
}

/**
 * ツリーの分岐（├──）を表示するコンポーネント
 */
export function TreeBranch() {
  return (
    <span className="text-gray-600">
      <TreeChar char="├" />
      <TreeChar char="─" />
      <TreeChar char="─" />
      <TreeChar char=" " />
    </span>
  );
}

/**
 * ツリーの最終分岐（└──）を表示するコンポーネント
 */
export function TreeLast() {
  return (
    <span className="text-gray-600">
      <TreeChar char="└" />
      <TreeChar char="─" />
      <TreeChar char="─" />
      <TreeChar char=" " />
    </span>
  );
}

/**
 * ツリーの縦線（│）を表示するコンポーネント
 */
function TreeVertical() {
  return (
    <span className="text-gray-600">
      <TreeChar char="│" />
      <TreeChar char=" " />
      <TreeChar char=" " />
      <TreeChar char=" " />
    </span>
  );
}

/**
 * ツリーのスペースを表示するコンポーネント
 */
function TreeSpace() {
  return (
    <span className="text-gray-600">
      <TreeChar char=" " />
      <TreeChar char=" " />
      <TreeChar char=" " />
      <TreeChar char=" " />
    </span>
  );
}

/**
 * スキルレベルに応じたタグスタイルを取得
 */
function getTagStyle(level: string): { label: string; style: string } {
  const styles: Record<string, { label: string; style: string }> = {
    daily: { label: "Daily", style: "bg-green-500/20 text-green-400 border-green-500/50" },
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
    <div className="whitespace-pre font-mono flex items-center">
      {parentIsLast ? <TreeSpace /> : <TreeVertical />}
      {isLastInCategory ? <TreeLast /> : <TreeBranch />}
      <span className={skill.isStrength ? "text-amber-400" : "text-green-400"}>
        {skill.name}
      </span>
      <span className="text-gray-500 ml-2">({formatExperience(skill.yearsOfExperience)})</span>
      {label && (
        <span className={`ml-2 px-1.5 py-0 text-[10px] rounded border ${style}`}>
          {label}
        </span>
      )}
      {skill.isStrength && <span className="text-amber-400 ml-2">★</span>}
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
    <div className="whitespace-pre font-mono flex items-center">
      {parentIsLast ? <TreeSpace /> : <TreeVertical />}
      {parentSkillIsLast ? <TreeSpace /> : <TreeVertical />}
      {isLastChild ? <TreeLast /> : <TreeBranch />}
      <span className={skill.isStrength ? "text-amber-400" : "text-green-400"}>
        {skill.name}
      </span>
      <span className="text-gray-500 ml-2">({formatExperience(skill.yearsOfExperience)})</span>
      {label && (
        <span className={`ml-2 px-1.5 py-0 text-[10px] rounded border ${style}`}>
          {label}
        </span>
      )}
      {skill.isStrength && <span className="text-amber-400 ml-2">★</span>}
    </div>
  );
}
