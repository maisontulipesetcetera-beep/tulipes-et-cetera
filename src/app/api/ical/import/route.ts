import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchIcalEvents } from "@/lib/ical";

export async function GET() {
  try {
    const settings = await db.settings.findUnique({ where: { id: "main" } });

    const jobs: Promise<void>[] = [];

    if (settings?.bookingIcalUrl) {
      jobs.push(
        fetchIcalEvents(settings.bookingIcalUrl, "booking").then(
          async (events) => {
            for (const ev of events) {
              await db.reservation.upsert({
                where: {
                  // Use a stable UID derived from source + start date
                  // We store it in notes for now since there is no uid field
                  // Instead we findFirst + create pattern
                  id: `booking-${ev.start.getTime()}`,
                },
                update: {
                  checkIn: ev.start,
                  checkOut: ev.end,
                  guestName: ev.summary,
                  status: "confirmed",
                },
                create: {
                  id: `booking-${ev.start.getTime()}`,
                  guestName: ev.summary,
                  guestEmail: "booking@external",
                  checkIn: ev.start,
                  checkOut: ev.end,
                  source: "booking",
                  status: "confirmed",
                },
              });
            }
          },
        ),
      );
    }

    if (settings?.airbnbIcalUrl) {
      jobs.push(
        fetchIcalEvents(settings.airbnbIcalUrl, "airbnb").then(
          async (events) => {
            for (const ev of events) {
              await db.reservation.upsert({
                where: {
                  id: `airbnb-${ev.start.getTime()}`,
                },
                update: {
                  checkIn: ev.start,
                  checkOut: ev.end,
                  guestName: ev.summary,
                  status: "confirmed",
                },
                create: {
                  id: `airbnb-${ev.start.getTime()}`,
                  guestName: ev.summary,
                  guestEmail: "airbnb@external",
                  checkIn: ev.start,
                  checkOut: ev.end,
                  source: "airbnb",
                  status: "confirmed",
                },
              });
            }
          },
        ),
      );
    }

    await Promise.all(jobs);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[GET /api/ical/import]", err);
    return NextResponse.json({ error: "Erreur import iCal" }, { status: 500 });
  }
}
