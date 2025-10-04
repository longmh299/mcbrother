// components/ProductCard.tsx
import Link from 'next/link';

export type ProductCardData = {
  id: number;
  slug: string;
  name: string;
  price: number | null;
  coverImage: string | null;
  short: string | null;
  category?: { id: number; name: string } | null;
};

function fmtVND(n?: number | null) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '';
  return new Intl.NumberFormat('vi-VN').format(n);
}

export default function ProductCard({ p }: { p: ProductCardData }) {
  const hasPrice = typeof p.price === 'number' && Number.isFinite(p.price);

  return (
    <article className="group overflow-hidden rounded-xl border bg-white hover:shadow-md transition">
      <Link href={`/san-pham/${p.slug}`} className="block">
        {p.coverImage ? (
          <img
            src={p.coverImage}
            alt={p.name}
            className="h-44 w-full object-contain bg-white p-3 transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : null}

        <div className="space-y-2 p-4">
          {p.category ? (
            <div className="text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-2 py-0.5">{p.category.name}</span>
            </div>
          ) : null}

          <h2 className="line-clamp-2 text-base font-semibold leading-snug group-hover:text-blue-600">
            {p.name}
          </h2>

          <div className="text-rose-600 font-medium">
            {hasPrice ? `${fmtVND(p.price)} ₫` : 'Liên hệ'}
          </div>

          {p.short ? (
            <p className="line-clamp-2 text-sm text-gray-600">{p.short}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
