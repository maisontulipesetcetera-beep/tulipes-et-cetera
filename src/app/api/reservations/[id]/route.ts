import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
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

    const reservation = await db.reservation.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(reservation);
  } catch (err) {
    console.error("[PATCH /api/reservations/[id]]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
