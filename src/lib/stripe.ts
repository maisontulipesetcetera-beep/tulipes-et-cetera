import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia" as any,
});

export async function createCheckoutSession(reservation: {
  id: string;
  guestEmail: string;
  depositAmount: number;
}) {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: reservation.guestEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Acompte — Tulipes EtCetera",
            description: "Acompte de réservation — Cottage de Charme",
          },
          unit_amount: reservation.depositAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/fr/tarifs?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/fr/tarifs?cancelled=true`,
    metadata: { reservationId: reservation.id },
  });
}
