// components/ImageField.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import UploadImage from '@/components/UploadImage';

type Props = {
  name: string;
  label?: string;
  defaultValue?: string | null;
  placeholder?: string;
  folder?: string; // đẩy vào folder Cloudinary cụ thể (tùy chọn)
};

export default function ImageField({
  name,
  label,
  defaultValue = '',
  placeholder = 'Dán URL ảnh hoặc bấm Upload',
  folder,
}: Props) {
  const [url, setUrl] = useState<string>(defaultValue || '');
  const [loading, setLoading] = useState(false);
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(defaultValue || '');
    if (urlRef.current) urlRef.current.value = defaultValue || '';
  }, [defaultValue]);

  async function rehostUrl() {
    const raw = urlRef.current?.value.trim();
    if (!raw) return;
    const fd = new FormData();
    fd.append('url', raw);
    if (folder) fd.append('folder', folder);

    setLoading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json().catch(() => null);
      if (json?.ok && json.url) {
        setUrl(json.url); // đổi sang URL Cloudinary
        if (urlRef.current) urlRef.current.value = json.url;
      } else {
        alert(json?.error || 'Re-host thất bại');
      }
    } finally {
      setLoading(false);
    }
  }

  const isCloudinary = url.includes('res.cloudinary.com');

  return (
    <div className="space-y-2">
      {label ? <label className="font-medium">{label}</label> : null}

      {/* hidden để submit URL cuối cùng vào server action */}
      <input type="hidden" name={name} value={url} />

      <div className="flex gap-2">
        <input
          ref={urlRef}
          defaultValue={url}
          placeholder={placeholder}
          className="border rounded px-3 py-2 w-full"
          onBlur={(e) => setUrl(e.currentTarget.value)}
        />
        <button
          type="button"
          className="border rounded px-3 py-2"
          onClick={() => { setUrl(''); if (urlRef.current) urlRef.current.value = ''; }}
          title="Xóa ảnh"
        >
          ✖
        </button>
      </div>

      {/* Upload file → Cloudinary + Re-host URL */}
      <div className="flex items-center gap-2 text-sm">
        <UploadImage
          name={`${name}_upload`}
          folder={folder}
          onUploaded={(u: string) => {
            setUrl(u);
            if (urlRef.current) urlRef.current.value = u;
          }}
          buttonLabel="Tải ảnh từ máy"
        />
        <button
          type="button"
          onClick={rehostUrl}
          className="border rounded px-3 py-2"
          disabled={loading}
          title="Tải URL này về Cloudinary"
        >
          {loading ? 'Đang re-host…' : 'Re-host URL → Cloudinary'}
        </button>
        {!isCloudinary && url && (
          <span className="text-amber-600">(Nên re-host để ổn định tốc độ & tránh lỗi link ngoài)</span>
        )}
      </div>

      {url ? (
        <div className="mt-2 border rounded p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="preview" className="max-h-48 object-contain mx-auto" />
        </div>
      ) : null}
    </div>
  );
}
