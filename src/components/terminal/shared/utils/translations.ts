/**
 * 翻訳ユーティリティ
 * 多言語対応のための共通翻訳オブジェクトと関数を提供する
 */

import { ja as jaTranslations, en as enTranslations } from "@/content/i18n";
import type {
  Locale,
  Translations,
  TranslationsMap,
} from "@/types/i18n";

// 型を再エクスポート（後方互換性のため）
export type { Locale, Translations };
export type TranslationData = Translations;

/**
 * 翻訳オブジェクト
 * 各言語の翻訳データをまとめたオブジェクト
 */
export const translations: TranslationsMap = {
  ja: jaTranslations,
  en: enTranslations,
};

/**
 * 指定されたロケールの翻訳オブジェクトを取得する
 * @param locale - 取得する言語（"ja" または "en"）
 * @returns 指定された言語の翻訳オブジェクト
 */
export function getTranslation(locale: Locale): Translations {
  return translations[locale];
}
