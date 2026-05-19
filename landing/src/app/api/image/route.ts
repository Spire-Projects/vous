import { NextRequest, NextResponse } from "next/server";

function isCloudinaryHost(hostname: string): boolean {
  return hostname === "res.cloudinary.com" || hostname.endsWith(".cloudinary.com");
}

const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return new NextResponse("Missing url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (!isCloudinaryHost(parsed.hostname)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), { next: { revalidate: 86400 } });
  if (!upstream.ok) return new NextResponse("Not found", { status: 404 });

  const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
