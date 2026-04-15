"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales, type Locale } from "@/i18n/config";

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
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`min-h-[40px] px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
            locale === currentLocale
              ? "bg-tulipe-green text-white"
              : "bg-white/80 text-tulipe-green border border-gray-200 hover:bg-tulipe-beige"
          }`}
          aria-label={`Switch to ${localeNames[locale]}`}
          aria-current={locale === currentLocale ? "true" : undefined}
        >
          <span className="uppercase">{locale}</span>
        </button>
      ))}
    </div>
  );
}
