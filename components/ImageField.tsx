// components/ImageField.tsx
"use client";

import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = url || "";
  }, [url]);

  return (
    <div className="space-y-2">
      {label ? <label className="font-medium">{label}</label> : null}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          name={name}
          defaultValue={defaultValue || ""}
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

      <UploadImage
        // component có sẵn của bạn — chỉ cần bắt url trả về
        onUploaded={(u: string) => setUrl(u)}
        label="Upload ảnh"
      />

      {url ? (
        <div className="mt-2 border rounded p-2">
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
