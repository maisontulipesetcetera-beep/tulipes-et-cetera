import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const blockedDates = await db.blockedDate.findMany({
      orderBy: { date: "asc" },
    });

    return NextResponse.json(blockedDates);
  } catch (err) {
    console.error("[GET /api/blocked-dates]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const BlockSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = BlockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { startDate, endDate, reason } = parsed.data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return NextResponse.json(
        { error: "La date de fin doit être après la date de début" },
        { status: 400 },
      );
    }

    // Create one BlockedDate entry per day in the range
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    const created = await db.$transaction(
      dates.map((date) =>
        db.blockedDate.create({
          data: {
            date,
            reason: reason ?? null,
          },
        }),
      ),
    );

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("[POST /api/blocked-dates]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id requis" }, { status: 400 });
    }

    await db.blockedDate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/blocked-dates]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
