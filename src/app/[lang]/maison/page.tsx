import type { Metadata } from "next";
import Image from "next/image";
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

export default function MaisonPage() {
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
          La Maison 🌷
        </h1>
        <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
          Une maison de charme atypique, ouverte sur un cadre verdoyant
        </p>
      </section>

      {/* Main content */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Text — 60% */}
            <div className="lg:w-[60%] flex flex-col gap-6">
              <h2 className="font-heading text-3xl text-tulipe-blue">
                On me dit &ldquo;Maison de Charme&rdquo; et je le suis !
              </h2>
              <p className="font-body text-gray-700 text-lg leading-relaxed">
                Atypique et ouverte sur un cadre verdoyant, j&apos;offre tous
                mes atouts à savoir l&apos;indépendance, le calme,
                l&apos;agrément, la détente et tous les éléments qui
                participeront au bonheur de celui qui résidera sous mon toit. Un
                jardin privatif aménagé, des places de parking et le prêt
                gratuit de vélos, un chargeur de voitures électriques et tout au
                fond de la propriété un brasero pour l&apos;ambiance.
              </p>
              <p className="font-body text-gray-700 text-lg leading-relaxed">
                Parlons de moi Maison de Charme&hellip; Je suis composée
                d&apos;un grand salon/SAM avec bibliothèque de livres et revues,
                téléviseur connecté ainsi que tout un équipement de loisirs. Un
                perron et une grande terrasse, un poêle à bois, une cuisine
                parfaitement équipée, une machine à laver, des toilettes
                indépendantes, un bureau&hellip; ceci pour le rez-de-chaussée.
              </p>
              <p className="font-body text-gray-700 text-lg leading-relaxed">
                À l&apos;étage trois chambres, une salle de bains avec douche et
                baignoire balnéo, etc. Les lits sont de belles dimensions et les
                literies de qualité, tout est fourni.
              </p>

              {/* Features list */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Jardin privatif 3 000 m²",
                  "Parking gratuit",
                  "Vélos en prêt gratuit",
                  "Chargeur voiture électrique",
                  "Brasero & terrasse",
                  "Poêle à bois",
                  "Cuisine équipée",
                  "Machine à laver",
                  "TV connectée & bibliothèque",
                  "Baignoire balnéo",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 font-body text-gray-700"
                  >
                    <span className="text-tulipe-forest font-bold">✓</span>
                    {item}
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
            &ldquo;Un vrai Home Sweet Home&rdquo; 🌷
          </p>
        </div>
      </section>
    </>
  );
}
