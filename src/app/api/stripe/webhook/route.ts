import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export const config = {
  api: { bodyParser: false },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[Stripe webhook] Signature invalide:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const reservationId = session.metadata?.reservationId;

      if (!reservationId) {
        return NextResponse.json(
          { error: "reservationId manquant" },
          { status: 400 },
        );
      }

      const reservation = await db.reservation.update({
        where: { id: reservationId },
        data: {
          depositPaid: true,
          stripeSessionId: session.id,
          status: "confirmed",
        },
      });

      // Send confirmation email to guest
      await sendEmail({
        to: reservation.guestEmail,
        subject: "Confirmation de réservation — Tulipes EtCetera",
        html: `
          <h2>Votre réservation est confirmée !</h2>
          <p>Bonjour ${reservation.guestName},</p>
          <p>Nous avons bien reçu votre acompte. Votre séjour est confirmé.</p>
          <ul>
            <li><strong>Arrivée :</strong> ${reservation.checkIn.toLocaleDateString("fr-FR")}</li>
            <li><strong>Départ :</strong> ${reservation.checkOut.toLocaleDateString("fr-FR")}</li>
            <li><strong>Voyageurs :</strong> ${reservation.guests}</li>
          </ul>
          <p>Nous nous réjouissons de vous accueillir à Tulipes EtCetera !</p>
          <p>À bientôt,<br>L'équipe Tulipes EtCetera</p>
        `,
      }).catch(console.error);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Stripe webhook] Traitement:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
