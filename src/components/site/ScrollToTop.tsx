"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut de page"
      className="fixed bottom-6 right-6 z-50 p-3 bg-tulipe-forest text-white rounded-full shadow-lg hover:bg-tulipe-forest-dark hover:scale-110 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-tulipe-gold"
    >
      <ChevronUp size={20} />
    </button>
  );
}
