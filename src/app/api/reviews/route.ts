import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const CreateSchema = z.object({
  author: z.string().min(1),
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  source: z.enum(["direct", "booking", "airbnb", "google"]).default("direct"),
  visible: z.boolean().default(true),
});

const UpdateSchema = z.object({
  id: z.string(),
  author: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  source: z.enum(["direct", "booking", "airbnb", "google"]).optional(),
  visible: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const DeleteSchema = z.object({
  id: z.string(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const reviews = await db.review.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(reviews);
  } catch (err) {
    console.error("[GET /api/reviews]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const maxOrder = await db.review.aggregate({ _max: { sortOrder: true } });
    const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const review = await db.review.create({
      data: { ...parsed.data, sortOrder },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error("[POST /api/reviews]", err);
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
    const parsed = UpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id, ...data } = parsed.data;
    const review = await db.review.update({ where: { id }, data });

    return NextResponse.json(review);
  } catch (err) {
    console.error("[PUT /api/reviews]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = DeleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await db.review.delete({ where: { id: parsed.data.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/reviews]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
