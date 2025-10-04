"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type State = { error?: string } | null;

export async function loginAction(prev: State, formData: FormData): Promise<State> {
  const user = String(formData.get("user") || "");
  const pass = String(formData.get("pass") || "");
  const next = (formData.get("next") as string) || "/admin";

  const U = process.env.ADMIN_USER || "admin";
  const P = process.env.ADMIN_PASS || "admin123";

  if (user !== U || pass !== P) {
    return { error: "Sai tài khoản hoặc mật khẩu" };
  }

  // set cookie 24h
  cookies().set("admin_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect(next);
}

export async function logoutAction() {
  cookies().set("admin_auth", "", { path: "/", maxAge: 0 });
  redirect("/admin/login");
}
