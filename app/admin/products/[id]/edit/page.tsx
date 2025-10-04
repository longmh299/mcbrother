import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateProduct, deleteProduct } from "../../actions";

export default async function EditProduct({ params }:{ params:{ id:string } }){
  const id=Number(params.id);
  const p=await prisma.product.findUnique({ where:{ id }, include:{ category:{select:{slug:true,name:true}}, images:true, attributes:true } });
  if(!p) return notFound();
  const cats=await prisma.category.findMany({ orderBy:[{order:"asc"},{name:"asc"}], select:{ slug:true, name:true } });
  const imageUrls=p.images.sort((a,b)=>a.sort-b.sort).map(i=>i.url).join("\n");
  const attrs=p.attributes.sort((a,b)=>a.sort-b.sort).map(a=>`${a.name}: ${a.value}`).join("\n");

  async function action(formData: FormData){ "use server"; return updateProduct(id, formData); }
  async function del(){ "use server"; await deleteProduct(id); }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Sửa sản phẩm</h1>
      <form action={action} className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div><label className="block text-sm mb-1">Tên *</label><input name="name" defaultValue={p.name} className="w-full rounded-lg border px-3 py-2" /></div>
          <div><label className="block text-sm mb-1">Slug</label><input name="slug" defaultValue={p.slug} className="w-full rounded-lg border px-3 py-2" /></div>
          <div><label className="block text-sm mb-1">Danh mục</label><select name="categorySlug" defaultValue={p.category?.slug||""} className="w-full rounded-lg border px-3 py-2"><option value="">-- Không chọn --</option>{cats.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
          <div><label className="block text-sm mb-1">Giá</label><input name="price" defaultValue={p.price??""} className="w-full rounded-lg border px-3 py-2" /></div>
          <div className="flex gap-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={p.published} /> Hiển thị</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isFeatured" defaultChecked={p.isFeatured} /> Nổi bật</label></div>
        </div>
        <div className="space-y-3">
          <div><label className="block text-sm mb-1">Mô tả ngắn</label><input name="short" defaultValue={p.short||""} className="w-full rounded-lg border px-3 py-2" /></div>
          <div><label className="block text-sm mb-1">Mô tả</label><textarea name="description" defaultValue={p.description||""} className="w-full rounded-lg border px-3 py-2 h-28" /></div>
          <div><label className="block text-sm mb-1">Ảnh bìa (URL)</label><input name="coverImage" defaultValue={p.coverImage||""} className="w-full rounded-lg border px-3 py-2" /></div>
         
          <div><label className="block text-sm mb-1">Ảnh phụ (mỗi dòng 1 URL)</label><textarea name="imageUrls" defaultValue={imageUrls} className="w-full rounded-lg border px-3 py-2 h-28" /></div>
          <div><label className="block text-sm mb-1">Thông số (mỗi dòng 'Tên: Giá trị')</label><textarea name="attributes" defaultValue={attrs} className="w-full rounded-lg border px-3 py-2 h-28" /></div>
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <button className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800">Lưu</button>
          <form action={del}><button className="rounded-lg border px-5 py-2 hover:bg-red-50" formAction={del}>Xoá</button></form>
        </div>
      </form>
    </div>
  );
}
