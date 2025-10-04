// components/Footer.tsx
import Link from "next/link";

const BLUE = "#2653ed";
const YELLOW = "#f5ed42";

// để đơn giản mình viết icon ngay trong mảng
const socials = [
  {
    key: "ytb",
    label: "YouTube",
    href: "https://www.youtube.com/@mcbrotherjsc",
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" {...props} fill="currentColor">
        <path d="M23.5 6.2a4 4 0 0 0-2.8-2.8C18.9 3 12 3 12 3s-6.9 0-8.7.4A4 4 0 0 0 .5 6.2 41 41 0 0 0 0 12a41 41 0 0 0 .5 5.8 4 4 0 0 0 2.8 2.8C5.1 21 12 21 12 21s6.9 0 8.7-.4a4 4 0 0 0 2.8-2.8A41 41 0 0 0 24 12a41 41 0 0 0-.5-5.8zM9.5 15.5v-7L16 12l-6.5 3.5z"/>
      </svg>
    ),
  },
  {
    key: "fb",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100063588310367&ref=embed_page#",
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" {...props} fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.7c0-2.6 1.5-4 3.9-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"/>
      </svg>
    ),
  },
  {
    key: "zalo",
    label: "Zalo",
    href: "https://zalo.me/0834551888",
    // logo chuẩn bạn đặt tại public/images/zalo-official.svg
    icon: (props: any) => (
      <img src="/images/zalo.svg" alt="Zalo" {...props} />
    ),
  },
  {
    key: "tt",
    label: "TikTok",
    href: "https://www.tiktok.com/@mcbrother.jsc",
    icon: (props: any) => (
      <svg viewBox="0 0 24 24" {...props} fill="currentColor">
        <path d="M16 8.3a6 6 0 0 0 4 1.5V13a9 9 0 0 1-4-.9v4.3a5.5 5.5 0 1 1-5.5-5.5c.2 0 .4 0 .6.1v3a2.5 2.5 0 1 0 1.9 2.4V3h3v5.3z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      className="mt-16 border-t border-black/10"
      style={{ backgroundColor: BLUE }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 text-white">
        {/* Grid: mobile 1 col, từ md chia 12 col */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-10 items-start">
          {/* Cột 1: 5/12 */}
          <div className="md:col-span-5 space-y-5">
            <h3
              className="text-2xl md:text-3xl font-extrabold uppercase leading-tight"
              style={{ color: YELLOW }}
            >
              Công ty cổ phần<br className="hidden sm:block" />
              thiết bị MCBROTHER
            </h3>

            {/* Icon social trần */}
            <div className="flex items-center gap-5">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="transition hover:text-[#f5ed42]"
                >
                  <s.icon className="w-8 h-8 text-white" />
                </a>
              ))}
            </div>

            {/* Logo Bộ Công Thương */}
            <a
              href="http://online.gov.vn/Home/WebDetails/51361/"
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <img
                src="/images/bo-cong-thuong.png"
                alt="Đã thông báo Bộ Công Thương"
                className="h-14 md:h-16 w-auto"
              />
            </a>
          </div>

          {/* Cột 2: 3/12 */}
          <div className="md:col-span-3">
            <h4 className="font-semibold mb-3">Chính sách</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="hover:text-black hover:bg-[#f5ed42] rounded px-1 py-0.5"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-giao-hang"
                  className="hover:text-black hover:bg-[#f5ed42] rounded px-1 py-0.5"
                >
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="hover:text-black hover:bg-[#f5ed42] rounded px-1 py-0.5"
                >
                  Liên hệ công ty
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: 4/12 */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-semibold mb-3">Thông tin liên hệ</h4>
            <p>
              Địa chỉ:{" "}
              <strong>
                33 đường số 5, KDC Vĩnh Lộc, P. Bình Hưng Hòa B, Q. Bình Tân,
                TP.HCM
              </strong>
            </p>
            <p>
              Hotline:{" "}
              <a
                href="tel:0834551888"
                className="font-semibold underline underline-offset-4 decoration-white/50 hover:text-black hover:bg-[#f5ed42] rounded px-1"
              >
                0834 551 888
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@mcbrother.net"
                className="underline underline-offset-4 decoration-white/50 hover:text-black hover:bg-[#f5ed42] rounded px-1"
              >
                mcbrother2013@gmail.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a
                href="https://mcbrother.net"
                target="_blank"
                className="underline underline-offset-4 decoration-white/50 hover:text-black hover:bg-[#f5ed42] rounded px-1"
              >
                mcbrother.net
              </a>
            </p>
            <p>
              Số GCN ĐKKD: <strong>0312229437</strong> • Ngày cấp:{" "}
              <strong>10/04/2013</strong>
              <br />
              Nơi cấp: <strong>Sở Kế Hoạch Và Đầu Tư TP.HCM</strong>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <p className="text-center text-xs text-white/80">
            © {new Date().getFullYear()} MCBROTHER JSC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
