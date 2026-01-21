/**
 * キャリアタブの行表示コンポーネント
 */

import {
  ActiveInstantLine,
  ActiveCommandLine,
  translations,
  CompletedCommandLine,
} from "../../shared";
import {
  CareersLine,
} from "./types";

/**
 * キャリア期間を表示用にフォーマットする
 * @param period - 期間データ（start, end）
 * @param locale - 表示言語（"ja" または "en"）
 * @returns フォーマットされた期間文字列
 */
function formatCareerPeriod(period: { start: string; end: string }, locale: "ja" | "en"): string {
  const presentText = translations[locale].careers.present;
  const formatDate = (dateStr: string) => {
    if (dateStr === "present") return presentText;
    const [year, month] = dateStr.split("-");
    return `${year}/${month}`;
  };
  return `${formatDate(period.start)} - ${formatDate(period.end)}`;
}

/**
 * 完了済みキャリア行の表示コンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.line - キャリア行データ
 * @param props.isExpanded - 詳細が展開されているかどうか
 * @param props.onToggle - 展開切り替えのコールバック関数
 * @param props.locale - 表示言語
 * @returns 完了済みキャリア行のJSX要素
 */
export function CompletedCareersLine({
  line,
  isExpanded,
  onToggle,
  locale,
}: {
  line: CareersLine;
  isExpanded?: boolean;
  onToggle?: () => void;
  locale: "ja" | "en";
}) {
  const t = translations[locale].careers;

  if (line.type === "command") {
    return <CompletedCommandLine command={t.command} className="mb-4" />;
  }

  if (line.type === "career-entry" && line.localizedCareer) {
    const localizedCareer = line.localizedCareer;
    const isPresent = localizedCareer.period.end === "present";
    const index = line.index ?? 0;

    const company = localizedCareer.company;
    const position = localizedCareer.position;
    const description = localizedCareer.description;
    const responsibilities = localizedCareer.responsibilities;
    const achievements = localizedCareer.achievements;
    const technologies = localizedCareer.technologies;

    return (
      <div className="font-mono relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col items-center">
          <div className={`w-0.5 flex-1 ${index === 0 ? "mt-3" : ""} ${isPresent ? "bg-green-400" : "bg-gray-600"}`} />
        </div>

        <div className="absolute left-0 top-3 w-6 flex justify-center">
          <div className={`w-3 h-3 rounded-full border-2 ${
            isPresent
              ? "bg-green-400 border-green-400 animate-pulse"
              : "bg-black border-gray-500"
          }`} />
        </div>

        <div className="ml-10">
          <div
            className="cursor-pointer hover:bg-gray-800/50 px-3 py-2 rounded transition-colors"
            onClick={onToggle}
          >
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-yellow-400">*</span>
              <span className="text-gray-500">{formatCareerPeriod(localizedCareer.period, locale)}</span>
              {isPresent && (
                <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded border border-green-500/50">
                  CURRENT
                </span>
              )}
              <span className="text-gray-500 ml-auto">[{isExpanded ? "-" : "+"}]</span>
            </div>

            <div className="mt-2">
              <span className="text-green-300 font-semibold">{company}</span>
              <span className="text-gray-500 mx-2">|</span>
              <span className="text-cyan-400">{position}</span>
            </div>

            <div className="text-gray-400 text-sm mt-1">
              {description}
            </div>
          </div>

          {isExpanded && (
            <div className="ml-6 mt-4 mb-2 border-l-2 border-gray-700 pl-4">
              <div className="mb-4">
                <span className="text-gray-400">$</span>
                <span className="text-green-400 ml-2">cat</span>
                <span className="text-cyan-400 ml-2">{line.careerId}/README.md</span>
              </div>

              {(!responsibilities || responsibilities.length === 0) &&
               (!achievements || achievements.length === 0) &&
               (!technologies || technologies.length === 0) ? (
                <div className="text-gray-500">
                  {`// ${t.sectionLabels.comingSoon}`}
                </div>
              ) : (
                <>
                  {responsibilities && responsibilities.length > 0 && (
                    <div className="space-y-1 mb-4">
                      <div className="text-gray-500">## {t.sectionLabels.responsibilities}</div>
                      {responsibilities.map((item, idx) => (
                        <div key={idx} className="text-green-400 text-sm">
                          <span className="text-gray-500">-</span> {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {achievements && achievements.length > 0 && (
                    <div className="space-y-1 mb-4">
                      <div className="text-gray-500">## {t.sectionLabels.achievements}</div>
                      {achievements.map((item, idx) => (
                        <div key={idx} className="text-green-400 text-sm">
                          <span className="text-amber-400">+</span> {item}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 bg-black/50 rounded p-4 border border-gray-700">
                    <div className="mb-2">
                      <span className="text-gray-400">$</span>
                      <span className="text-green-400 ml-2">echo</span>
                      <span className="text-cyan-400 ml-2">$TECH_STACK</span>
                      <span className="text-gray-300 ml-2">| tr &apos;,&apos; &apos;\n&apos;</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-2 text-xs bg-gray-800/50 text-green-300 rounded border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

/**
 * アクティブなキャリア行の表示コンポーネント
 * @param props - コンポーネントプロパティ
 * @param props.line - キャリア行データ
 * @param props.onComplete - 完了時のコールバック関数
 * @param props.locale - 表示言語
 * @returns アクティブなキャリア行のJSX要素
 */
export function ActiveCareersLine({
  line,
  onComplete,
  locale,
}: {
  line: CareersLine;
  onComplete: () => void;
  locale: "ja" | "en";
}) {
  if (line.type === "command") {
    return (
      <div className="mb-4">
        <ActiveCommandLine command={translations[locale].careers.command} onComplete={onComplete} />
      </div>
    );
  }

  return (
    <ActiveInstantLine onComplete={onComplete}>
      <CompletedCareersLine line={line} locale={locale} />
    </ActiveInstantLine>
  );
}
