'use client';
import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, FilePlus2, Save, Sparkles, X, RotateCcw, PlusCircle, Clock3, Download, FileText, Table2, Braces, Printer } from 'lucide-react';
import { useModuleStore } from '@/store/module-store';
import { assessModuleQuality } from '@/lib/module-quality';
import { createTemplate, moduleTemplates, type TemplateId } from '@/lib/templates';
import { exportExamExcel, exportExamJson, exportExamWord, getExamQuestions, printExamPdf } from '@/lib/exam-export';
const DRAFT_KEY = 'eduforge-module-draft-v1';
export function ModuleTools() {
    const doc = useModuleStore(s => s.document), isDirty = useModuleStore(s => s.isDirty), loadDocument = useModuleStore(s => s.loadDocument), markClean = useModuleStore(s => s.markClean);
    const [open, setOpen] = useState<'quality' | 'templates' | null>(null), [restored, setRestored] = useState(false), [recovery, setRecovery] = useState<any>(null), [dismissed, setDismissed] = useState(false), [examOpen, setExamOpen] = useState(false), [answerKey, setAnswerKey] = useState(false);
    const report = useMemo(() => assessModuleQuality(doc), [doc]);
    const examCount = getExamQuestions(doc).length;
    useEffect(() => { const raw = localStorage.getItem(DRAFT_KEY); if (raw)
        try {
            const d = JSON.parse(raw);
            if (d?.blocks && Array.isArray(d.blocks) && d.updatedAt && d.updatedAt !== doc.updatedAt)
                setRecovery(d);
            else
                localStorage.removeItem(DRAFT_KEY);
        }
        catch {
            localStorage.removeItem(DRAFT_KEY);
        } }, [doc.updatedAt]);
    useEffect(() => { if (!isDirty)
        return; const id = setTimeout(() => localStorage.setItem(DRAFT_KEY, JSON.stringify(doc)), 600); return () => clearTimeout(id); }, [doc, isDirty]);
    const save = () => { localStorage.setItem(DRAFT_KEY, JSON.stringify(doc)); markClean(); };
    const startFresh = () => { localStorage.removeItem(DRAFT_KEY); setRecovery(null); setDismissed(true); loadDocument({ ...doc, title: 'Untitled financial module', description: '', blocks: [], updatedAt: new Date().toISOString() } as any); };
    const restore = () => { if (recovery) {
        loadDocument(recovery);
        setRecovery(null);
        setRestored(true);
    } };
    return <>{recovery && !dismissed && <div role="dialog" aria-modal="true" aria-label="Draft recovery" className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"><div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"><div className="bg-gradient-to-br from-blue-700 to-indigo-700 p-6 text-white"><div className="flex items-center gap-3"><div className="rounded-2xl bg-white/15 p-3"><RotateCcw size={24}/></div><div><h2 className="text-xl font-black">Welcome back</h2><p className="mt-1 text-sm text-blue-100">We found an unsaved draft from a previous session.</p></div></div></div><div className="p-6"><div className="mb-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><div className="flex items-center gap-2 font-semibold text-slate-800"><Clock3 size={16}/> Last saved draft</div><p className="mt-2 line-clamp-2">{String(recovery.title || 'Untitled financial module')}</p><p className="mt-1 text-xs text-slate-400">{recovery.blocks?.length || 0} blocks</p></div><div className="grid gap-3"><button onClick={restore} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"><RotateCcw size={17}/> Continue where I left off</button><button onClick={startFresh} className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold text-slate-700 hover:bg-slate-50"><PlusCircle size={17}/> Start a new module</button><button onClick={() => { setDismissed(true); setRecovery(null); }} className="py-2 text-sm font-semibold text-slate-400 hover:text-slate-700">Not now</button></div></div></div></div>}<button onClick={save} className="btn"><Save size={16}/> Save draft</button><div className="relative"><button onClick={() => setExamOpen(v => !v)} disabled={examCount === 0} className="btn disabled:cursor-not-allowed disabled:opacity-40"><Download size={16}/> Export exam</button>{examOpen && <div className="absolute right-0 top-11 z-[80] w-64 rounded-2xl border bg-white p-2 shadow-2xl"><div className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">{examCount} question{examCount === 1 ? '' : 's'} ready</div><button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50" onClick={() => { printExamPdf(doc, answerKey); setExamOpen(false); }}><Printer size={16}/><span>PDF {answerKey ? 'Answer Key' : 'Student Version'}</span></button><label className="mx-2 flex cursor-pointer items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600"><input type="checkbox" checked={answerKey} onChange={e => setAnswerKey(e.target.checked)}/> Include answers in PDF</label><button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50" onClick={() => { exportExamWord(doc); setExamOpen(false); }}><FileText size={16}/> Word (.doc)</button><button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50" onClick={() => { exportExamExcel(doc); setExamOpen(false); }}><Table2 size={16}/> Excel (.xls)</button><button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left hover:bg-slate-50" onClick={() => { exportExamJson(doc); setExamOpen(false); }}><Braces size={16}/> JSON</button></div>}</div><button onClick={() => setOpen('quality')} className="btn"><ClipboardCheck size={16}/> Quality {report.score}%</button><button onClick={() => setOpen('templates')} className="btn"><FilePlus2 size={16}/> Templates</button>{restored && <span className="text-xs text-blue-600">Draft restored</span>}
 {open === 'quality' && <div role="dialog" aria-modal="true" aria-label="Module quality report" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center"><div><h2 className="text-xl font-bold">Module readiness</h2><p className="text-sm text-slate-500">Editorial and accessibility preflight check.</p></div><button className="ml-auto p-2" onClick={() => setOpen(null)} aria-label="Close"><X /></button></div><div className="my-5 flex items-center gap-4"><div className="grid h-20 w-20 place-items-center rounded-full border-8 border-blue-100 text-xl font-black text-blue-700">{report.score}%</div><p className="text-sm text-slate-600">Catch common publishing gaps before export.</p></div><ul className="space-y-2">{report.checks.map(c => <li key={c.id} className="flex gap-3 rounded-lg border p-3"><CheckCircle2 className={c.passed ? 'text-green-600' : 'text-slate-300'} size={18}/><div><strong>{c.label}</strong>{!c.passed && <p className="text-xs text-slate-500">{c.detail}</p>}</div></li>)}</ul></div></div>}
 {open === 'templates' && <div role="dialog" aria-modal="true" aria-label="Module templates" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center"><div><h2 className="text-xl font-bold">Financial learning templates</h2><p className="text-sm text-slate-500">Start with a structured learning flow.</p></div><button className="ml-auto p-2" onClick={() => setOpen(null)} aria-label="Close"><X /></button></div><div className="mt-5 grid gap-3 md:grid-cols-3">{moduleTemplates.map(t => <button key={t.id} className="rounded-xl border p-4 text-left hover:border-blue-400 hover:bg-blue-50" onClick={() => { if (!isDirty || confirm('Replace the current module with this template?')) {
        loadDocument(createTemplate(t.id as TemplateId, doc));
        setOpen(null);
    } }}><Sparkles size={18} className="mb-3 text-blue-600"/><strong>{t.name}</strong><span className="mt-2 block text-sm text-slate-500">{t.description}</span></button>)}</div></div></div>}</>;
}

