const LIVRET_URL = "https://tulipes-et-cetera.fr/fr/livret";

export default function LivretPage() {
  return (
    <>
      {/* Header sobre */}
      <section className="bg-tulipe-cream py-12 px-4 text-center border-b border-tulipe-beige">
        <h1 className="font-heading text-3xl md:text-4xl text-tulipe-royal mb-2">
          Livret d&apos;accueil
        </h1>
        <p className="font-body text-gray-500 text-sm">
          Tulipes EtCetera — Waldighoffen
        </p>
      </section>

      <section className="py-10 px-4 bg-white">
        <div className="max-w-2xl mx-auto flex flex-col gap-10">
          {/* Wifi */}
          <div className="flex flex-col gap-3 p-6 rounded-xl bg-tulipe-cream border border-tulipe-beige">
            <h2 className="font-heading text-xl text-tulipe-royal flex items-center gap-2">
              <span>📶</span> Connexion Wifi
            </h2>
            <div className="font-body text-sm text-gray-700 flex flex-col gap-1.5">
              <p>
                <strong>Réseau :</strong>{" "}
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                  TulipesEtCetera_WiFi
                </span>
              </p>
              <p>
                <strong>Mot de passe :</strong>{" "}
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                  [à compléter]
                </span>
              </p>
            </div>
          </div>

          {/* Équipements */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl text-tulipe-royal flex items-center gap-2">
              <span>🏠</span> Équipements
            </h2>
            <ul className="font-body text-sm text-gray-700 flex flex-col gap-2">
              {[
                "Cuisine équipée : plaques, four, micro-ondes, réfrigérateur, cafetière",
                "Machine à laver (lessive fournie)",
                "TV connectée (Netflix, YouTube…) — télécommande sur le meuble",
                "Poêle à bois — bûches disponibles dans le cellier",
                "Baignoire balnéo — mode d'emploi affiché dans la salle de bains",
                "Vélos disponibles dans le garage — casques inclus",
                "Chargeur voiture électrique — prise type 2 côté jardin",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-tulipe-green mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Poubelles / tri */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl text-tulipe-royal flex items-center gap-2">
              <span>♻️</span> Tri des déchets
            </h2>
            <ul className="font-body text-sm text-gray-700 flex flex-col gap-1.5">
              <li>
                <strong className="text-yellow-600">Jaune</strong> — Emballages,
                cartons, plastiques, métal
              </li>
              <li>
                <strong className="text-green-600">Vert</strong> — Verre (bacs
                devant le portail)
              </li>
              <li>
                <strong className="text-gray-600">Gris</strong> — Ordures
                ménagères non recyclables
              </li>
              <li className="text-gray-500 mt-1">
                Collecte : mardi matin — bacs à sortir la veille au soir
              </li>
            </ul>
          </div>

          {/* Numéros d'urgence */}
          <div className="flex flex-col gap-3 p-6 rounded-xl bg-red-50 border border-red-100">
            <h2 className="font-heading text-xl text-red-700 flex items-center gap-2">
              <span>🚨</span> Numéros d&apos;urgence
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "SAMU", number: "15" },
                { label: "Police", number: "17" },
                { label: "Pompiers", number: "18" },
                { label: "Urgences européen", number: "112" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={`tel:${item.number}`}
                  className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-red-100 hover:bg-red-50 transition-colors"
                >
                  <span className="font-body font-semibold text-gray-700 text-sm">
                    {item.label}
                  </span>
                  <span className="font-mono font-bold text-red-600 text-lg">
                    {item.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Restaurants recommandés */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl text-tulipe-royal flex items-center gap-2">
              <span>🍽️</span> Restaurants recommandés
            </h2>
            <ul className="font-body text-sm text-gray-700 flex flex-col gap-2">
              {[
                "À la Carpe Frite — Sierentz (spécialité carpe frite, 10 min)",
                "Auberge du Sundgau — Ferrette (cuisine alsacienne traditionnelle, 15 min)",
                "Restaurant de la Couronne — Altkirch (brasserie, 12 min)",
              ].map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="text-tulipe-gold shrink-0">★</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Activités */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl text-tulipe-royal flex items-center gap-2">
              <span>🗺️</span> Activités à proximité
            </h2>
            <ul className="font-body text-sm text-gray-700 flex flex-col gap-2">
              {[
                "Ferrette & château — village médiéval (15 min à vélo)",
                "Parc Animalier de Landskron — Huningue (25 min en voiture)",
                "Bâle (Suisse) — musées, shopping, vieille ville (20 min en voiture)",
                "Sentier des étangs du Sundgau — départ à 500m de la maison",
                "Route des Vins d'Alsace — Guebwiller (30 min en voiture)",
              ].map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="text-tulipe-green shrink-0">→</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact hôtes */}
          <div className="flex flex-col gap-2 p-6 rounded-xl bg-tulipe-cream border border-tulipe-beige text-center">
            <p className="font-heading text-lg text-tulipe-royal">
              Une question ? Besoin d&apos;aide ?
            </p>
            <a
              href="tel:+33389400290"
              className="font-body font-semibold text-tulipe-green text-lg hover:underline"
            >
              +33 3 89 40 02 90
            </a>
            <p className="font-body text-xs text-gray-400">
              Nous sommes disponibles de 8h à 21h
            </p>
          </div>

          {/* QR Code — à imprimer */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-tulipe-cream border border-tulipe-beige text-center items-center">
            <h2 className="font-heading text-xl text-tulipe-royal flex items-center gap-2">
              <span>📲</span> Accès rapide au livret
            </h2>
            <p className="font-body text-sm text-gray-500">
              Scannez ce QR code pour accéder au livret depuis votre smartphone
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/qrcode?url=${encodeURIComponent(LIVRET_URL)}&size=220`}
              alt="QR code vers le livret d'accueil"
              width={220}
              height={220}
              className="rounded-lg border border-tulipe-beige shadow-sm"
            />
            <p className="font-body text-xs text-gray-400">
              tulipes-et-cetera.fr/fr/livret
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
