import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint — no auth required — returns base price only
export async function GET() {
  try {
    const settings = await db.settings.findUnique({ where: { id: "main" } });
    const basePrice = settings?.basePrice ?? 17900; // default 179€ in cents
    return NextResponse.json({ basePrice });
  } catch {
    // Fallback if DB unavailable
    return NextResponse.json({ basePrice: 17900 });
  }
}
