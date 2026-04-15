import { db } from "@/lib/db";
import BookingForm from "@/components/site/BookingForm";
import { getTranslations } from "next-intl/server";

export default async function TarifsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}) {
  const t = await getTranslations("booking");
  const params = await searchParams;

  const settings = await db.settings.findUnique({ where: { id: "main" } });
  const basePrice = settings?.basePrice ?? 17900;

  return (
    <div className="min-h-screen bg-tulipe-cream py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl text-tulipe-bordeaux mb-4 text-center">
          {t("title")}
        </h1>

        <p className="font-body text-center text-gray-600 mb-2">
          {t("priceFrom")}{" "}
          <span className="font-semibold text-tulipe-bordeaux text-lg">
            {(basePrice / 100).toFixed(0)} €
          </span>{" "}
          / nuit
        </p>

        {params.success && (
          <div className="mb-8 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-green-700 font-body text-sm">
            Paiement reçu — votre réservation est confirmée !
          </div>
        )}

        {params.cancelled && (
          <div className="mb-8 rounded-xl bg-amber-50 border border-amber-200 p-4 text-center text-amber-700 font-body text-sm">
            Paiement annulé. Vous pouvez réessayer ci-dessous.
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
