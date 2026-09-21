'use client';
import { CheckCircle2, ChevronRight, CircleDot, FileText, Gauge, Lightbulb, Sparkles, Target, Zap } from 'lucide-react';
import type { ModuleDocument } from '@/lib/types';
import { blockRegistry } from '@/lib/blocks';
type View = 'overview' | 'builder' | 'insights' | 'publish' | 'showcase';
export function Overview({ doc, report, quizzes, interactive, visible, go }: {
    doc: any;
    report: any;
    quizzes: number;
    interactive: number;
    visible: number;
    go: (v: View) => void;
}) {
    const progress = Math.min(100, Math.round((visible / Math.max(doc.blocks.length, 1)) * 100));
    return <div className="h-full overflow-y-auto"><div className="mx-auto max-w-7xl p-5 pb-24 md:p-8">
  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-blue-600"><CircleDot size={12}/> Workspace</div><h1 className="text-3xl font-black tracking-tight md:text-4xl">Build something learners remember.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">A visual learning studio for creating interactive financial modules, simulations and assessments.</p></div><button onClick={() => go('builder')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"><Zap size={16}/> Open builder</button></div>
  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[['Blocks', String(doc.blocks.length), 'Content units', FileText], ['Interactive', String(interactive), 'Hands-on activities', Zap], ['Checks', String(quizzes), 'Knowledge moments', CheckCircle2], ['Readiness', `${report.score}%`, 'Publishing confidence', Gauge]].map(([label, value, sub, Icon]: any) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-700"><Icon size={17}/></div><span className="text-2xl font-black tracking-tight">{value}</span></div><div className="mt-5 text-sm font-bold">{label}</div><div className="mt-1 text-xs text-slate-400">{sub}</div></div>)}</div>
  <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
   <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-black">Module blueprint</h2><p className="mt-1 text-xs text-slate-400">Your current learning architecture</p></div><button onClick={() => go('builder')} className="text-xs font-bold text-blue-600">Edit structure</button></div><div className="mt-6 space-y-2">{doc.blocks.slice(0, 8).map((b: any, i: number) => { const def = blockRegistry.find(x => x.type === b.type); return <div key={b.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-xs font-black text-slate-400">{String(i + 1).padStart(2, '0')}</div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{def?.name ?? b.type}</div><div className="truncate text-xs text-slate-400">{def?.description}</div></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${b.settings.isVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{b.settings.isVisible ? 'Live' : 'Hidden'}</span></div>; })}{doc.blocks.length > 8 && <div className="pt-2 text-center text-xs text-slate-400">+ {doc.blocks.length - 8} more blocks</div>}</div></section>
   <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><Sparkles size={18}/></div><div><h2 className="font-black">Smart Coach</h2><p className="text-xs text-slate-400">Editorial signals</p></div></div><div className="mt-6 space-y-3">{report.checks.slice(0, 4).map((c: any) => <div key={c.id} className="flex gap-3 rounded-xl bg-white/5 p-3"><CheckCircle2 size={16} className={c.passed ? 'text-emerald-400' : 'text-amber-400'}/><div><div className="text-xs font-bold">{c.label}</div><div className="mt-1 text-[11px] leading-4 text-slate-400">{c.passed ? 'Looks good.' : c.detail}</div></div></div>)}</div><button onClick={() => go('insights')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-black text-slate-950">Open recommendations <ChevronRight size={14}/></button></section>
  </div>
 </div></div>;
}

