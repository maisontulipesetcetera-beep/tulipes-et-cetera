export default function MentionsLegalesPage() {
  return (
    <>
      <section className="bg-tulipe-bordeaux py-16 px-4 text-center">
        <h1 className="font-heading text-4xl md:text-5xl text-white mb-4">
          Mentions légales
        </h1>
      </section>

      <section className="py-16 px-4 bg-tulipe-cream">
        <div className="max-w-3xl mx-auto flex flex-col gap-10 font-body text-gray-700">
          {/* Éditeur */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-bordeaux">
              Éditeur du site
            </h2>
            <p className="leading-relaxed">
              <strong>Tulipes EtCetera</strong>
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
            <h2 className="font-heading text-2xl text-tulipe-bordeaux">
              Hébergeur
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
                className="text-tulipe-green hover:underline"
              >
                https://vercel.com
              </a>
            </p>
          </div>

          {/* Propriété intellectuelle */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-bordeaux">
              Propriété intellectuelle
            </h2>
            <p className="leading-relaxed">
              L&apos;ensemble du contenu de ce site (textes, images,
              photographies, illustrations) est la propriété exclusive de
              Tulipes EtCetera, sauf mention contraire. Toute reproduction,
              représentation ou diffusion, en tout ou partie, est interdite sans
              autorisation préalable écrite de l&apos;éditeur.
            </p>
          </div>

          {/* RGPD */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-bordeaux">
              Protection des données personnelles (RGPD)
            </h2>
            <p className="leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données
              (RGPD) et à la loi Informatique et Libertés, vous disposez
              d&apos;un droit d&apos;accès, de rectification, de suppression et
              de portabilité de vos données personnelles.
            </p>
            <p className="leading-relaxed">
              Les données collectées via les formulaires de ce site (nom,
              e-mail, message) sont utilisées uniquement pour répondre à vos
              demandes et ne sont pas transmises à des tiers sans votre
              consentement.
            </p>
            <p className="leading-relaxed">
              Pour exercer vos droits, contactez-nous à :{" "}
              <a
                href="mailto:contact@tulipes-et-cetera.fr"
                className="text-tulipe-green hover:underline"
              >
                contact@tulipes-et-cetera.fr
              </a>
            </p>
          </div>

          {/* Cookies */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-bordeaux">
              Cookies
            </h2>
            <p className="leading-relaxed">
              Ce site utilise des cookies techniques nécessaires à son bon
              fonctionnement (gestion de session, préférences de langue). Aucun
              cookie publicitaire ou de traçage tiers n&apos;est déposé sans
              votre consentement.
            </p>
          </div>

          {/* Politique d'annulation */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-bordeaux">
              Politique d&apos;annulation
            </h2>
            <div className="border-2 border-dashed border-tulipe-beige rounded-xl p-8 bg-white text-center">
              <p className="text-gray-400">
                Politique d&apos;annulation — à compléter lors de
                l&apos;ouverture des réservations
              </p>
            </div>
          </div>

          {/* Responsabilité */}
          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-2xl text-tulipe-bordeaux">
              Limitation de responsabilité
            </h2>
            <p className="leading-relaxed">
              Tulipes EtCetera s&apos;efforce d&apos;assurer l&apos;exactitude
              et la mise à jour des informations diffusées sur ce site, et se
              réserve le droit de corriger le contenu à tout moment sans
              préavis. Tulipes EtCetera décline toute responsabilité pour les
              dommages directs ou indirects pouvant résulter de l&apos;accès au
              site ou de l&apos;utilisation des informations qu&apos;il
              contient.
            </p>
          </div>

          <p className="text-sm text-gray-400 border-t border-tulipe-beige pt-6">
            Dernière mise à jour : avril 2026
          </p>
        </div>
      </section>
    </>
  );
}
