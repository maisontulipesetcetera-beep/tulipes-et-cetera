import type { Metadata } from "next";
import Link from "next/link";
import BookingForm from "@/components/site/BookingForm";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Réserver — Tulipes Et Cetera",
    description:
      "Réservez votre séjour à partir de 179€/nuit. Calendrier en temps réel, paiement sécurisé.",
  },
  de: {
    title: "Buchen — Tulipes Et Cetera",
    description:
      "Buchen Sie Ihren Aufenthalt ab 179€/Nacht. Echtzeit-Kalender, sichere Zahlung.",
  },
  en: {
    title: "Book — Tulipes Et Cetera",
    description:
      "Book your stay from €179/night. Real-time availability calendar, secure payment.",
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
      canonical: `${BASE_URL}/${locale}/reservation`,
      languages: {
        fr: `${BASE_URL}/fr/reservation`,
        de: `${BASE_URL}/de/reservation`,
        en: `${BASE_URL}/en/reservation`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/reservation`,
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

interface ReservationPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ReservationPage({
  params,
}: ReservationPageProps) {
  const { lang } = await params;
  const t = await getTranslations("reservation");

  const rooms = [
    {
      labelKey: "tulipe_label" as const,
      price: "179€",
      noteKey: "tulipe_note" as const,
      highlight: true,
    },
    {
      labelKey: "lavande_label" as const,
      price: "169€",
      noteKey: "lavande_note" as const,
      highlight: false,
    },
    {
      labelKey: "cigogne_label" as const,
      price: "189€",
      noteKey: "cigogne_note" as const,
      highlight: false,
    },
  ];

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

      {/* Prix */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {rooms.map((item) => (
              <div
                key={item.labelKey}
                className={`rounded-2xl p-8 text-center border flex flex-col gap-2 ${
                  item.highlight
                    ? "bg-tulipe-forest text-white border-tulipe-forest shadow-lg"
                    : "bg-white text-tulipe-forest border-tulipe-beige shadow-sm"
                }`}
              >
                <h2 className="font-heading text-xl">{t(item.labelKey)}</h2>
                <p
                  className={`font-heading text-5xl font-bold ${item.highlight ? "text-white" : "text-tulipe-blue"}`}
                >
                  {item.price}
                </p>
                <p
                  className={`font-body text-sm ${item.highlight ? "text-white/70" : "text-gray-500"}`}
                >
                  {t(item.noteKey)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-tulipe-beige rounded-xl p-6 flex flex-col gap-2 text-sm font-body text-gray-600 max-w-xl mx-auto">
            {(
              [
                "included1",
                "included2",
                "included3",
                "included4",
                "included5",
              ] as const
            ).map((key) => (
              <p key={key} className="flex items-center gap-2">
                <span className="text-tulipe-forest font-bold">✓</span> {t(key)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Calendrier + Formulaire de réservation */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl text-tulipe-blue text-center mb-8">
            {t("form_title")}
          </h2>
          <div className="bg-tulipe-cream rounded-2xl border border-tulipe-beige p-6 md:p-10">
            <BookingForm />
          </div>
          <p className="font-body text-center text-gray-500 text-sm mt-8">
            {t("contact_text")}{" "}
            <Link
              href={`/${lang}/contact`}
              className="text-tulipe-forest underline hover:text-tulipe-forest transition-colors"
            >
              {t("contact_page")}
            </Link>{" "}
            {t("contact_or")}{" "}
            <a
              href="tel:+33389400290"
              className="text-tulipe-forest underline hover:text-tulipe-forest transition-colors"
            >
              +33 3 89 40 02 90
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
