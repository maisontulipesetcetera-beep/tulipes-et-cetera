import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import { locales, type Locale } from "@/i18n/config";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Contact — Tulipes Et Cetera",
    description:
      "2 Rue des Tulipes, 68640 Waldighoffen. Tél: +33 3 89 40 02 90",
  },
  de: {
    title: "Kontakt — Tulipes Et Cetera",
    description:
      "2 Rue des Tulipes, 68640 Waldighoffen. Tel: +33 3 89 40 02 90",
  },
  en: {
    title: "Contact — Tulipes Et Cetera",
    description:
      "2 Rue des Tulipes, 68640 Waldighoffen. Tel: +33 3 89 40 02 90",
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
      canonical: `${BASE_URL}/${locale}/contact`,
      languages: {
        fr: `${BASE_URL}/fr/contact`,
        de: `${BASE_URL}/de/contact`,
        en: `${BASE_URL}/en/contact`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/contact`,
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

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-tulipe-bordeaux py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Nous contacter
        </h1>
        <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
          Une question ? Une demande ? Nous répondons sous 24h.
        </p>
      </section>

      {/* Map + Form */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Left: Map + infos */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2676.5!2d7.3186!3d47.4589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDI3JzMyLjAiTiA3wrAxOScwNy4wIkU!5e0!3m2!1sfr!2sfr!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Tulipes et Cetera — Waldighoffen"
              />
            </div>

            {/* Infos de contact */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-tulipe-beige flex flex-col gap-4">
              <h2 className="font-heading text-xl text-tulipe-bordeaux">
                Informations
              </h2>
              <div className="flex flex-col gap-3 font-body text-sm text-gray-700">
                <p className="flex items-start gap-3">
                  <span className="text-tulipe-bordeaux text-base mt-0.5">
                    📍
                  </span>
                  <span>
                    2 Rue des Tulipes
                    <br />
                    68640 Waldighoffen, France
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-tulipe-bordeaux text-base">📞</span>
                  <a
                    href="tel:+33389400290"
                    className="hover:text-tulipe-green transition-colors"
                  >
                    +33 3 89 40 02 90
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-tulipe-bordeaux text-base">✉️</span>
                  <a
                    href="mailto:contact@tulipes-et-cetera.fr"
                    className="hover:text-tulipe-green transition-colors"
                  >
                    contact@tulipes-et-cetera.fr
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-tulipe-bordeaux text-base">🕐</span>
                  <span>Réponse sous 24h</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Formulaire */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-tulipe-beige">
              <h2 className="font-heading text-2xl text-tulipe-bordeaux mb-6">
                Envoyez-nous un message
              </h2>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
