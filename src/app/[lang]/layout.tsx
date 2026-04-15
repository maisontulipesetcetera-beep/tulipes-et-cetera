import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, type Locale } from "@/i18n/config";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

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
  fr: "Maison d'hôtes de charme en Alsace. Chambres confortables, petit-déjeuner inclus, jardin fleuri et balnéothérapie.",
  de: "Charmantes Gästehaus im Elsass. Komfortable Zimmer, Frühstück inklusive, Blumengarten und Balneotherapie.",
  en: "Charming bed and breakfast in Alsace. Comfortable rooms, breakfast included, flower garden and balneotherapy.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = locales.includes(lang as Locale) ? (lang as Locale) : "fr";

  return {
    title: "Tulipes Et Cetera — Maison d'hôtes de charme en Alsace",
    description: descriptionByLocale[locale],
  };
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

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
      className={`${playfairDisplay.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-tulipe-cream font-body">
        <NextIntlClientProvider messages={messages}>
          <Header lang={locale} />
          <main className="flex-1">{children}</main>
          <Footer lang={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
