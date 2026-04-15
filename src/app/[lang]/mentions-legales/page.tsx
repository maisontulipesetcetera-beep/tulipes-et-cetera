import { getTranslations } from "next-intl/server";

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  await params;
  const t = await getTranslations("mentions");

  return (
    <>
      <section className="bg-tulipe-blue py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          {t("page_title")}
        </h1>
      </section>

      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-3xl mx-auto flex flex-col gap-10 font-body text-gray-700">
          {/* Éditeur */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-blue">
              {t("editor_title")}
            </h2>
            <p className="leading-relaxed">
              <strong style={{ fontFamily: "var(--font-script)" }}>
                Tulipes Et Cetera
              </strong>
              <br />
              Cottage de Charme
              <br />
              2 Rue des Tulipes, 68640 Waldighoffen, France
              <br />
              Téléphone : +33 3 89 40 02 90
              <br />
              E-mail : contact@tulipes-et-cetera.fr
            </p>
          </div>

          {/* Hébergeur */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-blue">
              {t("host_title")}
            </h2>
            <p className="leading-relaxed">
              <strong>Vercel Inc.</strong>
              <br />
              340 Pine Street, Suite 701
              <br />
              San Francisco, CA 94104, États-Unis
              <br />
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tulipe-forest hover:underline"
              >
                https://vercel.com
              </a>
            </p>
          </div>

          {/* Propriété intellectuelle */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-blue">
              {t("ip_title")}
            </h2>
            <p className="leading-relaxed">{t("ip_text")}</p>
          </div>

          {/* RGPD */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-blue">
              {t("rgpd_title")}
            </h2>
            <p className="leading-relaxed">{t("rgpd_text1")}</p>
            <p className="leading-relaxed">{t("rgpd_text2")}</p>
            <p className="leading-relaxed">
              {t("rgpd_text3")}{" "}
              <a
                href="mailto:contact@tulipes-et-cetera.fr"
                className="text-tulipe-forest hover:underline"
              >
                contact@tulipes-et-cetera.fr
              </a>
            </p>
          </div>

          {/* Cookies */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-blue">
              {t("cookies_title")}
            </h2>
            <p className="leading-relaxed">{t("cookies_text")}</p>
          </div>

          {/* Politique d'annulation */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-blue">
              {t("cancel_title")}
            </h2>
            <div className="border-2 border-dashed border-tulipe-beige rounded-xl p-8 bg-white text-center">
              <p className="text-gray-400">{t("cancel_placeholder")}</p>
            </div>
          </div>

          {/* Responsabilité */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-blue">
              {t("liability_title")}
            </h2>
            <p className="leading-relaxed">{t("liability_text")}</p>
          </div>

          <p className="text-sm text-gray-400 border-t border-tulipe-beige pt-6">
            {t("last_update")}
          </p>
        </div>
      </section>
    </>
  );
}
