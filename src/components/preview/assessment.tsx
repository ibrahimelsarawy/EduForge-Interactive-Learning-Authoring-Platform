'use client';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import type { Block } from '@/lib/types';
import { StyledPreviewBlock } from './block-renderer';
export function AssessmentView({ blocks, onBack }: {
    blocks: Block[];
    onBack: () => void;
}) {
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    if (!started)
        return <div className="mx-auto max-w-xl py-10 text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-blue-100 text-blue-700"><GraduationCap size={30}/></div><h1 className="text-3xl font-black">Module assessment</h1><p className="mt-3 opacity-70">You have {blocks.length} question{blocks.length === 1 ? '' : 's'}. Answer each question and submit your responses.</p><div className="mt-7 flex justify-center gap-3"><button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700" onClick={onBack}><ArrowLeft size={16}/> Back to lesson</button><button className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700" onClick={() => setStarted(true)}>Start assessment</button></div></div>;
    if (finished)
        return <div className="mx-auto max-w-xl py-10 text-center"><div className="text-5xl">🎉</div><h1 className="mt-4 text-3xl font-black">Assessment completed</h1><p className="mt-3 opacity-70">Your answers were submitted. Review each question's feedback above if needed.</p><div className="mt-7 flex justify-center gap-3"><button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-100" onClick={onBack}>Back to lesson</button><button className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700" onClick={() => { setStarted(false); setFinished(false); }}>Try assessment again</button></div></div>;
    return <div><div className="mb-6 flex items-center justify-between border-b pb-4"><div><div className="text-xs font-semibold uppercase tracking-widest text-blue-500">Assessment</div><h1 className="text-2xl font-black">Check your understanding</h1></div><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">{blocks.length} questions</span></div><div className="space-y-5">{blocks.map((b, i) => <section key={b.id} className="assessment-question rounded-xl border p-5"><div className="mb-3 text-sm font-bold opacity-60">Question {i + 1} of {blocks.length}</div><StyledPreviewBlock block={b}/></section>)}</div><button className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700" onClick={() => setFinished(true)}>Finish assessment</button></div>;
}

