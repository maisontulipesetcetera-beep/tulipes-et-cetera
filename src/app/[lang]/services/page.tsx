import Image from "next/image";

const prestations = [
  {
    emoji: "🥐",
    title: "Petit-déjeuner complet",
    description:
      "Kougelhopf maison, pain frais, œufs fermiers, confitures artisanales et produits locaux d'Alsace. Un réveil en douceur chaque matin.",
  },
  {
    emoji: "📶",
    title: "Wifi & confort moderne",
    description:
      "TV connectée, bibliothèque garnie de livres et revues, jeux de société, linge de lit et de bain fourni — tout le confort d'un chez-soi.",
  },
  {
    emoji: "🚲",
    title: "Vélos gratuits",
    description:
      "Prêt de vélos pour découvrir le Sundgau à votre rythme : villages pittoresques, vignes, étangs et pistes cyclables balisées.",
  },
  {
    emoji: "🐴",
    title: "Poney sur place",
    description:
      "Rencontrez le poney de la propriété ! Une joie pour les enfants et un moment de douceur pour les grands.",
  },
  {
    emoji: "🧺",
    title: "Paniers pique-nique",
    description:
      "Sur commande, nous préparons des paniers pique-nique avec des produits bio et locaux pour vos escapades dans la région.",
  },
  {
    emoji: "🔥",
    title: "Brasero & jardin",
    description:
      "Jardin privatif de 3 000 m², terrasse aménagée et brasero pour les soirées estivales. Votre espace vert, rien que pour vous.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-tulipe-bordeaux py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Nos Prestations
        </h1>
        <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
          Tout ce qu&apos;il faut pour un séjour parfait, inclus ou disponible
          sur place
        </p>
      </section>

      {/* Grid */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestations.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-8 shadow-sm border border-tulipe-beige flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <span className="text-5xl">{item.emoji}</span>
              <h2 className="font-heading text-xl text-tulipe-bordeaux">
                {item.title}
              </h2>
              <p className="font-body text-gray-600 leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Photos section */}
      <section className="py-16 px-4 bg-tulipe-beige">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl text-tulipe-bordeaux text-center mb-10">
            Des moments savoureux
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/gallery/petit-dejeuner.jpg"
                alt="Petit-déjeuner maison avec crêpes et jus"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/gallery/jeux-societe.jpg"
                alt="Jeux de société Monopoly et Scrabble"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
