import Image from "next/image";

const articles = [
  {
    slug: "incontournables-sundgau",
    title: "Les incontournables du Sundgau",
    excerpt:
      "Entre étangs miroitants, villages médiévaux et cigognes, le Sundgau est une région qui se mérite. Voici notre sélection des lieux à ne manquer sous aucun prétexte lors de votre séjour à Waldighoffen.",
    image: "/images/hero-facade.jpg",
    imageAlt: "Paysage du Sundgau alsacien",
    date: "2026-03-15",
    readTime: "5 min",
  },
  {
    slug: "recette-kougelhopf",
    title: "Recette du Kougelhopf traditionnel",
    excerpt:
      "Le kougelhopf, brioche alsacienne aux raisins secs et aux amandes, est l'un des emblèmes de la gastronomie régionale. Nous vous partageons la recette de famille que nous préparons chaque matin pour nos hôtes.",
    image: "/images/gallery/petit-dejeuner.jpg",
    imageAlt: "Petit-déjeuner alsacien avec kougelhopf",
    date: "2026-02-28",
    readTime: "7 min",
  },
  {
    slug: "balades-velo-waldighoffen",
    title: "5 balades à vélo autour de Waldighoffen",
    excerpt:
      "Waldighoffen est idéalement situé pour explorer le Sundgau à vélo. Sentiers balisés, routes de campagne tranquilles, arrêts dans les bistrots de village — voici 5 itinéraires pour tous les niveaux.",
    image: "/images/gallery/choucroute.jpg",
    imageAlt: "Table alsacienne pour une pause cycliste",
    date: "2026-02-10",
    readTime: "6 min",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-tulipe-green py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Le Blog
        </h1>
        <p className="font-body text-white/80 text-lg max-w-xl mx-auto">
          Recettes, découvertes et conseils de séjour en Alsace
        </p>
      </section>

      {/* Articles */}
      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-tulipe-beige flex flex-col sm:flex-row hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative sm:w-64 aspect-[4/3] sm:aspect-auto shrink-0">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 256px"
                />
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col gap-3 justify-center">
                <div className="flex items-center gap-3 text-xs font-body text-gray-400">
                  <span>{formatDate(article.date)}</span>
                  <span>·</span>
                  <span>{article.readTime} de lecture</span>
                </div>
                <h2 className="font-heading text-xl md:text-2xl text-tulipe-green">
                  {article.title}
                </h2>
                <p className="font-body text-gray-600 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
                <button
                  type="button"
                  className="self-start mt-1 text-sm font-body font-semibold text-tulipe-green hover:text-tulipe-green-dark transition-colors cursor-not-allowed opacity-60"
                  disabled
                  title="Article complet bientôt disponible"
                >
                  Lire la suite →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter placeholder */}
      <section className="py-12 px-4 bg-tulipe-beige text-center">
        <h2 className="font-heading text-2xl text-tulipe-green mb-3">
          Restez informé
        </h2>
        <p className="font-body text-gray-600 mb-6">
          Nouveaux articles, offres spéciales et actualités de la maison —
          directement dans votre boîte mail.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="votre@email.fr"
            className="flex-1 px-4 py-3 rounded-[10px] border border-tulipe-beige font-body text-sm focus:outline-none focus:ring-2 focus:ring-tulipe-green bg-white"
            disabled
          />
          <button
            type="button"
            disabled
            className="px-6 py-3 bg-tulipe-green text-white font-body font-semibold rounded-[10px] opacity-60 cursor-not-allowed text-sm"
          >
            S&apos;abonner
          </button>
        </div>
        <p className="font-body text-xs text-gray-400 mt-3">
          Fonctionnalité bientôt disponible
        </p>
      </section>
    </>
  );
}
