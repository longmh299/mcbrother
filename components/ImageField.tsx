// components/ImageField.tsx
"use client";

import { useRef, useState } from "react";
import UploadImage from "@/components/UploadImage";

type Props = {
  name: string;
  label?: string;
  defaultValue?: string | null;
  placeholder?: string;
};

export default function ImageField({
  name,
  label,
  defaultValue = "",
  placeholder = "Dán URL ảnh hoặc bấm Upload",
}: Props) {
  const [url, setUrl] = useState<string>(defaultValue || "");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      {label ? <label className="font-medium">{label}</label> : null}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          name={name}
          value={url}
          placeholder={placeholder}
          className="border rounded px-3 py-2 w-full"
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="button"
          className="border rounded px-3 py-2"
          onClick={() => setUrl("")}
          title="Xóa ảnh"
        >
          ✖
        </button>
      </div>

      {/* ✅ UploadImage chỉ có name + onUploaded */}
      <UploadImage
        name={`${name}_upload`}
        onUploaded={(u: string) => setUrl(u)}
      />

      {url ? (
        <div className="mt-2 border rounded p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="preview"
            className="max-h-48 object-contain mx-auto"
          />
        </div>
      ) : null}
    </div>
  );
}
