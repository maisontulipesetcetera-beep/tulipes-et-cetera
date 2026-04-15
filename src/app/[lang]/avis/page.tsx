import type { Metadata } from "next";
import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Avis clients — Tulipes EtCetera",
    description:
      "Note 9.9/10 sur Booking. Découvrez les témoignages de nos hôtes.",
  },
  de: {
    title: "Gästebewertungen — Tulipes EtCetera",
    description:
      "Bewertung 9,9/10 auf Booking. Lesen Sie die Erfahrungsberichte unserer Gäste.",
  },
  en: {
    title: "Guest Reviews — Tulipes EtCetera",
    description: "Rated 9.9/10 on Booking. Read our guests' testimonials.",
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
      canonical: `${BASE_URL}/${locale}/avis`,
      languages: {
        fr: `${BASE_URL}/fr/avis`,
        de: `${BASE_URL}/de/avis`,
        en: `${BASE_URL}/en/avis`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/avis`,
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

const reviewsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "Review",
      position: 1,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: { "@type": "Person", name: "Marie" },
      reviewBody:
        "La réalité dépasse ce qu'on attendait. Un petit quelque chose indéfinissable qui fait qu'on se sent vraiment chez soi, dans un cadre magnifique.",
      itemReviewed: {
        "@type": "LodgingBusiness",
        name: "Tulipes EtCetera",
      },
    },
    {
      "@type": "Review",
      position: 2,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: { "@type": "Person", name: "Thomas" },
      reviewBody:
        "Endroit magnifique, literie exceptionnelle, accueil au top ! Nous reviendrons sans hésiter. Le jardin est un vrai paradis.",
      itemReviewed: {
        "@type": "LodgingBusiness",
        name: "Tulipes EtCetera",
      },
    },
    {
      "@type": "Review",
      position: 3,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: { "@type": "Person", name: "Famille Al-Rashid" },
      reviewBody:
        "On y est restés une semaine alors qu'on avait prévu 2 nuits. Impossible de partir ! Le calme, la nature, la maison… tout est parfait.",
      itemReviewed: {
        "@type": "LodgingBusiness",
        name: "Tulipes EtCetera",
      },
    },
    {
      "@type": "Review",
      position: 4,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: { "@type": "Person", name: "Annette" },
      reviewBody:
        "Le petit-déjeuner est incroyable, tout est frais et local. Le kougelhopf maison est à tomber. Mention spéciale pour l'accueil chaleureux.",
      itemReviewed: {
        "@type": "LodgingBusiness",
        name: "Tulipes EtCetera",
      },
    },
    {
      "@type": "Review",
      position: 5,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      author: { "@type": "Person", name: "Lucas & Sophie" },
      reviewBody:
        "Un vrai Home Sweet Home. On reviendra ! La baignoire balnéo et le brasero dans le jardin, on ne demande rien de plus.",
      itemReviewed: {
        "@type": "LodgingBusiness",
        name: "Tulipes EtCetera",
      },
    },
  ],
};

const avis = [
  {
    text: "La réalité dépasse ce qu'on attendait. Un petit quelque chose indéfinissable qui fait qu'on se sent vraiment chez soi, dans un cadre magnifique.",
    author: "Marie",
    origin: "Paris",
    stars: 5,
  },
  {
    text: "Endroit magnifique, literie exceptionnelle, accueil au top ! Nous reviendrons sans hésiter. Le jardin est un vrai paradis.",
    author: "Thomas",
    origin: "Stuttgart",
    stars: 5,
  },
  {
    text: "On y est restés une semaine alors qu'on avait prévu 2 nuits. Impossible de partir ! Le calme, la nature, la maison… tout est parfait.",
    author: "Famille Al-Rashid",
    origin: "",
    stars: 5,
  },
  {
    text: "Le petit-déjeuner est incroyable, tout est frais et local. Le kougelhopf maison est à tomber. Mention spéciale pour l'accueil chaleureux.",
    author: "Annette",
    origin: "Amsterdam",
    stars: 5,
  },
  {
    text: "Un vrai Home Sweet Home. On reviendra ! La baignoire balnéo et le brasero dans le jardin, on ne demande rien de plus.",
    author: "Lucas & Sophie",
    origin: "Lyon",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span
      className="text-tulipe-gold text-lg"
      aria-label={`${count} étoiles sur 5`}
    >
      {"★".repeat(count)}
    </span>
  );
}

export default async function AvisPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = locales.includes(lang as Locale) ? (lang as Locale) : "fr";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      {/* Header */}
      <section className="bg-tulipe-green py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Avis de nos hôtes
        </h1>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-tulipe-gold text-3xl">★★★★★</span>
          <span className="font-heading text-3xl text-white">9.9 / 10</span>
        </div>
        <p className="font-body text-white/70 text-sm">
          Note moyenne sur Booking.com
        </p>
      </section>

      {/* Avis grid */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avis.map((item) => (
            <blockquote
              key={item.author}
              className="bg-white rounded-2xl p-7 shadow-sm border border-tulipe-beige flex flex-col gap-4"
            >
              <Stars count={item.stars} />
              <p className="font-body text-gray-700 italic leading-relaxed flex-1">
                &ldquo;{item.text}&rdquo; 🌷
              </p>
              <footer className="font-body text-tulipe-green font-semibold text-sm">
                — {item.author}
                {item.origin && (
                  <span className="text-gray-400 font-normal">
                    , {item.origin}
                  </span>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Lien Booking */}
      <section className="py-12 px-4 bg-tulipe-beige text-center">
        <p className="font-body text-gray-600 mb-4 text-lg">
          Retrouvez tous nos avis vérifiés sur Booking.com
        </p>
        <a
          href="https://www.booking.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-[#003580] hover:bg-[#00224f] text-white font-body font-semibold rounded-[10px] transition-colors"
        >
          Voir tous les avis sur Booking.com
        </a>
      </section>

      {/* Livre d'or */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl text-tulipe-green mb-4">
            Livre d&apos;or
          </h2>
          <p className="font-body text-gray-600 mb-8 text-base max-w-xl mx-auto">
            Feuilletez les mots laissés par nos hôtes et, si vous le souhaitez,
            laissez-y votre empreinte.
          </p>
          <Link
            href={`/${locale}/livre-dor`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-tulipe-green hover:bg-tulipe-green-dark text-white font-body font-semibold rounded-[10px] transition-colors text-base"
          >
            📖 Ouvrir le livre d&apos;or
          </Link>
        </div>
      </section>
    </>
  );
}
