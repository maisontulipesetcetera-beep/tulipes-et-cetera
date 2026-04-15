import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";
import WeatherWidget from "@/components/site/WeatherWidget";
import ScrollVideoHero from "@/components/site/ScrollVideoHero";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Tulipes Et Cetera — Cottage de Charme en Alsace",
    description:
      "Cottage de Charme 3★ à Waldighoffen, Sundgau. Petit-déjeuner inclus, balnéo, jardin 3000m², vélos gratuits. Note 9.9/10",
  },
  de: {
    title: "Tulipes Et Cetera — Charme-Cottage im Elsass",
    description:
      "3★-Charme-Cottage in Waldighoffen, Sundgau. Frühstück inklusive, Whirlpool, 3000m² Garten, kostenlose Fahrräder. Bewertung 9,9/10",
  },
  en: {
    title: "Tulipes Et Cetera — Charming Cottage in Alsace",
    description:
      "3-star Charming Cottage in Waldighoffen, Sundgau. Breakfast included, spa bath, 3000m² garden, free bikes. Rated 9.9/10",
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
  const tf = await getTranslations("features");
  const th = await getTranslations("home");

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
      text: th("testimonial1_text"),
      author: th("testimonial1_author"),
    },
    {
      text: th("testimonial2_text"),
      author: th("testimonial2_author"),
    },
  ];

  return (
    <>
      {/* Hero scroll-driven GSAP */}
      <ScrollVideoHero lang={lang} />

      {/* Features strip */}
      <section className="bg-white py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
          {features.map(({ emoji, key }) => (
            <div
              key={key}
              className="flex flex-col items-center gap-3 text-center min-w-[110px]"
            >
              <span className="text-5xl">{emoji}</span>
              <span className="font-body text-base font-medium text-gray-700">
                {tf(key)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Mini gallery */}
      <section className="bg-tulipe-beige py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl text-tulipe-blue text-center mb-12">
            {th("gallery_title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl text-tulipe-blue text-center mb-12">
            {th("testimonials_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((item) => (
              <blockquote
                key={item.author}
                className="bg-white rounded-2xl p-10 shadow-md hover:shadow-lg border border-tulipe-beige flex flex-col gap-4 transition-shadow duration-200"
              >
                <p className="font-body text-gray-700 italic text-xl leading-relaxed">
                  &ldquo;{item.text}&rdquo; 🌷
                </p>
                <footer className="font-body text-tulipe-forest font-semibold text-sm">
                  — {item.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-tulipe-blue py-20 md:py-28 px-4 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h2 className="font-heading text-3xl md:text-5xl text-white">
            {th("cta_title")}
          </h2>
          <p className="font-body text-white/80 text-lg">
            {th("cta_subtitle")}
          </p>
          <Link
            href={`/${lang}/reservation`}
            className="inline-block px-12 py-5 bg-tulipe-gold hover:bg-tulipe-gold-light text-white font-body font-semibold rounded-[10px] transition-all duration-200 hover:scale-105 hover:shadow-xl text-xl shadow-lg"
          >
            {th("cta_button")}
          </Link>
        </div>
      </section>
    </>
  );
}
