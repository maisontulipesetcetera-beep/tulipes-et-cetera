import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, type Locale } from "@/i18n/config";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import ScrollToTop from "@/components/site/ScrollToTop";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const descriptionByLocale: Record<Locale, string> = {
  fr: "Cottage de Charme en Alsace. Chambres confortables, petit-déjeuner inclus, jardin fleuri et balnéothérapie.",
  de: "Charme-Cottage im Elsass. Komfortable Zimmer, Frühstück inklusive, Blumengarten und Balneotherapie.",
  en: "Charming Cottage in Alsace. Comfortable rooms, breakfast included, flower garden and balneotherapy.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = locales.includes(lang as Locale) ? (lang as Locale) : "fr";

  return {
    title: "Tulipes Et Cetera — Cottage de Charme en Alsace",
    description: descriptionByLocale[locale],
  };
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const schemaOrgLodgingBusiness = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Tulipes Et Cetera",
  description: "Cottage de Charme en Alsace",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2 Rue des Tulipes",
    addressLocality: "Waldighoffen",
    postalCode: "68640",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 47.4589,
    longitude: 7.3186,
  },
  telephone: "+33686436578",
  priceRange: "€€",
  starRating: { "@type": "Rating", ratingValue: "3" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "9.9",
    bestRating: "10",
    reviewCount: "86",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free WiFi" },
    { "@type": "LocationFeatureSpecification", name: "Free Parking" },
    { "@type": "LocationFeatureSpecification", name: "Breakfast Included" },
    { "@type": "LocationFeatureSpecification", name: "Garden" },
    { "@type": "LocationFeatureSpecification", name: "Free Bicycles" },
  ],
  image: "https://tulipes-et-cetera.fr/images/hero-facade.jpg",
  url: "https://tulipes-et-cetera.fr",
  availableLanguage: ["French", "German", "English"],
  checkinTime: "16:00",
  checkoutTime: "11:00",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${playfairDisplay.variable} ${lato.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaOrgLodgingBusiness),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-tulipe-cream font-body">
        <NextIntlClientProvider messages={messages}>
          <Header lang={locale} />
          <main className="flex-1">{children}</main>
          <Footer lang={locale} />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
