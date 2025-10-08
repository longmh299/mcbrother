// app/san-pham/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CategoryPicker from "@/components/CategoryPicker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  categoryId?: string; // id
  cat?: string;        // slug
  page?: string;
};

const PER_PAGE = 8; // ✅ 4 cột × 2 dòng

function fmtVND(n?: number | null) {
  if (typeof n !== "number") return "Liên hệ";
  try {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  } catch {
    return "Liên hệ";
  }
}

// slugify không dấu (để match tên/slug)
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getData(params: SearchParams) {
  const q = (params.q || "").trim();
  const qSlug = q ? slugify(q) : "";
  const rawCatId = (params.categoryId ?? "").trim();
  const catSlug = (params.cat ?? "").trim();
  const page = Math.max(1, Number(params.page) || 1);

  // Ưu tiên categoryId; nếu chỉ có slug thì tra id
  let categoryId: number | undefined = /^\d+$/.test(rawCatId)
    ? Number(rawCatId)
    : undefined;

  if (!categoryId && catSlug) {
    const cat = await prisma.category.findUnique({
      where: { slug: catSlug },
      select: { id: true },
    });
    categoryId = cat?.id;
  }

  // where cơ bản (không dùng published để tránh lỗi nếu schema không có)
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { short: { contains: q, mode: "insensitive" } }, // đổi sang shortDesc nếu schema của bạn khác tên
      { sku: { contains: q, mode: "insensitive" } },
      ...(qSlug ? [{ slug: { contains: qSlug, mode: "insensitive" } }] : []),
    ];
  }
  if (categoryId) where.categoryId = categoryId;

  // Lấy tổng số
  const count = await prisma.product.count({ where });

  // Lấy danh sách sản phẩm (có fallback orderBy để tránh lỗi schema)
  let items = await prisma.product.findMany({
    where,
    orderBy: [{ createdAt: "desc" as const }], // thử dùng createdAt trước
    skip: (page - 1) * PER_PAGE,
    take: PER_PAGE,
    select: {
      id: true,
      slug: true,
      name: true,
      short: true,
      coverImage: true,
      price: true,
    },
  }).catch(async () => {
    // fallback nếu schema không có createdAt
    return prisma.product.findMany({
      where,
      orderBy: [{ id: "desc" as const }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select: {
        id: true,
        slug: true,
        name: true,
        short: true,
        coverImage: true,
        price: true,
      },
    });
  });

  // Lấy categories (fallback nếu không có field "order")
  let categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" as const }, { name: "asc" as const }],
    select: { id: true, name: true },
  }).catch(async () => {
    return prisma.category.findMany({
      orderBy: [{ name: "asc" as const }],
      select: { id: true, name: true },
    });
  });

  return {
    q,
    categoryId,
    cat: catSlug || undefined,
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
    if (v !== undefined && v !== null && String(v).length > 0) sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function ProductsPage({
  // Next 15: searchParams là Promise
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParamsPromise;
  const { q, categoryId, cat, page, totalPages, items, categories } = await getData(sp);
  const catParam = cat ? { cat } : { categoryId };

  return (
    // Full-bleed nền dịu (xu hướng)
    <section className="w-full bg-surface">
      {/* Nội dung gói trong container rộng (2xl=1600 trong tailwind.config.js) */}
      <div className="container px-4 lg:px-6 py-6 md:py-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Sản phẩm
          </h1>
        </div>

        {/* Thanh lọc */}
        <form
          action="/san-pham"
          className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 md:p-4 shadow-card"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">

            <div className="sm:col-span-12">
              <CategoryPicker categories={categories} />
            </div>

            {/* <div className="sm:col-span-4">
              <button
                className="w-full rounded-xl bg-primary text-white font-medium py-2.5 hover:brightness-110 transition"
                type="submit"
              >
                Lọc
              </button>
            </div> */}
          </div>
        </form>

        {/* Grid 4 cột ở xl (8 sp / trang) */}
        {items.length === 0 ? (
          <div className="text-gray-500">Không có sản phẩm phù hợp.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
            {items.map((p) => (
              <Link
                href={`/san-pham/${p.slug}`}
                key={p.id}
                className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-transform duration-300 ease-soft-out hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="aspect-[4/3] bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.coverImage}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 ease-soft-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-3 md:p-4 space-y-1">
                  <div className="text-[15px] font-semibold text-gray-900">
                    {fmtVND(p.price)}
                  </div>
                  <h3 className="text-sm md:text-[15px] font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  {p.short && (
                    <p className="text-xs text-gray-500 line-clamp-2">{p.short}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-7 md:mt-9 flex items-center justify-center gap-1.5 md:gap-2"
          >
            <Link
              aria-label="Trang trước"
              href={buildHref("/san-pham", {
                q,
                ...catParam,
                page: Math.max(1, page - 1),
              })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page === 1 ? "pointer-events-none opacity-40" : "bg-white hover:bg-gray-50"
              }`}
            >
              Trước
            </Link>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const show =
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1 ||
                  (page <= 3 && p <= 4) ||
                  (page >= totalPages - 2 && p >= totalPages - 3);

                if (show) {
                  const active = p === page;
                  return (
                    <Link
                      key={p}
                      href={buildHref("/san-pham", { q, ...catParam, page: p })}
                      className={`min-w-[36px] text-center px-2.5 py-2 rounded-lg border text-sm ${
                        active
                          ? "bg-primary border-primary text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {p}
                    </Link>
                  );
                }
                if ((p === page - 2 && p > 1) || (p === page + 2 && p < totalPages)) {
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
              href={buildHref("/san-pham", {
                q,
                ...catParam,
                page: Math.min(totalPages, page + 1),
              })}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page === totalPages
                  ? "pointer-events-none opacity-40"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              Sau
            </Link>
          </nav>
        )}
      </div>
    </section>
  );
}
