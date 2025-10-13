'use client';

import { useRef, useState } from 'react';

type Props = {
  name: string;
  onUploaded?: (url: string) => void;
  accept?: string;       // mặc định image/*
  maxSizeMB?: number;    // mặc định 10MB
  folder?: string;       // nếu muốn đẩy vào folder riêng (server sẽ ưu tiên CLOUDINARY_FOLDER)
  className?: string;
  buttonLabel?: string;
};

export default function UploadImage({
  name,
  onUploaded,
  accept = 'image/*',
  maxSizeMB = 10,
  folder,
  className = '',
  buttonLabel = 'Tải ảnh từ máy',
}: Props) {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Chỉ hỗ trợ ảnh');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Ảnh quá lớn (> ${maxSizeMB}MB)`);
      return;
    }

    const fd = new FormData();
    fd.append('file', file);
    if (folder) fd.append('folder', folder);

    setLoading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json().catch(() => null);
      if (json?.ok && json.url) {
        onUploaded?.(json.url);
      } else {
        alert(json?.error || 'Upload thất bại');
      }
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="border rounded px-3 py-2 text-sm"
          onClick={() => fileRef.current?.click()}
          disabled={loading}
        >
          {loading ? 'Đang tải…' : buttonLabel}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
      {/* nếu muốn submit kèm form có thể render <input type="hidden" name={name} /> ở component cha */}
    </div>
  );
}
