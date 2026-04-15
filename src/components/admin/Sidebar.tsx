"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  MessageSquare,
  FileEdit,
  Settings,
  BookOpen,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Accueil", href: "/admin" },
  { icon: BookOpen, label: "Réservations", href: "/admin/reservations" },
  { icon: CalendarDays, label: "Calendrier", href: "/admin/calendrier" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: FileEdit, label: "Mon site", href: "/admin/contenu" },
  { icon: Settings, label: "Réglages", href: "/admin/parametres" },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl m-3 shadow-md overflow-hidden border border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-4 px-6 py-6 border-b border-gray-100">
        <Image
          src="/images/logo.jpg"
          alt="Tulipes EtCetera"
          width={52}
          height={52}
          className="rounded-full object-cover shrink-0 shadow-sm"
        />
        <div className="leading-tight">
          <p className="font-heading text-xl font-bold text-tulipe-royal">
            Tulipes
          </p>
          <p className="font-heading text-base text-tulipe-gold">et Cetera</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 py-3.5 px-5 rounded-xl text-base font-medium transition-all ${
                active
                  ? "bg-tulipe-green/10 text-tulipe-green font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                size={22}
                className={active ? "text-tulipe-green" : "text-gray-400"}
                strokeWidth={active ? 2.5 : 2}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Espace administration
        </p>
      </div>
    </div>
  );
}
