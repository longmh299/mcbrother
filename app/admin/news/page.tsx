// app/admin/news/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { bulkPostOp } from './actions';

export const dynamic = 'force-dynamic';

export default async function NewsAdminList({
  searchParams,
}: {
  searchParams: any;
}) {
  // ép kiểu nhẹ để dùng an toàn
  const sp = searchParams as Record<string, string | string[] | undefined>;

  const params = {
    q: sp.q ? String(sp.q) : undefined,
    published:
      typeof sp.published === 'string'
        ? sp.published
        : undefined, // 'true' | 'false' | undefined
    page: sp.page ? String(sp.page) : undefined,
  };

  const page = Math.max(1, Number(params.page ?? '1'));
  const take = 20;
  const skip = (page - 1) * take;

  const where: any = {};
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { slug: { contains: params.q, mode: 'insensitive' } },
    ];
  }
  if (params.published === 'true') where.published = true;
  if (params.published === 'false') where.published = false;

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
      },
    }),
    prisma.post.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / take));

  const buildQS = (n: number) => {
    // <-- KHÔNG truyền nguyên sp vào URLSearchParams (tránh Symbol)
    const qs = new URLSearchParams();
    if (params.q) qs.set('q', params.q);
    if (params.published) qs.set('published', params.published);
    qs.set('page', String(n));
    return qs.toString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quản lý Tin tức</h1>
        <Link
          href="/admin/news/new"
          className="px-3 py-1 rounded bg-black text-white"
        >
          + Tạo bài viết
        </Link>
      </div>

      {/* Bộ lọc GET */}
      <form className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={params.q ?? ''}
          placeholder="Tìm tiêu đề/slug…"
          className="border rounded px-2 py-1"
        />
        <select
          name="published"
          defaultValue={params.published ?? ''}
          className="border rounded px-2 py-1"
        >
          <option value="">-- Tất cả --</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>
        <button className="border rounded px-3">Lọc</button>
      </form>

      {/* Bulk actions */}
      <form action={bulkPostOp} className="space-y-2">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 w-10"></th>
              <th className="p-2">Tiêu đề</th>
              <th className="p-2">Slug</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Ngày tạo</th>
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
                    href={`/admin/news/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="p-2">{p.slug}</td>
                <td className="p-2">{p.published ? '✅' : '❌'}</td>
                <td className="p-2">
                  {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="p-2">
                  <Link
                    href={`/tin-tuc/${p.slug}`}
                    className="text-sm underline"
                    target="_blank"
                  >
                    Xem
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
              href={`/admin/news?${url}`}
              className={`px-3 py-1 rounded border ${
                active ? 'bg-black text-white' : ''
              }`}
            >
              {n}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
