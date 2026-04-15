import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { createCheckoutSession } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const PatchSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "in_progress", "completed", "cancelled"])
    .optional(),
  notes: z.string().optional(),
  depositPaid: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const reservation = await db.reservation.findUnique({ where: { id } });
    if (!reservation) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 },
      );
    }

    return NextResponse.json(reservation);
  } catch (err) {
    console.error("[GET /api/reservations/[id]]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = PatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Fetch current reservation to detect status transition
    const existing = await db.reservation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 },
      );
    }

    const reservation = await db.reservation.update({
      where: { id },
      data: parsed.data,
    });

    // When status transitions to "confirmed", create Stripe checkout and email client
    if (parsed.data.status === "confirmed" && existing.status !== "confirmed") {
      try {
        const session = await createCheckoutSession({
          id: reservation.id,
          guestEmail: reservation.guestEmail,
          totalAmount: reservation.totalAmount ?? 0,
        });

        await sendEmail({
          to: reservation.guestEmail,
          subject: "Votre réservation est confirmée — Tulipes Et Cetera",
          html: `
            <h2>Bonne nouvelle, votre réservation est confirmée !</h2>
            <p>Bonjour ${reservation.guestName},</p>
            <p>Nous avons le plaisir de confirmer votre séjour chez <strong>Tulipes Et Cetera</strong>.</p>
            <p>Pour finaliser votre réservation, veuillez régler votre séjour en cliquant sur le lien ci-dessous :</p>
            <p style="margin: 24px 0;">
              <a href="${session.url}" style="background:#2d6a4f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
                Payer mon séjour
              </a>
            </p>
            <p><strong>Montant du séjour :</strong> ${((reservation.totalAmount ?? 0) / 100).toFixed(2)} €</p>
            <p>Ce lien est sécurisé et vous redirigera vers notre page de paiement Stripe.</p>
            <p>À très bientôt en Alsace !</p>
            <p>— L'équipe Tulipes Et Cetera</p>
          `,
        });
      } catch (emailErr) {
        console.error(
          "[PATCH /api/reservations/[id]] Stripe/email error",
          emailErr,
        );
        // Don't fail the whole request — reservation is already confirmed
      }
    }

    return NextResponse.json(reservation);
  } catch (err) {
    console.error("[PATCH /api/reservations/[id]]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
