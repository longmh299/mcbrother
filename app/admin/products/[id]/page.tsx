// app/admin/products/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { updateProduct } from '../actions';
import Link from 'next/link';
import RichEditor from '@/components/RichEditor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { id: string };

export default async function EditProductPage({
  // 🔧 App Router truyền params dạng Promise
  params: paramsPromise,
}: {
  params: Promise<Params>;
}) {
  // ✅ Phải await trước khi dùng
  const { id: idStr } = await paramsPromise;
  const id = Number(idStr);
  if (!Number.isFinite(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      // CHỈ chọn các field có trong schema hiện tại của bạn
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        short: true,
        description: true,
        coverImage: true,

        published: true,
        isFeatured: true,
        categoryId: true,
        category: { select: { id: true, name: true } },

        // --- SEO
        metaTitle: true,
        metaDescription: true,
        canonicalUrl: true,
        ogImage: true,
        noindex: true,
        nofollow: true,

        // --- Specs
        power: true,
        voltage: true,
        weight: true,
        dimensions: true,
        functions: true,
        material: true,

        // --- Video (tạm bỏ check TS nếu Prisma Client chưa update)
        // @ts-ignore
        videoUrl: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sửa sản phẩm</h1>
        <Link
          href="/admin/products"
          className="px-3 py-2 text-[15px] rounded bg-gray-100 hover:bg-gray-200"
        >
          ← Quay lại
        </Link>
      </div>

      <form action={updateProduct} className="grid gap-6 md:grid-cols-3">
        <input type="hidden" name="id" defaultValue={product.id} />

        {/* Cột trái */}
        <section className="md:col-span-2 space-y-6">
          {/* Card 1: Thông tin chung */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông tin chung</div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Tên sản phẩm *</label>
                <input
                  name="name"
                  defaultValue={product.name ?? ''}
                  required
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Slug</label>
                <input
                  name="slug"
                  defaultValue={product.slug ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">SKU</label>
                <input
                  name="sku"
                  defaultValue={product.sku ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Giá</label>
                <input
                  name="price"
                  type="number"
                  step="1"
                  defaultValue={product.price ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Danh mục</label>
                <select
                  name="categoryId"
                  defaultValue={product.categoryId ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                >
                  <option value="">-- Chưa chọn --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Mô tả ngắn</label>
                <input
                  name="short"
                  defaultValue={product.short ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Ảnh đại diện (URL)</label>
                <input
                  name="coverImage"
                  defaultValue={product.coverImage ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              {/* --- VIDEO URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Link video (YouTube/Cloudinary)</label>
                <input
                  name="videoUrl"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  // dùng any để tránh TS báo đỏ khi client chưa update
                  defaultValue={(product as any).videoUrl ?? ''}
                />
                {/* (tuỳ chọn) Preview */}
                {(product as any).videoUrl ? (
                  <div className="mt-2">
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe
                        src={(product as any).videoUrl}
                        className="absolute inset-0 w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="lazy"
                        title={`Video ${product.name}`}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-6 md:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="published"
                    defaultChecked={!!product.published}
                    className="h-4 w-4"
                  />
                  <span>Hiển thị</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    defaultChecked={!!product.isFeatured}
                    className="h-4 w-4"
                  />
                  <span>Nổi bật</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Nội dung */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Nội dung chi tiết</div>
            <div className="p-5">
              <RichEditor name="description" value={product.description ?? ''} />
            </div>
          </div>

          {/* Card 3: Thông số kỹ thuật */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông số kỹ thuật</div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Công suất (power)</label>
                <input
                  name="power"
                  defaultValue={product.power ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Điện áp (voltage)</label>
                <input
                  name="voltage"
                  defaultValue={product.voltage ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Cân nặng (weight)</label>
                <input
                  name="weight"
                  defaultValue={product.weight ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Kích thước (dimensions)</label>
                <input
                  name="dimensions"
                  defaultValue={product.dimensions ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Chức năng (functions)</label>
                <input
                  name="functions"
                  defaultValue={product.functions ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Vật liệu (material)</label>
                <input
                  name="material"
                  defaultValue={product.material ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cột phải: SEO */}
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">SEO</div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium">Meta title</label>
                <input
                  name="metaTitle"
                  defaultValue={product.metaTitle ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Meta description</label>
                <textarea
                  name="metaDescription"
                  rows={3}
                  defaultValue={product.metaDescription ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Canonical URL</label>
                <input
                  name="canonicalUrl"
                  defaultValue={product.canonicalUrl ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">OG Image (URL)</label>
                <input
                  name="ogImage"
                  defaultValue={product.ogImage ?? ''}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="noindex"
                    defaultChecked={!!product.noindex}
                    className="h-4 w-4"
                  />
                    <span>Noindex</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="nofollow"
                    defaultChecked={!!product.nofollow}
                    className="h-4 w-4"
                  />
                  <span>Nofollow</span>
                </label>
              </div>
            </div>
          </div>

          <button className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Cập nhật sản phẩm
          </button>
        </aside>
      </form>
    </div>
  );
}
