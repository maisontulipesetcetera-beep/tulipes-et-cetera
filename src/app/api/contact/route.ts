import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  // honeypot
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);

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

    const contact = await db.contact.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        status: "unread",
      },
    });

    // Notify owner
    const settings = await db.settings.findUnique({ where: { id: "main" } });
    const ownerEmail = settings?.email;
    if (ownerEmail) {
      await sendEmail({
        to: ownerEmail,
        subject: `Nouveau message de ${data.name} — Tulipes EtCetera`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${data.name}</p>
          <p><strong>Email :</strong> ${data.email}</p>
          <p><strong>Message :</strong></p>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
        `,
      }).catch(console.error);
    }

    return NextResponse.json(
      { success: true, id: contact.id },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
