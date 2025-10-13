// components/RichEditor.tsx (Server Component)
// import React from 'react';
// import RichEditorClient from './RichEditor.client';

// type Props = {
//   name?: string;            // <-- thêm
//   value?: string;           // giữ nguyên
//   onChange?: (html: string) => void;
//   height?: number;
//   placeholder?: string;
//   readOnly?: boolean;
//   className?: string;
// };

// export default function RichEditor(props: Props) {
//   const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
//   const isReadOnly = props.readOnly || !apiKey;

//   if (isReadOnly) {
//     return (
//       <div className={`prose max-w-none rounded-xl border bg-white p-3 ${props.className ?? ''}`}>
//         <div
//           className="min-h-[180px] opacity-90"
//           dangerouslySetInnerHTML={{ __html: props.value || '<p><em>(Không có nội dung)</em></p>' }}
//         />
//       </div>
//     );
//   }

//   return <RichEditorClient apiKey={apiKey!} {...props} />;
// }
// components/RichEditor.tsx (Server Component)
import React from 'react';
import RichEditorClient from './RichEditor.client';

type Props = {
  name?: string;
  value?: string;
  onChange?: (html: string) => void; // chỉ chạy ở client khi có editor
  height?: number;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  id?: string; // optional: duy trì id ổn định
};

export default function RichEditor(props: Props) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
  const isReadOnly = props.readOnly || !apiKey;

  if (isReadOnly) {
    // Chế độ read-only (không có API key hoặc bị khóa)
    return (
      <div className={`prose max-w-none rounded-xl border bg-white p-3 ${props.className ?? ''}`}>
        <div
          className="min-h-[180px] opacity-90"
          dangerouslySetInnerHTML={{
            __html: props.value && props.value.trim()
              ? props.value
              : '<p><em>(Không có nội dung)</em></p>',
          }}
        />
        {/* Nếu có name thì vẫn gửi giá trị về server */}
        {props.name ? (
          <input type="hidden" name={props.name} value={props.value ?? ''} />
        ) : null}
      </div>
    );
  }

  // Có API key → render client editor
  return (
    <RichEditorClient
      apiKey={apiKey!}
      {...props}
    />
  );
}

