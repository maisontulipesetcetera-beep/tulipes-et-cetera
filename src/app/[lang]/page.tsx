import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";
import WeatherWidget from "@/components/site/WeatherWidget";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Tulipes Et Cetera — Maison d'hôtes de charme en Alsace",
    description:
      "Maison d'hôtes 3★ à Waldighoffen, Sundgau. Petit-déjeuner inclus, balnéo, jardin 3000m², vélos gratuits. Note 9.9/10",
  },
  de: {
    title: "Tulipes Et Cetera — Charmantes Gästehaus im Elsass",
    description:
      "3★-Gästehaus in Waldighoffen, Sundgau. Frühstück inklusive, Whirlpool, 3000m² Garten, kostenlose Fahrräder. Bewertung 9,9/10",
  },
  en: {
    title: "Tulipes Et Cetera — Charming Bed & Breakfast in Alsace",
    description:
      "3-star B&B in Waldighoffen, Sundgau. Breakfast included, spa bath, 3000m² garden, free bikes. Rated 9.9/10",
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
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        fr: `${BASE_URL}/fr`,
        de: `${BASE_URL}/de`,
        en: `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
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

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const t = await getTranslations("hero");
  const tf = await getTranslations("features");

  const galleryImages = [
    {
      src: "/images/gallery/salon-champagne.jpg",
      alt: "Salon cosy avec champagne",
    },
    { src: "/images/gallery/petit-dejeuner.jpg", alt: "Petit-déjeuner maison" },
    {
      src: "/images/gallery/diner-romantique.jpg",
      alt: "Dîner romantique aux bougies",
    },
    { src: "/images/gallery/raclette.jpg", alt: "Soirée raclette conviviale" },
  ];

  const features = [
    { emoji: "🌿", key: "garden" as const },
    { emoji: "🛁", key: "balneo" as const },
    { emoji: "🥐", key: "breakfast" as const },
    { emoji: "🚲", key: "bikes" as const },
    { emoji: "🐴", key: "pony" as const },
  ];

  const testimonials = [
    {
      text: "La réalité dépasse ce qu'on attendait. Un petit quelque chose indéfinissable qui fait qu'on se sent vraiment chez soi.",
      author: "Marie, Paris",
    },
    {
      text: "Endroit magnifique, literie exceptionnelle, accueil au top ! On reviendra sans hésiter.",
      author: "Thomas, Stuttgart",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[560px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero-facade.jpg"
          alt="Façade de Tulipes et Cetera au coucher de soleil"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-white leading-tight drop-shadow-lg">
            {t("title")}
          </h1>
          <p className="font-body text-lg sm:text-xl md:text-2xl text-white/90 max-w-xl">
            {t("subtitle")}
          </p>
          <Link
            href={`/${lang}/reservation`}
            className="mt-2 inline-block px-10 py-4 bg-tulipe-green hover:bg-tulipe-green-dark text-white font-body font-semibold rounded-[10px] transition-all duration-200 hover:scale-105 hover:shadow-xl text-lg shadow-lg"
          >
            {t("cta")}
          </Link>
          <div className="mt-2">
            <WeatherWidget />
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-tulipe-cream py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8">
          {features.map(({ emoji, key }) => (
            <div
              key={key}
              className="flex flex-col items-center gap-2 text-center min-w-[100px]"
            >
              <span className="text-4xl">{emoji}</span>
              <span className="font-body text-sm text-gray-700">{tf(key)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Mini gallery */}
      <section className="bg-tulipe-beige py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-tulipe-bordeaux text-center mb-10">
            Quelques instants chez nous
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryImages.map((img) => (
              <div
                key={img.src}
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-tulipe-cream py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-tulipe-bordeaux text-center mb-10">
            Ce que disent nos hôtes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <blockquote
                key={t.author}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg border border-tulipe-beige flex flex-col gap-4 transition-shadow duration-200"
              >
                <p className="font-body text-gray-700 italic text-lg leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="font-body text-tulipe-bordeaux font-semibold text-sm">
                  — {t.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-tulipe-bordeaux py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="font-heading text-3xl md:text-4xl text-white">
            Prêt pour une escapade en Alsace ?
          </h2>
          <p className="font-body text-white/80 text-lg">
            Réservez votre séjour dès maintenant et profitez de notre maison de
            charme.
          </p>
          <Link
            href={`/${lang}/reservation`}
            className="inline-block px-10 py-4 bg-tulipe-gold hover:bg-amber-500 text-white font-body font-semibold rounded-[10px] transition-all duration-200 hover:scale-105 hover:shadow-xl text-lg shadow-lg"
          >
            Réservez votre séjour
          </Link>
        </div>
      </section>
    </>
  );
}
