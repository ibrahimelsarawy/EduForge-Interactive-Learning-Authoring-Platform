'use client';
import { motion } from 'framer-motion';
import { mergeBlockDesign } from '@/lib/design';
import { sanitizeRichHtml } from '@/lib/sanitize';
import type { Block } from '@/lib/types';
import { AccordionPreview, CodePreview, Explainer, ImagePreview, ProgressPreview } from './content';
import { CompoundCalculator, EMICalculator, SIPCalculator } from './calculators';
import { FlashcardsPreview, KnowledgeCheckPreview, MCQ, ScenarioPreview, TrueFalse, VideoPreview } from './interactive';
export function PreviewBlock({ block }: {
    block: Block;
}) {
    const c = block.content;
    switch (block.type) {
        case 'richText': return <article className="prose-content" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(String(c.html ?? '')) }}/>;
        case 'image': return <ImagePreview content={c}/>;
        case 'video': return <VideoPreview content={c}/>;
        case 'mcqQuiz': return <MCQ block={block}/>;
        case 'trueFalseQuiz': return <TrueFalse block={block}/>;
        case 'emiCalculator': return <EMICalculator content={c}/>;
        case 'sipCalculator': return <SIPCalculator content={c}/>;
        case 'compoundInterest': return <CompoundCalculator content={c}/>;
        case 'callout': return <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-slate-900"><strong>{String(c.title)}</strong><div dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(String(c.html ?? c.text ?? '')) }}/></div>;
        case 'divider': return <div className={c.spacing === 'compact' ? 'py-1' : c.spacing === 'spacious' ? 'py-8' : 'py-4'}><hr className={c.style === 'dashed' ? 'border-dashed' : c.style === 'dotted' ? 'border-dotted' : c.style === 'gradient' ? 'border-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent' : 'border-solid'}/></div>;
        case 'accordion': return <AccordionPreview content={c}/>;
        case 'progressTracker': return <ProgressPreview content={c}/>;
        case 'achievementBadge': return <motion.div initial={{ scale: .95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`rounded-xl border p-5 text-center ${c.unlocked ? 'bg-amber-50 text-slate-900' : 'opacity-50'}`}><div className="text-4xl">{String(c.icon)}</div><strong>{String(c.title)}</strong><p className="text-sm">{String(c.description)}</p>{c.unlockCondition ? <p className="mt-2 text-xs">Unlock: {String(c.unlockCondition)}</p> : null}</motion.div>;
        case 'codeSnippet': return <CodePreview content={c}/>;
        case 'conceptExplainer': return <Explainer content={c}/>;
        case 'scenarioSimulator': return <ScenarioPreview content={c}/>;
        case 'flashcards': return <FlashcardsPreview content={c}/>;
        case 'knowledgeCheck': return <KnowledgeCheckPreview content={c}/>;
        default: return null;
    }
}
export function StyledPreviewBlock({ block }: {
    block: Block;
}) {
    const d = mergeBlockDesign(block.settings.design);
    const shadow = d.shadow === 'soft' ? '0 8px 24px rgba(15,23,42,.08)' : d.shadow === 'medium' ? '0 16px 40px rgba(15,23,42,.12)' : d.shadow === 'large' ? '0 24px 70px rgba(15,23,42,.18)' : 'none';
    const initial = d.animation === 'fade' ? { opacity: 0 } : d.animation === 'slideUp' ? { opacity: 0, y: 24 } : d.animation === 'slideLeft' ? { opacity: 0, x: 24 } : d.animation === 'scale' ? { opacity: 0, scale: .92 } : { opacity: 1 };
    const animate = d.animation === 'fade' || d.animation === 'slideUp' || d.animation === 'slideLeft' || d.animation === 'scale' ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 1 };
    const repeat = d.animationRepeat < 0 ? Infinity : d.animationRepeat;
    return <motion.div initial={initial} animate={animate} transition={{ duration: d.animationDuration, delay: d.animationDelay, repeat }} whileHover={d.hoverScale || d.hoverLift ? { scale: d.hoverScale || 1.01, y: d.hoverLift ? -4 : 0 } : undefined} style={{ textAlign: d.textAlign, fontFamily: d.fontFamily, fontSize: d.fontSize, fontWeight: d.fontWeight, lineHeight: d.lineHeight, letterSpacing: d.letterSpacing, color: d.textColor, opacity: d.opacity / 100, background: d.backgroundGradient || d.backgroundColor, padding: d.padding, marginTop: d.marginTop, marginBottom: d.marginBottom, borderRadius: d.borderRadius, boxShadow: shadow }}><PreviewBlock block={block}/></motion.div>;
}

