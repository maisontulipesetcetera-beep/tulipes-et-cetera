import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("hero");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center bg-tulipe-cream">
      <h1 className="font-heading text-4xl md:text-6xl text-tulipe-bordeaux">
        {t("title")}
      </h1>
      <p className="font-body text-xl md:text-2xl text-gray-700 max-w-xl">
        {t("subtitle")}
      </p>
      <a
        href="#booking"
        className="mt-4 inline-block px-8 py-3 bg-tulipe-green hover:bg-tulipe-green-dark text-white font-body font-semibold rounded-[10px] transition-colors"
      >
        {t("cta")}
      </a>
    </div>
  );
}
