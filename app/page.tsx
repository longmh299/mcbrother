// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TickerBar from "@/components/TickerBar";
import FeaturedSlider from "@/components/FeaturedSlider";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mcbrother.net";

export const metadata: Metadata = {
  title: "MCBROTHER JSC – Máy chế biến & đóng gói thực phẩm",
  description:
    "Giải pháp máy móc tối ưu hiệu suất cho nhà máy/xưởng: hút chân không, co màng, in date, cân đóng gói… Lắp đặt & bảo hành tận nơi.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "MCBROTHER JSC",
    title: "MCBROTHER JSC – Máy chế biến & đóng gói thực phẩm",
    description: "Giải pháp theo nhu cầu – lắp đặt nhanh – bảo hành tận nơi.",
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

/* ---------- DATA ---------- */
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
    take: 4,
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
      <section className="relative isolate">
        <div className="relative h-[420px] lg:h-[560px] 2xl:h-[620px]">
          {/* Background */}
          <picture className="absolute inset-0 block">
            <source media="(min-width:1536px)" srcSet="/images/mcbrother.png" />
            <source media="(min-width:1024px)" srcSet="/images/mcbrother.png" />
            <img
              src="/images/m-mcbrother.png"
              alt="Bối cảnh dây chuyền máy móc chế biến & đóng gói thực phẩm"
              className="absolute inset-0 w-full h-full object-cover object-left"
              loading="eager"
              fetchPriority="high"
              width={1920}
              height={960}
            />
          </picture>

          {/* Overlay: mobile nhẹ, desktop đậm hơn */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/25 to-transparent lg:from-black/55 lg:via-black/30 2xl:from-black/40 2xl:via-black/20" />

          {/* ===== Desktop/Tablet ===== */}
          <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] px-4 lg:px-6">
            <div className="absolute left-0 top-8 text-white/85 text-sm tracking-wide uppercase">
              Giải pháp cho nhà máy / xưởng sản xuất
            </div>

            <div className="absolute left-0 top-14 text-white drop-shadow-md">
              <h1 className="font-extrabold tracking-tight text-6xl 2xl:text-7xl leading-[1.05]">
                MCBROTHER
              </h1>
              <div className="mt-3 h-1.5 w-28 rounded-full bg-[#F5ED42]" />
            </div>

            <p className="absolute left-0 top-[26%] max-w-xl text-white/90 text-lg leading-relaxed">
              Máy chế biến &amp; đóng gói thực phẩm – tư vấn theo nhu cầu, lắp đặt nhanh, bảo hành tận nơi.
            </p>

            <div className="absolute left-0 top-[40%] flex gap-3">
              <Link
                href="/san-pham"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F5ED42] text-black font-semibold shadow-[0_8px_24px_rgba(245,237,66,.35)] hover:brightness-110"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M13 5l7 7-7 7M5 12h14"/></svg>
                Xem sản phẩm
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/80 text-white/95 hover:bg-white/10 backdrop-blur-sm"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z"/></svg>
                Nhận tư vấn miễn phí
              </Link>
            </div>

            <ul className="absolute left-0 top-[55%] flex flex-wrap gap-2 text-[13px] text-white/90">
              {["Lắp đặt nhanh", "Bảo hành tận nơi", "Giao hàng toàn quốc"].map((t) => (
                <li key={t} className="rounded-full bg-white/10 border border-white/20 px-3 py-1 backdrop-blur-sm">
                  {t}
                </li>
              ))}
            </ul>

            <address
              className="not-italic absolute left-0 bottom-8 bg-white/78 backdrop-blur rounded-xl p-4 pr-5 text-[15px] leading-relaxed text-slate-800 shadow-md"
              aria-label="Thông tin liên hệ MCBROTHER"
            >
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#2653ED]">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.14a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92Z" fill="currentColor"/>
                </svg>
                <span  className="text-[#FFFFFF]" >0834 551 888</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#2653ED]">
                  <path d="M12 2C8.13 2 5 5.06 5 8.86c0 5.23 7 12.28 7 12.28s7-7.05 7-12.28C19 5.06 15.87 2 12 2Zm0 9.86a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill="currentColor"/>
                </svg>
                <span  className="text-[#FFFFFF]">33 đường số 5, KDC Vĩnh Lộc, Bình Tân, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#2653ED]">
                  <path d="M4 4h16v2H4zm0 6h16v2H4zm0 6h10v2H4z" fill="currentColor"/>
                </svg>
                <span className="text-[#FFFFFF]">mcbrother.net</span>
              </div>
            </address>
          </div>

          {/* ===== Mobile (CÁCH 1: canh giữa dọc) ===== */}
          <div className="lg:hidden absolute inset-0 px-4">
            {/* spotlight nhẹ nâng tương phản, đặt ở phía trên giữa */}
            <div className="absolute -z-[1] left-0 right-0 top-24 h-40 bg-[radial-gradient(circle_at_20%_30%,rgba(0,0,0,.22),transparent_60%)]" />
            <div className="h-full flex flex-col justify-center text-white pb-4 pt-[6vh]">
              <div className="text-white/90 text-[11px] tracking-wide uppercase mb-1">
                Giải pháp cho nhà máy / xưởng sản xuất
              </div>
              <h1 className="text-[28px] font-extrabold leading-tight drop-shadow">
                MCBROTHER
              </h1>
              <p className="mt-1 text-white/95 text-[15px] leading-[1.45]">
                Máy chế biến &amp; đóng gói thực phẩm – tư vấn theo nhu cầu, lắp đặt nhanh.
              </p>

              <div className="flex gap-2 mt-3">
                <Link
                  href="/san-pham"
                  className="flex-1 text-center px-4 py-2.5 rounded-md bg-[#F5ED42] text-black font-semibold"
                >
                  Xem sản phẩm
                </Link>
                <Link
                  href="/lien-he"
                  className="flex-1 text-center px-4 py-2.5 rounded-md border border-white/90 text-white/95"
                >
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chip/thanh cam kết */}
      <TickerBar />

      {/* ====== VỀ CÔNG TY ====== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">Về MCBROTHER JSC</h2>
            <p className="text-gray-700">
              Từ 2013, chúng tôi cung cấp trọn gói giải pháp máy chế biến & đóng gói:
              hút chân không, co màng, in date, cân đóng gói… Tập trung tối ưu hiệu suất,
              lắp đặt nhanh và bảo hành tận nơi.
            </p>
          </div>
          <div className="md:text-right">
            <Link
              href="/gioi-thieu"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2653ed] text-white hover:brightness-110"
            >
              Xem trang giới thiệu
            </Link>
          </div>
        </div>
      </section>

      {/* ====== SẢN PHẨM NỔI BẬT ====== */}
      <section className="max-w-7xl mx-auto px-0 lg:px-0">
        <FeaturedSlider
          items={products}
          title="Sản phẩm nổi bật"
          viewAllHref="/san-pham"
          autoplayMs={4500}
        />
      </section>

      {/* ====== SỐ LIỆU ====== */}
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
                className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm"
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

      {/* ====== TIN TỨC ====== */}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {news.map((n) => (
              <Link
                key={n.id}
                href={`/tin-tuc/${n.slug}`}
                className="group block rounded-2xl overflow-hidden bg-white hover:shadow-md border border-gray-200 transition"
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
                <div className="p-3 space-y-1">
                  <div className="text-[15px] font-semibold leading-snug line-clamp-2 group-hover:text-sky-700 transition">
                    {n.title}
                  </div>
                  {n.excerpt && (
                    <p className="text-xs text-gray-600 line-clamp-2">{n.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ====== HÌNH ẢNH & VIDEO ====== */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-10 space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-center">
          Hình ảnh &amp; Video
        </h2>

        <div className="grid md:grid-cols-10 gap-6">
          <div className="md:col-span-6">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
              {[
                "/images/anh1.jpg",
                "/images/anh2.jpg",
                "/images/anh3.jpg",
                "/images/anh4.jpg",
                "/images/anh5.jpg",
                "/images/anh6.jpg",
              ].map((src, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border bg-gray-50">
                  <img
                    src={src}
                    alt={`MCBROTHER image ${i + 1}`}
                    className="w-full h-44 lg:h-48 object-cover hover:scale-[1.05] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="aspect-[3/2] lg:aspect-video w-full rounded-2xl overflow-hidden border bg-black">
              <iframe
                src="https://www.youtube.com/embed/ueRQXgNbzoE?si=rV7lwHXh1mmgZKRR"
                title="MCBROTHER Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Video giới thiệu năng lực & sản phẩm của MCBROTHER JSC.
            </p>
          </div>
        </div>
      </section>

      {/* ====== CTA cuối trang ====== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#f5ed42]" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-10 md:py-12 text-black">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl md:text-3xl font-extrabold">
                Cần tư vấn chọn máy phù hợp?
              </h3>
              <p className="mt-2 text-black/90">
                Để lại thông tin, chúng tôi sẽ liên hệ trong 24h để đề xuất cấu hình tối ưu chi phí &amp; hiệu suất.
              </p>
            </div>
            <div className="md:text-right">
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2653ed] text-white font-semibold hover:brightness-110"
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
