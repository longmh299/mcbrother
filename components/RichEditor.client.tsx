// components/RichEditor.client.tsx
'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

// Chỉ load Editor ở client, KHÔNG SSR
const TinyMCEEditor = dynamic(
  async () => (await import('@tinymce/tinymce-react')).Editor,
  { ssr: false, loading: () => <div className="min-h-[180px] rounded-lg border p-3 text-sm text-gray-500">Đang tải trình soạn thảo…</div> }
);

type Props = {
  apiKey: string;
  name?: string;
  value?: string;
  onChange?: (html: string) => void;
  height?: number;
  placeholder?: string;
  className?: string;
  id?: string; // để id ổn định (optional)
};

export default function RichEditorClient({
  apiKey,
  name,
  value = '',
  onChange,
  height = 360,
  placeholder,
  className,
  id,
}: Props) {
  const [content, setContent] = React.useState(value);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => { setContent(value ?? ''); }, [value]);

  // render skeleton trong SSR/lần đầu để tránh mismatch
  if (!mounted) {
    return (
      <div className={className}>
        {name ? <input type="hidden" name={name} value={content} /> : null}
        <div className="min-h-[180px] rounded-lg border p-3 text-sm text-gray-500">
          Đang tải trình soạn thảo…
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {name ? <input type="hidden" name={name} value={content} /> : null}

      <TinyMCEEditor
        id={id || name || 'mcbe-editor'}      // id ổn định để tránh lệch
        apiKey={apiKey}
        value={content}
        init={{
          height,
          menubar: false,
          plugins: [
            'advlist','autolink','lists','link','image','charmap','preview','anchor',
            'searchreplace','visualblocks','code','fullscreen','insertdatetime','media',
            'table','help','wordcount',
          ],
          toolbar:
            'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image media table | removeformat | code',
          branding: false,
          placeholder,
          content_style:
            'body { font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; font-size:14px }',
          entity_encoding: 'raw',
          valid_elements: '*[*]',
        }}
        onEditorChange={(html) => {
          setContent(html);
          onChange?.(html);
        }}
      />
    </div>
  );
}
