import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Prestations — Tulipes Et Cetera",
    description:
      "Petit-déjeuner bio, vélos gratuits, poney, paniers pique-nique, brasero, jardin privatif.",
  },
  de: {
    title: "Leistungen — Tulipes Et Cetera",
    description:
      "Bio-Frühstück, kostenlose Fahrräder, Pony, Picknickkorb, Feuerstelle, privater Garten.",
  },
  en: {
    title: "Services — Tulipes Et Cetera",
    description:
      "Organic breakfast, free bikes, pony, picnic baskets, fire pit, private garden.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = locales.includes(lang as Locale) ? (lang as Locale) : "fr";
  const { title, description } = metaByLocale[locale];

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/services`,
      languages: {
        fr: `${BASE_URL}/fr/services`,
        de: `${BASE_URL}/de/services`,
        en: `${BASE_URL}/en/services`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/services`,
      images: [{ url: `${BASE_URL}/images/logo.jpg` }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/images/logo.jpg`],
    },
  };
}

const prestationsData = [
  {
    emoji: "🥐",
    titleKey: "breakfast_title" as const,
    descKey: "breakfast_desc" as const,
  },
  {
    emoji: "📶",
    titleKey: "wifi_title" as const,
    descKey: "wifi_desc" as const,
  },
  {
    emoji: "🚲",
    titleKey: "bikes_title" as const,
    descKey: "bikes_desc" as const,
  },
  {
    emoji: "🐴",
    titleKey: "pony_title" as const,
    descKey: "pony_desc" as const,
  },
  {
    emoji: "🧺",
    titleKey: "picnic_title" as const,
    descKey: "picnic_desc" as const,
  },
  {
    emoji: "🔥",
    titleKey: "brasero_title" as const,
    descKey: "brasero_desc" as const,
  },
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const t = await getTranslations("services");

  return (
    <>
      {/* Header */}
      <section className="bg-tulipe-blue py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          {t("page_title")}
        </h1>
        <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
          {t("page_subtitle")}
        </p>
      </section>

      {/* Grid */}
      <section className="py-20 md:py-28 px-4 bg-tulipe-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestationsData.map((item) => (
            <div
              key={item.titleKey}
              className="bg-white rounded-2xl p-8 shadow-sm border border-tulipe-beige flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300"
            >
              <span className="text-5xl">{item.emoji}</span>
              <h2 className="font-heading text-xl text-tulipe-blue">
                {t(item.titleKey)}
              </h2>
              <p className="font-body text-gray-600 leading-relaxed text-sm">
                {t(item.descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Photos section */}
      <section className="py-16 px-4 bg-tulipe-beige">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl text-tulipe-blue text-center mb-10">
            {t("moments_title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/gallery/petit-dejeuner.jpg"
                alt="Petit-déjeuner maison avec crêpes et jus"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/gallery/jeux-societe.jpg"
                alt="Jeux de société Monopoly et Scrabble"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
