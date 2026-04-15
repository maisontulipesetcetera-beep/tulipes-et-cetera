"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileNavItems = [
  { emoji: "🏠", label: "Accueil", href: "/admin" },
  { emoji: "📋", label: "Réservations", href: "/admin/reservations" },
  { emoji: "📅", label: "Calendrier", href: "/admin/calendrier" },
  { emoji: "💬", label: "Messages", href: "/admin/messages" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex items-stretch justify-around">
      {mobileNavItems.map(({ emoji, label, href }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-3 transition-colors ${
              active
                ? "text-tulipe-green bg-tulipe-green/10"
                : "text-gray-500 hover:text-tulipe-green"
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span
              className={`text-xs font-semibold ${active ? "text-tulipe-green" : "text-gray-500"}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
