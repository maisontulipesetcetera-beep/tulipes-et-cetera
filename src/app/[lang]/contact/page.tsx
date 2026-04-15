import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Contact — Tulipes Et Cetera",
    description:
      "2 Rue des Tulipes, 68640 Waldighoffen. Tél: 06 86 43 65 78",
  },
  de: {
    title: "Kontakt — Tulipes Et Cetera",
    description:
      "2 Rue des Tulipes, 68640 Waldighoffen. Tel: 06 86 43 65 78",
  },
  en: {
    title: "Contact — Tulipes Et Cetera",
    description:
      "2 Rue des Tulipes, 68640 Waldighoffen. Tel: 06 86 43 65 78",
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const t = await getTranslations("contact");

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

      {/* Map + Form */}
      <section className="py-20 md:py-28 px-4 bg-tulipe-cream">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Left: Map + infos */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/3] w-full">
              <iframe
                src="https://www.google.com/maps?q=2+Rue+des+Tulipes,+68640+Waldighoffen,+France&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Tulipes Et Cetera — Waldighoffen"
              />
            </div>

            {/* Infos de contact */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-tulipe-beige flex flex-col gap-4">
              <h2 className="font-heading text-xl text-tulipe-blue">
                {t("info_title")}
              </h2>
              <div className="flex flex-col gap-3 font-body text-sm text-gray-700">
                <p className="flex items-start gap-3">
                  <span className="text-tulipe-forest text-base mt-0.5">
                    📍
                  </span>
                  <span>
                    2 Rue des Tulipes
                    <br />
                    68640 Waldighoffen, France 🌷
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-tulipe-forest text-base">📞</span>
                  <a
                    href="tel:+33686436578"
                    className="hover:text-tulipe-forest transition-colors"
                  >
                    06 86 43 65 78
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-tulipe-forest text-base">✉️</span>
                  <a
                    href="mailto:maison.tulipes.etcetera@gmail.com"
                    className="hover:text-tulipe-forest transition-colors"
                  >
                    maison.tulipes.etcetera@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-tulipe-forest text-base">🕐</span>
                  <span>{t("response_time")}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right: Formulaire */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-tulipe-beige">
              <h2 className="font-heading text-2xl text-tulipe-blue mb-6">
                {t("send_message")}
              </h2>

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
