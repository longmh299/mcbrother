"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Cat = { name: string; slug: string };

const BLUE = "#2653ED";
const YELLOW = "#F5ED42";

export default function Header({ categories = [] }: { categories: Cat[] }) {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);

  // Đóng panel khi đổi route
  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  // Khóa scroll khi mở overlay
  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  const nav = [
    { href: "/", label: "Trang chủ" },
    { href: "/gioi-thieu", label: "Giới thiệu" },
    { href: "/san-pham", label: "Sản phẩm" }, // dropdown 2 cột
    { href: "/tin-tuc", label: "Tin tức" },
    { href: "/lien-he", label: "Liên hệ" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  // gạch chân vàng (hover + active)
  const baseLink =
    "group relative px-2.5 py-2 text-sm font-medium text-white/95 rounded " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 " +
    "after:absolute after:content-[''] after:left-2 after:right-2 after:-bottom-1 " +
    "after:h-0.5 after:bg-[#F5ED42] after:origin-center after:scale-x-0 " +
    "after:transition-transform after:duration-200 group-hover:after:scale-x-100";

  return (
    <header role="banner" className="sticky top-0 z-50">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[60] rounded bg-white px-3 py-2 text-sm text-black shadow"
      >
        Bỏ qua và tới nội dung chính
      </a>

      {/* ===== Brand bar (phần trắng trên menu) ===== */}
      <div className="hidden md:block bg-white dark:bg-neutral-950 border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-3 md:gap-5 py-2">
            {/* Logo */}
            <Link href="/" aria-label="MCBROTHER JSC" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="MCBROTHER JSC"
                width={56}
                height={56}
                className="rounded-full"
                priority
              />
            </Link>

            {/* Tiêu đề + Tagline */}
            <div className="leading-tight text-center">
              <h1
                className="uppercase font-extrabold tracking-tight"
                style={{
                  color: "#dc2626",
                  WebkitTextStrokeWidth: 1.4,
                  WebkitTextStrokeColor: "#fff",
                  textShadow: "0 0 1px #fff, 0 0 2px #fff",
                  fontSize: "clamp(20px, 2.6vw, 42px)",
                  lineHeight: 1.1,
                }}
              >
                CÔNG TY CỔ PHẦN THIẾT BỊ MCBROTHER
              </h1>
              <p
                className="font-medium"
                style={{ color: "#1e4b8f", fontSize: "clamp(13px, 1.4vw, 18px)" }}
              >
                Cung cấp thiết bị & công nghệ ngành thực phẩm, dược phẩm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== NAV BAR (thanh xanh) ===== */}
      <div
        className="bg-[#2653ED]/95 text-white backdrop-blur supports-[backdrop-filter]:bg-[#2653ED]/85 shadow-[0_1px_0_rgba(0,0,0,.06)]"
        style={{ backgroundColor: BLUE }}
      >
        <div className="container h-14 flex items-center gap-3">
          {/* Logo nhỏ mobile */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 md:hidden"
            aria-label="MCBROTHER JSC"
          >
            <Image
              src="/images/logo.png"
              alt="MCBROTHER JSC"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-semibold tracking-tight">MCBROTHER</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-4" aria-label="Chính">
            {nav.map((item) => {
              const active = isActive(item.href);

              if (item.href === "/san-pham") {
                return (
                  <div key="san-pham" className="relative group">
                    <Link
                      href="/san-pham"
                      className={`${baseLink} ${active ? "after:scale-x-100" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>

                    {/* Dropdown 2 cột */}
                    <div className="pointer-events-none absolute left-1/2 top-full z-50 hidden -translate-x-1/2 pt-2 group-hover:block group-focus-within:block">
                      <div className="pointer-events-auto w-[560px] rounded-2xl bg-[#2653ED] text-white/95 backdrop-blur p-2.5 shadow-2xl">
                        <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
                          {categories.map((c) => (
                            <Link
                              key={c.slug}
                              href={`/san-pham?cat=${encodeURIComponent(c.slug)}`}
                              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#F5ED42] hover:text-gray-900"
                            >
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-white group-hover:bg-white/20 group-hover:text-gray-900 shrink-0">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                                </svg>
                              </span>
                              <span className="text-[13px] font-medium leading-5 line-clamp-1">
                                {c.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-[11px] text-white/80">{categories.length} danh mục</span>
                          <Link
                            href="/san-pham"
                            className="text-[11px] rounded px-2 py-1 text-white/90 hover:bg-[#F5ED42] hover:text-gray-900"
                          >
                            Xem tất cả →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Mục khác
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${baseLink} ${active ? "after:scale-x-100" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ===== Khối bên phải: SEARCH DESKTOP + CTA + HAMBURGER ===== */}
          <div className="ms-auto flex items-center gap-1 sm:gap-2 min-w-0">
            {/* Search desktop: chỉ hiện từ md trở lên */}
            <form action="/tim-kiem" role="search" className="hidden md:flex items-center shrink-0">
              <div className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 focus-within:bg-white/20 focus-within:border-white/30 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-80">
                  <path d="M21 21l-4.2-4.2M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <label htmlFor="q" className="sr-only">Tìm sản phẩm / bài viết</label>
                <input id="q" name="q" placeholder="Tìm tên / SKU…" className="w-64 lg:w-80 bg-transparent placeholder:text-white/70 text-sm outline-none" />
                <button type="submit" className="rounded-full bg-white/20 px-3 py-1 text-sm hover:bg-white/30">Tìm</button>
              </div>
            </form>

            {/* Zalo – ẩn trên rất nhỏ, hiện từ sm trở lên */}
            <Link
              href="https://zalo.me/0834551888"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/35 px-3 py-1.5 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shrink-0"
              aria-label="Chat Zalo 0834 551 888"
            >
              <img src="/images/zalo.svg" alt="Zalo" className="h-4 w-4" />
              Zalo
            </Link>

            {/* Phone CTA: icon trên mobile, pill từ sm trở lên */}
            <a
              href="tel:0834551888"
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[linear-gradient(180deg,#FFF77A_0%,#F5ED42_100%)] text-gray-900 shadow hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 shrink-0"
              aria-label="Gọi 0834 551 888"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.6 3.2 3.4 5 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3.1.6.5 0 .9.4.9.9V20c0 .5-.4.9-.9.9C10.7 20.9 3.1 13.3 3.1 3.9c0-.5.4-.9.9-.9H7c.5 0 .9.4.9.9 0 1.1.2 2.1.6 3.1.1.4 0 .9-.2 1.2l-2.2 2.6Z" />
              </svg>
            </a>
            <a
              href="tel:0834551888"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#FFF77A_0%,#F5ED42_100%)] px-3 py-1.5 text-sm font-semibold text-gray-900 shadow hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 shrink-0"
              aria-label="Gọi 0834 551 888"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8c1.6 3.2 3.4 5 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3.1.6.5 0 .9.4.9.9V20c0 .5-.4.9-.9.9C10.7 20.9 3.1 13.3 3.1 3.9c0-.5.4-.9.9-.9H7c.5 0 .9.4.9.9 0 1.1.2 2.1.6 3.1.1.4 0 .9-.2 1.2l-2.2 2.6Z" />
              </svg>
              0834 551 888
            </a>

            {/* Hamburger (mobile menu) */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 shrink-0"
              aria-label="Mở menu"
              aria-expanded={openMenu}
              onClick={() => setOpenMenu((v) => !v)}
            >
              {!openMenu ? (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                  <path d="M3 6h18v2H3zm0 5.5h18v2H3zM3 17h18v2H3z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                  <path d="M6.4 4.9 4.9 6.4 10.5 12l-5.6 5.6 1.5 1.5L12 13.5l5.6 5.6 1.5-1.5L13.5 12l5.6-5.6-1.5-1.5L12 10.5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay cho menu (mobile) */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 transition-opacity duration-200 ${
          openMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenMenu(false)}
        aria-hidden={!openMenu}
      />

      {/* ===== Panel menu mobile (đẹp hơn) ===== */}
      <div
        role="dialog"
        aria-modal="true"
        className={`md:hidden fixed top-[56px] right-0 h-[calc(100dvh-56px)] w-72
                    bg-[#2653ED]/95 backdrop-blur text-white
                    shadow-2xl ring-1 ring-white/10 rounded-l-2xl
                    transform transition-transform duration-300 ease-in-out
                    ${openMenu ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header trong panel */}
        <div className="sticky top-0 z-10 bg-[#2653ED]/95 backdrop-blur px-4 py-3 flex items-center justify-between border-b border-white/10 rounded-tl-2xl">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="" className="h-6 w-6 rounded-full" />
            <span className="font-semibold">MCBROTHER</span>
          </div>
          <button
            onClick={() => setOpenMenu(false)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Đóng menu"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M6.4 4.9 4.9 6.4 10.5 12l-5.6 5.6 1.5 1.5L12 13.5l5.6 5.6 1.5-1.5L13.5 12l5.6-5.6-1.5-1.5L12 10.5z" />
            </svg>
          </button>
        </div>

        {/* Danh mục + CTA */}
        <nav aria-label="Chính (mobile)" className="h-full overflow-y-auto">
          <ul className="py-2 px-3 space-y-1">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-5 py-3 text-base rounded-md transition
                                ${
                                  active
                                    ? "relative bg-[#F5ED42] text-gray-900"
                                    : "text-white hover:bg-[#F5ED42] hover:text-gray-900"
                                } focus:outline-none focus:ring-2 focus:ring-white/50`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenMenu(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {/* Divider */}
            <li>
              <div className="my-2 h-px bg-white/10" />
            </li>

            {/* CTA */}
            <li className="mt-1">
              <a
                href="tel:0834551888"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full
                           bg-[linear-gradient(180deg,#FFF77A_0%,#F5ED42_100%)]
                           px-4 py-2.5 font-semibold text-gray-900 shadow hover:brightness-105"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M6.6 10.8c1.6 3.2 3.4 5 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3.1.6.5 0 .9.4.9.9V20c0 .5-.4.9-.9.9C10.7 20.9 3.1 13.3 3.1 3.9c0-.5.4-.9.9-.9H7c.5 0 .9.4.9.9 0 1.1.2 2.1.6 3.1.1.4 0 .9-.2 1.2l-2.2 2.6Z" />
                </svg>
                Gọi 0834 551 888
              </a>
            </li>
            <li className="pb-3">
              <Link
                href="https://zalo.me/0834551888"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full
                           border border-white/35 px-4 py-2.5"
                onClick={() => setOpenMenu(false)}
              >
                <img src="/images/zalo.svg" alt="Zalo" className="h-4 w-4" />
                Chat Zalo
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
