import type { ModuleDocument } from './types';
export interface QualityCheck {
    id: string;
    label: string;
    passed: boolean;
    detail: string;
}
export interface QualityReport {
    score: number;
    checks: QualityCheck[];
}
/** Defensive quality assessment: imported/legacy documents may have missing fields. */
export function assessModuleQuality(doc: ModuleDocument | null | undefined): QualityReport {
    const safe = doc ?? ({} as ModuleDocument);
    const title = String(safe.title ?? '');
    const description = String(safe.description ?? '');
    const blocks = Array.isArray(safe.blocks) ? safe.blocks : [];
    const metadata = safe.metadata ?? ({} as ModuleDocument['metadata']);
    const tags = Array.isArray(metadata.tags) ? metadata.tags : [];
    const estimatedDuration = Number(metadata.estimatedDuration ?? 0);
    const checks: QualityCheck[] = [
        { id: 'title', label: 'Clear module title', passed: title.trim().length >= 5, detail: 'Use at least 5 characters.' },
        { id: 'description', label: 'Module description', passed: description.trim().length >= 20, detail: 'Add a learner-facing description.' },
        { id: 'content', label: 'Meaningful lesson structure', passed: blocks.length >= 3, detail: 'Aim for at least 3 blocks.' },
        { id: 'accessibility', label: 'Image accessibility', passed: blocks.filter(b => b?.type === 'image').every(b => String(b?.content?.alt ?? '').trim().length > 0), detail: 'Every image needs alt text.' },
        { id: 'assessment', label: 'Knowledge check', passed: blocks.some(b => b?.type === 'mcqQuiz' || b?.type === 'trueFalseQuiz'), detail: 'Add at least one quiz.' },
        { id: 'interaction', label: 'Interactive learning', passed: blocks.some(b => ['emiCalculator', 'sipCalculator', 'compoundInterest', 'conceptExplainer'].includes(b?.type)), detail: 'Add a calculator or concept explainer.' },
        { id: 'metadata', label: 'Learning metadata', passed: tags.length > 0 && Number.isFinite(estimatedDuration) && estimatedDuration > 0, detail: 'Add duration and at least one tag.' },
        { id: 'completion', label: 'Completion cue', passed: blocks.some(b => b?.type === 'progressTracker' || b?.type === 'achievementBadge'), detail: 'Add progress tracking or an achievement badge.' },
    ];
    const score = checks.length ? Math.round((checks.filter(c => c.passed).length / checks.length) * 100) : 0;
    return { score, checks };
}

