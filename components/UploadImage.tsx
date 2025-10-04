// // components/UploadImage.tsx
// "use client";

// import { useId, useState } from "react";

// type Props = {
//   name: string;            // tên input thực sự gửi về form cha
//   label?: string;          // nhãn hiển thị
//   defaultValue?: string;   // url mặc định
// };

// export default function UploadImage({ name, label = "Ảnh", defaultValue = "" }: Props) {
//   const [value, setValue] = useState(defaultValue || "");
//   const [busy, setBusy] = useState(false);
//   const id = useId();

//   async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setBusy(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);

//       const res = await fetch("/api/upload", { method: "POST", body: fd });
//       if (!res.ok) throw new Error("Upload failed");
//       const json = await res.json();
//       if (json?.url) setValue(json.url);
//     } catch (err) {
//       console.error(err);
//       alert("Tải ảnh thất bại");
//     } finally {
//       setBusy(false);
//       e.target.value = "";
//     }
//   }

//   return (
//     <div className="space-y-2">
//       <label htmlFor={id} className="font-medium">{label}</label>

//       {/* input ẩn: giá trị thật gửi về form CHA */}
//       <input type="hidden" name={name} value={value} />

//       <div className="flex items-center gap-3">
//         <input
//           id={id}
//           type="text"
//           className="border rounded px-3 py-2 flex-1"
//           placeholder="Dán URL ảnh…"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//         />
//         <input type="file" accept="image/*" onChange={onFileChange} disabled={busy} />
//       </div>

//       {busy && <p className="text-sm text-slate-500">Đang tải…</p>}
//       {!!value && <img src={value} alt="" className="h-24 rounded border" />}
//     </div>
//   );
// }
// components/UploadImage.tsx
'use client';

import { useState } from 'react';

export default function UploadImage({
  name,
  onUploaded,
}: {
  name: string; // tên input hidden (nếu cần)
  onUploaded?: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    setLoading(false);
    if (json.ok) {
      onUploaded?.(json.url);
    } else {
      alert(json.error || 'Upload failed');
    }
  }

  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={handleChange} />
      {loading && <p className="text-sm text-gray-500">Đang tải ảnh…</p>}
      {/* Có thể render <input type="hidden" name={name} value={url} /> ở nơi gọi */}
    </div>
  );
}
