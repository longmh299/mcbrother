// app/api/product-suggest/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = String(searchParams.get('q') || '').trim();
    const categoryId = searchParams.get('categoryId') || undefined;

    if (!q || q.length < 2) return NextResponse.json({ items: [] });

    const where: any = {
      published: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ],
    };
    if (categoryId) where.categoryId = Number(categoryId);

    const items = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { name: true, slug: true },
    });

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json({ items: [], error: e?.message }, { status: 200 });
  }
}
