'use client';
import type { Block } from '@/lib/types';
import { useModuleStore } from '@/store/module-store';
import { RichTextEditor } from './rich-text-editor';
import { BlockDesignPanel } from './block-design-panel';
import { AccordionEditor, BadgeEditor, CalculatorEditor, ExplainerEditor, FlashcardsEditor, ImageEditor, KnowledgeCheckEditor, ProgressEditor, QuizEditor, ScenarioEditor, TrueFalseEditor, VideoEditor } from './block-editors';
import { str } from './block-editors/helpers';
export function BlockForm({ block }: {
    block: Block;
}) {
    const update = useModuleStore(s => s.updateContent);
    const c = block.content;
    const set = (patch: Record<string, unknown>, batch = false) => update(block.id, { ...c, ...patch }, `Edit ${block.type}`, batch);
    if (block.settings.isLocked)
        return <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">This block is locked. Unlock it from the block toolbar to edit.</p>;
    const editor = (() => {
        switch (block.type) {
            case 'richText': return <RichTextEditor value={str(c.html)} onChange={html => set({ html }, true)}/>;
            case 'image': return <ImageEditor content={c} set={set}/>;
            case 'video': return <VideoEditor content={c} set={set}/>;
            case 'mcqQuiz': return <QuizEditor block={block}/>;
            case 'trueFalseQuiz': return <TrueFalseEditor block={block}/>;
            case 'emiCalculator': return <CalculatorEditor block={block} type="emi"/>;
            case 'sipCalculator': return <CalculatorEditor block={block} type="sip"/>;
            case 'compoundInterest': return <CalculatorEditor block={block} type="compound"/>;
            case 'callout': return <div className="grid gap-3"><select aria-label="Callout type" className="input" value={str(c.variant, 'info')} onChange={e => set({ variant: e.target.value })}>{['info', 'warning', 'tip', 'important', 'danger'].map(x => <option key={x}>{x}</option>)}</select><input aria-label="Callout title" className="input" value={str(c.title)} onChange={e => set({ title: e.target.value }, true)}/><RichTextEditor value={str(c.html, c.text ? `<p>${String(c.text)}</p>` : '')} onChange={html => set({ html }, true)}/></div>;
            case 'divider': return <div className="grid gap-3 sm:grid-cols-2"><label>Style<select className="input" value={str(c.style)} onChange={e => set({ style: e.target.value })}>{['solid', 'dashed', 'dotted', 'gradient'].map(x => <option key={x}>{x}</option>)}</select></label><label>Spacing<select className="input" value={str(c.spacing, 'normal')} onChange={e => set({ spacing: e.target.value })}>{['compact', 'normal', 'spacious'].map(x => <option key={x}>{x}</option>)}</select></label></div>;
            case 'accordion': return <AccordionEditor content={c} set={set}/>;
            case 'progressTracker': return <ProgressEditor content={c} set={set}/>;
            case 'achievementBadge': return <BadgeEditor content={c} set={set}/>;
            case 'codeSnippet': return <div className="grid gap-2"><select aria-label="Code language" className="input" value={str(c.language, 'json')} onChange={e => set({ language: e.target.value })}>{['js', 'python', 'json', 'sql'].map(x => <option key={x}>{x}</option>)}</select><label><input type="checkbox" checked={Boolean(c.lineNumbers)} onChange={e => set({ lineNumbers: e.target.checked })}/> Show line numbers</label><textarea aria-label="Code snippet" className="input min-h-36 font-mono" value={str(c.code)} onChange={e => set({ code: e.target.value }, true)}/></div>;
            case 'conceptExplainer': return <ExplainerEditor content={c} set={set}/>;
            case 'scenarioSimulator': return <ScenarioEditor content={c} set={set}/>;
            case 'flashcards': return <FlashcardsEditor content={c} set={set}/>;
            case 'knowledgeCheck': return <KnowledgeCheckEditor content={c} set={set}/>;
            default: return null;
        }
    })();
    return <><div>{editor}</div><BlockDesignPanel block={block}/></>;
}

