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

/** Thêm transform cho URL Cloudinary (resize/crop/nén tự động) */
function cldThumb(url: string | null, w = 600, h = 450) {
  if (!url) return null;
  try {
    const u = new URL(url);
    // chỉ transform nếu ảnh nằm trên Cloudinary
    if (u.hostname.includes('res.cloudinary.com')) {
      // chèn đoạn /c_fill,g_auto,f_auto,q_auto,w_*,h_* sau /upload/
      return url.replace(
        '/upload/',
        `/upload/c_fill,g_auto,f_auto,q_auto,w_${w},h_${h}/`
      );
    }
  } catch {
    /* ignore */
  }
  return url; // không phải cloudinary thì giữ nguyên
}

export default function ProductCard({ p }: { p: ProductCardData }) {
  const hasPrice = typeof p.price === 'number' && Number.isFinite(p.price);
  const imgUrl = cldThumb(p.coverImage, 600, 450); // 4:3

  return (
    <article className="group overflow-hidden rounded-xl border bg-white transition hover:shadow-md">
      <Link href={`/san-pham/${p.slug}`} className="block">
        {/* Khung ảnh cố định tỉ lệ 4:3, crop cân đối */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
          {imgUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgUrl}
              alt={p.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-2 p-4">
          {p.category ? (
            <div className="text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-2 py-0.5">
                {p.category.name}
              </span>
            </div>
          ) : null}

          <h2 className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover:text-blue-600">
            {p.name}
          </h2>

          <div className="font-medium text-rose-600">
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
