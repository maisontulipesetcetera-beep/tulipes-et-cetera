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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    ).getDate();

    const [arrivees, enAttente, reservationsMois] = await Promise.all([
      db.reservation.count({
        where: {
          status: "confirmed",
          checkIn: { gte: today, lt: tomorrow },
        },
      }),
      db.reservation.count({
        where: { status: "pending" },
      }),
      db.reservation.findMany({
        where: {
          status: { in: ["confirmed", "completed", "in_progress"] },
          checkIn: { lt: monthEnd },
          checkOut: { gt: monthStart },
        },
        select: {
          checkIn: true,
          checkOut: true,
          totalAmount: true,
          status: true,
        },
      }),
    ]);

    // Taux d'occupation
    let joursReserves = 0;
    for (const r of reservationsMois) {
      const debut = r.checkIn < monthStart ? monthStart : r.checkIn;
      const fin = r.checkOut > monthEnd ? monthEnd : r.checkOut;
      const jours = Math.max(
        0,
        Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)),
      );
      joursReserves += jours;
    }
    const tauxOccupation = Math.min(
      100,
      Math.round((joursReserves / daysInMonth) * 100),
    );

    // CA du mois (confirmed + completed)
    const caMois = reservationsMois
      .filter((r) => ["confirmed", "completed"].includes(r.status))
      .reduce((s, r) => s + (r.totalAmount ?? 0), 0);

    return NextResponse.json({
      arrivees,
      enAttente,
      tauxOccupation,
      caMois, // en centimes
    });
  } catch (err) {
    console.error("[GET /api/stats]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
