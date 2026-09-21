'use client';
import { useState } from 'react';
import { Activity, Bot, CheckCircle2, ChevronRight, Clock3, FileText, GitBranch, MessageSquare, Rocket, Sparkles, Users, WandSparkles, Zap } from 'lucide-react';
import { useModuleStore } from '@/store/module-store';
import type { ModuleDocument } from '@/lib/types';
import { LearnerPortal } from './suite/learner-portal';
import { AICopilot } from './suite/ai-copilot';
import { Analytics } from './suite/analytics';
import { Collaboration } from './suite/collaboration';
import { VersionControl } from './suite/version-control';
export function ShowcaseHub({ onBack }: {
    onBack: () => void;
}) {
    const doc = useModuleStore(s => s.document);
    const [tab, setTab] = useState<'learner' | 'ai' | 'analytics' | 'collab' | 'versions'>('learner');
    const [share, setShare] = useState(false);
    const createShare = () => { localStorage.setItem('eduforge-showcase-document', JSON.stringify(doc)); const url = `${window.location.origin}/showcase?demo=1`; navigator.clipboard?.writeText(url); setShare(true); window.setTimeout(() => setShare(false), 2400); };
    const tabs = [['learner', 'Learner', Sparkles], ['ai', 'AI Copilot', Bot], ['analytics', 'Analytics', Activity], ['collab', 'Collaboration', Users], ['versions', 'Versions', GitBranch]] as const;
    return <div className="h-full overflow-y-auto bg-[#f5f7fb]"><div className="mx-auto max-w-7xl p-5 pb-24 md:p-8"><div className="overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-2xl md:p-10"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-blue-300"><Sparkles size={14}/> Product showcase</div><h1 className="mt-3 text-4xl font-black tracking-tight">EduForge in action.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">A complete authoring-to-learning experience for interactive courses.</p></div><div className="flex flex-wrap gap-2"><button onClick={onBack} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300">Back to studio</button><button onClick={createShare} className="rounded-xl bg-white px-4 py-2 text-xs font-black text-slate-950">{share ? 'Link copied' : 'Share showcase'}</button></div></div><div className="mt-8 flex flex-wrap gap-2">{tabs.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${tab === id ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}><Icon size={14}/>{label}</button>)}</div></div>{tab === 'learner' ? <LearnerPortal doc={doc}/> : tab === 'ai' ? <AICopilot /> : tab === 'analytics' ? <Analytics /> : tab === 'collab' ? <Collaboration /> : <VersionControl />}</div></div>;
}

