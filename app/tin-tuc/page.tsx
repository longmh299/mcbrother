// app/tin-tuc/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  categoryId?: string;
  page?: string;
};

const PER_PAGE = 12;

async function getData(params: SearchParams) {
  const q = (params.q ?? "").trim();
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const where: any = { published: true };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;

  const [count, items, categories] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
        category: { select: { id: true, name: true} },
      },
    }),
    prisma.postCategory.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  return {
    q,
    categoryId,
    page,
    totalPages: Math.max(1, Math.ceil(count / PER_PAGE)),
    items,
    categories,
  };
}

function buildHref(
  base: string,
  params: Record<string, string | number | undefined | null>
) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).length > 0) {
      sp.set(k, String(v));
    }
  });
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function NewsPage({
  // IMPORTANT: searchParams từ App Router là Promise
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Phải await trước khi dùng
  const params = await searchParamsPromise;

  const { q, categoryId, page, totalPages, items, categories } =
    await getData(params);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Tin tức</h1>

      {/* Thanh tìm kiếm gộp */}
      <form
        action="/tin-tuc"
        className="mb-5 rounded-xl border border-gray-200 bg-white p-2 md:p-3 shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-6">
            <input
              name="q"
              defaultValue={q}
              placeholder="Tìm bài viết…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="sm:col-span-4">
            <select
              name="categoryId"
              defaultValue={categoryId ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Tất cả chuyên mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              className="w-full rounded-lg bg-[#2653ed] text-white font-medium py-2.5 hover:brightness-110"
              type="submit"
            >
              Lọc
            </button>
          </div>
        </div>
      </form>

      {/* Lưới bài */}
      {items.length === 0 ? (
        <div className="text-gray-500">Không có bài viết phù hợp.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {items.map((n) => (
            <Link
              href={`/tin-tuc/${n.slug}`}
              key={n.id}
              className="group block rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow-md transition"
            >
              <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                {n.coverImage ? (
                  <img
                    src={n.coverImage}
                    alt={n.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-2.5 md:p-3 space-y-1">
                <div className="text-[15px] font-semibold leading-snug line-clamp-2 group-hover:text-sky-700 transition">
                  {n.title}
                </div>
                {n.category?.name && (
                  <div className="text-xs text-gray-500">{n.category.name}</div>
                )}
                {n.excerpt && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {n.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-1.5 md:gap-2">
          <Link
            aria-label="Trang trước"
            href={buildHref("/tin-tuc", {
              q,
              categoryId,
              page: Math.max(1, page - 1),
            })}
            className={`px-3 py-2 rounded-md border text-sm ${
              page === 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"
            }`}
          >
            Trước
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              if (
                p === 1 ||
                p === totalPages ||
                Math.abs(p - page) <= 1 ||
                (page <= 3 && p <= 4) ||
                (page >= totalPages - 2 && p >= totalPages - 3)
              ) {
                return (
                  <Link
                    key={p}
                    href={buildHref("/tin-tuc", { q, categoryId, page: p })}
                    className={`min-w-[36px] text-center px-2.5 py-2 rounded-md border text-sm ${
                      p === page
                        ? "bg-[#2653ed] border-[#2653ed] text-white"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </Link>
                );
              }
              if (
                (p === page - 2 && p > 1) ||
                (p === page + 2 && p < totalPages)
              ) {
                return (
                  <span key={p} className="px-2 text-gray-500">
                    …
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Link
            aria-label="Trang sau"
            href={buildHref("/tin-tuc", {
              q,
              categoryId,
              page: Math.min(totalPages, page + 1),
            })}
            className={`px-3 py-2 rounded-md border text-sm ${
              page === totalPages
                ? "pointer-events-none opacity-40"
                : "hover:bg-gray-50"
            }`}
          >
            Sau
          </Link>
        </div>
      )}
    </main>
  );
}
