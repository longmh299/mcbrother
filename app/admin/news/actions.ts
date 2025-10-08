// app/admin/news/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { slugify } from '@/lib/slug';

/* -------------------- helpers -------------------- */
function asString(v: FormDataEntryValue | null) {
  return (v ?? '').toString().trim();
}
function asBool(v: FormDataEntryValue | null) {
  const s = asString(v).toLowerCase();
  return s === '1' || s === 'true' || s === 'on';
}
function asInt(v: FormDataEntryValue | null) {
  const s = asString(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
function asTags(v: FormDataEntryValue | null): string[] {
  const s = asString(v);
  if (!s) return [];
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}
// ép kiểu id cho where (Int hoặc String tuỳ schema)
function toWhereId(id: string | number) {
  if (typeof id === 'number') return id as any;
  return /^\d+$/.test(id) ? (Number(id) as any) : (id as any);
}

/* -------------------- CREATE -------------------- */
export async function createPost(formData: FormData) {
  const title = asString(formData.get('title'));
  if (!title) redirect('/admin/news/new?err=missing_title');

  const slug = asString(formData.get('slug')) || slugify(title);
  const excerpt = asString(formData.get('excerpt')) || null;
  const content = asString(formData.get('content')) || null;

  const coverImage = asString(formData.get('coverImage')) || null;
  const tags = asTags(formData.get('tags'));
  const published = asBool(formData.get('published'));

  // ✅ Prisma cần number | null
  const categoryId = asInt(formData.get('categoryId')); // number | null

  // SEO
  const metaTitle = asString(formData.get('metaTitle')) || null;
  const metaDescription = asString(formData.get('metaDescription')) || null;
  const canonicalUrl = asString(formData.get('canonicalUrl')) || null;
  const ogImage = asString(formData.get('ogImage')) || null;
  const noindex = asBool(formData.get('noindex'));
  const nofollow = asBool(formData.get('nofollow'));

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags,
      published,
      categoryId, // ✅ đúng kiểu
      metaTitle,
      metaDescription,
      canonicalUrl,
      ogImage,
      noindex,
      nofollow,
    },
  });

  revalidatePath('/admin/news');
  redirect('/admin/news?ok=1');
}

/* -------------------- UPDATE (+ slug redirect) -------------------- */
export async function updatePost(id: string | number, formData: FormData) {
  const whereId = toWhereId(id);

  const current = await prisma.post.findUnique({
    where: { id: whereId },
    select: { slug: true },
  });
  if (!current) redirect('/admin/news?err=not_found');

  const title = asString(formData.get('title'));
  const newSlug = asString(formData.get('slug')) || slugify(title);

  const data = {
    slug: newSlug,
    title,
    excerpt: asString(formData.get('excerpt')) || null,
    content: asString(formData.get('content')) || null,
    coverImage: asString(formData.get('coverImage')) || null,
    tags: asTags(formData.get('tags')),
    published: asBool(formData.get('published')),
    categoryId: asInt(formData.get('categoryId')), // ✅ number | null
    metaTitle: asString(formData.get('metaTitle')) || null,
    metaDescription: asString(formData.get('metaDescription')) || null,
    canonicalUrl: asString(formData.get('canonicalUrl')) || null,
    ogImage: asString(formData.get('ogImage')) || null,
    noindex: asBool(formData.get('noindex')),
    nofollow: asBool(formData.get('nofollow')),
  };

  await prisma.$transaction(async (tx) => {
    await tx.post.update({ where: { id: whereId }, data });

    if (current.slug && current.slug !== newSlug) {
      await tx.slugRedirect.upsert({
        where: { fromSlug: current.slug },
        create: { entityType: 'post', fromSlug: current.slug, toSlug: newSlug },
        update: { toSlug: newSlug },
      });
    }
  });

  revalidatePath('/admin/news');
  redirect('/admin/news?ok=1');
}

/* -------------------- DELETE -------------------- */
export async function deletePost(id: string | number) {
  await prisma.post.delete({
    where: { id: toWhereId(id) },
  });
  revalidatePath('/admin/news');
  redirect('/admin/news?ok=1');
}

/* -------------------- BULK publish/unpublish -------------------- */
export async function bulkPostOp(formData: FormData) {
  const op = asString(formData.get('op')) || 'publish'; // 'publish' | 'unpublish'

  const idsStr = formData
    .getAll('ids')
    .map((v) => (typeof v === 'string' ? v : String(v)))
    .map((s) => s.trim())
    .filter(Boolean);

  if (!idsStr.length) return;

  const allNumeric = idsStr.every((s) => /^\d+$/.test(s));
  const idsForPrisma: (number | string)[] = allNumeric
    ? idsStr.map((s) => Number(s))
    : idsStr;

  const BATCH = 200;
  for (let i = 0; i < idsForPrisma.length; i += BATCH) {
    const chunk = idsForPrisma.slice(i, i + BATCH) as any[];
    await prisma.post.updateMany({
      where: { id: { in: chunk } as any },
      data: { published: op === 'publish' },
    });
  }

  revalidatePath('/admin/news');
}
