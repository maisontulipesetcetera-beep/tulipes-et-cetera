"use client";

import { Menu, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/admin": "Accueil",
  "/admin/reservations": "Réservations",
  "/admin/calendrier": "Calendrier",
  "/admin/finances": "Finances",
  "/admin/messages": "Messages",
  "/admin/contenu": "Contenu",
  "/admin/statistiques": "Statistiques",
  "/admin/parametres": "Paramètres",
};

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const pageTitle = pageTitles[pathname] ?? "Administration";

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-gray-800">{pageTitle}</h1>
      </div>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 hidden sm:block">
          {session?.user?.name ?? session?.user?.email ?? "Admin"}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Se déconnecter"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
