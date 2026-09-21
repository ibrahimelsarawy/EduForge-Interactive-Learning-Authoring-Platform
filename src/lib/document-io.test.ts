import { describe, expect, it } from 'vitest';
import { prepareImport, serializeForExport } from './document-io';
import type { ModuleDocument } from './types';
const base: ModuleDocument = {
    schemaVersion: 1, moduleId: '00000000-0000-4000-8000-000000000001', title: 'Import me', description: '', version: '1.0.0', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z', author: { id: 'a', name: 'A' }, metadata: { estimatedDuration: 1, difficulty: 'beginner', tags: [], thumbnail: '' }, blocks: [{ id: '00000000-0000-4000-8000-000000000002', type: 'richText', order: 0, content: { html: 'x' }, settings: { isVisible: true, isLocked: false, customCss: '' } }], quizConfig: { feedbackMode: 'immediate', passingScore: 60, showScoreOnCompletion: true }
};
describe('document import/export', () => {
    it('serializes pretty JSON', () => expect(serializeForExport(base)).toContain('\n  "title"'));
    it('rejects malformed export state', () => expect(() => serializeForExport({ ...base, title: '' })).toThrow());
    it('regenerates module ID', () => expect(prepareImport(base).document.moduleId).not.toBe(base.moduleId));
    it('regenerates block IDs', () => expect(prepareImport(base).document.blocks[0].id).not.toBe(base.blocks[0].id));
    it('normalizes block order', () => expect(prepareImport({ ...base, blocks: [{ ...base.blocks[0], order: 0 }] }).document.blocks[0].order).toBe(0));
    it('rejects arrays', () => expect(() => prepareImport([])).toThrow());
    it('rejects null', () => expect(() => prepareImport(null)).toThrow());
    it('rejects newer schemas', () => expect(() => prepareImport({ ...base, schemaVersion: 99 })).toThrow(/newer/));
    it('reports UUID regeneration warning', () => expect(prepareImport(base).warnings.join(' ')).toMatch(/UUIDs/));
});

