"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, MessageSquare, Settings } from "lucide-react";

const mobileNavItems = [
  { icon: Home, label: "Accueil", href: "/admin" },
  { icon: CalendarDays, label: "Réservations", href: "/admin/reservations" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: Settings, label: "Réglages", href: "/admin/parametres" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex items-stretch justify-around">
      {mobileNavItems.map(({ icon: Icon, label, href }) => {
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
            <Icon
              size={22}
              className={active ? "text-tulipe-green" : "text-gray-400"}
              strokeWidth={active ? 2.5 : 2}
            />
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
