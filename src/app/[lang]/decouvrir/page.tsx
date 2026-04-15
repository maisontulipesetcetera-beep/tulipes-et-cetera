import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Découvrir le Sundgau — Tulipes Et Cetera",
    description:
      "Explorez l'Alsace du Sud : villages, gastronomie, randonnées, Ferrette, carpes frites.",
  },
  de: {
    title: "Den Sundgau entdecken — Tulipes Et Cetera",
    description:
      "Entdecken Sie das südliche Elsass: Dörfer, Gastronomie, Wanderwege, Ferrette, Karpfen.",
  },
  en: {
    title: "Discover the Sundgau — Tulipes Et Cetera",
    description:
      "Explore southern Alsace: villages, gastronomy, hiking, Ferrette, fried carp.",
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
      canonical: `${BASE_URL}/${locale}/decouvrir`,
      languages: {
        fr: `${BASE_URL}/fr/decouvrir`,
        de: `${BASE_URL}/de/decouvrir`,
        en: `${BASE_URL}/en/decouvrir`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/decouvrir`,
      images: [{ url: `${BASE_URL}/images/hero-facade.jpg` }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/images/hero-facade.jpg`],
    },
  };
}

const sectionsData = [
  {
    titleKey: "sundgau_title" as const,
    descKey: "sundgau_desc" as const,
    image: "/images/hero-facade.jpg",
    imageAlt: "Paysage alsacien au coucher de soleil",
    features: ["sundgau_f1", "sundgau_f2", "sundgau_f3", "sundgau_f4"] as const,
  },
  {
    titleKey: "gastro_title" as const,
    descKey: "gastro_desc" as const,
    image: "/images/gallery/choucroute.jpg",
    imageAlt: "Choucroute alsacienne avec bières",
    features: ["gastro_f1", "gastro_f2", "gastro_f3", "gastro_f4"] as const,
  },
  {
    titleKey: "activities_title" as const,
    descKey: "activities_desc" as const,
    image: "/images/gallery/jeux-societe.jpg",
    imageAlt: "Activités de loisirs",
    features: [
      "activities_f1",
      "activities_f2",
      "activities_f3",
      "activities_f4",
    ] as const,
  },
];

export default async function DecouvrirPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const t = await getTranslations("decouvrir");

  return (
    <>
      {/* Hero avec overlay */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <Image
          src="/images/hero-facade.jpg"
          alt="Découvrir l'Alsace et le Sundgau"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 w-full px-4 pb-12 text-center">
          <h1 className="font-heading text-4xl md:text-6xl text-white drop-shadow-lg mb-3">
            {t("page_title")}
          </h1>
          <p className="font-body text-white/90 text-lg max-w-2xl mx-auto">
            {t("page_subtitle")}
          </p>
        </div>
      </section>

      {/* Sections */}
      {sectionsData.map((section, idx) => (
        <section
          key={section.titleKey}
          className={`py-16 px-4 ${idx % 2 === 0 ? "bg-tulipe-cream" : "bg-tulipe-beige"}`}
        >
          <div className="max-w-6xl mx-auto">
            <div
              className={`flex flex-col ${idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-10 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2 flex flex-col gap-5">
                <h2 className="font-heading text-3xl md:text-4xl text-tulipe-blue">
                  {t(section.titleKey)}
                </h2>
                <p className="font-body text-gray-700 leading-relaxed">
                  {t(section.descKey)}
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {section.features.map((fKey) => (
                    <li
                      key={fKey}
                      className="flex items-center gap-2 font-body text-sm text-gray-600"
                    >
                      <span className="text-tulipe-gold">★</span> {t(fKey)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-tulipe-blue py-12 px-4 text-center">
        <p className="font-heading text-2xl text-white mb-2">
          {t("cta_title")}
        </p>
        <p className="font-body text-white/80 mb-1">{t("cta_address")}</p>
        <p className="font-body text-white/60 text-sm">{t("cta_distances")}</p>
      </section>
    </>
  );
}
