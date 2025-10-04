// app/tin-tuc/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Params = { slug?: string };

function fmtDate(d: Date) {
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

async function getPost(slug: string | undefined) {
  if (!slug) return null; // guard
  return prisma.post.findUnique({
    where: { slug: String(slug) },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

// ----- SEO -----
export async function generateMetadata(
  { params: paramsPromise }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await paramsPromise; // ✅ await params
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;
  const canonical = post.canonicalUrl || undefined;
  const ogImages =
    post.ogImage || post.coverImage ? [String(post.ogImage || post.coverImage)] : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      images: ogImages,
    },
    robots: {
      index: !(post.noindex ?? false),
      follow: !(post.nofollow ?? false),
    },
  };
}

// ----- PAGE -----
export default async function NewsDetailPage(
  { params: paramsPromise }: { params: Promise<Params> }
) {
  const { slug } = await paramsPromise; // ✅ await params
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.createdAt?.toISOString?.() || undefined,
    dateModified: post.updatedAt?.toISOString?.() || undefined,
    description: post.metaDescription || post.excerpt || undefined,
    articleSection: post.category?.name || undefined,
    keywords: (post.tags || []).join(', ') || undefined,
  };

  // liên quan
  const related = await prisma.post.findMany({
    where: post.categoryId
      ? { published: true, categoryId: post.categoryId, id: { not: post.id } }
      : { published: true, id: { not: post.id } },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: {
      id: true,
      slug: true,
      title: true,
      coverImage: true,
      excerpt: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 py-6 lg:py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
        <span className="px-1.5">/</span>
        <Link href="/tin-tuc" className="hover:text-sky-700">Tin tức</Link>
        {post.category ? (
          <>
            <span className="px-1.5">/</span>
            <Link href={`/tin-tuc?categoryId=${post.category.id}`} className="hover:text-sky-700">
              {post.category.name}
            </Link>
          </>
        ) : null}
      </nav>

      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-semibold leading-tight">{post.title}</h1>
        <div className="text-sm text-gray-500 flex flex-wrap items-center gap-3">
          <span>{fmtDate(post.createdAt as any)}</span>
          {post.tags?.length ? (
            <span className="inline-flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs">#{t}</span>
              ))}
            </span>
          ) : null}
        </div>
        {post.coverImage ? (
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto object-cover" />
          </div>
        ) : null}
      </header>

      {post.content ? (
        <article className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      ) : (
        post.excerpt && <p className="text-gray-700">{post.excerpt}</p>
      )}

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Bài viết liên quan</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rp) => (
              <Link
                key={rp.id}
                href={`/tin-tuc/${rp.slug}`}
                className="group block rounded-xl overflow-hidden bg-white hover:shadow-md border border-gray-200 transition"
              >
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                  {rp.coverImage ? (
                    <img
                      src={rp.coverImage}
                      alt={rp.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1.5">
                  <div className="text-xs text-gray-500">{fmtDate(rp.createdAt as any)}</div>
                  <div className="font-semibold leading-snug line-clamp-2 group-hover:text-sky-700 transition">
                    {rp.title}
                  </div>
                  {rp.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-2">{rp.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
