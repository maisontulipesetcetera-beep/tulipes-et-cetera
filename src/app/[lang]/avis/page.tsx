import Link from "next/link";

const avis = [
  {
    text: "La réalité dépasse ce qu'on attendait. Un petit quelque chose indéfinissable qui fait qu'on se sent vraiment chez soi, dans un cadre magnifique.",
    author: "Marie",
    origin: "Paris",
    stars: 5,
  },
  {
    text: "Endroit magnifique, literie exceptionnelle, accueil au top ! Nous reviendrons sans hésiter. Le jardin est un vrai paradis.",
    author: "Thomas",
    origin: "Stuttgart",
    stars: 5,
  },
  {
    text: "On y est restés une semaine alors qu'on avait prévu 2 nuits. Impossible de partir ! Le calme, la nature, la maison… tout est parfait.",
    author: "Famille Al-Rashid",
    origin: "",
    stars: 5,
  },
  {
    text: "Le petit-déjeuner est incroyable, tout est frais et local. Le kougelhopf maison est à tomber. Mention spéciale pour l'accueil chaleureux.",
    author: "Annette",
    origin: "Amsterdam",
    stars: 5,
  },
  {
    text: "Un vrai Home Sweet Home. On reviendra ! La baignoire balnéo et le brasero dans le jardin, on ne demande rien de plus.",
    author: "Lucas & Sophie",
    origin: "Lyon",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span
      className="text-tulipe-gold text-lg"
      aria-label={`${count} étoiles sur 5`}
    >
      {"★".repeat(count)}
    </span>
  );
}

export default function AvisPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-tulipe-bordeaux py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Avis de nos hôtes
        </h1>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-tulipe-gold text-3xl">★★★★★</span>
          <span className="font-heading text-3xl text-white">9.9 / 10</span>
        </div>
        <p className="font-body text-white/70 text-sm">
          Note moyenne sur Booking.com
        </p>
      </section>

      {/* Avis grid */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avis.map((item) => (
            <blockquote
              key={item.author}
              className="bg-white rounded-2xl p-7 shadow-sm border border-tulipe-beige flex flex-col gap-4"
            >
              <Stars count={item.stars} />
              <p className="font-body text-gray-700 italic leading-relaxed flex-1">
                &ldquo;{item.text}&rdquo;
              </p>
              <footer className="font-body text-tulipe-bordeaux font-semibold text-sm">
                — {item.author}
                {item.origin && (
                  <span className="text-gray-400 font-normal">
                    , {item.origin}
                  </span>
                )}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Lien Booking */}
      <section className="py-12 px-4 bg-tulipe-beige text-center">
        <p className="font-body text-gray-600 mb-4 text-lg">
          Retrouvez tous nos avis vérifiés sur Booking.com
        </p>
        <a
          href="https://www.booking.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-[#003580] hover:bg-[#00224f] text-white font-body font-semibold rounded-[10px] transition-colors"
        >
          Voir tous les avis sur Booking.com
        </a>
      </section>

      {/* Livre d'or placeholder */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl text-tulipe-bordeaux text-center mb-8">
            Livre d&apos;or
          </h2>
          <div className="border-2 border-dashed border-tulipe-beige rounded-2xl p-16 text-center bg-white">
            <p className="font-body text-gray-400 text-lg">
              Livre d&apos;or numérique — à venir
            </p>
            <p className="font-body text-gray-300 text-sm mt-2">
              Partagez votre expérience directement depuis cette page
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
