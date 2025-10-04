// app/admin/products/new/page.tsx
import { prisma } from '@/lib/prisma';
import { createProduct } from '../actions';
import Link from 'next/link';
import RichEditor from '@/components/RichEditor';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tạo sản phẩm</h1>
        <Link
          href="/admin/products"
          className="px-3 py-2 text-[15px] rounded bg-gray-100 hover:bg-gray-200"
        >
          ← Quay lại
        </Link>
      </div>

      <form action={createProduct} className="grid gap-6 md:grid-cols-3">
        {/* Cột trái: Thông tin cơ bản */}
        <section className="md:col-span-2 space-y-6">
          {/* Card 1: Thông tin chung */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông tin chung</div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Tên sản phẩm *</label>
                <input name="name" required className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium">Slug</label>
                <input name="slug" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">SKU</label>
                <input name="sku" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm font-medium">Giá</label>
                <input
                  name="price"
                  type="number"
                  step="1"
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Danh mục</label>
                <select name="categoryId" className="mt-1 w-full rounded-lg border px-3 py-2">
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
                <input name="short" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Ảnh đại diện (URL)</label>
                <input name="coverImage" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              {/* ...các field khác... */}
              <div className="space-y-1">
                <label className="block text-sm font-medium">Link video (YouTube/Cloudinary)</label>
                <input
                  name="videoUrl"
                  type="url"
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="https://www.youtube.com/watch?v=..."
                  defaultValue= ""
                />
                <p className="text-xs text-muted-foreground">
                  Dán link YouTube (tự chuyển sang /embed) hoặc link video Cloudinary.
                </p>
              </div>


              <div className="flex items-center gap-6 md:col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="published" defaultChecked className="h-4 w-4" />
                  <span>Hiển thị</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" className="h-4 w-4" />
                  <span>Nổi bật</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Nội dung (Rich text / HTML) */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Nội dung chi tiết</div>
            <div className="p-5">
              <RichEditor name="description" value="" />
            </div>
          </div>

          {/* Card 3: Thông số kỹ thuật */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông số kỹ thuật</div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium">Công suất (power)</label>
                <input name="power" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Điện áp (voltage)</label>
                <input name="voltage" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Cân nặng (weight)</label>
                <input name="weight" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Kích thước (dimensions)</label>
                <input name="dimensions" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Chức năng (functions)</label>
                <input name="functions" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Vật liệu (material)</label>
                <input name="material" className="mt-1 w-full rounded-lg border px-3 py-2" />
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
                <input name="metaTitle" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Meta description</label>
                <textarea
                  name="metaDescription"
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Canonical URL</label>
                <input name="canonicalUrl" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">OG Image (URL)</label>
                <input name="ogImage" className="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>

              <div className="flex items-center gap-6">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="noindex" className="h-4 w-4" />
                  <span>Noindex</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="nofollow" className="h-4 w-4" />
                  <span>Nofollow</span>
                </label>
              </div>
            </div>
          </div>

          <button className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Lưu sản phẩm
          </button>
        </aside>
      </form>
    </div>
  );
}
