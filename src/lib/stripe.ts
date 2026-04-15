import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia" as any,
    })
  : null;

export async function createCheckoutSession(reservation: {
  id: string;
  guestEmail: string;
  totalAmount: number;
}) {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: reservation.guestEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Règlement séjour — Tulipes Et Cetera",
            description: "Règlement intégral du séjour — Cottage de Charme",
          },
          unit_amount: reservation.totalAmount,
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
