"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  id: number;
  slug: string;
  name: string;
  short?: string | null;
  coverImage?: string | null;
  price?: number | null;
  createdAt?: Date | string | null;
};

function fmtVND(n?: number | null) {
  if (typeof n !== "number") return "Liên hệ";
  try {
    return new Intl.NumberFormat("vi-VN").format(n) + "₫";
  } catch {
    return "Liên hệ";
  }
}

function useSlidesPerView() {
  const [spv, setSpv] = useState(1);
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w >= 1280) setSpv(5);
      else if (w >= 1024) setSpv(4);
      else if (w >= 768) setSpv(3);
      else if (w >= 640) setSpv(2);
      else setSpv(1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return spv;
}

export default function FeaturedSlider({
  items,
  title = "Sản phẩm nổi bật",
  viewAllHref = "/san-pham",
  autoplayMs = 4500,
}: {
  items: Item[];
  title?: string;
  viewAllHref?: string;
  autoplayMs?: number;
}) {
  const spv = useSlidesPerView();
  const maxIndex = Math.max(0, items.length - spv);

  const [index, setIndex] = useState(0);
  const [isHover, setHover] = useState(false);

  // autoplay
  useEffect(() => {
    if (isHover || maxIndex === 0) return;
    const t = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, autoplayMs);
    return () => clearInterval(t);
  }, [isHover, maxIndex, autoplayMs]);

  // giữ index hợp lệ khi spv đổi
  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [spv, maxIndex, index]);

  // translate theo viewport: -index * (100% / spv)
  const translate = useMemo(
    () => `translateX(calc(${-index} * (100% / var(--spv))))`,
    [index]
  );

  // swipe
  const swipe = useRef({ active: false, startX: 0, moved: 0 });
  const SWIPE_DIST = 40;
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current.active = true;
    swipe.current.startX = e.clientX;
    swipe.current.moved = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!swipe.current.active) return;
    swipe.current.moved = e.clientX - swipe.current.startX;
  };
  const onPointerUp = () => {
    if (!swipe.current.active) return;
    const dx = swipe.current.moved;
    swipe.current.active = false;
    if (Math.abs(dx) > SWIPE_DIST) {
      if (dx < 0) setIndex((i) => Math.min(i + 1, maxIndex));
      else setIndex((i) => Math.max(i - 1, 0));
    }
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (Math.abs(swipe.current.moved) > SWIPE_DIST) {
      e.preventDefault();
      e.stopPropagation();
    }
    swipe.current.moved = 0;
  };

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <section className="relative max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-5">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
        <Link href={viewAllHref} className="text-sm text-sky-700 hover:underline">
          Xem tất cả
        </Link>
      </div>

      {/* Prev/Next desktop */}
      {maxIndex > 0 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="hidden md:flex absolute left-2 top-[calc(50%+12px)] -translate-y-1/2 z-10
                       h-9 w-9 items-center justify-center rounded-full bg-white shadow border
                       hover:bg-gray-50"
            aria-label="Trước"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="hidden md:flex absolute right-2 top-[calc(50%+12px)] -translate-y-1/2 z-10
                       h-9 w-9 items-center justify-center rounded-full bg-white shadow border
                       hover:bg-gray-50"
            aria-label="Sau"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}

      {/* VIEWPORT */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ ["--spv" as any]: spv }} /* mỗi card = 100% / --spv */
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
      >
        {/* TRACK */}
        <ul
          className="flex will-change-transform transition-transform duration-500 ease-out"
          style={{
            width: `calc(100% * ${items.length} / var(--spv))`,
            transform: translate,
          }}
        >
          {items.map((p, idx) => {
            const createdAt = p.createdAt ? new Date(p.createdAt) : null;
            const isNew = createdAt
              ? (Date.now() - createdAt.getTime()) / 86400000 <= 30
              : false;
            const isHot = idx < 3;

            return (
              <li
                key={p.id}
                className="shrink-0"
                style={{ width: "calc(100% / var(--spv))" }} // mỗi slide = 1/spv viewport
              >
                <Link
                  href={`/san-pham/${p.slug}`}
                  className="group mx-2 block overflow-hidden rounded-2xl border border-gray-200 bg-white
                             transition hover:border-sky-200 hover:shadow-lg h-full"
                >
                  {/* Ảnh: KHỐNG CHẾ CHIỀU CAO theo bp để không bao giờ to quá */}
                  <div className="overflow-hidden bg-gray-50
                                  h-[190px] sm:h-[200px] md:h-[210px] lg:h-[220px] xl:h-[230px]">
                    {p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Nội dung: giữ chiều cao ổn định */}
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

                  {/* Badges */}
                  {/* <div className="absolute left-2 top-2 flex flex-col gap-1 pointer-events-none">
                    {isHot && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500
                                       px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/30">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                          <path d="M13.5 2.1c.3 2.3-1 3.4-2.7 4.8C9 8 8 9.2 8 11.2c0 2.6 2.1 4.8 4.8 4.8 3 0 5.2-2.6 4.6-5.6-.4-2-2.1-3-2.5-5.5-.1-.6.2-1.6.6-2.7-1.1.2-1.9.6-2.1.9Z" />
                        </svg>
                      
                      </span>
                    )}
                    {isNew && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500
                                       px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/30">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                          <path d="M12 2l1.6 4.2L18 8l-4.4 1.8L12 14l-1.6-4.2L6 8l4.4-1.8L12 2zM5 16l.9 2.4L8 19l-2.1.6L5 22l-.9-2.4L2 19l2.1-.6L5 16zm14 0l.9 2.4L22 19l-2.1.6L19 22l-.9-2.4L16 19l2.1-.6L19 16z" />
                        </svg>
                        
                      </span>
                    )}
                  </div> */}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Dots */}
      {maxIndex > 0 && (
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              aria-label={`Trang ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-6 bg-[#2653ed]" : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
