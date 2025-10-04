// components/SeoPreview.tsx
'use client';

import { useEffect, useState } from 'react';

export default function SeoPreview({
  titleName = 'metaTitle',
  descName = 'metaDescription',
  urlName = 'canonicalUrl',
  defaultTitle = '',
  defaultDesc = '',
  defaultUrl = '',
}: {
  titleName?: string;
  descName?: string;
  urlName?: string;
  defaultTitle?: string | null;
  defaultDesc?: string | null;
  defaultUrl?: string | null;
}) {
  const [title, setTitle] = useState(defaultTitle ?? '');
  const [desc, setDesc] = useState(defaultDesc ?? '');
  const [url, setUrl] = useState(defaultUrl ?? '');

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        <label className="text-sm">Meta title ({title.length}/60)</label>
        <input
          name={titleName}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="~50–60 ký tự"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Meta description ({desc.length}/160)</label>
        <textarea
          name={descName}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border rounded px-2 py-1"
          rows={3}
          placeholder="~140–160 ký tự"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm">Canonical URL</label>
        <input
          name={urlName}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded px-2 py-1"
          placeholder="https://domain/duong-dan"
        />
      </div>

      {/* Preview kiểu Google */}
      <div className="mt-3 rounded border p-3">
        <div className="text-[#1a0dab] text-xl leading-tight">{title || 'Tiêu đề trang'}</div>
        <div className="text-[#006621] text-sm">{url || 'https://domain/duong-dan'}</div>
        <div className="text-[#545454]">{desc || 'Mô tả ngắn gọn hiển thị trên kết quả tìm kiếm…'}</div>
      </div>
    </div>
  );
}
