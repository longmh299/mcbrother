// components/CategoryPicker.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Cat = { id: number; name: string };

export default function CategoryPicker({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // đọc categoryId hiện tại từ URL (an toàn)
  const selectedIdFromUrl = (() => {
    const raw = (sp.get("categoryId") ?? "").trim();
    return /^\d+$/.test(raw) ? Number(raw) : undefined;
  })();

  const [selectedId, setSelectedId] = useState<number | undefined>(selectedIdFromUrl);
  useEffect(() => setSelectedId(selectedIdFromUrl), [selectedIdFromUrl]);

  const selected = categories.find((c) => c.id === selectedId);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  // vị trí popup bám đúng nút (portal + fixed)
  const [rect, setRect] = useState<{ left: number; top: number; width: number } | null>(null);
  const updateRect = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ left: r.left, top: r.bottom + 8, width: r.width }); // đúng bề rộng nút
  };
  useEffect(() => {
    if (!open) return;
    updateRect();
    const onResize = () => updateRect();
    const onScroll = () => updateRect();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  // click outside → đóng
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())),
    [categories, q]
  );

  // chọn danh mục → cập nhật hidden + URL (có fallback cho mobile)
  function apply(id?: number) {
    setSelectedId(id);
    if (hiddenRef.current) hiddenRef.current.value = id != null ? String(id) : "";

    const params = new URLSearchParams(sp.toString());
    if (id == null) params.delete("categoryId");
    else params.set("categoryId", String(id));
    const url = `${pathname}?${params.toString()}`;

    router.replace(url);
    router.refresh();

    // Fallback cứng nếu URL chưa đổi (một số trình duyệt mobile hơi “cứng đầu”)
    setTimeout(() => {
      const cur = new URLSearchParams(window.location.search).get("categoryId") ?? "";
      const want = id != null ? String(id) : "";
      if (cur !== want) window.location.assign(url);
    }, 150);

    setOpen(false);
  }

  return (
    <div className="relative">
      {/* hidden để form "Lọc" giữ được categoryId */}
      <input ref={hiddenRef} type="hidden" name="categoryId" value={selectedId != null ? String(selectedId) : ""} />

      {/* Nút mở */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2.5 text-[15px]"
      >
        <span className="truncate">{selected ? selected.name : "Danh mục"}</span>
        <svg viewBox="0 0 20 20" className={`ml-2 h-4 w-4 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M5.5 7.5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {/* Popup qua portal, bám đúng nút */}
      {open && rect && typeof document !== "undefined" &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[999]" onMouseDown={() => setOpen(false)} />
            <div
              className="fixed z-[1000] rounded-xl border bg-white shadow-lg"
              style={{ left: rect.left, top: rect.top, width: rect.width }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="border-b p-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm danh mục..."
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <ul className="max-h-72 overflow-auto py-1 text-sm">
                <li>
                  <button type="button" onClick={() => apply(undefined)} className="w-full px-3 py-2 text-left hover:bg-gray-50">
                    Tất cả
                  </button>
                </li>
                {filtered.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => apply(c.id)}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${selectedId === c.id ? "bg-gray-50 font-medium" : ""}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
                {filtered.length === 0 && <li className="px-3 py-2 text-gray-500">Không thấy danh mục</li>}
              </ul>
            </div>
          </>,
          document.body
        )
      }
    </div>
  );
}
