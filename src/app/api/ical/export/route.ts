import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateIcal } from "@/lib/ical";

export async function GET() {
  try {
    const reservations = await db.reservation.findMany({
      where: {
        status: { in: ["confirmed", "in_progress"] },
      },
      orderBy: { checkIn: "asc" },
    });

    const icalStr = generateIcal(
      reservations.map((r) => ({
        id: r.id,
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        guestName: r.guestName,
      })),
    );

    return new NextResponse(icalStr, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="tulipes-et-cetera.ics"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[GET /api/ical/export]", err);
    return NextResponse.json({ error: "Erreur export iCal" }, { status: 500 });
  }
}
