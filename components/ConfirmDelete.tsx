"use client";

import { useState } from "react";

type Props = {
  /** id của form ẩn sẽ submit khi xác nhận xoá */
  formId: string;
  label?: string;
  className?: string;
};

export default function ConfirmDelete({ formId, label = "Xoá", className }: Props) {
  const [open, setOpen] = useState(false);

  const submitTargetForm = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    form?.requestSubmit(); // submit form ẩn
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={className || "px-3 py-2 rounded bg-red-600 text-white"}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded bg-white p-4 w-[320px] shadow">
            <p className="text-sm">Bạn chắc chắn muốn xoá sản phẩm này?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded border"
                onClick={() => setOpen(false)}
              >
                Huỷ
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded bg-red-600 text-white"
                onClick={submitTargetForm}
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
