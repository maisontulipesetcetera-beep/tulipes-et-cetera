"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  ClipboardList,
  DollarSign,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Accueil", href: "/admin" },
  { icon: ClipboardList, label: "Réservations", href: "/admin/reservations" },
  { icon: CalendarDays, label: "Calendrier", href: "/admin/calendrier" },
  { icon: DollarSign, label: "Finances", href: "/admin/finances" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages" },
  { icon: FileText, label: "Contenu", href: "/admin/contenu" },
  { icon: BarChart3, label: "Statistiques", href: "/admin/statistiques" },
  { icon: Settings, label: "Paramètres", href: "/admin/parametres" },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <Image
          src="/images/logo.jpg"
          alt="Tulipes Et Cetera"
          width={40}
          height={40}
          className="rounded-full object-cover shrink-0"
        />
        <div className="leading-tight">
          <p className="font-heading text-sm font-semibold text-tulipe-bordeaux">
            Tulipes
          </p>
          <p className="font-heading text-xs text-tulipe-gold">et Cetera</p>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="ml-auto lg:hidden p-1 rounded text-gray-400 hover:text-gray-600"
          aria-label="Fermer le menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-tulipe-green/10 text-tulipe-green"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                size={18}
                className={active ? "text-tulipe-green" : "text-gray-400"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">Administration v1.0</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[250px] shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="fixed top-0 left-0 h-full w-[250px] bg-white z-50 flex flex-col shadow-xl lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
