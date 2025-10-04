// app/admin/news/new/page.tsx
import { createPost } from '../actions';
import SubmitButton from '@/components/SubmitButton';
import SlugField from '@/components/SlugField';
import ImageField from '@/components/ImageField';
import SeoPreview from '@/components/SeoPreview';
// Nếu bạn dùng TipTap: import RichEditor từ components/RichEditor

export default function NewPostPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Tạo bài viết</h1>

      <form action={createPost} className="space-y-4">
        <SlugField entity="post" titleName="title" slugName="slug" />

        <div className="space-y-2">
          <label className="font-medium">Tóm tắt</label>
          <textarea name="excerpt" rows={3} className="w-full border rounded px-2 py-1" />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Nội dung</label>
          {/* TipTap (nếu muốn) → nhớ có input hidden name="content".
              Tạm thời dùng textarea cho nhanh: */}
          <textarea name="content" rows={8} className="w-full border rounded px-2 py-1" />
        </div>

        <ImageField name="coverImage" label="Ảnh đại diện" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Tags (phân cách dấu phẩy)</label>
            <input name="tags" placeholder="cpet, máy đóng gói" className="w-full border rounded px-2 py-1" />
          </div>
          <label className="flex items-end gap-2">
            <input type="checkbox" name="published" defaultChecked />
            Published
          </label>
        </div>

        {/* SEO */}
        <SeoPreview />
        {/* Nếu muốn submit ngay từ preview, đảm bảo có input hidden tương ứng hoặc để SeoPreview gắn trực tiếp */}

        <div className="pt-2">
          <SubmitButton>Lưu</SubmitButton>
        </div>
      </form>
    </div>
  );
}
