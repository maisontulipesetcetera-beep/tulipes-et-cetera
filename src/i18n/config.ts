export const locales = ["fr", "de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const localeNames: Record<Locale, string> = {
  fr: "Français",
  de: "Deutsch",
  en: "English",
};
