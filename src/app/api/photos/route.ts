import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { put, del } from "@vercel/blob";

const DeleteSchema = z.object({
  id: z.string(),
  url: z.string().url(),
});

const ReorderSchema = z.object({
  id: z.string(),
  sortOrder: z.number().int().min(0),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");

    const photos = await db.photo.findMany({
      where: page ? { page } : {},
      orderBy: [{ page: "asc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json(photos);
  } catch (err) {
    console.error("[GET /api/photos]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const page = formData.get("page") as string | null;
    const alt = formData.get("alt") as string | null;

    if (!file || !page) {
      return NextResponse.json(
        { error: "Fichier et page requis" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 },
      );
    }

    const filename = `photos/${page}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const blob = await put(filename, file, { access: "public" });

    // Get max sortOrder for this page
    const maxOrder = await db.photo.aggregate({
      where: { page },
      _max: { sortOrder: true },
    });
    const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

    const photo = await db.photo.create({
      data: {
        url: blob.url,
        alt: alt ?? undefined,
        page,
        sortOrder,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (err) {
    console.error("[POST /api/photos]", err);
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

    await del(parsed.data.url);
    await db.photo.delete({ where: { id: parsed.data.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/photos]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ReorderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const photo = await db.photo.update({
      where: { id: parsed.data.id },
      data: { sortOrder: parsed.data.sortOrder },
    });

    return NextResponse.json(photo);
  } catch (err) {
    console.error("[PATCH /api/photos]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
