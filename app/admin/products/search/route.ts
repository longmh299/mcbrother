// app/admin/products/search/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    const limitRaw = parseInt(searchParams.get("limit") || "10", 10);
    const limit = Math.max(1, Math.min(limitRaw, 50));

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            {
              attributes: {
                some: {
                  OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { value: { contains: q, mode: "insensitive" } },
                  ],
                },
              },
            },
          ],
        }
      : {};

    const items = await prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        published: true,
        coverImage: true,
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Error" }, { status: 500 });
  }
}
