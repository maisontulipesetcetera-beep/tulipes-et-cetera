import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "La Maison — Tulipes Et Cetera",
    description:
      "Découvrez notre maison de charme : salon, cuisine équipée, terrasse, jardin, poêle à bois. 3 chambres avec balnéo.",
  },
  de: {
    title: "Das Haus — Tulipes Et Cetera",
    description:
      "Entdecken Sie unser charmantes Haus: Wohnzimmer, voll ausgestattete Küche, Terrasse, Garten, Holzofen. 3 Zimmer mit Whirlpool.",
  },
  en: {
    title: "The House — Tulipes Et Cetera",
    description:
      "Discover our charming house: living room, fully equipped kitchen, terrace, garden, wood stove. 3 rooms with spa bath.",
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
      canonical: `${BASE_URL}/${locale}/maison`,
      languages: {
        fr: `${BASE_URL}/fr/maison`,
        de: `${BASE_URL}/de/maison`,
        en: `${BASE_URL}/en/maison`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/maison`,
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

export default async function MaisonPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const t = await getTranslations("maison");

  const photos = [
    {
      src: "/images/gallery/salon-champagne.jpg",
      alt: "Salon cosy avec champagne",
    },
    {
      src: "/images/gallery/raclette.jpg",
      alt: "Soirée raclette avec bibliothèque",
    },
    {
      src: "/images/gallery/jeux-societe.jpg",
      alt: "Jeux de société Monopoly et Scrabble",
    },
  ];

  return (
    <>
      {/* Page header */}
      <section className="bg-tulipe-blue py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          {t("page_title")}
        </h1>
        <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
          {t("page_subtitle")}
        </p>
      </section>

      {/* Main content */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Text — 60% */}
            <div className="lg:w-[60%] flex flex-col gap-6">
              <h2 className="font-heading text-3xl text-tulipe-blue">
                {t("section_title")}
              </h2>
              <p className="font-body text-gray-700 text-lg leading-relaxed">
                {t("desc1")}
              </p>
              <p className="font-body text-gray-700 text-lg leading-relaxed">
                {t("desc2")}
              </p>
              <p className="font-body text-gray-700 text-lg leading-relaxed">
                {t("desc3")}
              </p>

              {/* Features list */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    "feature_garden",
                    "feature_parking",
                    "feature_bikes",
                    "feature_ev",
                    "feature_brasero",
                    "feature_stove",
                    "feature_kitchen",
                    "feature_washer",
                    "feature_tv",
                    "feature_balneo",
                  ] as const
                ).map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 font-body text-gray-700"
                  >
                    <span className="text-tulipe-forest font-bold">✓</span>
                    {t(key)}
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery — 40% */}
            <div className="lg:w-[40%] flex flex-col gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sweet home image */}
      <section className="bg-tulipe-beige py-16 px-4">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/sweet-home.jpg"
              alt="Sweet Home — Tulipes Et Cetera"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
          <p className="font-heading text-2xl text-tulipe-blue italic">
            &ldquo;{t("sweet_home")}&rdquo;
          </p>
        </div>
      </section>
    </>
  );
}
