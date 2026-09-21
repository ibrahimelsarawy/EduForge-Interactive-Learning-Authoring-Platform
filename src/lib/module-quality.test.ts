import { describe, expect, it } from 'vitest';
import { assessModuleQuality } from './module-quality';
import type { ModuleDocument } from './types';
const doc = (): ModuleDocument => ({ schemaVersion: 1, moduleId: 'x', title: 'Budget Basics', description: 'A practical introduction to budgeting for beginners.', version: '1', createdAt: '', updatedAt: '', author: { id: 'a', name: 'A' }, metadata: { estimatedDuration: 10, difficulty: 'beginner', tags: ['finance'], thumbnail: '' }, quizConfig: { feedbackMode: 'immediate', passingScore: 60, showScoreOnCompletion: true }, blocks: [] });
describe('module quality', () => { it('reports missing learning structure', () => { expect(assessModuleQuality(doc()).score).toBeLessThan(100); }); it('accepts accessible images', () => { const d = doc(); d.blocks = [{ id: '1', type: 'image', order: 0, content: { alt: 'Budget chart' }, settings: { isVisible: true, isLocked: false, customCss: '' } }]; expect(assessModuleQuality(d).checks.find(c => c.id === 'accessibility')?.passed).toBe(true); }); });

