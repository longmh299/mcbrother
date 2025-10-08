// components/HeaderShell.tsx
import { prisma } from "@/lib/prisma";
import Header from "./Header";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Cat = { name: string; slug: string };

export default async function HeaderShell() {
  const rows = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { name: true, slug: true }, // slug có thể là string | null
  });

  // TS-safe: bỏ các item không có slug
  const categories: Cat[] = rows
    .filter((c): c is { name: string; slug: string } => !!c.slug)
    .map((c) => ({ name: c.name, slug: c.slug! }));

  return <Header categories={categories} />;
}
