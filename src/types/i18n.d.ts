/**
 * i18n 型定義
 * ja.json の構造に基づいて型安全な翻訳アクセスを提供
 */

import type { ja as jaTranslations } from "@/content/i18n";

/** サポートされるロケールの型 */
export type Locale = "ja" | "en";

/** 翻訳データの型（ja.json の構造から自動生成） */
export type Translations = typeof jaTranslations;

/** 翻訳オブジェクト全体の型 */
export type TranslationsMap = Record<Locale, Translations>;

/** タブID型（翻訳ファイルの tabs キーから導出） */
export type TabId = keyof Translations["tabs"];

/** キャリアアイテムID型 */
export type CareerItemId = keyof Translations["careers"]["items"];
