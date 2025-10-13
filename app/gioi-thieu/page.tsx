// app/gioi-thieu/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/*
  MCBROTHER — TRANG GIỚI THIỆU (About Company)
  - Tập trung 100% vào câu chuyện doanh nghiệp: Sứ mệnh, Tầm nhìn, Giá trị, Năng lực, Hành trình, Đội ngũ, Văn hóa.
  - Tránh liệt kê sản phẩm; thay bằng mô tả năng lực & phương pháp triển khai dự án.
  - SEO: Meta + JSON-LD Organization/Breadcrumb/Website, dữ liệu pháp lý.
  - UI: Hero + TOC, các section rõ ràng, ảnh minh họa thay thế bằng hình thật.
*/

/* ==========================
 *   THÔNG TIN DOANH NGHIỆP (CẬP NHẬT THEO THỰC TẾ)
 * ========================== */
const COMPANY = {
  name: "Công ty Cổ phần Thiết bị MCBROTHER",
  slogan:
    "Đồng hành số hoá sản xuất thực phẩm — tối ưu vận hành, nâng tầm chuẩn chất lượng.",
  summary:
    "MCBROTHER JSC là doanh nghiệp tư vấn giải pháp và cung cấp thiết bị cho chuỗi chế biến — đóng gói thực phẩm. Chúng tôi tập trung vào hiệu quả vận hành, an toàn và tính bền vững, triển khai theo quy trình chuẩn hoá từ khảo sát đến bảo trì.",
  website: "https://mcbrother.net",
  email: "mcbrother2013@gmail.com",
  hotline: "0834 551 888",
  zalo: "https://zalo.me/0834551888",
  address:
    "33 đường số 5, KDC Vĩnh Lộc, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM, Việt Nam",
  registration: {
    number: "0312229437",
    issuedAt: "2013-04-10",
    issuer: "Sở Kế Hoạch Và Đầu Tư TP.HCM",
  },
  foundingDate: "2013-04-10",
  logo: "/images/logo-mcbrother.png", // TODO: 512x512
  ogImage: "/images/mcbrother.png", // TODO: 1200x630
};

const BANNER_URL = process.env.NEXT_PUBLIC_ABOUT_BANNER || "/images/mcbrother.png"; // ảnh fallback

/* ==========================
 *   SEO METADATA
 * ========================== */
export const metadata: Metadata = {
  title: `Giới thiệu | ${COMPANY.name}`,
  description:
    "Giới thiệu về MCBROTHER — Đối tác giải pháp trong lĩnh vực chế biến & đóng gói thực phẩm. Sứ mệnh, tầm nhìn, giá trị cốt lõi, quy trình triển khai & văn hoá doanh nghiệp.",
  alternates: { canonical: "/gioi-thieu" },
  openGraph: {
    title: `Giới thiệu | ${COMPANY.name}`,
    description:
      "Sứ mệnh, tầm nhìn, giá trị cốt lõi, năng lực & hành trình phát triển của MCBROTHER JSC.",
    type: "website",
    url: `${COMPANY.website}/gioi-thieu`,
    images: [
      { url: COMPANY.ogImage, width: 1200, height: 630, alt: `${COMPANY.name} — About` },
    ],
    siteName: COMPANY.name,
  },
  robots: { index: true, follow: true },
};

/* ==========================
 *   DỮ LIỆU HIỂN THỊ
 * ========================== */
const STATS = [
  { value: "10+", label: "năm đồng hành cùng doanh nghiệp" },
  { value: "1.200+", label: "khách hàng & đối tác" },
  { value: "250+", label: "dự án/dây chuyền triển khai" },
  { value: "24–48h", label: "phản hồi kỹ thuật tại khu vực trọng điểm" },
];

const VALUES = [
  {
    title: "Chính trực & Minh bạch",
    desc: "Cam kết rõ ràng về chất lượng, tiến độ, chi phí; tài liệu kỹ thuật đầy đủ, truy xuất được.",
  },
  {
    title: "Hiệu quả & An toàn",
    desc: "Tối ưu TCO, nâng năng suất, giảm thời gian dừng; ưu tiên an toàn vận hành và vệ sinh thực phẩm.",
  },
  {
    title: "Đồng hành trọn vòng đời",
    desc: "Khảo sát — thiết kế — lắp đặt — đào tạo — bảo trì; tư vấn nâng cấp khi nhu cầu mở rộng.",
  },
  {
    title: "Đổi mới thực tiễn",
    desc: "Cải tiến dựa trên dữ liệu vận hành và phản hồi hiện trường, không phô trương thông số.",
  },
];

const TIMELINE = [
  { year: "2013", title: "Thành lập", desc: "Đặt nền móng với định hướng giải pháp thiết bị cho SME & nhà máy thực phẩm." },
  { year: "2018", title: "Mở rộng năng lực", desc: "Chuẩn hoá quy trình lắp đặt, đào tạo & tài liệu vận hành tiếng Việt." },
  { year: "2021", title: "Nâng cấp hậu mãi", desc: "Tối ưu kho linh kiện, SLA phản hồi khu vực 24–48h." },
  { year: "2024", title: "Chuyển đổi số", desc: "Chuẩn hoá hệ thống quản trị sản phẩm, nội dung & CRM, đẩy mạnh trải nghiệm dịch vụ." },
];

const METHODS = [
  {
    step: "01",
    title: "Khảo sát & Chẩn đoán",
    desc: "Phỏng vấn nhu cầu, đo đạc hiện trạng, phân tích nút thắt năng suất/chi phí/ATVSTP.",
  },
  {
    step: "02",
    title: "Thiết kế giải pháp",
    desc: "Đề xuất sơ đồ bố trí, yêu cầu điện/khí, checklist an toàn, ước tính sản lượng & TCO.",
  },
  {
    step: "03",
    title: "Lắp đặt & Chạy thử",
    desc: "Căn chỉnh, chạy mẫu tiêu chuẩn, bàn giao SOP vận hành & bảo dưỡng định kỳ.",
  },
  {
    step: "04",
    title: "Đồng hành & Nâng cấp",
    desc: "Theo dõi sau bán, đào tạo bổ sung, tối ưu theo dữ liệu vận hành thực tế.",
  },
];

const CAPABILITIES = [
  { area: "Tư vấn & Thiết kế", items: ["Khảo sát dây chuyền", "Layout nhà xưởng", "Chuẩn ATVSTP & 5S", "Ước tính TCO"] },
  { area: "Triển khai", items: ["Lắp đặt tại chỗ", "Test chạy chuẩn hóa", "Bàn giao SOP", "Đào tạo vận hành"] },
  { area: "Hậu mãi", items: ["Bảo hành 12–24 tháng", "Linh kiện sẵn kho", "SLA phản hồi 24–48h", "Bảo trì định kỳ"] },
  { area: "Tuân thủ & Tài liệu", items: ["CO/CQ theo lô", "Checklist an toàn", "Hồ sơ kỹ thuật tiếng Việt", "Hướng dẫn bảo dưỡng"] },
];


const PARTNERS = [
  "/images/about/partner-1.png",
  "/images/about/partner-2.png",
  "/images/about/partner-3.png",
  "/images/about/partner-4.png",
  "/images/about/partner-5.png",
];

/* ==========================
 *   LAYOUT HELPERS
 * ========================== */
function Section({ id, title, children, className = "" }: { id?: string; title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      {title && (
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export default function AboutPage() {
  /* JSON-LD */
  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    url: COMPANY.website,
    logo: COMPANY.logo,
    foundingDate: COMPANY.foundingDate,
    email: COMPANY.email,
    telephone: COMPANY.hotline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address,
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'VN',
    },
    contactPoint: [
      { '@type': 'ContactPoint', telephone: COMPANY.hotline, contactType: 'customer service', areaServed: 'VN', availableLanguage: ['vi', 'en'] },
    ],
    sameAs: [COMPANY.website],
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: COMPANY.website },
      { '@type': 'ListItem', position: 2, name: 'Giới thiệu', item: `${COMPANY.website}/gioi-thieu` },
    ],
  };

  const siteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY.name,
    url: COMPANY.website,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${COMPANY.website}/tim-kiem?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <main className="min-h-screen">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src={BANNER_URL} alt="MCBROTHER — About" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36 text-white">
          <nav aria-label="breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm opacity-90">
              <li><Link href="/" className="hover:underline">Trang chủ</Link></li>
              <li>/</li>
              <li aria-current="page" className="text-white/90">Giới thiệu</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight">
            {COMPANY.name} — {COMPANY.slogan}
          </h1>
          <p className="mt-4 text-base md:text-lg max-w-3xl text-white/90">
            {COMPANY.summary}
          </p>
        </div>
      </section>

      {/* BODY */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 py-10">
          {/* TOC */}
          <aside className="lg:col-span-3 order-last lg:order-first">
            <div className="sticky top-24 rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm">
              <p className="font-semibold mb-3">Mục lục</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:underline">Về chúng tôi</a></li>
                <li><a href="#mission" className="hover:underline">Sứ mệnh & Tầm nhìn</a></li>
                <li><a href="#values" className="hover:underline">Giá trị cốt lõi</a></li>
                <li><a href="#method" className="hover:underline">Phương pháp triển khai</a></li>
                <li><a href="#capabilities" className="hover:underline">Năng lực cốt lõi</a></li>
                <li><a href="#timeline" className="hover:underline">Hành trình phát triển</a></li>
                <li><a href="#testimonials" className="hover:underline">Khách hàng nói gì</a></li>
                <li><a href="#legal" className="hover:underline">Thông tin pháp lý</a></li>
                <li><a href="#culture" className="hover:underline">Văn hoá & Đội ngũ</a></li>
                {/* <li><a href="#careers" className="hover:underline">Tuyển dụng</a></li> */}
                <li><a href="/lien-he" className="hover:underline">Liên hệ</a></li>
              </ul>
            </div>
          </aside>

          {/* CONTENT */}
          <div className="lg:col-span-9 space-y-14">
            {/* ABOUT */}
            <Section id="about" title="Về MCBROTHER">
              <div className="prose max-w-none prose-slate">
                <p>
                  {COMPANY.name} được thành lập năm 2013 với định hướng trở thành đối tác giải pháp đáng tin cậy
                  cho các doanh nghiệp trong ngành thực phẩm. Chúng tôi kết hợp tư duy hệ thống với kinh nghiệm hiện trường
                  để đưa ra khuyến nghị phù hợp — không bán cho bạn một thiết bị, mà mang đến năng lực vận hành bền vững.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl border bg-white p-6 text-center shadow-sm">
                    <div className="text-2xl md:text-3xl font-bold text-[#2653ED]">{s.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{s.label}</div>
                  </div>
                ))}
              </div>
            </Section>

            {/* MISSION & VISION */}
            <Section id="mission" title="Sứ mệnh & Tầm nhìn">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border p-6 bg-white shadow-sm">
                  <h3 className="font-semibold">Sứ mệnh</h3>
                  <p className="text-slate-600 mt-2">
                    Nâng cao hiệu quả sản xuất thực phẩm tại Việt Nam thông qua các giải pháp thiết bị an toàn,
                    ổn định và tối ưu chi phí sở hữu (TCO).
                  </p>
                </div>
                <div className="rounded-2xl border p-6 bg-white shadow-sm">
                  <h3 className="font-semibold">Tầm nhìn</h3>
                  <p className="text-slate-600 mt-2">
                    Trở thành doanh nghiệp dẫn dắt về trải nghiệm dịch vụ và chuẩn hóa tài liệu kỹ thuật cho ngành
                    thiết bị chế biến — đóng gói, góp phần thúc đẩy tiêu chuẩn chất lượng sản phẩm Việt Nam.
                  </p>
                </div>
              </div>
            </Section>

            {/* CORE VALUES */}
            <Section id="values" title="Giá trị cốt lõi">
              <div className="grid md:grid-cols-2 gap-4">
                {VALUES.map((v) => (
                  <div key={v.title} className="rounded-2xl border p-6 bg-white shadow-sm">
                    <h3 className="text-lg font-semibold">{v.title}</h3>
                    <p className="text-slate-600 mt-1">{v.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* METHOD */}
            <Section id="method" title="Phương pháp triển khai">
              <ol className="relative border-s pl-6 space-y-6">
                {METHODS.map((m) => (
                  <li key={m.step}>
                    <span className="absolute -left-[9px] mt-1 h-5 w-5 rounded-full border-2 border-[#2653ED] bg-white flex items-center justify-center text-xs font-bold text-[#2653ED]">{m.step}</span>
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                      <div className="font-semibold">{m.title}</div>
                      <p className="text-slate-600 mt-1">{m.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            {/* CAPABILITIES */}
            <Section id="capabilities" title="Năng lực cốt lõi">
              <div className="grid md:grid-cols-2 gap-4">
                {CAPABILITIES.map((cap) => (
                  <div key={cap.area} className="rounded-2xl border p-6 bg-white shadow-sm">
                    <h3 className="font-semibold">{cap.area}</h3>
                    <ul className="list-disc pl-5 mt-2 text-slate-700 space-y-1">
                      {cap.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            {/* TIMELINE */}
            <Section id="timeline" title="Hành trình phát triển">
              <ol className="relative border-s pl-6 space-y-6">
                {TIMELINE.map((t) => (
                  <li key={t.year}>
                    <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 border-[#2653ED] bg-white" />
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                      <div className="text-sm text-slate-500">{t.year}</div>
                      <div className="font-semibold">{t.title}</div>
                      <p className="text-slate-600 mt-1">{t.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

           
            {/* LEGAL & CONTACT SUMMARY */}
            <Section id="legal" title="Thông tin pháp lý & liên hệ">
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border p-6 bg-white shadow-sm">
                  <h3 className="font-semibold">Thông tin doanh nghiệp</h3>
                  <ul className="mt-2 space-y-1 text-slate-700">
                    <li><strong>Pháp nhân:</strong> {COMPANY.name}</li>
                    <li><strong>GCN ĐKKD:</strong> {COMPANY.registration.number}</li>
                    <li><strong>Ngày cấp:</strong> 10/04/2013</li>
                    <li><strong>Nơi cấp:</strong> {COMPANY.registration.issuer}</li>
                    <li><strong>Địa chỉ:</strong> {COMPANY.address}</li>
                  </ul>
                </div>
                <div className="rounded-2xl border p-6 bg-white shadow-sm">
                  <h3 className="font-semibold">Liên hệ</h3>
                  <ul className="mt-2 space-y-1 text-slate-700">
                    <li>
                      <strong>Hotline:</strong>{" "}
                      <a className="text-[#2653ED] font-medium" href={`tel:${COMPANY.hotline.replaceAll(' ', '')}`}>{COMPANY.hotline}</a>
                    </li>
                    <li>
                      <strong>Email:</strong>{" "}
                      <a className="text-[#2653ED]" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                    </li>
                    <li>
                      <strong>Website:</strong>{" "}
                      <a className="text-[#2653ED]" href={COMPANY.website} target="_blank">mcbrother.net</a>
                    </li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* CULTURE & TEAM (ảnh minh hoạ)
            <Section id="culture" title="Văn hoá & Đội ngũ">
              <div className="grid md:grid-cols-3 gap-4">
                {[1,2,3].map((i) => (
                  <div key={i} className="aspect-[4/3] relative rounded-xl overflow-hidden ring-1 ring-slate-200">
                    <Image src={`/images/about/team-${i}.jpg`} alt={`Team ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-slate-600 mt-4">
                Chúng tôi đề cao tinh thần học hỏi, an toàn và tôn trọng khách hàng. Mỗi dự án thành công là kết quả của
                sự phối hợp giữa kỹ thuật, tư vấn và dịch vụ hậu mãi.
              </p>
            </Section>

            {/* PARTNERS (logo hàng đối tác) */}
            {/* <Section id="partners" title="Đối tác & khách hàng tiêu biểu">
              <div className="rounded-2xl border p-6 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                  {PARTNERS.map((src, idx) => (
                    <div key={idx} className="relative h-10 md:h-12 w-32 md:w-40 opacity-80 hover:opacity-100 transition">
                      <Image src={src} alt={`Partner ${idx+1}`} fill className="object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            </Section> */}

            {/* CAREERS CTA */}
            {/* <Section id="careers">
              <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-[#2653ED] to-[#1b3db2] p-6 md:p-10 text-white">
                <div className="max-w-3xl">
                  <h3 className="text-2xl md:text-3xl font-bold">Gia nhập MCBROTHER</h3>
                  <p className="text-white/90 mt-2">
                    Nếu bạn yêu thích môi trường kỹ thuật, dịch vụ khách hàng và mong muốn tạo giá trị thực, hãy liên hệ để biết cơ hội phù hợp.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/tuyen-dung" className="px-4 py-2 rounded-lg bg-[#F5ED42] text-black font-medium hover:opacity-90">Xem vị trí mở</Link>
                    <Link href={`mailto:${COMPANY.email}`} className="px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/30 backdrop-blur hover:bg-white/20">Gửi CV</Link>
                  </div>
                </div>
                <Image src="/images/about/career.png" alt="Careers" width={420} height={260} className="hidden md:block absolute -right-6 -bottom-6 opacity-90" />
              </div>
            </Section> */}

            {/* CONTACT + MAP */}
            {/* <Section id="contact" title="Liên hệ & Bản đồ">
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border p-6 bg-white shadow-sm">
                  <h3 className="font-semibold">Liên hệ nhanh</h3>
                  <p className="text-slate-700 mt-2">Hotline: <a className="text-[#2653ED] font-medium" href={`tel:${COMPANY.hotline.replaceAll(' ', '')}`}>{COMPANY.hotline}</a></p>
                  <p className="text-slate-700">Email: <a className="text-[#2653ED]" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
                  <p className="text-slate-700">Zalo: <a className="text-[#2653ED]" href={COMPANY.zalo} target="_blank">Nhắn Zalo</a></p>
                  <p className="text-slate-700">Địa chỉ: {COMPANY.address}</p>
                </div>
                <div className="rounded-2xl overflow-hidden border">
                  {/* TODO: Thay src Google Maps thật của công ty */}
                  {/* <iframe
                    title="Bản đồ MCBROTHER"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221.65847940509272!2d106.59103609453759!3d10.807521690744872!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b9b242e47c1%3A0x5e480b67c566bbf9!2zQ8O0bmcgdHkgY-G7lSBwaOG6p24gdGhp4bq_dCBi4buLIE1DQlJPVEhFUg!5e1!3m2!1svi!2s!4v1759564926729!5m2!1svi!2s"
                    width="100%"
                    height="360"
                    loading="lazy"
                    className="w-full"
                  />
                </div>
              </div>
            </Section> */} 

          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="hidden md:block py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
      </div>
    </main>
  );
}
