"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";

interface FooterProps {
  lang: Locale;
}

export default function Footer({ lang }: FooterProps) {
  const t = useTranslations();

  return (
    <footer className="bg-tulipe-bordeaux text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Contact info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/images/logo.jpg"
                alt="Tulipes EtCetera"
                height={40}
                width={40}
                className="rounded-md object-cover"
              />
              <span className="font-heading text-base text-white">
                Tulipes EtCetera
              </span>
            </div>
            <p className="text-sm text-white/80 font-body leading-relaxed">
              Cottage de Charme 🌷
              <br />
              Alsace, France
            </p>
            <p className="text-sm text-white/80 font-body">
              📞 +33 (0)3 XX XX XX XX
            </p>
            <p className="text-sm text-white/80 font-body">
              ✉️ contact@tulipes-et-cetera.fr
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-tulipe-gold text-base mb-2">
              Navigation
            </h3>
            {(
              [
                ["home", "/"],
                ["house", "/maison"],
                ["rooms", "/chambres"],
                ["booking", "/reservation"],
                ["contact", "/contact"],
              ] as const
            ).map(([key, href]) => (
              <Link
                key={key}
                href={`/${lang}${href === "/" ? "" : href}`}
                className="text-sm text-white/80 hover:text-tulipe-sage font-body transition-colors"
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </div>

          {/* Column 3: Languages */}
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-tulipe-gold text-base mb-2">
              Langues
            </h3>
            {locales.map((locale) => (
              <Link
                key={locale}
                href={`/${locale}`}
                className={`text-sm font-body transition-colors ${
                  locale === lang
                    ? "text-white font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {localeNames[locale]}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-body">
          <p>© 2026 Tulipes EtCetera — {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}/mentions-legales`}
              className="hover:text-tulipe-sage transition-colors"
            >
              {t("footer.legal")}
            </Link>
            <Link
              href={`/${lang}/confidentialite`}
              className="hover:text-tulipe-sage transition-colors"
            >
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
