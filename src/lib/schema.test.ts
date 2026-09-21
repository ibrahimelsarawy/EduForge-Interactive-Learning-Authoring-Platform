import { describe, expect, it } from 'vitest';
import { validateModule } from './schema';
import type { BlockType, ModuleDocument } from './types';
const base: ModuleDocument = {
    schemaVersion: 1, moduleId: '00000000-0000-4000-8000-000000000001', title: 'Test', description: '', version: '1.0.0', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
    author: { id: 'a', name: 'A' }, metadata: { estimatedDuration: 1, difficulty: 'beginner', tags: [], thumbnail: '' },
    blocks: [{ id: '00000000-0000-4000-8000-000000000002', type: 'richText', order: 0, content: { html: 'x' }, settings: { isVisible: true, isLocked: false, customCss: '' } }],
    quizConfig: { feedbackMode: 'immediate', passingScore: 60, showScoreOnCompletion: true },
};
describe('module schema', () => {
    it('accepts valid module', () => expect(validateModule(base).success).toBe(true));
    it('rejects empty title', () => expect(validateModule({ ...base, title: '' }).success).toBe(false));
    it('rejects empty blocks', () => expect(validateModule({ ...base, blocks: [] }).success).toBe(false));
});
describe('module schema edge cases', () => {
    const withBlock = (type: BlockType, content: Record<string, unknown>) => ({ ...base, blocks: [{ ...base.blocks[0], type, content }] });
    it('rejects duplicate order values', () => expect(validateModule({ ...base, blocks: [...base.blocks, { ...base.blocks[0], id: '00000000-0000-4000-8000-000000000003' }] }).success).toBe(false));
    it('rejects image without alt text', () => expect(validateModule(withBlock('image', { src: 'https://example.com/a.png', alt: '' })).success).toBe(false));
    it('rejects unsupported image source', () => expect(validateModule(withBlock('image', { src: 'ftp://bad', alt: 'Alt' })).success).toBe(false));
    it('rejects unsupported video host', () => expect(validateModule(withBlock('video', { url: 'https://example.com/video' })).success).toBe(false));
    it('rejects MCQ with one option', () => expect(validateModule(withBlock('mcqQuiz', { options: [{ text: 'A', isCorrect: true }] })).success).toBe(false));
    it('rejects MCQ without a correct answer', () => expect(validateModule(withBlock('mcqQuiz', { options: [{ text: 'A', isCorrect: false }, { text: 'B', isCorrect: false }] })).success).toBe(false));
    it('rejects more than six quiz options', () => expect(validateModule(withBlock('mcqQuiz', { options: Array.from({ length: 7 }, (_, i) => ({ text: String(i), isCorrect: i === 0 })) })).success).toBe(false));
    it('rejects invalid EMI ranges', () => expect(validateModule(withBlock('emiCalculator', { principal: 1, annualRate: 99, months: 0 })).success).toBe(false));
    it('rejects invalid SIP ranges', () => expect(validateModule(withBlock('sipCalculator', { monthly: 1, annualRate: 0, years: 0 })).success).toBe(false));
    it('rejects invalid compound frequency', () => expect(validateModule(withBlock('compoundInterest', { frequency: 3 })).success).toBe(false));
    it('rejects explainer with fewer than three steps', () => expect(validateModule(withBlock('conceptExplainer', { steps: [{}, {}] })).success).toBe(false));
    it('rejects progress with fewer than two steps', () => expect(validateModule(withBlock('progressTracker', { total: 1 })).success).toBe(false));
});

