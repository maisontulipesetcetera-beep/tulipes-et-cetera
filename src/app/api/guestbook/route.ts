import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const CreateSchema = z.object({
  author: z.string().min(1).max(100),
  message: z.string().min(1).max(1000),
  photoUrl: z.string().url().optional(),
});

export async function GET() {
  try {
    const entries = await db.guestbookEntry.findMany({
      where: { visible: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(entries);
  } catch (err) {
    console.error("[GET /api/guestbook]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const entry = await db.guestbookEntry.create({
      data: {
        author: parsed.data.author,
        message: parsed.data.message,
        photoUrl: parsed.data.photoUrl,
        visible: false,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error("[POST /api/guestbook]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
