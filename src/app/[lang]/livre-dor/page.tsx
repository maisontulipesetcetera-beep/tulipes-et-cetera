import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import GuestBook from "@/components/site/GuestBook";

const BASE_URL = "https://tulipes-et-cetera.fr";

const metaByLocale: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: "Livre d'or — Tulipes Et Cetera",
    description:
      "Feuilletez le livre d'or de Tulipes Et Cetera et laissez votre message.",
  },
  de: {
    title: "Gästebuch — Tulipes Et Cetera",
    description:
      "Blättern Sie im Gästebuch von Tulipes Et Cetera und hinterlassen Sie eine Nachricht.",
  },
  en: {
    title: "Guest Book — Tulipes Et Cetera",
    description:
      "Browse the guest book of Tulipes Et Cetera and leave your message.",
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
      canonical: `${BASE_URL}/${locale}/livre-dor`,
      languages: {
        fr: `${BASE_URL}/fr/livre-dor`,
        de: `${BASE_URL}/de/livre-dor`,
        en: `${BASE_URL}/en/livre-dor`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/livre-dor`,
      images: [{ url: `${BASE_URL}/images/hero-facade.jpg` }],
      type: "website",
    },
  };
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function LivreDorPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-tulipe-blue py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Livre d&apos;or 🌷
        </h1>
        <p className="font-body text-white/70 text-base max-w-xl mx-auto">
          Les mots de nos hôtes, pour toujours gravés dans notre mémoire.
          Feuilletez les pages et, si vous l&apos;envie vous prend, laissez-y
          votre empreinte.
        </p>
      </section>

      {/* Book section */}
      <section className="py-16 px-4 bg-tulipe-cream min-h-[70vh] flex items-start justify-center">
        <div className="w-full max-w-3xl">
          <GuestBook />
        </div>
      </section>
    </>
  );
}
