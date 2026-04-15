import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const reservations = await db.reservation.findMany({
      where: { status: { not: "cancelled" } },
      select: { checkIn: true, source: true, totalAmount: true, status: true },
      orderBy: { checkIn: "asc" },
    });

    // Group by month
    const byMonth: Record<
      string,
      { month: string; count: number; revenue: number }
    > = {};
    for (const r of reservations) {
      const key = r.checkIn.toISOString().slice(0, 7); // "YYYY-MM"
      const label = r.checkIn.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      });
      if (!byMonth[key]) byMonth[key] = { month: label, count: 0, revenue: 0 };
      byMonth[key].count += 1;
      byMonth[key].revenue += r.totalAmount ?? 0;
    }

    // Group by source
    const bySource: Record<string, number> = {};
    for (const r of reservations) {
      bySource[r.source] = (bySource[r.source] ?? 0) + 1;
    }

    const totalReservations = reservations.length;
    const totalRevenue = reservations.reduce(
      (s, r) => s + (r.totalAmount ?? 0),
      0,
    );
    const confirmedCount = reservations.filter((r) =>
      ["confirmed", "in_progress", "completed"].includes(r.status),
    ).length;

    return NextResponse.json({
      byMonth: Object.values(byMonth),
      bySource: Object.entries(bySource).map(([source, count]) => ({
        source,
        count,
      })),
      totalReservations,
      totalRevenue,
      confirmedCount,
    });
  } catch (err) {
    console.error("[GET /api/stats/reservations]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
