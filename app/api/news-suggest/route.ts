// app/api/news-suggest/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = String(searchParams.get("q") || "").trim();
    const categoryIdRaw = searchParams.get("categoryId");

    if (!q || q.length < 2) {
      const res = NextResponse.json({ items: [] });
      res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
      return res;
    }

    const categoryId =
      categoryIdRaw === null || categoryIdRaw === "" ? undefined : Number(categoryIdRaw);

    const where: any = {
      published: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
      ],
    };
    if (categoryId !== undefined && Number.isFinite(categoryId)) {
      where.categoryId = categoryId;
    }

    const items = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { title: true, slug: true },
    });

    const res = NextResponse.json({ items });
    res.headers.set("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    return res;
  } catch (e: any) {
    return NextResponse.json(
      { items: [], error: e?.message ?? "Internal error" },
      { status: 500 },
    );
  }
}
