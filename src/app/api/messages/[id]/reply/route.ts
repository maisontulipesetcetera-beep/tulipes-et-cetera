import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

const ReplySchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
});

export async function POST(
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
    const parsed = ReplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const contact = await db.contact.findUnique({ where: { id } });
    if (!contact) {
      return NextResponse.json(
        { error: "Message introuvable" },
        { status: 404 },
      );
    }

    await sendEmail({
      to: contact.email,
      subject: parsed.data.subject,
      html: parsed.data.body.replace(/\n/g, "<br>"),
    });

    const updated = await db.contact.update({
      where: { id },
      data: {
        status: "replied",
        reply: parsed.data.body,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[POST /api/messages/[id]/reply]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
