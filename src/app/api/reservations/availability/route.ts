import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const reservations = await db.reservation.findMany({
      where: {
        status: { in: ["pending", "confirmed", "in_progress"] },
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
      orderBy: { checkIn: "asc" },
    });

    return NextResponse.json(reservations);
  } catch (err) {
    console.error("[GET /api/reservations/availability]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
