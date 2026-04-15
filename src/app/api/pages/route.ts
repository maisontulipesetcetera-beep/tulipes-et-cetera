import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const PutSchema = z.object({
  page: z.string().min(1),
  section: z.string().min(1),
  lang: z.enum(["fr", "de", "en"]),
  content: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const lang = searchParams.get("lang");

    const contents = await db.pageContent.findMany({
      where: {
        ...(page ? { page } : {}),
        ...(lang ? { lang } : {}),
      },
      orderBy: [{ page: "asc" }, { section: "asc" }],
    });

    return NextResponse.json(contents);
  } catch (err) {
    console.error("[GET /api/pages]", err);
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

    const { page, section, lang, content } = parsed.data;

    const result = await db.pageContent.upsert({
      where: { page_section_lang: { page, section, lang } },
      update: { content },
      create: { page, section, lang, content },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[PUT /api/pages]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
