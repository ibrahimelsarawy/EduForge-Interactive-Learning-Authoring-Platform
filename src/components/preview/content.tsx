'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { sanitizeRichHtml } from '@/lib/sanitize';
export function ImagePreview({ content }: {
    content: Record<string, unknown>;
}) { const [broken, setBroken] = useState(false); const src = String(content.src ?? ''); const alt = String(content.alt ?? ''); return <figure>{src && !broken ? <img loading="lazy" src={src} alt={alt} className={`rounded-xl ${content.alignment === 'full-width' ? 'w-full' : content.alignment === 'right' ? 'ml-auto' : content.alignment === 'left' ? 'mr-auto' : 'mx-auto'}`} style={{ width: content.alignment === 'full-width' ? '100%' : 'auto', height: String(content.height || 'auto'), objectFit: (content.objectFit as any) || 'cover', objectPosition: (content.objectPosition as any) || 'center' }} onError={() => setBroken(true)}/> : <div role="img" aria-label={alt || 'Image unavailable'} className="grid min-h-40 place-items-center rounded-xl border border-dashed bg-slate-50 p-4 text-center text-sm text-slate-500">Image unavailable. Update or replace this image in the editor.</div>}{content.caption ? <figcaption className="mt-2 text-sm opacity-70">{String(content.caption)}</figcaption> : null}</figure>; }
export function AccordionPreview({ content }: {
    content: Record<string, unknown>;
}) { const items = Array.isArray(content.items) ? content.items as Record<string, unknown>[] : [], [open, setOpen] = useState<number | null>(null); const refs = useRef<Array<HTMLButtonElement | null>>([]); const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => { if (e.key === 'ArrowDown') {
    e.preventDefault();
    refs.current[(i + 1) % items.length]?.focus();
} if (e.key === 'ArrowUp') {
    e.preventDefault();
    refs.current[(i - 1 + items.length) % items.length]?.focus();
} if (e.key === 'Home') {
    e.preventDefault();
    refs.current[0]?.focus();
} if (e.key === 'End') {
    e.preventDefault();
    refs.current[items.length - 1]?.focus();
} }; return <div className="space-y-2">{items.map((item, i) => <div className="rounded border" key={i}><button ref={el => { refs.current[i] = el; }} onKeyDown={e => onKey(e, i)} onClick={() => setOpen(open === i ? null : i)} className="w-full p-3 text-left font-semibold" aria-expanded={open === i}>{String(item.title)}</button><AnimatePresence>{open === i ? <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-3 pb-3">{String(item.body)}</motion.div> : null}</AnimatePresence></div>)}</div>; }
export function ProgressPreview({ content }: {
    content: Record<string, unknown>;
}) { const total = Math.max(2, Number(content.total) || 2), current = Math.min(total, Math.max(1, Number(content.current) || 1)), labels = Array.isArray(content.labels) ? content.labels as string[] : []; return <div><div className="mb-2 flex justify-between text-sm"><span>Progress</span><span>{current}/{total}</span></div>{content.mode === 'branching' ? <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${total},minmax(0,1fr))` }}>{Array.from({ length: total }, (_, i) => <div key={i} className={`rounded px-1 py-2 text-center text-xs ${i < current ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>{labels[i] ?? i + 1}</div>)}</div> : <div role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total} className="h-3 overflow-hidden rounded-full bg-slate-200"><motion.div className="h-full bg-blue-600" animate={{ width: `${100 * current / total}%` }}/></div>}</div>; }
export function CodePreview({ content }: {
    content: Record<string, unknown>;
}) { const [copied, setCopied] = useState(false), code = String(content.code ?? ''); return <div className="relative overflow-auto rounded-xl bg-slate-950 p-4 text-sm text-green-300"><button className="btn absolute right-2 top-2 text-xs" onClick={async () => { await navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }}><Copy size={14}/>{copied ? 'Copied' : 'Copy'}</button><pre className="min-w-max whitespace-pre">{code.split('\n').map((line, i) => <div key={i}>{content.lineNumbers ? <span className="mr-4 text-slate-500">{i + 1}</span> : null}{line}</div>)}</pre></div>; }
export function Explainer({ content }: {
    content: Record<string, unknown>;
}) { const steps = Array.isArray(content.steps) ? content.steps as Record<string, unknown>[] : [], [index, setIndex] = useState(0); useEffect(() => { if (!content.autoPlay || steps.length < 2)
    return; const id = setInterval(() => setIndex(i => (i + 1) % steps.length), 3500); return () => clearInterval(id); }, [content.autoPlay, steps.length]); const step = steps[index]; return <section className="rounded-xl border p-5"><div className="text-xs text-blue-600">STEP {index + 1} OF {steps.length}</div><h3 className="mt-1 font-bold">{String(step?.title ?? content.title)}</h3><p className="mt-2 opacity-80">{String(step?.description ?? '')}</p><div className="mt-4 flex gap-2"><button className="btn" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>Previous</button><button className="btn" onClick={() => setIndex(Math.min(steps.length - 1, index + 1))} disabled={index === steps.length - 1}>Next</button></div></section>; }

