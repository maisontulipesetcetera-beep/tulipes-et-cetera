import type { Metadata } from "next";
import Image from "next/image";
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

const sections = [
  {
    title: "Le Sundgau",
    description:
      "Surnommé « la petite Toscane d'Alsace », le Sundgau est une région de collines verdoyantes, de villages fleuris et d'étangs scintillants. À deux pas de la maison, Ferrette — cité médiévale perchée — offre une vue imprenable sur la vallée. Partez à la découverte de villages comme Oltingue, Leymen ou Fislis, chacun avec son église, son lavoir et ses ruelles fleuries.",
    image: "/images/hero-facade.jpg",
    imageAlt: "Paysage alsacien au coucher de soleil",
    features: [
      "Villages médiévaux",
      "Étangs et sentiers",
      "Ferrette & château",
      "Cigognes d'Alsace",
    ],
  },
  {
    title: "Gastronomie alsacienne",
    description:
      "L'Alsace est une terre de saveurs. La carpe frite du Sundgau est un incontournable à goûter dans les nombreux restaurants de la région. La choucroute, le baeckeoffe, le munster, les vins d'Alsace et le kougelhopf vous attendent. Les marchés locaux regorgent de produits frais et artisanaux.",
    image: "/images/gallery/choucroute.jpg",
    imageAlt: "Choucroute alsacienne avec bières",
    features: [
      "Carpe frite du Sundgau",
      "Choucroute & baeckeoffe",
      "Vins d'Alsace",
      "Kougelhopf & bretzel",
    ],
  },
  {
    title: "Activités & balades",
    description:
      "La région offre un réseau dense de pistes cyclables et sentiers de randonnée. Partez explorer le Parc Naturel des Vosges du Sud, les vignobles de la Route des Vins ou encore Bâle à 20 minutes. En hiver, les stations de ski des Vosges sont accessibles en moins d'une heure.",
    image: "/images/gallery/jeux-societe.jpg",
    imageAlt: "Activités de loisirs",
    features: [
      "Randonnée & cyclisme",
      "Route des Vins",
      "Bâle à 20 min",
      "Vosges à 45 min",
    ],
  },
];

export default function DecouvrirPage() {
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
            Découvrir la région
          </h1>
          <p className="font-body text-white/90 text-lg max-w-2xl mx-auto">
            Sundgau, gastronomie alsacienne et activités — votre guide de voyage
            depuis Waldighoffen
          </p>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section, idx) => (
        <section
          key={section.title}
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
                  {section.title}
                </h2>
                <p className="font-body text-gray-700 leading-relaxed">
                  {section.description}
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {section.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 font-body text-sm text-gray-600"
                    >
                      <span className="text-tulipe-gold">★</span> {f}
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
          Waldighoffen — au cœur du Sundgau
        </p>
        <p className="font-body text-white/80 mb-1">
          2 Rue des Tulipes, 68640 Waldighoffen
        </p>
        <p className="font-body text-white/60 text-sm">
          À 20 min de Bâle · 30 min de Mulhouse · 45 min des pistes de ski
        </p>
      </section>
    </>
  );
}
