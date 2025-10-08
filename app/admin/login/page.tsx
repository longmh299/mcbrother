// app/admin/login/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function LoginInner() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get('next') || '/admin';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: gọi server action / API login của bạn ở đây
    // await login(new FormData(e.currentTarget));
    router.push(next);
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold">Đăng nhập</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        <button className="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">
          Đăng nhập
        </button>
        <input type="hidden" name="next" value={next} />
      </form>

      <div className="mt-3 text-xs text-gray-500">
        <Link href="/">← Về trang chủ</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Đang tải…</div>}>
      <LoginInner />
    </Suspense>
  );
}
