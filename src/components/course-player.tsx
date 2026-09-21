'use client';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Play, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { createBlock, blockRegistry } from '@/lib/blocks';
import type { Block, ModuleDocument } from '@/lib/types';
import { StyledPreviewBlock } from '@/components/preview';
function demoDocument(): ModuleDocument {
    const blocks = [
        createBlock('richText'),
        createBlock('callout'),
        createBlock('scenarioSimulator'),
        createBlock('flashcards'),
        createBlock('knowledgeCheck'),
        createBlock('mcqQuiz'),
        createBlock('achievementBadge'),
    ];
    blocks[0].content = { html: '<h2>Build a healthier money plan</h2><p>Learn a simple framework for budgeting, emergency savings and confident financial decisions.</p>' };
    blocks[1].content = { variant: 'info', title: 'The 50 / 30 / 20 idea', html: '<p>A useful starting framework is to think about needs, wants and future goals. Adapt the percentages to your own situation.</p>' };
    blocks[2].content = { title: 'An unexpected expense appears', context: 'Your car needs an urgent repair this month. You have some emergency savings and a credit card.', options: [{ label: 'Use emergency savings', feedback: 'You use money designed for unexpected costs and avoid new interest.', score: 10 }, { label: 'Put it all on credit', feedback: 'This solves the immediate problem but creates repayment pressure.', score: 4 }, { label: 'Ignore the repair', feedback: 'Delaying essential maintenance may increase the final cost.', score: 0 }] };
    blocks[3].content = { title: 'Key finance terms', cards: [{ front: 'APR', back: 'The annualized cost of borrowing, including interest and certain fees.' }, { front: 'Emergency fund', back: 'Cash reserved for unexpected expenses or income disruption.' }, { front: 'Compound interest', back: 'Growth earned on both the original amount and accumulated interest.' }] };
    blocks[4].content = { question: 'How confident are you applying this framework?', options: ['Not yet', 'Getting there', 'Confident', 'I can teach it'], correctIndex: 2, explanation: 'Confidence checks help identify where another example may help.' };
    blocks[5].content = { question: 'What is a financial goal?', options: [{ text: 'A target for your money', isCorrect: true, explanation: 'A financial goal is a specific outcome you want your money to support.' }, { text: 'A type of loan', isCorrect: false, explanation: 'A loan is a financial product, not a goal.' }], points: 10 };
    blocks[6].content = { icon: '🏆', title: 'Money Plan Starter', description: 'Completed your first interactive learning path.', unlockCondition: 'Complete the course.', unlocked: true };
    return { schemaVersion: 1, moduleId: 'demo-course', title: 'Personal Finance 101', description: 'A short interactive course on budgeting, emergency savings and better money decisions.', version: '1.0', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), author: { id: 'demo', name: 'EduForge Demo' }, metadata: { estimatedDuration: 12, difficulty: 'beginner', tags: ['finance', 'budgeting', 'interactive'], thumbnail: '' }, blocks, quizConfig: { feedbackMode: 'immediate', passingScore: 70, showScoreOnCompletion: true } };
}
export function CoursePlayer({ initialDocument }: {
    initialDocument?: ModuleDocument;
}) {
    const [doc] = useState<ModuleDocument>(() => initialDocument || (() => { try {
        const raw = localStorage.getItem('eduforge-published-course');
        return raw ? JSON.parse(raw) : demoDocument();
    }
    catch {
        return demoDocument();
    } })());
    const blocks = useMemo(() => doc.blocks.filter(b => b.settings.isVisible), [doc]);
    const [index, setIndex] = useState(0);
    const [done, setDone] = useState(false);
    const progress = Math.round(((index + 1) / Math.max(blocks.length, 1)) * 100);
    if (done)
        return <main className="min-h-screen bg-[#f5f7fb] p-5 md:p-10"><div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center"><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="w-full rounded-[2rem] border bg-white p-8 text-center shadow-xl md:p-14"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Trophy size={34}/></div><div className="mt-6 text-xs font-black uppercase tracking-[.2em] text-emerald-600">Course completed</div><h1 className="mt-3 text-4xl font-black tracking-tight">You did it.</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">You completed every learning moment in <strong>{doc.title}</strong>.</p><div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3"><div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-black">100%</div><div className="text-[10px] text-slate-400">complete</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-black">{blocks.length}</div><div className="text-[10px] text-slate-400">moments</div></div><div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-black">✓</div><div className="text-[10px] text-slate-400">certificate ready</div></div></div><button onClick={() => { setDone(false); setIndex(0); }} className="mt-8 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black"><RotateCcw size={14}/> Review course</button></motion.div></div></main>;
    const block = blocks[index];
    return <main className="min-h-screen bg-[#f5f7fb] text-slate-950"><header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4"><a href="/" className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-xs font-black text-white">EF</a><div className="min-w-0 flex-1"><div className="truncate text-sm font-black">{doc.title}</div><div className="text-[10px] text-slate-400">{doc.metadata.difficulty} · {doc.metadata.estimatedDuration} min · v{doc.version}</div></div><span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 sm:flex"><CheckCircle2 size={12}/> Published</span></div><div className="h-1 bg-slate-100"><motion.div className="h-full bg-blue-600" animate={{ width: `${progress}%` }}/></div></header><div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[220px_1fr]"><aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border bg-white p-4"><div className="text-xs font-black uppercase tracking-widest text-slate-400">Course map</div><div className="mt-4 space-y-1">{blocks.map((b, i) => <button key={b.id} onClick={() => setIndex(i)} className={`flex w-full items-center gap-2 rounded-xl p-2.5 text-left text-xs font-bold ${i === index ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-50'}`}><span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-black/5 text-[10px]">{i + 1}</span><span className="truncate">{blockRegistry.find(x => x.type === b.type)?.name || b.type}</span></button>)}</div></div></aside><section><div className="mb-6"><div className="flex items-center justify-between text-xs font-black text-slate-400"><span>Learning moment {index + 1} of {blocks.length}</span><span>{progress}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-200"><motion.div className="h-full rounded-full bg-blue-600" animate={{ width: `${progress}%` }}/></div></div><AnimatePresence mode="wait"><motion.div key={block.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .22 }} className="rounded-[2rem] border bg-white p-6 shadow-sm md:p-10"><StyledPreviewBlock block={block}/></motion.div></AnimatePresence><div className="mt-5 flex items-center justify-between"><button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-xs font-black disabled:opacity-30"><ArrowLeft size={14}/> Previous</button>{index === blocks.length - 1 ? <button onClick={() => setDone(true)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white">Complete course <Check size={14}/></button> : <button onClick={() => setIndex(i => Math.min(blocks.length - 1, i + 1))} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-black text-white">Continue <ArrowRight size={14}/></button>}</div><div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 text-center text-[11px] text-slate-400"><Sparkles size={13} className="mr-1 inline text-blue-500"/> Powered by EduForge · interactive learning experience</div></section></div></main>;
}

