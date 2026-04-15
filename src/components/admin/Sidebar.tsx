"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { emoji: "🏠", label: "Accueil", href: "/admin" },
  { emoji: "📋", label: "Réservations", href: "/admin/reservations" },
  { emoji: "📅", label: "Calendrier", href: "/admin/calendrier" },
  { emoji: "💬", label: "Messages", href: "/admin/messages" },
  { emoji: "📝", label: "Mon site", href: "/admin/contenu" },
  { emoji: "⚙️", label: "Réglages", href: "/admin/parametres" },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-sm rounded-2xl m-3 shadow-md overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-6 border-b border-gray-100">
        <Image
          src="/images/logo.jpg"
          alt="Tulipes Et Cetera"
          width={52}
          height={52}
          className="rounded-full object-cover shrink-0 shadow-sm"
        />
        <div className="leading-tight">
          <p className="font-heading text-xl font-bold text-tulipe-bordeaux">
            Tulipes
          </p>
          <p className="font-heading text-base text-tulipe-gold">et Cetera</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
        {navItems.map(({ emoji, label, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl text-lg font-semibold transition-all ${
                active
                  ? "bg-tulipe-green/15 text-tulipe-green border-l-4 border-tulipe-green"
                  : "text-gray-700 hover:bg-tulipe-beige hover:text-gray-900 border-l-4 border-transparent"
              }`}
            >
              <span className="text-2xl">{emoji}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pied de sidebar */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-sm text-gray-400 text-center">
          Espace administration
        </p>
      </div>
    </div>
  );
}
