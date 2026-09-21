'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Quote, Code2, Heading1, Heading2, Heading3, Heading4, Link as LinkIcon } from 'lucide-react';
import { useEffect } from 'react';
export function RichTextEditor({ value, onChange }: {
    value: string;
    onChange: (html: string) => void;
}) {
    const editor = useEditor({ extensions: [StarterKit, Underline, Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' })], content: value, onUpdate: ({ editor }) => onChange(editor.getHTML()), editorProps: { attributes: { class: 'prose-content min-h-32 rounded-b-lg px-3 py-3 focus:outline-none', 'aria-label': 'Rich text editor' } } });
    useEffect(() => { if (editor && value !== editor.getHTML())
        editor.commands.setContent(value, false); }, [editor, value]);
    if (!editor)
        return null;
    const button = (label: string, icon: React.ReactNode, action: () => void, active = false) => <button type="button" aria-label={label} title={label} onMouseDown={e => e.preventDefault()} onClick={action} className={`rounded p-1.5 ${active ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'}`}>{icon}</button>;
    const setLink = () => { const previous = editor.getAttributes('link').href as string | undefined; const url = window.prompt('Enter URL', previous || 'https://'); if (url === null)
        return; if (!url.trim())
        editor.chain().focus().unsetLink().run();
    else
        editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run(); };
    return <div className="overflow-hidden rounded-lg border border-slate-300"><div role="toolbar" aria-label="Rich text formatting" className="flex flex-wrap gap-1 border-b bg-slate-50 p-1">
  {button('Bold', <Bold size={16}/>, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
  {button('Italic', <Italic size={16}/>, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
  {button('Underline', <UnderlineIcon size={16}/>, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
  {button('Strikethrough', <Strikethrough size={16}/>, () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}
  {button('H1', <Heading1 size={16}/>, () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
  {button('H2', <Heading2 size={16}/>, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
  {button('H3', <Heading3 size={16}/>, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}
  {button('H4', <Heading4 size={16}/>, () => editor.chain().focus().toggleHeading({ level: 4 }).run(), editor.isActive('heading', { level: 4 }))}
  {button('Bullet list', <List size={16}/>, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
  {button('Ordered list', <ListOrdered size={16}/>, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
  {button('Quote', <Quote size={16}/>, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
  {button('Code block', <Code2 size={16}/>, () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'))}
  {button('Hyperlink', <LinkIcon size={16}/>, setLink, editor.isActive('link'))}
 </div><EditorContent editor={editor}/></div>;
}

