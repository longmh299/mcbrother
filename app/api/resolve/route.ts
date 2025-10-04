// app/api/resolve/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/resolve?entity=product|post|category|postCategory&slug=...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const entity = String(searchParams.get('entity') || '');
    const slug = String(searchParams.get('slug') || '');

    if (!entity || !slug) {
      return NextResponse.json({ ok: false, error: 'Missing entity/slug' }, { status: 400 });
    }

    const map = {
      product: prisma.product,
      post: prisma.post,
      category: prisma.category,
      postCategory: prisma.postCategory,
    } as const;
    const model = (map as any)[entity];
    if (!model) return NextResponse.json({ ok: false, error: 'Invalid entity' }, { status: 400 });

    const exists = await model.findFirst({ where: { slug }, select: { slug: true } });
    if (exists) return NextResponse.json({ ok: true, entity, slug });

    const red = await prisma.slugRedirect.findUnique({ where: { fromSlug: slug } });
    if (red && red.entityType === entity) {
      return NextResponse.json({ ok: true, entity, slug: red.toSlug, redirected: true });
    }

    return NextResponse.json({ ok: false, notFound: true }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Error' }, { status: 500 });
  }
}
