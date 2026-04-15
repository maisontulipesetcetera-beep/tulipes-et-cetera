"use client";

import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Background: photo fixe + blur overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-facade.jpg')" }}
      />
      <div className="fixed inset-0 z-0 backdrop-blur-xl bg-white/60" />

      {/* Contenu par-dessus le fond */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar desktop — cachée sur mobile */}
        <aside className="hidden lg:flex flex-col w-[280px] shrink-0 h-screen sticky top-0">
          <Sidebar />
        </aside>

        {/* Zone principale */}
        <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
          {/* TopBar desktop */}
          <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-white/50 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌷</span>
              <span className="font-heading text-xl font-bold text-tulipe-bordeaux">
                Mon espace
              </span>
            </div>
            <a
              href="/api/auth/signout"
              className="flex items-center gap-2 px-5 py-3 bg-tulipe-bordeaux text-white text-lg font-semibold rounded-xl hover:bg-tulipe-bordeaux/90 transition-colors shadow-sm"
            >
              🚪 Se déconnecter
            </a>
          </header>

          {/* TopBar mobile */}
          <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white/90 backdrop-blur-sm border-b border-white/50 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌷</span>
              <span className="font-heading text-lg font-bold text-tulipe-bordeaux">
                Mon espace
              </span>
            </div>
            <a
              href="/api/auth/signout"
              className="flex items-center gap-2 px-4 py-2 bg-tulipe-bordeaux text-white text-base font-semibold rounded-xl"
            >
              🚪 Sortir
            </a>
          </header>

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>

      {/* Navigation mobile en bas — bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t-2 border-tulipe-green/20 shadow-lg">
        <MobileBottomNav />
      </nav>
    </div>
  );
}

function MobileBottomNav() {
  // Rendu côté client pour usePathname
  return <MobileBottomNavClient />;
}

// Composant client séparé pour éviter les erreurs SSR
import dynamic from "next/dynamic";

const MobileBottomNavClient = dynamic(
  () => import("@/components/admin/MobileBottomNav"),
  { ssr: false },
);
