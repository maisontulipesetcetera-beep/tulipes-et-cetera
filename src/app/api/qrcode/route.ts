import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const size = parseInt(searchParams.get("size") ?? "300", 10);

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  const clampedSize = Math.min(Math.max(size, 64), 1024);

  try {
    const buffer = await QRCode.toBuffer(url, {
      type: "png",
      width: clampedSize,
      margin: 2,
      color: {
        dark: "#5c1a1a", // tulipe-bordeaux
        light: "#fffdf7",
      },
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 },
    );
  }
}
