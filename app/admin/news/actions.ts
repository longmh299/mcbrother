// app/admin/news/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { slugify } from '@/lib/slug';

const toBool = (v: FormDataEntryValue | null) =>
  v === 'on' || v === 'true' || v === '1';

/** Tạo bài viết */
export async function createPost(formData: FormData) {
  const title = String(formData.get('title') || '').trim();
  if (!title) redirect('/admin/news/new?err=missing_title');

  let slug = String(formData.get('slug') || '').trim();
  if (!slug) slug = slugify(title);

  const excerpt = String(formData.get('excerpt') || '').trim() || null;
  const content = String(formData.get('content') || '').trim() || null;

  const coverImage = String(formData.get('coverImage') || '').trim() || null;
  const tagsRaw = String(formData.get('tags') || '').trim();
  const tags = tagsRaw
    ? tagsRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const published = toBool(formData.get('published'));
  const categoryId = String(formData.get('categoryId') || '').trim() || null;

  // SEO
  const metaTitle = String(formData.get('metaTitle') || '').trim() || null;
  const metaDescription = String(formData.get('metaDescription') || '').trim() || null;
  const canonicalUrl = String(formData.get('canonicalUrl') || '').trim() || null;
  const ogImage = String(formData.get('ogImage') || '').trim() || null;
  const noindex = toBool(formData.get('noindex'));
  const nofollow = toBool(formData.get('nofollow'));

  await prisma.post.create({
    data: {
      slug, title, excerpt, content, coverImage, tags, published, categoryId,
      metaTitle, metaDescription, canonicalUrl, ogImage, noindex, nofollow,
    },
  });

  revalidatePath('/admin/news');
  redirect('/admin/news?ok=1');
}

/** Cập nhật + SlugRedirect khi đổi slug */
export async function updatePost(id: string | number, formData: FormData) {
  const current = await prisma.post.findUnique({ where: { id: typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : (id as any) }, select: { slug: true } });
  if (!current) redirect('/admin/news?err=not_found');

  const title = String(formData.get('title') || '').trim();
  const newSlug = (String(formData.get('slug') || '').trim() || slugify(title));

  const data = {
    slug: newSlug,
    title,
    excerpt: String(formData.get('excerpt') || '').trim() || null,
    content: String(formData.get('content') || '').trim() || null,
    coverImage: String(formData.get('coverImage') || '').trim() || null,
    tags: (String(formData.get('tags') || '').trim() || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    published: toBool(formData.get('published')),
    categoryId: String(formData.get('categoryId') || '').trim() || null,
    metaTitle: String(formData.get('metaTitle') || '').trim() || null,
    metaDescription: String(formData.get('metaDescription') || '').trim() || null,
    canonicalUrl: String(formData.get('canonicalUrl') || '').trim() || null,
    ogImage: String(formData.get('ogImage') || '').trim() || null,
    noindex: toBool(formData.get('noindex')),
    nofollow: toBool(formData.get('nofollow')),
  };

  await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id: typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : (id as any) },
      data,
    });
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

/** Xoá bài viết */
export async function deletePost(id: string | number) {
  await prisma.post.delete({
    where: { id: typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : (id as any) },
  });
  revalidatePath('/admin/news');
  redirect('/admin/news?ok=1');
}

/** Bulk publish/unpublish — ép kiểu ID an toàn (Int/String) + batch */
export async function bulkPostOp(formData: FormData) {
  const op = String(formData.get('op') || 'publish'); // 'publish' | 'unpublish'

  // lấy & làm sạch ids từ form
  const idsStr = formData
    .getAll('ids')
    .map((v) => (typeof v === 'string' ? v : String(v)))
    .map((s) => s.trim())
    .filter(Boolean);

  if (!idsStr.length) return;

  // nếu TẤT CẢ là số -> cast sang number[], ngược lại giữ string[]
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
