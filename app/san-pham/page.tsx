// app/san-pham/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CategoryPicker from "@/components/CategoryPicker";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  categoryId?: string;
  page?: string;
};

const PER_PAGE = 15;

function fmtVND(n?: number | null) {
  if (typeof n !== "number") return "Liên hệ";
  try {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  } catch {
    return "Liên hệ";
  }
}

// 👉 Dùng để tìm kiếm không dấu (match với slug)
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getData(params: SearchParams) {
  const q = (params.q || "").trim();
  const qSlug = q ? slugify(q) : "";
  // parse categoryId an toàn (tránh NaN/rác)
  const rawCat = (params.categoryId ?? "").trim();
  const categoryId = /^\d+$/.test(rawCat) ? Number(rawCat) : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const where: any = { published: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { short: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      // ⚡ tìm theo slug không dấu
      ...(qSlug ? [{ slug: { contains: qSlug } }] : []),
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const [count, items, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
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
    }),
    prisma.category.findMany({
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
    if (v !== undefined && v !== null && String(v).length > 0) sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function ProductsPage({
  // 🔧 App Router truyền searchParams dưới dạng Promise
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ✅ phải await trước khi dùng
  const params = await searchParamsPromise;

  const { q, categoryId, page, totalPages, items, categories } = await getData(params);

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Sản phẩm</h1>

      {/* Thanh lọc: input + combobox + nút Lọc */}
      <form
        action="/san-pham"
        className="mb-5 rounded-xl border border-gray-200 bg-white p-2 md:p-3 shadow-sm"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <div className="sm:col-span-6">
            <input
              name="q"
              defaultValue={q}
              placeholder="Tìm theo tên / SKU… (gõ không dấu cũng được)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Combobox popup (đã xử lý mobile trong component) */}
          <div className="sm:col-span-4">
            <CategoryPicker categories={categories} />
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

      {/* Lưới sản phẩm */}
      {items.length === 0 ? (
        <div className="text-gray-500">Không có sản phẩm phù hợp.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {items.map((p) => (
            <Link
              href={`/san-pham/${p.slug}`}
              key={p.id}
              className="group block rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow-md transition"
            >
              <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                {p.coverImage ? (
                  <img
                    src={p.coverImage}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-2.5 md:p-3 space-y-1">
                <div className="text-[15px] font-bold text-gray-900">
                  {fmtVND(p.price)}
                </div>
                <div className="text-sm md:text-[15px] font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-sky-700 transition">
                  {p.name}
                </div>
                {p.short && (
                  <p className="text-xs text-gray-500 line-clamp-2">{p.short}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-6 md:mt-8 flex items-center justify-center gap-1.5 md:gap-2">
          {/* Prev */}
          <Link
            aria-label="Trang trước"
            href={buildHref("/san-pham", {
              q,
              categoryId,
              page: Math.max(1, page - 1),
            })}
            className={`px-3 py-2 rounded-md border text-sm ${
              page === 1
                ? "pointer-events-none opacity-40"
                : "hover:bg-gray-50"
            }`}
          >
            Trước
          </Link>

          {/* Số trang */}
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
                    href={buildHref("/san-pham", { q, categoryId, page: p })}
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

          {/* Next */}
          <Link
            aria-label="Trang sau"
            href={buildHref("/san-pham", {
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
