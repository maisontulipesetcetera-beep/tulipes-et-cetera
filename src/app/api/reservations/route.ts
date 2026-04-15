import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ReservationSchema = z.object({
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  guests: z.number().int().min(1).max(20),
  message: z.string().optional(),
  // honeypot
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ReservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Honeypot check
    if (data.website) {
      return NextResponse.json({ success: true });
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: "La date de départ doit être après la date d'arrivée" },
        { status: 400 },
      );
    }

    // Check for conflicting reservations
    const conflict = await db.reservation.findFirst({
      where: {
        status: { in: ["pending", "confirmed", "in_progress"] },
        OR: [{ checkIn: { lt: checkOut }, checkOut: { gt: checkIn } }],
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Ces dates ne sont pas disponibles" },
        { status: 409 },
      );
    }

    // Get settings for pricing
    const settings = await db.settings.findUnique({ where: { id: "main" } });
    const basePrice = settings?.basePrice ?? 17900;
    const depositPercent = settings?.depositPercent ?? 30;

    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalAmount = basePrice * nights;
    const depositAmount = Math.round((totalAmount * depositPercent) / 100);

    const reservation = await db.reservation.create({
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        checkIn,
        checkOut,
        guests: data.guests,
        message: data.message,
        status: "pending",
        source: "direct",
        totalAmount,
        depositAmount,
      },
    });

    // Notify owner
    const ownerEmail = settings?.email;
    if (ownerEmail) {
      await sendEmail({
        to: ownerEmail,
        subject: `Nouvelle demande de réservation — ${data.guestName}`,
        html: `
          <h2>Nouvelle demande de réservation</h2>
          <p><strong>Nom :</strong> ${data.guestName}</p>
          <p><strong>Email :</strong> ${data.guestEmail}</p>
          <p><strong>Téléphone :</strong> ${data.guestPhone ?? "—"}</p>
          <p><strong>Arrivée :</strong> ${checkIn.toLocaleDateString("fr-FR")}</p>
          <p><strong>Départ :</strong> ${checkOut.toLocaleDateString("fr-FR")}</p>
          <p><strong>Voyageurs :</strong> ${data.guests}</p>
          <p><strong>Message :</strong> ${data.message ?? "—"}</p>
          <p><strong>Montant total :</strong> ${(totalAmount / 100).toFixed(2)} €</p>
          <p><strong>Acompte :</strong> ${(depositAmount / 100).toFixed(2)} €</p>
        `,
      }).catch(console.error);
    }

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    console.error("[POST /api/reservations]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const reservations = await db.reservation.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reservations);
  } catch (err) {
    console.error("[GET /api/reservations]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
