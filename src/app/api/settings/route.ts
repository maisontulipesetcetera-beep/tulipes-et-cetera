import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const PutSchema = z.object({
  propertyName: z.string().min(1).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  basePrice: z.number().int().min(0).optional(), // cents
  highSeasonPrice: z.number().int().min(0).nullable().optional(),
  weekendPrice: z.number().int().min(0).nullable().optional(),
  depositPercent: z.number().int().min(0).max(100).optional(),
  cancellationPolicy: z.string().nullable().optional(),
  bookingIcalUrl: z.string().nullable().optional(),
  airbnbIcalUrl: z.string().nullable().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const settings = await db.settings.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = PutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const settings = await db.settings.upsert({
      where: { id: "main" },
      update: parsed.data,
      create: { id: "main", ...parsed.data },
    });

    return NextResponse.json(settings);
  } catch (err) {
    console.error("[PUT /api/settings]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
