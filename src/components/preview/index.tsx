'use client';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, Moon, Sun, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { useModuleStore } from '@/store/module-store';
import { BlockErrorBoundary } from '../error-boundary';
import { AssessmentView } from './assessment';
import { StyledPreviewBlock } from './block-renderer';
const width = { desktop: '100%', tablet: '768px', mobile: '375px' } as const;
export function Preview() {
    const doc = useModuleStore(s => s.document), device = useModuleStore(s => s.previewDevice), setDevice = useModuleStore(s => s.setPreviewDevice), dark = useModuleStore(s => s.previewDark), toggleDark = useModuleStore(s => s.togglePreviewDark);
    const [assessment, setAssessment] = useState(false);
    const quizBlocks = doc.blocks.filter(b => b.settings.isVisible && (b.type === 'mcqQuiz' || b.type === 'trueFalseQuiz'));
    return <aside className="hidden min-h-0 w-[42%] min-w-[420px] overflow-hidden border-l bg-slate-100 xl:flex xl:flex-col">
    <div className="flex items-center gap-1 border-b bg-white p-3" role="radiogroup" aria-label="Preview device">
      {(['desktop', 'tablet', 'mobile'] as const).map(d => <button key={d} role="radio" aria-checked={device === d} aria-label={`${d} preview`} onClick={() => setDevice(d)} className={`rounded p-2 ${device === d ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-100'}`}>{d === 'desktop' ? <Monitor size={18}/> : d === 'tablet' ? <Tablet size={18}/> : <Smartphone size={18}/>}</button>)}
      {quizBlocks.length > 0 ? <button onClick={() => setAssessment(v => !v)} className={`ml-auto rounded-lg px-3 py-2 text-xs font-semibold ${assessment ? 'border border-slate-300 bg-white text-slate-800' : 'bg-slate-100 text-slate-700'}`}><GraduationCap size={15} className="mr-1 inline"/>{assessment ? 'Back to lesson' : 'Exam mode'}</button> : null}
      <button onClick={toggleDark} aria-label="Toggle preview dark mode" className={`rounded p-2 ${dark ? 'text-slate-100 hover:bg-slate-800' : 'hover:bg-slate-100'}`}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
      <button onClick={() => window.print()} className="btn text-xs">Print</button>
    </div>
    <div className={`min-h-0 flex-1 overflow-y-auto p-5 ${dark ? 'bg-slate-900' : 'bg-slate-100'}`}><motion.div data-theme={dark ? 'dark' : 'light'} animate={{ width: width[device] }} transition={{ type: 'spring', stiffness: 240, damping: 28 }} className={`preview-surface mx-auto min-h-full rounded-xl border p-5 shadow-sm ${dark ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {assessment ? <AssessmentView blocks={quizBlocks} onBack={() => setAssessment(false)}/> : <><h1 className="text-2xl font-black">{doc.title}</h1>{doc.description ? <p className="mt-2 opacity-70">{doc.description}</p> : null}<div className="mt-6 space-y-5">{doc.blocks.filter(b => b.settings.isVisible).map(block => <BlockErrorBoundary key={block.id} blockName={block.type}><StyledPreviewBlock block={block}/></BlockErrorBoundary>)}</div></>}
    </motion.div></div>
  </aside>;
}
export { PreviewBlock, StyledPreviewBlock } from './block-renderer';

