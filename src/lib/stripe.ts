import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function createCheckoutSession(reservation: {
  id: string;
  guestEmail: string;
  totalAmount: number;
}) {
  if (!stripe) {
    console.warn(
      "[stripe] STRIPE_SECRET_KEY not configured, skipping checkout",
    );
    return null;
  }
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
    success_url: "https://tulipes-etcetera.fr/fr/reservation?success=true",
    cancel_url: "https://tulipes-etcetera.fr/fr/reservation?cancelled=true",
    metadata: { reservationId: reservation.id },
  });
}
