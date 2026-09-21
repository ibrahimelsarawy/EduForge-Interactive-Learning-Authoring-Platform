'use client';
import { Activity, BookOpen, CheckCircle2, Gauge, Lightbulb, Target, Users, Zap } from 'lucide-react';
import type { ModuleDocument } from '@/lib/types';
export function Insights({ doc, report, quizzes, interactive, visible }: {
    doc: any;
    report: any;
    quizzes: number;
    interactive: number;
    visible: number;
}) {
    const coverage = Math.round((interactive / Math.max(doc.blocks.length, 1)) * 100);
    const checks = report.checks.filter((x: any) => !x.passed);
    return <div className="h-full overflow-y-auto"><div className="mx-auto max-w-6xl p-5 pb-24 md:p-8"><div><div className="text-xs font-bold uppercase tracking-[.18em] text-blue-600">Insights</div><h1 className="mt-2 text-3xl font-black">Turn content into learning signals.</h1><p className="mt-2 text-sm text-slate-500">A practical view of structure, interaction and publishing readiness.</p></div><div className="mt-7 grid gap-5 md:grid-cols-3"><InsightCard icon={Gauge} label="Readiness" value={`${report.score}%`} note="Quality preflight score"/><InsightCard icon={Zap} label="Interaction coverage" value={`${coverage}%`} note={`${interactive} hands-on blocks`}/><InsightCard icon={Target} label="Assessment density" value={`${quizzes}`} note="Knowledge checks in module"/></div><div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]"><section className="rounded-3xl border bg-white p-6"><h2 className="font-black">Learning mix</h2><div className="mt-6 space-y-4"><Mix label="Core content" value={Math.max(0, visible - interactive - quizzes)} total={Math.max(doc.blocks.length, 1)}/><Mix label="Interactive" value={interactive} total={Math.max(doc.blocks.length, 1)}/><Mix label="Assessment" value={quizzes} total={Math.max(doc.blocks.length, 1)}/></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-50 p-4"><BookOpen size={16} className="text-blue-600"/><div className="mt-3 text-2xl font-black">{doc.metadata.estimatedDuration}</div><div className="text-xs text-slate-400">minutes estimated</div></div><div className="rounded-2xl bg-slate-50 p-4"><Users size={16} className="text-blue-600"/><div className="mt-3 text-2xl font-black">{doc.metadata.tags.length}</div><div className="text-xs text-slate-400">content tags</div></div></div></section><section className="rounded-3xl border bg-white p-6"><h2 className="font-black">What to improve</h2><div className="mt-5 space-y-3">{checks.length ? checks.map((c: any) => <div key={c.id} className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4"><div className="flex gap-3"><Lightbulb size={17} className="shrink-0 text-amber-600"/><div><div className="text-sm font-bold">{c.label}</div><p className="mt-1 text-xs leading-5 text-slate-500">{c.detail}</p></div></div></div>) : <div className="rounded-2xl bg-emerald-50 p-5 text-sm font-semibold text-emerald-800">Your current module passes every available preflight check.</div>}</div></section></div></div></div>;
}
function InsightCard({ icon: Icon, label, value, note }: {
    icon: any;
    label: string;
    value: string;
    note: string;
}) { return <div className="rounded-3xl border bg-white p-5"><div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={17}/></div><span className="text-3xl font-black">{value}</span></div><div className="mt-5 text-sm font-bold">{label}</div><div className="mt-1 text-xs text-slate-400">{note}</div></div>; }
function Mix({ label, value, total }: {
    label: string;
    value: number;
    total: number;
}) { const p = Math.round(value / total * 100); return <div><div className="mb-2 flex justify-between text-xs font-bold"><span>{label}</span><span>{p}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${p}%` }}/></div></div>; }

