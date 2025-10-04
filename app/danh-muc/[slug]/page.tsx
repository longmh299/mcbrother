// app/danh-muc/[slug]/page.tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { abs } from "@/lib/site";
import { redirect, notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params; // ✅ Next 15: params là Promise

  const c = await prisma.category.findUnique({ where: { slug } });

  if (!c) {
    const r = await prisma.slugRedirect.findUnique({ where: { fromSlug: slug } });
    if (r?.entityType === "category") {
      return {
        title: "Redirecting…",
        robots: { index: false, follow: false },
        other: { refresh: `0;url=/danh-muc/${r.toSlug}` },
      };
    }
    return {};
  }

  const title = c.metaTitle || c.name;
  const description = c.metaDescription || "";
  const url = c.canonicalUrl || abs(`/danh-muc/${c.slug}`);
  const ogImage = c.ogImage || abs("/images/placeholder.svg");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: [{ url: ogImage }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: { index: c.noindex ? false : true, follow: c.nofollow ? false : true },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params; // ✅ Next 15: params là Promise

  const c = await prisma.category.findUnique({ where: { slug } });
  if (!c) {
    const r = await prisma.slugRedirect.findUnique({ where: { fromSlug: slug } });
    if (r?.entityType === "category") redirect(`/danh-muc/${r.toSlug}`);
    notFound();
  }

  const items = await prisma.product.findMany({
    where: { categoryId: c.id, published: true, noindex: false },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { slug: true, name: true },
  });

  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.name,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/san-pham/${p.slug}`),
      name: p.name,
    })),
  };

  return (
    <main className="mx-auto max-w-6xl p-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <h1 className="text-2xl font-semibold">{c.name}</h1>
      {/* TODO: render list sản phẩm theo UI của bạn */}
    </main>
  );
}
