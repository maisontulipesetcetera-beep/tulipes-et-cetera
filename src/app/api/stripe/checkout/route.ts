import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createCheckoutSession } from "@/lib/stripe";

const CheckoutSchema = z.object({
  reservationId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "reservationId requis" },
        { status: 400 },
      );
    }

    const reservation = await db.reservation.findUnique({
      where: { id: parsed.data.reservationId },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 },
      );
    }

    if (!reservation.totalAmount) {
      return NextResponse.json(
        { error: "Montant du séjour manquant" },
        { status: 400 },
      );
    }

    const session = await createCheckoutSession({
      id: reservation.id,
      guestEmail: reservation.guestEmail,
      totalAmount: reservation.totalAmount,
    });

    if (!session?.url) {
      console.error("[POST /api/stripe/checkout] No session URL returned");
      return NextResponse.json(
        { error: "Stripe non configuré" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(
      "[POST /api/stripe/checkout] ERROR:",
      err?.message,
      err?.type,
      err?.raw?.message,
    );
    return NextResponse.json(
      { error: "Erreur Stripe: " + (err?.message || "inconnue") },
      { status: 500 },
    );
  }
}
