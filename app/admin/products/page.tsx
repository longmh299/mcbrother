// app/admin/products/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { bulkProductOp } from './actions';

export const dynamic = 'force-dynamic';

// chỉ để hiển thị giá
function fmtVND(n?: number | null) {
  if (n === null || n === undefined || isNaN(Number(n))) return '0';
  try {
    return new Intl.NumberFormat('vi-VN').format(Number(n));
  } catch {
    return String(n ?? 0);
  }
}

type AdminSearchParams = {
  q?: string;
  categoryId?: string;
  status?: '' | 'published' | 'hidden';
  page?: string;
};

export default async function AdminProductList({
  // 🔧 App Router truyền searchParams dạng Promise
  searchParams: spPromise,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  // ✅ Phải await trước khi dùng
  const sp = await spPromise;

  // --- ép kiểu nhẹ các query ---
  const q = sp.q ? String(sp.q) : undefined;

  const categoryId = sp.categoryId
    ? (Number(sp.categoryId) || undefined)
    : undefined;

  const status = (sp.status ?? '') as '' | 'published' | 'hidden'; // '', 'published', 'hidden'
  const page = Math.max(1, Number(sp.page ?? '1'));

  // --- phân trang ---
  const take = 20;
  const skip = (page - 1) * take;

  // --- where ---
  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { sku: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (categoryId) where.categoryId = categoryId;
  if (status === 'published') where.published = true;
  if (status === 'hidden') where.published = false;

  const [items, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        published: true,
        isFeatured: true,
        category: { select: { id: true, name: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ select: { id: true, name: true } }),
  ]);

  const pages = Math.max(1, Math.ceil(total / take));

  // Build query string (tránh việc stringify searchParams gây lỗi Symbol)
  const buildQS = (n: number) => {
    const qs = new URLSearchParams();
    if (q) qs.set('q', q);
    if (categoryId) qs.set('categoryId', String(categoryId));
    if (status) qs.set('status', status);
    qs.set('page', String(n));
    return qs.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sản phẩm</h1>
        <Link
          href="/admin/products/new"
          className="px-3 py-1 rounded bg-black text-white"
        >
          + Tạo sản phẩm
        </Link>
      </div>

      {/* Bộ lọc GET */}
      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Tìm theo tên / slug / SKU"
          className="border rounded px-2 py-1"
        />
        <select
          name="categoryId"
          defaultValue={categoryId ?? ''}
          className="border rounded px-2 py-1"
        >
          <option value="">-- Tất cả danh mục --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status}
          className="border rounded px-2 py-1"
        >
          <option value="">Đang hiển thị</option>
          <option value="published">Hiển thị</option>
          <option value="hidden">Ẩn</option>
        </select>

        <button className="border rounded px-3">Lọc</button>
      </form>

      {/* Bulk actions */}
      <form action={bulkProductOp} className="space-y-2">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 w-10"></th>
              <th className="p-2">Tên sản phẩm</th>
              <th className="p-2 w-32">SKU</th>
              <th className="p-2 w-32">Giá</th>
              <th className="p-2">Danh mục</th>
              <th className="p-2 w-40">TT</th>
              <th className="p-2 w-16">#</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  <input type="checkbox" name="ids" value={p.id} />
                </td>
                <td className="p-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {p.name}
                  </Link>
                  <div className="text-xs text-gray-500">{p.slug}</div>
                </td>
                <td className="p-2">{p.sku || '-'}</td>
                <td className="p-2">{fmtVND(p.price)}</td>
                <td className="p-2">{p.category?.name || '-'}</td>
                <td className="p-2">
                  {p.published ? (
                    <span className="inline-block rounded bg-green-100 text-green-700 px-2 py-0.5 mr-1">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="inline-block rounded bg-gray-100 text-gray-700 px-2 py-0.5 mr-1">
                      Ẩn
                    </span>
                  )}
                  {p.isFeatured ? (
                    <span className="inline-block rounded bg-amber-100 text-amber-700 px-2 py-0.5">
                      Nổi bật
                    </span>
                  ) : null}
                </td>
                <td className="p-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-sm underline"
                  >
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-2">
          <button name="op" value="publish" className="px-3 py-1 border rounded">
            Publish
          </button>
          <button name="op" value="unpublish" className="px-3 py-1 border rounded">
            Unpublish
          </button>
          <button name="op" value="feature" className="px-3 py-1 border rounded">
            Feature
          </button>
          <button name="op" value="unfeature" className="px-3 py-1 border rounded">
            Unfeature
          </button>
          <button
            name="op"
            value="delete"
            className="px-3 py-1 border rounded text-white bg-red-500"
          >
            Xoá
          </button>
        </div>
      </form>

      {/* Pagination */}
      <div className="flex gap-2">
        {Array.from({ length: pages }).map((_, i) => {
          const n = i + 1;
          const url = buildQS(n);
          const active = n === page;
          return (
            <Link
              key={n}
              href={`/admin/products?${url}`}
              className={`px-3 py-1 rounded border ${active ? 'bg-black text-white' : ''}`}
            >
              {n}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
