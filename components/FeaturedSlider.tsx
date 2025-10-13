"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type Item = {
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
      if (w >= 1536) setSpv(5);
      else if (w >= 1280) setSpv(4);
      else if (w >= 1024) setSpv(3);
      else if (w >= 640) setSpv(2);
      else setSpv(1);
    };
    calc();
    window.addEventListener("resize", calc, { passive: true });
    return () => window.removeEventListener("resize", calc);
  }, []);
  return spv;
}

type Props = {
  title?: string;
  items: Item[];
  viewAllHref?: string;
  autoplayMs?: number;
  showDots?: boolean;
};

export default function FeaturedSlider({
  title = "Sản phẩm nổi bật",
  items,
  viewAllHref = "/san-pham",
  autoplayMs = 4500,
  showDots = true,
}: Props) {
  const spv = useSlidesPerView();
  const maxIndex = Math.max(0, items.length - spv);

  const [index, setIndex] = useState(0);
  const [isHover, setHover] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const startX = useRef(0);
  const deltaX = useRef(0);

  // autoplay
  useEffect(() => {
    if (isHover || isTouching || maxIndex === 0) return;
    const t = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, autoplayMs);
    return () => clearInterval(t);
  }, [isHover, isTouching, autoplayMs, maxIndex]);

  // clamp index nếu spv đổi
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, items.length - spv)));
  }, [spv, items.length]);

  const slideWidthPct = useMemo(() => 100 / spv, [spv]);
  const translate = `translate3d(${-index * slideWidthPct}%,0,0)`;

  // Handlers swipe/drag (mobile)
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    setIsTouching(true);
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    deltaX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    setIsTouching(false);
    // ngưỡng ~ 1/6 chiều rộng viewport
    const threshold = Math.min(120, window.innerWidth / 6);
    if (deltaX.current > threshold) setIndex((i) => Math.max(0, i - 1));
    else if (deltaX.current < -threshold) setIndex((i) => Math.min(maxIndex, i + 1));
  };

  return (
    <section
      className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
        <Link href={viewAllHref} className="text-sm text-sky-700 hover:underline">
          Xem tất cả
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500">Chưa có sản phẩm.</div>
      ) : (
        <div
          className="relative overflow-hidden select-none"
          style={{ touchAction: "pan-y" }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* TRACK: transform-gpu để tránh mất ảnh khi translate trên mobile */}
          <ul
            className="flex will-change-transform transform-gpu transition-transform duration-500 ease-out"
            style={{
              width: `${(items.length * 100) / spv}%`,
              transform: translate,
            }}
            aria-live="polite"
          >
            {items.map((p, idx) => {
              const isVisible = idx >= index && idx < index + spv;
              const isNext = idx >= index - 1 && idx <= index + spv;

              return (
                <li
                  key={p.id}
                  className="px-2 md:px-3"
                  style={{ width: `${slideWidthPct}%`, minWidth: `${slideWidthPct}%` }}
                >
                  <article className="h-full rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Khung ảnh: cố định tỉ lệ giúp không “bành” trên mobile */}
                    <div className="relative bg-gray-50 overflow-hidden aspect-[4/3] md:h-[220px] lg:h-[240px] xl:h-[260px] max-h-[320px]">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.name}
                          fill
                          className="object-contain"
                          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                          draggable={false}
                          // ép ảnh đang thấy ưu tiên vẽ để tránh khung trắng
                          loading={isVisible || isNext ? "eager" : "lazy"}
                          fetchPriority={isVisible ? "high" : "auto"}
                          priority={isVisible}
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="text-[13px] text-gray-500">Liên hệ</div>
                      <Link
                        href={`/san-pham/${p.slug}`}
                        className="block font-medium text-sky-700 hover:underline"
                      >
                        {p.name}
                      </Link>
                      {p.short ? (
                        <p className="line-clamp-2 text-sm text-gray-600">{p.short}</p>
                      ) : null}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {/* Prev/Next (ẩn trên mobile nếu muốn) */}
          {maxIndex > 0 && (
            <>
              <button
                aria-label="Prev"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow border border-gray-200"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
                className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow border border-gray-200"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      {/* Dots */}
      {showDots && maxIndex > 0 && (
        <div className="flex items-center gap-2 justify-center pt-1">
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
