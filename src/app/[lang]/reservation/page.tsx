import Link from "next/link";
import BookingForm from "@/components/site/BookingForm";

interface ReservationPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ReservationPage({
  params,
}: ReservationPageProps) {
  const { lang } = await params;

  return (
    <>
      {/* Header */}
      <section className="bg-tulipe-bordeaux py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Tarifs & Réservation
        </h1>
        <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
          Petit-déjeuner inclus — minimum 2 nuits — séjour sur mesure
        </p>
      </section>

      {/* Prix */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                label: "Chambre Tulipe",
                price: "179€",
                note: "/ nuit · 2 personnes",
                highlight: true,
              },
              {
                label: "Chambre Lavande",
                price: "169€",
                note: "/ nuit · 2 personnes",
                highlight: false,
              },
              {
                label: "Chambre Cigogne",
                price: "189€",
                note: "/ nuit · jusqu'à 3 pers.",
                highlight: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl p-8 text-center border flex flex-col gap-2 ${
                  item.highlight
                    ? "bg-tulipe-bordeaux text-white border-tulipe-bordeaux shadow-lg"
                    : "bg-white text-tulipe-bordeaux border-tulipe-beige shadow-sm"
                }`}
              >
                <h2 className="font-heading text-xl">{item.label}</h2>
                <p
                  className={`font-heading text-5xl font-bold ${item.highlight ? "text-tulipe-gold" : "text-tulipe-bordeaux"}`}
                >
                  {item.price}
                </p>
                <p
                  className={`font-body text-sm ${item.highlight ? "text-white/70" : "text-gray-500"}`}
                >
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-tulipe-beige rounded-xl p-6 flex flex-col gap-2 text-sm font-body text-gray-600 max-w-xl mx-auto">
            <p className="flex items-center gap-2">
              <span className="text-tulipe-green font-bold">✓</span>{" "}
              Petit-déjeuner complet inclus
            </p>
            <p className="flex items-center gap-2">
              <span className="text-tulipe-green font-bold">✓</span> Séjour
              minimum 2 nuits
            </p>
            <p className="flex items-center gap-2">
              <span className="text-tulipe-green font-bold">✓</span> Linge de
              lit et de bain fourni
            </p>
            <p className="flex items-center gap-2">
              <span className="text-tulipe-green font-bold">✓</span> Parking
              gratuit sur place
            </p>
            <p className="flex items-center gap-2">
              <span className="text-tulipe-green font-bold">✓</span> Vélos en
              prêt gratuit
            </p>
          </div>
        </div>
      </section>

      {/* Calendrier + Formulaire de réservation */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl text-tulipe-bordeaux text-center mb-8">
            Faire une demande de réservation
          </h2>
          <div className="bg-tulipe-cream rounded-2xl border border-tulipe-beige p-6 md:p-10">
            <BookingForm />
          </div>
          <p className="font-body text-center text-gray-500 text-sm mt-8">
            Vous pouvez aussi nous contacter directement :{" "}
            <Link
              href={`/${lang}/contact`}
              className="text-tulipe-bordeaux underline hover:text-tulipe-green transition-colors"
            >
              page contact
            </Link>{" "}
            ou par téléphone au{" "}
            <a
              href="tel:+33389400290"
              className="text-tulipe-bordeaux underline hover:text-tulipe-green transition-colors"
            >
              +33 3 89 40 02 90
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
