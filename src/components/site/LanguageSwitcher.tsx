"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n/config";

const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  de: "🇩🇪",
  en: "🇬🇧",
};

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: Locale) {
    // Replace the current locale prefix in the path
    const segments = pathname.split("/");
    // segments[0] is empty string, segments[1] is the locale
    segments[1] = newLocale;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${
            locale === currentLocale
              ? "bg-tulipe-green text-white font-semibold"
              : "text-gray-600 hover:text-tulipe-royal hover:bg-tulipe-beige"
          }`}
          aria-label={`Switch to ${localeNames[locale]}`}
          aria-current={locale === currentLocale ? "true" : undefined}
        >
          <span aria-hidden="true">{localeFlags[locale]}</span>
          <span className="uppercase font-medium">{locale}</span>
        </button>
      ))}
    </div>
  );
}
