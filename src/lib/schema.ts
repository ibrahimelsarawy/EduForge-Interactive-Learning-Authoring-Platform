import { z } from 'zod';
import type { ModuleDocument } from './types';
import { parseVideoUrl } from './video';
const uuid = z.string().uuid();
const blockTypes = ['richText','image','video','mcqQuiz','trueFalseQuiz','emiCalculator','sipCalculator','compoundInterest','callout','divider','accordion','progressTracker','achievementBadge','codeSnippet','conceptExplainer','scenarioSimulator','flashcards','knowledgeCheck'] as const;
const blockSchema = z.object({ id: uuid, type: z.enum(blockTypes), order: z.number().int().nonnegative(), content: z.record(z.unknown()), settings: z.object({ isVisible: z.boolean(), isLocked: z.boolean(), customCss: z.string(), design: z.any().optional() }) });
export const moduleSchema = z.object({
    schemaVersion: z.number().int().min(1).default(1),
    moduleId: uuid, title: z.string().trim().min(1, 'Module title is required.').max(200), description: z.string().max(1000), version: z.string().min(1), createdAt: z.string(), updatedAt: z.string(), author: z.object({ id: z.string(), name: z.string() }),
    metadata: z.object({ estimatedDuration: z.number().min(0), difficulty: z.enum(['beginner', 'intermediate', 'advanced']), tags: z.array(z.string()), thumbnail: z.string() }),
    blocks: z.array(blockSchema).min(1, 'Module must contain at least one block.').max(200, 'Module exceeds maximum block count (200).'),
    quizConfig: z.object({ feedbackMode: z.enum(['immediate', 'deferred']), passingScore: z.number().min(0).max(100), showScoreOnCompletion: z.boolean() })
}).superRefine((doc, ctx) => {
    const orders = doc.blocks.map(b => b.order);
    if (new Set(orders).size !== orders.length)
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Internal error: duplicate block order detected.' });
    doc.blocks.forEach((b, index) => {
        const content = b.content;
        const issue = (message: string, path?: string[]) => ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: path ? ['blocks', index, 'content', ...path] : ['blocks', index, 'content'] });
        if (b.type === 'image') {
            if (!String(content.alt ?? '').trim())
                issue(`Image block ${index + 1} is missing alt text (accessibility).`, ['alt']);
            if (content.src && !String(content.src).startsWith('data:') && !/^https?:\/\//.test(String(content.src)))
                issue('Image source must be a URL or uploaded data URI.', ['src']);
        }
        if (b.type === 'video' && String(content.url ?? '').trim() && !parseVideoUrl(String(content.url)))
            issue('Only YouTube and Vimeo URLs are supported.', ['url']);
        if (b.type === 'mcqQuiz') {
            const opts = Array.isArray(content.options) ? content.options : [];
            if (opts.length < 2)
                issue(`Quiz block ${index + 1} must have at least 2 options.`);
            if (opts.length > 6)
                issue(`Quiz block ${index + 1} supports at most 6 options.`);
            if (!opts.some((o) => Boolean((o as Record<string, unknown>).isCorrect)))
                issue(`Quiz block ${index + 1} must have at least one correct answer.`);
        }
        if (b.type === 'accordion' && (!Array.isArray(content.items) || content.items.length < 1))
            issue('Accordion must have at least one item.');
        if (b.type === 'conceptExplainer') {
            const steps = Array.isArray(content.steps) ? content.steps : [];
            if (steps.length < 3 || steps.length > 10)
                issue('Animated Explainer must have 3–10 steps.');
        }
        if (b.type === 'progressTracker' && Number(content.total) < 2)
            issue('Progress Tracker requires at least 2 steps.');
        if (b.type === 'emiCalculator') {
            const p = Number(content.principal), r = Number(content.annualRate), m = Number(content.months);
            if (p < 10000 || p > 100000000 || r < 0 || r > 36 || m < 1 || m > 360)
                issue(`EMI Calculator block ${index + 1} has invalid input ranges.`);
        }
        if (b.type === 'sipCalculator') {
            const p = Number(content.monthly), r = Number(content.annualRate), y = Number(content.years);
            if (p < 500 || p > 1000000 || r < 1 || r > 30 || y < 1 || y > 40)
                issue(`SIP Calculator block ${index + 1} has invalid input ranges.`);
        }
        if (b.type === 'compoundInterest') {
            const f = Number(content.frequency);
            if (![1, 2, 4, 12].includes(f))
                issue('Compound Interest frequency must be monthly, quarterly, half-yearly, or annually.');
        }
    });
});
export function validateModule(document: ModuleDocument) { return moduleSchema.safeParse(document); }

