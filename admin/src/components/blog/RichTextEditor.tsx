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
      attributes: { class: "prose prose-sm max-w-none min-h-[200px] p-3 focus:outline-none" },
    },
  });

  const btn = (active: boolean) =>
    `p-1.5 rounded transition-colors ${active ? "bg-vous-gold text-vous-black" : "text-vous-gray hover:text-vous-black hover:bg-vous-border"}`;

  return (
    <div className="border border-vous-border bg-vous-white">
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-vous-border bg-[#FAFAF9]">
        <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={btn(!!editor?.isActive("bold"))} title="Negrita"><Bold size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={btn(!!editor?.isActive("italic"))} title="Cursiva"><Italic size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(!!editor?.isActive("heading", { level: 2 }))} title="Título"><Heading2 size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={btn(!!editor?.isActive("bulletList"))} title="Lista"><List size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={btn(!!editor?.isActive("orderedList"))} title="Lista Numerada"><ListOrdered size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={btn(!!editor?.isActive("blockquote"))} title="Cita"><Quote size={14} /></button>
        <div className="w-px bg-vous-border mx-1" />
        <button type="button" onClick={() => editor?.chain().focus().undo().run()} className={btn(false)} title="Deshacer"><Undo size={14} /></button>
        <button type="button" onClick={() => editor?.chain().focus().redo().run()} className={btn(false)} title="Rehacer"><Redo size={14} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
