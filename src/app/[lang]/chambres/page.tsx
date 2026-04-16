import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Nos Chambres — Tulipes Et Cetera",
    description:
      "3 chambres de charme avec literie haut de gamme, salle de bains balnéo. Chambre Tulipe, Lavande et Cigogne.",
  },
  de: {
    title: "Unsere Zimmer — Tulipes Et Cetera",
    description:
      "3 charmante Zimmer mit hochwertiger Bettwäsche und Whirlpool-Badezimmer. Zimmer Tulpe, Lavendel und Storch.",
  },
  en: {
    title: "Our Rooms — Tulipes Et Cetera",
    description:
      "3 charming rooms with premium bedding and spa bathroom. Tulipe, Lavande and Cigogne rooms.",
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
      canonical: `${BASE_URL}/${locale}/chambres`,
      languages: {
        fr: `${BASE_URL}/fr/chambres`,
        de: `${BASE_URL}/de/chambres`,
        en: `${BASE_URL}/en/chambres`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/chambres`,
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

interface ChambresPageProps {
  params: Promise<{ lang: string }>;
}

const chambresData = [
  {
    slug: "tulipe",
    nameKey: "tulipe_name" as const,
    descKey: "tulipe_desc" as const,
    details: [
      "tulipe_detail1",
      "tulipe_detail2",
      "tulipe_detail3",
      "tulipe_detail4",
    ] as const,
    image: "/images/gallery/salon-champagne.jpg",
    imageAlt: "Chambre Tulipe — vue sur le jardin",
  },
  {
    slug: "lavande",
    nameKey: "lavande_name" as const,
    descKey: "lavande_desc" as const,
    details: [
      "lavande_detail1",
      "lavande_detail2",
      "lavande_detail3",
      "lavande_detail4",
    ] as const,
    image: "/images/gallery/diner-romantique.jpg",
    imageAlt: "Chambre Lavande — ambiance cosy",
  },
  {
    slug: "cigogne",
    nameKey: "cigogne_name" as const,
    descKey: "cigogne_desc" as const,
    details: [
      "cigogne_detail1",
      "cigogne_detail2",
      "cigogne_detail3",
      "cigogne_detail4",
    ] as const,
    image: "/images/gallery/raclette-2.jpg",
    imageAlt: "Chambre Cigogne — chambre familiale",
  },
];

export default async function ChambresPage({ params }: ChambresPageProps) {
  const { lang } = await params;
  const t = await getTranslations("chambres");

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

      {/* Chambres */}
      <section className="py-20 md:py-28 px-4 bg-tulipe-cream">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          {chambresData.map((chambre, idx) => (
            <div
              key={chambre.slug}
              className={`flex flex-col ${idx % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-tulipe-beige hover:shadow-lg transition-shadow duration-300`}
            >
              {/* Image */}
              <div className="relative md:w-2/5 aspect-[4/3] md:aspect-auto min-h-[240px]">
                <Image
                  src={chambre.image}
                  alt={chambre.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              {/* Content */}
              <div className="md:w-3/5 p-8 flex flex-col gap-4 justify-center">
                <h2 className="font-heading text-2xl md:text-3xl text-tulipe-blue">
                  {t(chambre.nameKey)}
                </h2>
                <p className="font-body text-gray-700 leading-relaxed">
                  {t(chambre.descKey)}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {chambre.details.map((detailKey) => (
                    <li
                      key={detailKey}
                      className="flex items-center gap-2 font-body text-sm text-gray-600"
                    >
                      <span className="text-tulipe-forest font-bold">✓</span>
                      {t(detailKey)}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <Link
                    href={`/${lang}/reservation`}
                    className="inline-block px-6 py-3 bg-tulipe-forest hover:bg-tulipe-forest-dark text-white font-body font-semibold rounded-[10px] transition-colors text-sm"
                  >
                    {t("book_button")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-tulipe-beige py-12 px-4 text-center">
        <p className="font-body text-gray-700 text-lg mb-4">{t("cta_text")}</p>
        <Link
          href={`/${lang}/reservation`}
          className="inline-block px-8 py-3 bg-tulipe-forest hover:bg-tulipe-forest-dark text-white font-body font-semibold rounded-[10px] transition-colors"
        >
          {t("cta_button")}
        </Link>
      </section>
    </>
  );
}
