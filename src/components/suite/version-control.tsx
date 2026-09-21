'use client';
import { GitBranch, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useModuleStore } from '@/store/module-store';
const clone = <T,>(value: T): T => structuredClone(value);
import type { ModuleDocument } from '@/lib/types';
export function VersionControl() { const doc = useModuleStore(s => s.document); const [versions, setVersions] = useState<{
    version: string;
    label: string;
    time: string;
    doc: ModuleDocument;
}[]>([{ version: doc.version, label: 'Current release candidate', time: 'Just now', doc: clone(doc) }, { version: '0.9.0', label: 'Interactive beta', time: 'Yesterday', doc: clone(doc) }, { version: '0.8.0', label: 'Initial authoring pass', time: '3 days ago', doc: clone(doc) }]); const [restored, setRestored] = useState(''); const load = useModuleStore(s => s.loadDocument); const save = () => { const next = `1.${versions.length}.0`; setVersions(v => [{ version: next, label: 'Snapshot created from current draft', time: 'Just now', doc: clone(doc) }, ...v]); }; return <section className="mt-5 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-3xl border bg-white p-6"><div className="flex items-center gap-3"><GitBranch size={19} className="text-blue-600"/><div><h2 className="font-black">Version control</h2><p className="text-xs text-slate-400">Snapshots, release history and restore.</p></div></div><button onClick={save} className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white">Create snapshot</button><div className="mt-6 space-y-2">{versions.map((v, i) => <button key={v.version} onClick={() => setRestored(v.version)} className={`w-full rounded-2xl border p-4 text-left transition ${i === 0 ? 'border-blue-200 bg-blue-50/50' : 'hover:bg-slate-50'}`}><div className="flex items-center justify-between"><span className="font-black">v{v.version}</span><span className="text-[10px] text-slate-400">{v.time}</span></div><div className="mt-1 text-xs text-slate-500">{v.label}</div></button>)}</div></div><div className="rounded-3xl border bg-white p-6"><div className="flex items-center justify-between"><div><h2 className="font-black">Release comparison</h2><p className="text-xs text-slate-400">Select a version to inspect or restore.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">Protected</span></div>{restored ? <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5"><div className="text-xs font-black uppercase tracking-widest text-blue-600">Selected v{restored}</div><div className="mt-4 grid gap-3 sm:grid-cols-3"><Compare label="Blocks" value={String(versions.find(v => v.version === restored)?.doc.blocks.length || 0)}/><Compare label="Tags" value={String(versions.find(v => v.version === restored)?.doc.metadata.tags.length || 0)}/><Compare label="Duration" value={`${versions.find(v => v.version === restored)?.doc.metadata.estimatedDuration || 0}m`}/></div><button onClick={() => { const target = versions.find(v => v.version === restored); if (target) {
    load(target.doc);
    setRestored('');
} }} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white"><RotateCcw size={14}/> Restore this version</button></div> : <div className="grid min-h-[280px] place-items-center text-center text-slate-400"><div><GitBranch size={30} className="mx-auto"/><p className="mt-3 text-sm font-semibold">Choose a version to compare.</p></div></div>}</div></section>; }
function Compare({ label, value }: {
    label: string;
    value: string;
}) { return <div className="rounded-xl bg-white p-3"><div className="text-lg font-black">{value}</div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div></div>; }

