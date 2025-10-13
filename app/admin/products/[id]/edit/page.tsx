// app/admin/products/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichEditor from "@/components/RichEditor";
import Script from "next/script";
import ImageField from "@/components/ImageField";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  // ✅ Next 15: params là Promise
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        name: true,
        short: true,
        description: true,
        sku: true,
        price: true,
        coverImage: true,
        videoUrl: true,
        published: true,
        isFeatured: true,
        power: true,
        voltage: true,
        weight: true,
        dimensions: true,
        functions: true,
        material: true,
        metaTitle: true,
        metaDescription: true,
        canonicalUrl: true,
        ogImage: true,
        noindex: true,
        nofollow: true,
        categoryId: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Không tìm thấy sản phẩm</h1>
        <Link
          href="/admin/products"
          className="text-sky-600 hover:underline"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

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

      <form
        id="productForm"
        action={updateProduct}
        className="grid gap-6 md:grid-cols-3"
      >
        <input type="hidden" name="id" value={product.id} />

        {/* Cột trái: Thông tin cơ bản */}
        <section className="md:col-span-2 space-y-6">
          {/* Card 1: Thông tin chung */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Thông tin chung</div>
            <div className="p-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Tên sản phẩm *</label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={product.name}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Slug</label>
                <input
                  id="slug"
                  name="slug"
                  defaultValue={product.slug ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="may-ghep-mi-lon-tdfj-160"
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  title="Chỉ chữ thường, số và dấu gạch ngang"
                />
                <p id="slugHint" className="mt-1 text-xs text-gray-500"></p>
              </div>

              <div>
                <label className="block text-sm font-medium">SKU</label>
                <input
                  name="sku"
                  defaultValue={product.sku ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Giá</label>
                <input
                  name="price"
                  type="number"
                  step="1"
                  min="0"
                  defaultValue={
                    typeof product.price === "number" ? product.price : undefined
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="VD: 125000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Danh mục</label>
                <select
                  name="categoryId"
                  defaultValue={product.categoryId ?? ""}
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
                  defaultValue={product.short ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                  placeholder="Tóm tắt 1–2 câu…"
                />
              </div>

              {/* Ảnh đại diện */}
              <div className="md:col-span-2">
                <ImageField
                  name="coverImage"
                  label="Ảnh đại diện"
                  defaultValue={product.coverImage ?? ""}
                  folder="mcbrother/products"
                  placeholder="Dán URL ảnh hoặc bấm Upload"
                />
              </div>

              {/* Video */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium">
                  Link video (YouTube/Cloudinary)
                </label>
                <input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="https://www.youtube.com/watch?v=..."
                  defaultValue={product.videoUrl ?? ""}
                />
                <p className="text-xs text-muted-foreground">
                  Dán link YouTube (tự chuyển sang /embed) hoặc link video
                  Cloudinary/MP4.
                </p>
                <div id="videoPreviewWrap" className="mt-2 hidden">
                  <div className="text-xs text-gray-600 mb-2">Xem trước video:</div>
                  <div className="rounded-lg border bg-black/5 p-2">
                    <div className="aspect-video w-full">
                      <iframe
                        id="ytPreview"
                        className="hidden h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                      <video id="mp4Preview" className="hidden h-full w-full" controls />
                    </div>
                  </div>
                </div>
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

          {/* Card 2: Nội dung (Rich text / HTML) */}
          <div className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-3 font-medium">Nội dung chi tiết</div>
            <div className="p-5">
              <RichEditor name="description" value={product.description ?? ""} />
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
                  defaultValue={product.power ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Điện áp (voltage)</label>
                <input
                  name="voltage"
                  defaultValue={product.voltage ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Cân nặng (weight)</label>
                <input
                  name="weight"
                  defaultValue={product.weight ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Kích thước (dimensions)</label>
                <input
                  name="dimensions"
                  defaultValue={product.dimensions ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Chức năng (functions)</label>
                <input
                  name="functions"
                  defaultValue={product.functions ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Vật liệu (material)</label>
                <input
                  name="material"
                  defaultValue={product.material ?? ""}
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
                  id="metaTitle"
                  name="metaTitle"
                  defaultValue={product.metaTitle ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <p id="metaTitleCount" className="mt-1 text-xs text-gray-500"></p>
              </div>
              <div>
                <label className="block text-sm font-medium">Meta description</label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={3}
                  defaultValue={product.metaDescription ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <p id="metaDescCount" className="mt-1 text-xs text-gray-500"></p>
              </div>
              <div>
                <label className="block text-sm font-medium">Canonical URL</label>
                <input
                  name="canonicalUrl"
                  defaultValue={product.canonicalUrl ?? ""}
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">OG Image (URL)</label>
                <input
                  name="ogImage"
                  defaultValue={product.ogImage ?? ""}
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

          <button
            id="submitBtn"
            className="w-full rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </aside>
      </form>

      {/* ---------- Client-side helpers ---------- */}
      <Script id="product-edit-enhance" strategy="afterInteractive">{`
(function(){
  const $ = (sel)=>document.querySelector(sel);
  const nameEl = $('#name');
  const slugEl = $('#slug');
  const slugHint = $('#slugHint');
  const videoInput = $('#videoUrl');
  const videoWrap = $('#videoPreviewWrap');
  const ytPreview = $('#ytPreview');
  const mp4Preview = $('#mp4Preview');
  const form = $('#productForm');
  const submitBtn = $('#submitBtn');
  const metaTitle = $('#metaTitle');
  const metaDescription = $('#metaDescription');
  const metaTitleCount = $('#metaTitleCount');
  const metaDescCount = $('#metaDescCount');

  let dirty = false;
  const markDirty = ()=>{ dirty = true; };

  // Auto slug
  const toSlug = (s) => s
    .toLowerCase()
    .normalize('NFKD').replace(/[\\u0300-\\u036f]/g,'')
    .replace(/[^a-z0-9\\s-]/g,'')
    .trim()
    .replace(/[\\s_-]+/g,'-')
    .replace(/^-+|-+$/g,'');
  let lastAutoSlug = slugEl?.value || '';
  const syncSlug = ()=>{
    if (!nameEl || !slugEl) return;
    const base = toSlug(nameEl.value || '');
    if (slugEl.value === '' || slugEl.value === lastAutoSlug) {
      slugEl.value = base;
      lastAutoSlug = base;
      if (slugHint) slugHint.textContent = base ? 'Slug gợi ý: ' + base : '';
    }
  };
  if (nameEl) nameEl.addEventListener('input', ()=>{ syncSlug(); markDirty(); });
  if (slugEl) slugEl.addEventListener('input', ()=>{ markDirty(); });

  // Video preview
  const toYouTubeEmbed = (u)=>{
    try {
      const url = new URL(u);
      if (/^(www\\.)?youtube\\.com$/i.test(url.hostname) && url.searchParams.get('v')) {
        return 'https://www.youtube.com/embed/' + url.searchParams.get('v');
      }
      if (/^(youtu\\.be)$/i.test(url.hostname)) {
        return 'https://www.youtube.com/embed/' + url.pathname.replace(/^\\//,'');
      }
    } catch {}
    return null;
  };
  const isVideoFile = (u)=>/\\.(mp4|webm|ogg)(\\?.*)?$/i.test(u) || /\\/video\\/upload\\//.test(u);

  const updateVideo = ()=>{
    if (!videoInput || !videoWrap || !ytPreview || !mp4Preview) return;
    const raw = (videoInput.value || '').trim();
    ytPreview.classList.add('hidden');
    mp4Preview.classList.add('hidden');
    videoWrap.classList.add('hidden');
    if (!raw) return;

    const yt = toYouTubeEmbed(raw);
    if (yt) {
      ytPreview.src = yt;
      ytPreview.classList.remove('hidden');
      videoWrap.classList.remove('hidden');
      return;
    }
    if (isVideoFile(raw)) {
      mp4Preview.src = raw;
      mp4Preview.classList.remove('hidden');
      videoWrap.classList.remove('hidden');
      return;
    }
  };
  if (videoInput) {
    videoInput.addEventListener('input', ()=>{ updateVideo(); markDirty(); });
    updateVideo();
  }

  // SEO counters
  const paintCount = (el, val, goodMin, goodMax) => {
    const len = val.length;
    const ok = len>=goodMin && len<=goodMax;
    el.textContent = len + ' ký tự' + (ok ? ' (tốt)' : '');
    el.style.color = ok ? '#16a34a' : '#6b7280';
  };
  const tickSEO = ()=>{
    if (metaTitle && metaTitleCount) paintCount(metaTitleCount, metaTitle.value, 50, 60);
    if (metaDescription && metaDescCount) paintCount(metaDescCount, metaDescription.value, 140, 160);
  };
  if (metaTitle) metaTitle.addEventListener('input', ()=>{ tickSEO(); markDirty(); });
  if (metaDescription) metaDescription.addEventListener('input', ()=>{ tickSEO(); markDirty(); });
  tickSEO();

  // Warn on leave
  window.addEventListener('beforeunload', (e)=>{
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });
  if (form) {
    form.addEventListener('submit', ()=>{ dirty = false; submitBtn?.setAttribute('disabled','true'); });
  }
})();
      `}</Script>
    </div>
  );
}
