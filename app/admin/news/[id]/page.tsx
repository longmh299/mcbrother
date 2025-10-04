// app/admin/news/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import { updatePost, deletePost } from '../actions';
import SubmitButton from '@/components/SubmitButton';
import ConfirmDelete from '@/components/ConfirmDelete';
import SlugField from '@/components/SlugField';
import ImageField from '@/components/ImageField';
import SeoPreview from '@/components/SeoPreview';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Next 15: params là Promise
  const { id } = await params;
  const idForPrisma = Number(id);
  if (Number.isNaN(idForPrisma)) {
    return <div>ID không hợp lệ</div>;
  }

  const p = await prisma.post.findUnique({
    where: { id: idForPrisma },
  });

  if (!p) return <div>Không tìm thấy bài viết</div>;

  async function onDelete() {
    'use server';
    await deletePost(idForPrisma);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Sửa bài viết</h1>

      <form action={updatePost.bind(null, idForPrisma)} className="space-y-4">
        <SlugField
          entity="post"
          titleName="title"
          slugName="slug"
          defaultTitle={p.title}
          defaultSlug={p.slug}
          excludeId={String(p.id)}
        />

        <div className="space-y-2">
          <label className="font-medium">Tóm tắt</label>
          <textarea
            name="excerpt"
            defaultValue={p.excerpt ?? ''}
            rows={3}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Nội dung</label>
          <textarea
            name="content"
            defaultValue={p.content ?? ''}
            rows={8}
            className="w-full border rounded px-2 py-1"
          />
          {/* Nếu dùng RichEditor, đảm bảo bind vào input hidden name="content" */}
        </div>

        <ImageField name="coverImage" label="Ảnh đại diện" defaultValue={p.coverImage ?? ''} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Tags (phân cách dấu phẩy)</label>
            <input
              name="tags"
              defaultValue={(p.tags || []).join(', ')}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <label className="flex items-end gap-2">
            <input type="checkbox" name="published" defaultChecked={p.published} />
            Published
          </label>
        </div>

        <SeoPreview
          defaultTitle={p.metaTitle ?? ''}
          defaultDesc={p.metaDescription ?? ''}
          defaultUrl={p.canonicalUrl ?? ''}
          defaultImage={p.ogImage ?? ''}
          defaultNoindex={p.noindex ?? false}
          defaultNofollow={p.nofollow ?? false}
        />

        <div className="flex gap-3 pt-2">
          <SubmitButton>Lưu</SubmitButton>
          <ConfirmDelete onConfirm={onDelete} />
        </div>
      </form>
    </div>
  );
}
