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

  // where cơ bản
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { short: { contains: q, mode: "insensitive" } }, // đổi tên field nếu schema khác
      { sku: { contains: q, mode: "insensitive" } },
      ...(qSlug ? [{ slug: { contains: qSlug, mode: "insensitive" } }] : []),
    ];
  }
  if (categoryId) where.categoryId = categoryId;

  // Đếm & lấy items
  const count = await prisma.product.count({ where });

  const select = {
    id: true,
    slug: true,
    name: true,
    short: true,
    coverImage: true,
    price: true,
  } as const;

  let items = await prisma.product.findMany({
    where,
    orderBy: [{ createdAt: "desc" as const }],
    skip: (page - 1) * PER_PAGE,
    take: PER_PAGE,
    select,
  }).catch(async () => {
    // fallback nếu không có createdAt
    return prisma.product.findMany({
      where,
      orderBy: [{ id: "desc" as const }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      select,
    });
  });

  // Categories (fallback nếu không có field "order")
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
    <section className="w-full bg-surface">
      <div className="container px-4 lg:px-6 py-6 md:py-8">
        {/* Title */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Sản phẩm
          </h1>
        </div>

        {/* SEARCH (mobile-only) */}
        <form
          action="/san-pham"
          method="GET"
          className="mb-3 sm:hidden"
          aria-label="Tìm sản phẩm"
        >
          {/* Giữ category hiện tại nếu đang lọc theo category */}
          {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
          {cat && <input type="hidden" name="cat" value={cat} />}

          <div className="relative">
            <input
              name="q"
              defaultValue={q}
              placeholder="Tìm tên / SKU / từ khóa"
              className="w-full h-11 rounded-full bg-white border border-gray-200 px-4 pr-11 text-[15px]
                         outline-none focus:border-[#2653ED] focus:ring-4 focus:ring-[#2653ED]/10"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 h-8 w-8 rounded-full bg-[#2653ED] text-white
                         inline-grid place-items-center hover:brightness-110"
              aria-label="Tìm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </form>

        {/* FILTER (GIỮ NGUYÊN CategoryPicker của bạn) */}
        <form
          action="/san-pham"
          className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 md:p-4 shadow-card"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-12">
              <CategoryPicker categories={categories} />
            </div>
          </div>
        </form>

        {/* GRID: UI thẻ sản phẩm (tên lớn hơn) */}
        {items.length === 0 ? (
          <div className="text-gray-500">Không có sản phẩm phù hợp.</div>
        ) : (
          <ul
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6 pb-20"
            role="list"
            aria-label="Danh sách sản phẩm"
          >
            {items.map((p) => (
              <li
                key={p.id}
                className="group rounded-3xl border border-gray-200/70 bg-white
                           shadow-[0_1px_0_#eef1f4] hover:shadow-[0_8px_24px_rgba(0,0,0,.08)]
                           transition-all duration-300 overflow-hidden"
              >
                <Link href={`/san-pham/${p.slug}`} className="block" aria-label={`Xem chi tiết ${p.name}`}>
                  <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.coverImage}
                        alt={`${p.name} – MCBROTHER`}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-3.5">
                    {/* Tên lớn hơn, 2 dòng */}
                    <h3 className="text-[16px] md:text-[17px] font-semibold leading-snug line-clamp-2 group-hover:text-[#2653ED] transition-colors">
                      {p.name}
                    </h3>
                    {/* Giá nổi bật, tăng nhẹ trên desktop */}
                    <div className="mt-1.5 text-[15px] md:text-[16px] font-semibold text-[#2653ED]">
                      {fmtVND(p.price)}
                    </div>
                    {/* Mô tả ẩn để thẻ đều; bật nếu cần */}
                    {/* {p.short && (
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{p.short}</p>
                    )} */}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination (giữ nguyên) */}
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
                const pnum = i + 1;
                const show =
                  pnum === 1 ||
                  pnum === totalPages ||
                  Math.abs(pnum - page) <= 1 ||
                  (page <= 3 && pnum <= 4) ||
                  (page >= totalPages - 2 && pnum >= totalPages - 3);

                if (show) {
                  const active = pnum === page;
                  return (
                    <Link
                      key={pnum}
                      href={buildHref("/san-pham", { q, ...catParam, page: pnum })}
                      className={`min-w-[36px] text-center px-2.5 py-2 rounded-lg border text-sm ${
                        active
                          ? "bg-primary border-primary text-white"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {pnum}
                    </Link>
                  );
                }
                if ((pnum === page - 2 && pnum > 1) || (pnum === page + 2 && pnum < totalPages)) {
                  return (
                    <span key={pnum} className="px-2 text-gray-500">…</span>
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
