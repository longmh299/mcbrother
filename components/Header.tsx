"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BLUE = "#2653ed";
const YELLOW = "#f5ed42";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Đóng menu khi đổi route
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const nav = [
    { href: "/", label: "Trang chủ" },
    { href: "/gioi-thieu", label: "Giới thiệu" },
    { href: "/san-pham", label: "Sản phẩm" },
    { href: "/tin-tuc", label: "Tin tức" },
    { href: "/lien-he", label: "Liên hệ" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const linkClass = (active: boolean) =>
    `px-3 py-2 rounded-md text-sm md:text-[15px] font-medium transition
     ${
       active
         ? "bg-[#f5ed42] text-black"
         : "text-white/95 hover:bg-[#f5ed42] hover:text-black"
     }`;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10">
      <div
        className="bg-[#2653ed] text-white/95"
        style={{ backgroundColor: BLUE }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 md:h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="MCBROTHER JSC"
          >
            <img
              src="/images/logo.png"
              alt="MCBROTHER JSC"
              className="h-10 md:h-12 w-auto"
            />
            <span
            className="
              font-semibold whitespace-nowrap leading-tight truncate
              text-[15px] sm:text-base md:text-lg
              max-w-[55vw] sm:max-w-[40vw] lg:max-w-[28rem]
            "
            title="MCBROTHER JSC"
          >
            MCBROTHER JSC
          </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(isActive(item.href))}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Hamburger mobile */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Mở menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {!open ? (
              // icon hamburger
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 6h18v2H3zm0 5.5h18v2H3zM3 17h18v2H3z" />
              </svg>
            ) : (
              // icon close
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.4 4.9 4.9 6.4 10.5 12l-5.6 5.6 1.5 1.5L12 13.5l5.6 5.6 1.5-1.5L13.5 12l5.6-5.6-1.5-1.5L12 10.5z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Panel trượt từ phải */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-[#2653ed] shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/20">
          <span className="font-semibold text-white">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
            className="p-2 hover:bg-white/10 rounded-md"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-white"
              fill="currentColor"
            >
              <path d="M6.4 4.9 4.9 6.4 10.5 12l-5.6 5.6 1.5 1.5L12 13.5l5.6 5.6 1.5-1.5L13.5 12l5.6-5.6-1.5-1.5L12 10.5z" />
            </svg>
          </button>
        </div>
        <nav aria-label="Mobile Navigation">
          <ul className="py-2">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-5 py-3 text-base ${
                      active
                        ? "bg-[#f5ed42] text-black"
                        : "text-white hover:bg-[#f5ed42] hover:text-black"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
