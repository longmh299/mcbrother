// app/api/admin/news/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 96);

const toBool = (v: unknown) =>
  typeof v === "boolean" ? v : String(v || "").trim() === "true" || v === 1 || v === "1";

const toTags = (v: unknown) => {
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map(s => s.trim()).filter(Boolean);
  return [] as string[];
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    if (!body?.title || typeof body.title !== "string") {
      return NextResponse.json({ ok: false, message: "title is required" }, { status: 400 });
    }

    const data = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug ? slugify(String(body.slug)) : slugify(String(body.title)),
        excerpt: body.excerpt ?? null,
        content: body.content ?? null,
        coverImage: body.coverImage ?? null,
        tags: toTags(body.tags),
        published: toBool(body.published),
        categoryId: body.categoryId ?? undefined,

        // SEO
        metaTitle: body.metaTitle ?? null,
        metaDescription: body.metaDescription ?? null,
        canonicalUrl: body.canonicalUrl ?? null,
        ogImage: body.ogImage ?? null,
        noindex: toBool(body.noindex),
        nofollow: toBool(body.nofollow),
      },
      select: { id: true, slug: true },
    });

    return NextResponse.json({ ok: true, post: data }, { status: 201 });
  } catch (e) {
    console.error("POST /api/admin/news error", e);
    return NextResponse.json({ ok: false, message: "Internal error" }, { status: 500 });
  }
}
