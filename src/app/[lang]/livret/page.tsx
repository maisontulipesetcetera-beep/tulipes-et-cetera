import { getTranslations } from "next-intl/server";

const LIVRET_URL = "https://tulipes-et-cetera.fr/fr/livret";

export default async function LivretPage() {
  const t = await getTranslations("livret");

  const equipements = [
    t("eq1"),
    t("eq2"),
    t("eq3"),
    t("eq4"),
    t("eq5"),
    t("eq6"),
    t("eq7"),
  ];

  const restaurants = [t("r1"), t("r2"), t("r3")];

  const activites = [t("a1"), t("a2"), t("a3"), t("a4"), t("a5")];

  const urgences = [
    { label: t("emergency_samu"), number: "15" },
    { label: t("emergency_police"), number: "17" },
    { label: t("emergency_pompiers"), number: "18" },
    { label: t("emergency_eu"), number: "112" },
  ];

  return (
    <>
      {/* Header sobre */}
      <section className="bg-tulipe-cream py-12 px-4 text-center border-b border-tulipe-beige">
        <h1 className="font-heading text-3xl md:text-4xl text-tulipe-blue mb-2">
          {t("page_title")}
        </h1>
        <p className="font-body text-gray-500 text-sm">
          <span style={{ fontFamily: "var(--font-script)" }}>
            Tulipes Et Cetera
          </span>{" "}
          — Waldighoffen
        </p>
      </section>

      <section className="py-10 px-4 bg-white">
        <div className="max-w-2xl mx-auto flex flex-col gap-10">
          {/* Wifi */}
          <div className="flex flex-col gap-3 p-6 rounded-xl bg-tulipe-cream border border-tulipe-beige">
            <h2 className="font-heading text-xl text-tulipe-blue flex items-center gap-2">
              <span>📶</span> {t("wifi_title")}
            </h2>
            <div className="font-body text-sm text-gray-700 flex flex-col gap-1.5">
              <p>
                <strong>{t("wifi_network")} :</strong>{" "}
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                  TulipesEtCetera_WiFi
                </span>
              </p>
              <p>
                <strong>{t("wifi_password")} :</strong>{" "}
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                  [à compléter]
                </span>
              </p>
            </div>
          </div>

          {/* Séparateur */}
          <p className="text-center text-tulipe-gold text-xl select-none">🌷</p>

          {/* Équipements */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl text-tulipe-blue flex items-center gap-2">
              <span>🏠</span> {t("equipment_title")}
            </h2>
            <ul className="font-body text-sm text-gray-700 flex flex-col gap-2">
              {equipements.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-tulipe-forest mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Poubelles / tri */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl text-tulipe-blue flex items-center gap-2">
              <span>♻️</span> {t("waste_title")}
            </h2>
            <ul className="font-body text-sm text-gray-700 flex flex-col gap-1.5">
              <li>
                <strong className="text-yellow-600">{t("waste_yellow")}</strong>{" "}
                — {t("waste_yellow_desc")}
              </li>
              <li>
                <strong className="text-green-600">{t("waste_green")}</strong> —{" "}
                {t("waste_green_desc")}
              </li>
              <li>
                <strong className="text-gray-600">{t("waste_grey")}</strong> —{" "}
                {t("waste_grey_desc")}
              </li>
              <li className="text-gray-500 mt-1">{t("waste_collection")}</li>
            </ul>
          </div>

          {/* Séparateur */}
          <p className="text-center text-tulipe-gold text-xl select-none">🌷</p>

          {/* Numéros d'urgence */}
          <div className="flex flex-col gap-3 p-6 rounded-xl bg-red-50 border border-red-100">
            <h2 className="font-heading text-xl text-red-700 flex items-center gap-2">
              <span>🚨</span> {t("emergency_title")}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {urgences.map((item) => (
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
            <h2 className="font-heading text-xl text-tulipe-blue flex items-center gap-2">
              <span>🍽️</span> {t("restaurants_title")}
            </h2>
            <ul className="font-body text-sm text-gray-700 flex flex-col gap-2">
              {restaurants.map((r) => (
                <li key={r} className="flex items-start gap-2">
                  <span className="text-tulipe-gold shrink-0">★</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Activités */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-xl text-tulipe-blue flex items-center gap-2">
              <span>🗺️</span> {t("activities_title")}
            </h2>
            <ul className="font-body text-sm text-gray-700 flex flex-col gap-2">
              {activites.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="text-tulipe-forest shrink-0">→</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact hôtes */}
          <div className="flex flex-col gap-2 p-6 rounded-xl bg-tulipe-cream border border-tulipe-beige text-center">
            <p className="font-heading text-lg text-tulipe-blue">
              {t("help_title")}
            </p>
            <a
              href="tel:+33389400290"
              className="font-body font-semibold text-tulipe-forest text-lg hover:underline"
            >
              +33 3 89 40 02 90
            </a>
            <p className="font-body text-xs text-gray-400">{t("help_hours")}</p>
          </div>

          {/* QR Code — à imprimer */}
          <div className="flex flex-col gap-4 p-6 rounded-xl bg-tulipe-cream border border-tulipe-beige text-center items-center">
            <h2 className="font-heading text-xl text-tulipe-blue flex items-center gap-2">
              <span>📲</span> {t("qr_title")}
            </h2>
            <p className="font-body text-sm text-gray-500">{t("qr_text")}</p>
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
