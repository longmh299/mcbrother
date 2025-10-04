// app/san-pham/[slug]/page.tsx
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/* ===================== CONFIG ===================== */
// ĐỔI SANG ZALO CỦA BẠN
const ZALO_URL = 'https://zalo.me/0834551888';
/* ================================================== */

// Định dạng VND
function formatVND(n: number) {
  try {
    return new Intl.NumberFormat('vi-VN').format(n) + '₫';
  } catch {
    return `${n}₫`;
  }
}

/**
 * PriceInline (bản “Liên hệ” màu đỏ)
 * - Luôn prefix "Giá: ..."
 * - Có giá -> hiển thị số tiền
 * - Không có giá -> "Giá: Liên hệ" màu đỏ
 * - Tránh <a> lồng <a> bằng prop noAnchor (dùng khi đặt bên trong <Link>)
 */
function PriceInline({
  price,
  noAnchor = false,
}: {
  price?: number | null;
  /** Nếu phần này nằm BÊN TRONG <Link> cha → true để render <span> thay vì <a> */
  noAnchor?: boolean;
}) {
  if (typeof price === 'number') {
    return <>Giá: {formatVND(price)}</>;
  }
  if (noAnchor) {
    return <span className="text-red-600 font-semibold">Giá: Liên hệ</span>;
  }
  return (
    <span className="text-red-600 font-semibold">
      Giá:{' '}
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
      >
        Liên hệ
      </a>
    </span>
  );
}

// Giải mã HTML entities (phòng description bị lưu &lt;table&gt;...)
function decodeHtmlEntities(html?: string | null) {
  if (!html) return '';
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      attributes: { orderBy: { sort: 'asc' } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });
}

/* ------------ SEO ------------- */
type Params = { slug: string };

export async function generateMetadata(
  { params: paramsPromise }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await paramsPromise; // ✅ await params
  const p = await getProduct(slug);
  if (!p) return {};
  const title = p.metaTitle || p.name;
  const description = p.metaDescription || p.short || undefined;
  const canonical = p.canonicalUrl || undefined;
  const ogImages =
    (p.ogImage || p.coverImage) ? [String(p.ogImage || p.coverImage)] : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: { title, description, images: ogImages },
    robots: { index: !(p.noindex ?? false), follow: !(p.nofollow ?? false) },
  };
}

/* ------------ PAGE ------------- */
export default async function ProductDetailPage(
  { params: paramsPromise }: { params: Promise<Params> }
) {
  const { slug } = await paramsPromise; // ✅ await params
  const p = await getProduct(slug);

  if (!p || !p.published) {
    return <div className="max-w-5xl mx-auto px-4 py-12">Không tìm thấy sản phẩm</div>;
  }

  // Build additionalProperty cho JSON-LD
  const additionalProps: { name: string; value: string }[] = [];
  const pushIf = (name: string, v?: string | null) => {
    if (v && v.trim()) additionalProps.push({ name, value: v });
  };
  pushIf('Công suất', p.power);
  pushIf('Điện áp', p.voltage);
  pushIf('Cân nặng', p.weight);
  pushIf('Kích thước', p.dimensions);
  pushIf('Chức năng', p.functions);
  pushIf('Vật liệu', p.material);
  for (const a of p.attributes) {
    if (a.name && a.value) additionalProps.push({ name: a.name, value: a.value });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku || undefined,
    image: p.coverImage ? [p.coverImage] : undefined,
    description: p.metaDescription || p.short || undefined,
    offers:
      typeof p.price === 'number'
        ? {
            '@type': 'Offer',
            priceCurrency: 'VND',
            price: String(p.price),
            availability: 'https://schema.org/InStock',
          }
        : undefined,
    additionalProperty: additionalProps.map((x) => ({
      '@type': 'PropertyValue',
      name: x.name,
      value: x.value,
    })),
  };

  // Liên quan
  const related = await prisma.product.findMany({
    where: p.categoryId
      ? { published: true, categoryId: p.categoryId, id: { not: p.id } }
      : { published: true, id: { not: p.id } },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'asc' }],
    take: 8,
    select: { id: true, slug: true, name: true, coverImage: true, price: true, short: true },
  });

  // Mô tả (giải mã entity để giữ <table>...)
  const descHtml = decodeHtmlEntities(p.description);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 lg:py-10 space-y-10">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:text-sky-700">Trang chủ</Link>
        <span className="px-1.5">/</span>
        <Link href="/san-pham" className="hover:text-sky-700">Sản phẩm</Link>
        {p.category ? (
          <>
            <span className="px-1.5">/</span>
            <Link href={`/san-pham?categoryId=${p.category.id}`} className="hover:text-sky-700">
              {p.category.name}
            </Link>
          </>
        ) : null}
      </nav>

      {/* Top grid */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {p.coverImage ? (
            <img src={p.coverImage} alt={p.name} className="w-full h-auto object-cover" />
          ) : (
            <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight">{p.name}</h1>

          {/* === Giá: ... (prefix luôn) === */}
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            <PriceInline price={p.price} />
          </div>

          {p.short ? <p className="text-gray-700">{p.short}</p> : null}

          {/* Thông số kỹ thuật (core) */}
          {(p.power || p.voltage || p.weight || p.dimensions || p.functions || p.material) && (
            <section className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Thông số kỹ thuật</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <tbody>
                    {p.power && (
                      <tr className="border-b">
                        <td className="bg-gray-50 px-3 py-2 w-1/3 font-medium">Công suất</td>
                        <td className="px-3 py-2">{p.power}</td>
                      </tr>
                    )}
                    {p.voltage && (
                      <tr className="border-b">
                        <td className="bg-gray-50 px-3 py-2 font-medium">Điện áp</td>
                        <td className="px-3 py-2">{p.voltage}</td>
                      </tr>
                    )}
                    {p.weight && (
                      <tr className="border-b">
                        <td className="bg-gray-50 px-3 py-2 font-medium">Cân nặng</td>
                        <td className="px-3 py-2">{p.weight}</td>
                      </tr>
                    )}
                    {p.dimensions && (
                      <tr className="border-b">
                        <td className="bg-gray-50 px-3 py-2 font-medium">Kích thước</td>
                        <td className="px-3 py-2">{p.dimensions}</td>
                      </tr>
                    )}
                    {p.functions && (
                      <tr className="border-b">
                        <td className="bg-gray-50 px-3 py-2 font-medium">Chức năng</td>
                        <td className="px-3 py-2">{p.functions}</td>
                      </tr>
                    )}
                    {p.material && (
                      <tr>
                        <td className="bg-gray-50 px-3 py-2 font-medium">Vật liệu</td>
                        <td className="px-3 py-2">{p.material}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ====== VIDEO VẬN HÀNH ====== */}
      {p.videoUrl && (
        <section id="video-van-hanh" className="space-y-3">
          <h2 className="text-lg font-semibold">Video vận hành</h2>
          {/\.(mp4|webm|ogg)(\?|$)/i.test(p.videoUrl) || p.videoUrl.includes('res.cloudinary.com') ? (
            <video src={p.videoUrl} className="w-full rounded-xl" controls preload="metadata" />
          ) : (
            <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={p.videoUrl}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                title={`Video ${p.name}`}
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}
        </section>
      )}
      {/* ====== /VIDEO ====== */}

      {/* Thông số bổ sung */}
      {p.attributes.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Thông số bổ sung</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <tbody>
                {p.attributes.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="bg-gray-50 px-3 py-2 w-1/3 font-medium">{a.name}</td>
                    <td className="px-3 py-2">{a.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Mô tả (giữ bảng TinyMCE) */}
      {descHtml ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Mô tả</h2>
          <div className="table-wrap">
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: descHtml }} suppressHydrationWarning />
          </div>
        </section>
      ) : null}

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg lg:text-xl font-semibold">Sản phẩm liên quan</h2>

          {/* MOBILE/TABLET: Carousel ngang */}
          <div className="lg:hidden px-4 overflow-x-auto snap-x snap-mandatory">
            <div className="flex gap-3">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/san-pham/${rp.slug}`}
                  className="snap-start w-[60%] min-w-[60%] sm:w-[42%] sm:min-w-[42%]
                       rounded-lg overflow-hidden border border-gray-200 bg-white hover:shadow-md transition"
                >
                  <div className="aspect-[3/2] max-h-40 bg-gray-50 overflow-hidden">
                    {rp.coverImage ? (
                      <img src={rp.coverImage} alt={rp.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xs text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="text-sm font-semibold">
                      {/* TRÁNH <a> lồng <a> */}
                      <PriceInline price={rp.price} noAnchor />
                    </div>
                    <div className="text-xs font-medium text-gray-900 leading-snug line-clamp-2">{rp.name}</div>
                    {rp.short && <p className="text-[11px] text-gray-500 line-clamp-2">{rp.short}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* DESKTOP: Grid */}
          <div className="hidden lg:grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {related.map((rp) => (
              <Link
                key={rp.id}
                href={`/san-pham/${rp.slug}`}
                className="group rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                  {rp.coverImage ? (
                    <img
                      src={rp.coverImage}
                      alt={rp.name}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-sm text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col gap-2">
                  <div className="text-[15px] font-semibold">
                    {/* TRÁNH <a> lồng <a> */}
                    <PriceInline price={rp.price} noAnchor />
                  </div>
                  <div className="font-medium text-gray-900 leading-snug line-clamp-2 group-hover:text-sky-700 transition">
                    {rp.name}
                  </div>
                  {rp.short && <p className="text-sm text-gray-500 line-clamp-2 mt-auto">{rp.short}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
