import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: { class: "richtext-editor-content max-w-none min-h-[200px] p-3 focus:outline-none" },
    },
  });

  const btn = (active: boolean) =>
    `p-1.5 rounded transition-colors ${active ? "bg-vous-gold text-white" : "text-vous-text-secondary hover:text-vous-text hover:bg-vous-elevated"}`;

  return (
    <div className="border border-vous-border bg-vous-surface rounded-2xl overflow-hidden">
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-white/40 bg-vous-bg">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={btn(!!editor?.isActive("bold"))} title="Negrita"><Bold size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={btn(!!editor?.isActive("italic"))} title="Cursiva"><Italic size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(!!editor?.isActive("heading", { level: 2 }))} title="Título"><Heading2 size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={btn(!!editor?.isActive("bulletList"))} title="Lista"><List size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={btn(!!editor?.isActive("orderedList"))} title="Lista Numerada"><ListOrdered size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={btn(!!editor?.isActive("blockquote"))} title="Cita"><Quote size={14} /></button>
        <div className="w-px bg-vous-border/40 mx-1" />
        <button type="button" onClick={() => editor?.chain().focus().undo().run()} className={btn(false)} title="Deshacer"><Undo size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().redo().run()} className={btn(false)} title="Rehacer"><Redo size={14} /></button>
      </div>
      <div className="overflow-x-auto">
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .richtext-editor-content h2 {
          font-family: 'Bodoni Moda', serif;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #0D0D0C;
        }
        .richtext-editor-content p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .richtext-editor-content ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .richtext-editor-content ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .richtext-editor-content li {
          margin-bottom: 0.25rem;
        }
        .richtext-editor-content li > p {
          margin-bottom: 0.25rem;
        }
        .richtext-editor-content blockquote {
          border-left: 3px solid #C9A84C;
          padding-left: 1rem;
          font-style: italic;
          color: #6B6B65;
          margin-bottom: 0.75rem;
        }
        .richtext-editor-content strong {
          font-weight: 600;
          color: #0D0D0C;
        }
        .richtext-editor-content em {
          font-style: italic;
        }
        .richtext-editor-content > :last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
