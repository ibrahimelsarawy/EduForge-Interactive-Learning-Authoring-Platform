'use client';
import { parseVideoUrl } from '@/lib/video';
import { str } from './helpers';
export function ImageEditor({ content: c, set }: {
    content: Record<string, unknown>;
    set: (p: Record<string, unknown>) => void;
}) {
    const upload = (file?: File) => { if (!file)
        return; if (file.size > 5 * 1024 * 1024) {
        alert('Image must be 5MB or smaller.');
        return;
    } if (!['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type)) {
        alert('Only JPG, PNG, WebP, and SVG are supported.');
        return;
    } const reader = new FileReader(); reader.onload = () => set({ src: String(reader.result) }); reader.readAsDataURL(file); };
    return <div className="grid gap-3"><input aria-label="Upload image" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={e => upload(e.target.files?.[0])}/><input aria-label="Image URL" className="input" placeholder="https://… or upload a file" value={str(c.src)} onChange={e => set({ src: e.target.value })}/><input aria-label="Image alt text" className="input" placeholder="Required alt text" value={str(c.alt)} onChange={e => set({ alt: e.target.value })}/><input aria-label="Image caption" className="input" placeholder="Caption" value={str(c.caption)} onChange={e => set({ caption: e.target.value })}/><div className="grid gap-3 sm:grid-cols-2"><label>Alignment<select className="input" value={str(c.alignment, 'center')} onChange={e => set({ alignment: e.target.value })}>{['left', 'center', 'right', 'full-width'].map(x => <option key={x}>{x}</option>)}</select></label><label>Fit<select className="input" value={str(c.objectFit, 'cover')} onChange={e => set({ objectFit: e.target.value })}>{['cover', 'contain', 'fill', 'none'].map(x => <option key={x}>{x}</option>)}</select></label><label>Image height<select className="input" value={str(c.height, 'auto')} onChange={e => set({ height: e.target.value })}>{['auto', '200px', '300px', '400px', '500px'].map(x => <option key={x}>{x}</option>)}</select></label><label>Focus<select className="input" value={str(c.objectPosition, 'center')} onChange={e => set({ objectPosition: e.target.value })}>{['center', 'top', 'bottom', 'left', 'right'].map(x => <option key={x}>{x}</option>)}</select></label></div></div>;
}
export function VideoEditor({ content: c, set }: {
    content: Record<string, unknown>;
    set: (p: Record<string, unknown>) => void;
}) { const parsed = parseVideoUrl(str(c.url)); return <div className="grid gap-3"><input aria-label="Video URL" className="input" placeholder="YouTube or Vimeo URL" value={str(c.url)} onChange={e => set({ url: e.target.value })}/>{c.url && !parsed ? <p role="alert" className="text-sm text-red-700">Only YouTube and Vimeo URLs are supported.</p> : null}{parsed ? <div className="relative overflow-hidden rounded-lg border bg-slate-950 text-white">{parsed.thumbnailUrl ? <img src={parsed.thumbnailUrl} alt="Video thumbnail preview" className="aspect-video w-full object-cover opacity-80"/> : <div className="flex aspect-video items-center justify-center">Vimeo video #{parsed.id}</div>}<span className="absolute inset-0 grid place-items-center text-4xl">▶</span></div> : null}<input aria-label="Video title" className="input" value={str(c.title)} onChange={e => set({ title: e.target.value })}/></div>; }

