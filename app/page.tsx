// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TickerBar from "@/components/TickerBar";

 



export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mcbrother.net";

export const metadata: Metadata = {
  title: "MCBROTHER JSC – Máy móc chế biến & đóng gói thực phẩm",
  description:
    "MCBROTHER JSC cung cấp máy móc chế biến & đóng gói thực phẩm: máy hút chân không, máy co màng, máy in date, cân đóng gói… Dịch vụ lắp đặt, bảo hành tận nơi.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "MCBROTHER JSC",
    title: "MCBROTHER JSC – Máy móc chế biến & đóng gói thực phẩm",
    description:
      "Giải pháp máy móc tối ưu hiệu suất – dịch vụ hậu mãi tận nơi.",
  },
  robots: { index: true, follow: true },
};

function fmtVND(n?: number | null) {
  if (typeof n !== "number") return "Liên hệ";
  try {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  } catch {
    return "Liên hệ";
  }
}

async function getHomepageData() {
  const featured = await prisma.product.findMany({
    where: { published: true, isFeatured: true },
    orderBy: [{ createdAt: "desc" }],
    take: 10,
    select: {
      id: true,
      slug: true,
      name: true,
      short: true,
      coverImage: true,
      price: true,
      createdAt: true,
    },
  });

  const latestIfEmpty =
    featured.length === 0
      ? await prisma.product.findMany({
          where: { published: true },
          orderBy: [{ createdAt: "desc" }],
          take: 10,
          select: {
            id: true,
            slug: true,
            name: true,
            short: true,
            coverImage: true,
            price: true,
            createdAt: true,
          },
        })
      : [];

  const news = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      createdAt: true,
    },
  });

  return {
    products: featured.length ? featured : latestIfEmpty,
    news,
  };
}

export default async function HomePage() {
  const { products, news } = await getHomepageData();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MCBROTHER JSC",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.svg`,
    sameAs: [
      "https://facebook.com/",
      "https://youtube.com/",
      "https://zalo.me/0834551888",
      "https://tiktok.com/",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+84-834-551-888",
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["Vietnamese"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "33 đường số 5, KDC Vĩnh Lộc, P. Bình Hưng Hòa B, Q. Bình Tân",
      addressLocality: "TP.HCM",
      addressCountry: "VN",
    },
  };

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2653ed]" />
        {/* Banner image overlay (đổi src theo ảnh của bạn) */}
        {/* <img
          src="/images/home-hero.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        /> */}
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-14 md:py-20 text-white">
          <div className="max-w-2xl space-y-4">
            <p className="uppercase tracking-wider text-white/90">
              Giải pháp tổng thể cho nhà máy / xưởng sản xuất
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Máy móc chế biến & đóng gói thực phẩm – tối ưu hiệu suất, nâng tầm
              thương hiệu
            </h1>
            <p className="text-white/90">
              Tư vấn theo nhu cầu – lắp đặt nhanh – bảo hành tận nơi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#f5ed42] text-black font-semibold hover:brightness-110"
              >
                Xem sản phẩm
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M13 5l7 7-7 7M5 12h14" />
                </svg>
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/70 text-white hover:bg-white/10"
              >
                Nhận tư vấn miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TICKER ======
      <section className="bg-[#1437d1] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-10 flex items-center overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mr-10">
              Hotline: 0834 551 888
            </span>
            <span className="mr-10">
              🚚 Giao hàng toàn quốc – Bảo hành tận nơi – Hỗ trợ kỹ thuật 24/7
            </span>
            <span>
              🛠️ Nhận tư vấn giải pháp trọn gói cho nhà máy / xưởng sản xuất
            </span>
          </div>
        </div>
      </section> */}
      <TickerBar />

      {/* ====== GIỚI THIỆU NGẮN + CTA ====== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              Về MCBROTHER JSC
            </h2>
            <p className="text-gray-700">
              Thành lập 2013, MCBROTHER JSC cung cấp giải pháp máy móc cho ngành
              chế biến & đóng gói thực phẩm: máy hút chân không, máy co màng, máy
              in date, cân đóng gói… Đồng hành cùng hàng nghìn doanh nghiệp, tối ưu
              hiệu suất và đảm bảo tiêu chuẩn chất lượng.
            </p>
          </div>
          <div className="md:text-right">
            <Link
              href="/gioi-thieu"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#2653ed] text-white hover:brightness-110"
            >
              Xem trang giới thiệu
            </Link>
          </div>
        </div>
      </section>

<section className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-5">
  <div className="flex items-end justify-between">
    <h2 className="text-2xl md:text-3xl font-semibold">Sản phẩm nổi bật</h2>
    <Link href="/san-pham" className="text-sm text-sky-700 hover:underline">
      Xem tất cả
    </Link>
  </div>

  {products.length === 0 ? (
    <div className="text-gray-500">Chưa có sản phẩm.</div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {products.map((p, idx) => {
        const createdAt = p.createdAt ? new Date(p.createdAt) : null;
        const isNew = createdAt ? (Date.now() - createdAt.getTime()) / 86400000 <= 30 : false; // trong 30 ngày
        const isHot = (p as any).isFeatured === true || idx < 3; // ưu tiên isFeatured, fallback 3 sản phẩm đầu

        return (
          <Link
            key={p.id}
            href={`/san-pham/${p.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-gray-200 bg-white
                       transition hover:border-sky-200 hover:shadow-lg"
          >
            {/* Ảnh */}
            <div className="relative aspect-[4/3] bg-gray-50">
              {p.coverImage ? (
                <img
                  src={p.coverImage}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              ) : (
                <div className="grid h-full place-items-center text-gray-400 text-sm">No Image</div>
              )}

              {/* Badges đẹp hơn */}
              <div className="absolute left-2 top-2 flex flex-col gap-1">
                {isHot && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500
                                   px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/30">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                      <path d="M13.5 2.1c.3 2.3-1 3.4-2.7 4.8C9 8 8 9.2 8 11.2c0 2.6 2.1 4.8 4.8 4.8 3 0 5.2-2.6 4.6-5.6-.4-2-2.1-3-2.5-5.5-.1-.6.2-1.6.6-2.7-1.1.2-1.9.6-2.1.9Z"/>
                    </svg>
                    Hot
                  </span>
                )}
                {isNew && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500
                                   px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/30">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                      <path d="M12 2l1.6 4.2L18 8l-4.4 1.8L12 14l-1.6-4.2L6 8l4.4-1.8L12 2zM5 16l.9 2.4L8 19l-2.1.6L5 22l-.9-2.4L2 19l2.1-.6L5 16zm14 0l.9 2.4L22 19l-2.1.6L19 22l-.9-2.4L16 19l2.1-.6L19 16z"/>
                    </svg>
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Nội dung */}
            <div className="p-3 space-y-1.5">
              <div className="text-[15px] font-bold text-gray-900">
                {fmtVND(p.price)}
              </div>
              <h3 className="line-clamp-2 font-semibold text-gray-900 transition group-hover:text-sky-700">
                {p.name}
              </h3>
              {p.short && (
                <p className="text-sm text-gray-500 line-clamp-2">{p.short}</p>
              )}
            </div>

            {/* CTA mũi tên xuất hiện khi hover (desktop) */}
            <div className="pointer-events-none absolute right-2 bottom-2 opacity-0 translate-x-1
                            transition group-hover:opacity-100 group-hover:translate-x-0">
              <div className="rounded-full bg-black/80 text-white p-2 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  )}
</section>


      {/* ====== SỐ LIỆU UY TÍN ====== */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { k: "Năm kinh nghiệm", v: "10+" },
              { k: "Khách hàng", v: "500+" },
              { k: "Dự án bàn giao", v: "2.000+" },
              { k: "Tỉnh thành phục vụ", v: "63" },
            ].map((it) => (
              <div
                key={it.k}
                className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-[#2653ed]">
                  {it.v}
                </div>
                <div className="mt-1 text-gray-600">{it.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TIN TỨC NỔI BẬT ====== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-5">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">Tin tức nổi bật</h2>
          <Link href="/tin-tuc" className="text-sm text-sky-700 hover:underline">
            Xem tất cả
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="text-gray-500">Chưa có bài viết.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/tin-tuc/${n.slug}`}
                className="group block rounded-lg overflow-hidden bg-white hover:shadow-md border border-gray-200 transition"
              >
                <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
                  {n.coverImage ? (
                    <img
                      src={n.coverImage}
                      alt={n.title}
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
                  <div className="text-[15px] font-semibold leading-snug line-clamp-2 group-hover:text-sky-700 transition">
                    {n.title}
                  </div>
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
      </section>

      {/* ====== HÌNH ẢNH (6) + VIDEO (4) ====== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10 space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">
          Hình ảnh & Video
        </h2>

        <div className="grid md:grid-cols-10 gap-6">
          <div className="md:col-span-6">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
              {[
                "/images/home/anh1.jpg",
                "/images/home/anh2.jpg",
                "/images/home/anh3.jpg",
                "/images/home/anh4.jpg",
                "/images/home/anh5.jpg",
                "/images/home/anh6.jpg",
              ].map((src, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border bg-gray-50"
                >
                  <img
                    src={src}
                    alt={`MCBROTHER image ${i + 1}`}
                    className="w-full h-40 md:h-44 lg:h-48 object-cover hover:scale-[1.05] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="aspect-video rounded-xl overflow-hidden border bg-black">
              <iframe
                src="https://www.youtube.com/embed/ueRQXgNbzoE?si=rV7lwHXh1mmgZKRR" 
                title="MCBROTHER Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Video giới thiệu về năng lực & sản phẩm của MCBROTHER JSC.
            </p>
          </div>
        </div>
      </section>

      {/* ====== CTA CUỐI TRANG ====== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2653ed]" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-10 md:py-12 text-white">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl md:text-3xl font-extrabold">
                Cần tư vấn chọn máy phù hợp?
              </h3>
              <p className="mt-2 text-white/90">
                Chúng tôi sẽ liên hệ trong 24h để tư vấn giải pháp tối ưu chi phí
                & hiệu suất cho mô hình của bạn.
              </p>
            </div>
            <div className="md:text-right">
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-[#f5ed42] text-black font-semibold hover:brightness-110"
              >
                Liên hệ ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ====== nhỏ xíu CSS chạy chữ ticker (Tailwind không có sẵn) ======
   Bạn có thể đặt phần này vào globals.css nếu muốn tái sử dụng.  */
