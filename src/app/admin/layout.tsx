"use client";

import Sidebar from "@/components/admin/Sidebar";
import { LogOut } from "lucide-react";
import dynamic from "next/dynamic";

const MobileBottomNavClient = dynamic(
  () => import("@/components/admin/MobileBottomNav"),
  { ssr: false },
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FAF8F5] to-[#FFF8F0]">
      <div className="flex min-h-screen">
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex flex-col w-[280px] shrink-0 h-screen sticky top-0">
          <Sidebar />
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
          {/* TopBar desktop */}
          <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="font-heading text-xl font-bold text-tulipe-bordeaux">
                Mon espace
              </span>
            </div>
            <a
              href="/api/auth/signout"
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-base font-semibold rounded-xl transition-colors"
            >
              <LogOut size={18} strokeWidth={2} />
              Se déconnecter
            </a>
          </header>

          {/* TopBar mobile */}
          <header className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 shadow-sm">
            <span className="font-heading text-lg font-bold text-tulipe-bordeaux">
              Mon espace
            </span>
            <a
              href="/api/auth/signout"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl"
            >
              <LogOut size={16} strokeWidth={2} />
              Sortir
            </a>
          </header>

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-lg">
        <MobileBottomNavClient />
      </nav>
    </div>
  );
}
