// app/gioi-thieu/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu | MCBROTHER JSC",
  description:
    "MCBROTHER JSC – Nhà cung cấp máy móc chế biến & đóng gói thực phẩm. Hơn 10 năm kinh nghiệm, dịch vụ tận nơi, bảo hành chính hãng.",
  openGraph: {
    title: "Giới thiệu | MCBROTHER JSC",
    description:
      "Giới thiệu về MCBROTHER JSC – Đối tác tin cậy trong lĩnh vực máy móc chế biến, đóng gói.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/gioi-thieu`,
  },
};

const BANNER_URL = process.env.NEXT_PUBLIC_ABOUT_BANNER; // optional remote banner

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* BANNER / HERO */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-sky-500" />
        {BANNER_URL ? (
          <img
            src={BANNER_URL}
            alt="MCBROTHER banner"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        ) : null}
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-16 md:py-24 text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            MCBROTHER JSC
          </h1>
          <p className="mt-4 text-white/90 max-w-2xl">
            Giải pháp máy móc chế biến & đóng gói thực phẩm – Tối ưu vận hành, nâng tầm chất lượng.
          </p>
        </div>
      </section>

      {/* NỘI DUNG */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16 space-y-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Về chúng tôi</h2>
            <p className="text-gray-700">
              Thành lập từ năm 2013, <strong>MCBROTHER JSC</strong> tập trung cung cấp và tích hợp
              các giải pháp máy móc trong lĩnh vực chế biến – đóng gói thực phẩm: máy hút chân không,
              máy co màng, máy in date, cân đóng gói… Chúng tôi đồng hành cùng hàng nghìn doanh nghiệp,
              tối ưu hiệu suất và đảm bảo tiêu chuẩn chất lượng.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Hơn 10 năm kinh nghiệm triển khai thực tế</li>
              <li>Hệ sinh thái máy móc đa dạng – sẵn kho</li>
              <li>Dịch vụ lắp đặt, bảo trì tận nơi</li>
              <li>Đội ngũ kỹ thuật được đào tạo bài bản</li>
            </ul>
          </div>

          <div className="rounded-2xl overflow-hidden border shadow-sm">
            {/* thay ảnh tùy ý */}
            <img
              src="/images/gioithieu.jpg"
              alt="MCBROTHER factory"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Giá trị cốt lõi */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Chất lượng & an toàn", desc: "Thiết bị đạt chuẩn, quy trình kiểm định chặt chẽ." },
            { title: "Tối ưu chi phí", desc: "Giải pháp phù hợp ngân sách, nâng cao hiệu suất." },
            { title: "Hậu mãi tin cậy", desc: "Bảo hành chính hãng, kỹ thuật hỗ trợ nhanh chóng." },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl border hover:shadow-sm transition">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-700 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Thông tin pháp lý & liên hệ nhanh */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl bg-gray-50 border">
            <h3 className="font-semibold text-lg mb-2">Thông tin doanh nghiệp</h3>
            <p className="text-gray-700">
              Địa chỉ: <strong>33 đường số 5, KDC Vĩnh Lộc, P. Bình Hưng Hòa B, Q. Bình Tân, TP.HCM</strong>
            </p>
            <p className="text-gray-700">GCN ĐKKD: <strong>0312229437</strong></p>
            <p className="text-gray-700">Ngày cấp: <strong>10/04/2013</strong></p>
            <p className="text-gray-700">Nơi cấp: <strong>Sở Kế Hoạch Và Đầu Tư TP.HCM</strong></p>
          </div>

          <div className="p-6 rounded-xl bg-gray-50 border">
            <h3 className="font-semibold text-lg mb-2">Liên hệ nhanh</h3>
            <p className="text-gray-700">Hotline: <a href="tel:0834551888" className="text-sky-700 font-semibold">0834 551 888</a></p>
            <p className="text-gray-700">Email: <a href="mailto:info@mcbrother.net" className="text-sky-700">info@mcbrother.net</a></p>
            <p className="text-gray-700">Website: <a href="https://mcbrother.net" className="text-sky-700" target="_blank">mcbrother.net</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}
