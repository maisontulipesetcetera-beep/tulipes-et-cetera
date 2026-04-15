import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get("month"); // e.g. "2026-04"

    let startOfMonth: Date;
    let endOfMonth: Date;

    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [year, month] = monthParam.split("-").map(Number);
      startOfMonth = new Date(year, month - 1, 1);
      endOfMonth = new Date(year, month, 0, 23, 59, 59);
    } else {
      const now = new Date();
      startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
      );
    }

    const [reservations, blockedDates] = await Promise.all([
      db.reservation.findMany({
        where: {
          status: { not: "cancelled" },
          OR: [
            { checkIn: { lte: endOfMonth }, checkOut: { gte: startOfMonth } },
          ],
        },
        select: {
          id: true,
          guestName: true,
          checkIn: true,
          checkOut: true,
          source: true,
          status: true,
        },
        orderBy: { checkIn: "asc" },
      }),
      db.blockedDate.findMany({
        where: {
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        orderBy: { date: "asc" },
      }),
    ]);

    return NextResponse.json({ reservations, blockedDates });
  } catch (err) {
    console.error("[GET /api/reservations/calendar]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
