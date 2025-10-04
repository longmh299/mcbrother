"use client";

import { useSearchParams } from "next/navigation";
import { useActionState as useFormState } from "react";
import { loginAction } from "./actions";

export default function AdminLogin() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <div className="container max-w-md py-10">
      <h1 className="text-2xl font-semibold mb-4">Đăng nhập Quản trị</h1>

      <form action={formAction} className="space-y-3 rounded-xl border bg-white p-5">
        <input type="hidden" name="next" value={next} />
        <input name="user" placeholder="Tài khoản" className="w-full border rounded px-3 py-2" required />
        <input name="pass" placeholder="Mật khẩu" type="password" className="w-full border rounded px-3 py-2" required />
        {state?.error && <div className="text-red-600 text-sm">{state.error}</div>}
        <button className="w-full bg-black text-white rounded px-4 py-2">Đăng nhập</button>
      </form>
    </div>
  );
}
