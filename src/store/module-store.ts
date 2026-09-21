'use client';
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { Block, HistoryEntry, ModuleDocument } from '@/lib/types';
import { createBlock } from '@/lib/blocks';
const now = () => new Date().toISOString();
const clone = <T,>(value: T): T => structuredClone(value);
const initialDocument = (): ModuleDocument => ({
    schemaVersion: 1, moduleId: uuid(), title: 'Untitled Financial Module', description: '', version: '1.0.0', createdAt: now(), updatedAt: now(),
    author: { id: 'creator-1', name: 'Content Creator' }, metadata: { estimatedDuration: 10, difficulty: 'beginner', tags: ['finance'], thumbnail: '' },
    blocks: [createBlock('richText')], quizConfig: { feedbackMode: 'immediate', passingScore: 60, showScoreOnCompletion: true },
});
interface Store {
    document: ModuleDocument;
    past: HistoryEntry[];
    future: HistoryEntry[];
    selectedBlockId: string | null;
    previewDevice: 'desktop' | 'tablet' | 'mobile';
    previewDark: boolean;
    isDirty: boolean;
    selectBlock: (id: string | null) => void;
    setPreviewDevice: (device: Store['previewDevice']) => void;
    togglePreviewDark: () => void;
    markClean: () => void;
    commit: (label: string, recipe: (doc: ModuleDocument) => ModuleDocument) => void;
    addBlock: (type: Block['type'], index?: number) => void;
    updateBlock: (id: string, patch: Partial<Block>, label?: string) => void;
    updateContent: (id: string, content: Record<string, unknown>, label?: string, batch?: boolean) => void;
    deleteBlock: (id: string) => void;
    duplicateBlock: (id: string) => void;
    moveBlock: (activeId: string, overId: string) => void;
    moveBy: (id: string, delta: number) => void;
    undo: () => void;
    redo: () => void;
    jumpToHistory: (pastIndex: number) => void;
    importDocument: (document: ModuleDocument) => void;
    loadDocument: (document: ModuleDocument) => void;
}
const normalize = (doc: Partial<ModuleDocument> | null | undefined): ModuleDocument => {
    const base = initialDocument();
    const safe = doc ?? {};
    const rawBlocks = Array.isArray(safe.blocks) ? safe.blocks : [];
    const metadata = safe.metadata ?? base.metadata;
    return {
        ...base,
        ...safe,
        title: typeof safe.title === 'string' ? safe.title : base.title,
        description: typeof safe.description === 'string' ? safe.description : '',
        metadata: {
            ...base.metadata,
            ...metadata,
            tags: Array.isArray(metadata.tags) ? metadata.tags : [],
        },
        blocks: rawBlocks.map((block, order) => ({
            ...block,
            content: block?.content && typeof block.content === 'object' ? block.content : {},
            order,
        })),
        updatedAt: now(),
    };
};
let lastBatch: {
    key: string;
    timestamp: number;
} | null = null;
export const useModuleStore = create<Store>((set, get) => {
    const push = (label: string, next: ModuleDocument | ((doc: ModuleDocument) => ModuleDocument), batchKey?: string) => {
        const current = clone(get().document);
        const time = Date.now();
        const batchable = Boolean(batchKey && lastBatch?.key === batchKey && time - lastBatch.timestamp <= 500);
        const resolved = typeof next === 'function' ? next(clone(current)) : next;
        set(state => ({
            document: normalize(resolved),
            past: batchable ? state.past : [...state.past, { label, snapshot: clone(current), timestamp: time }].slice(-50),
            future: [],
            isDirty: true
        }));
        lastBatch = batchKey ? { key: batchKey, timestamp: time } : null;
    };
    return {
        document: initialDocument(), past: [], future: [], selectedBlockId: null, previewDevice: 'desktop', previewDark: false, isDirty: false,
        selectBlock: (selectedBlockId) => set({ selectedBlockId }), setPreviewDevice: (previewDevice) => set({ previewDevice }), togglePreviewDark: () => set(s => ({ previewDark: !s.previewDark })), markClean: () => set({ isDirty: false }),
        commit: (label, recipe) => push(label, recipe(clone(get().document))),
        addBlock: (type, index) => { const block = createBlock(type); push(`Add ${type}`, doc => { doc.blocks.splice(index ?? doc.blocks.length, 0, block); return doc; }); set({ selectedBlockId: block.id }); },
        updateBlock: (id, patch, label = 'Update block') => push(label, doc => { doc.blocks = doc.blocks.map(b => b.id === id ? { ...b, ...patch } : b); return doc; }),
        updateContent: (id, content, label = 'Edit block', batch = false) => push(label, doc => { doc.blocks = doc.blocks.map(b => b.id === id ? { ...b, content } : b); return doc; }, batch ? `content:${id}` : undefined),
        deleteBlock: (id) => push('Delete block', doc => ({ ...doc, blocks: doc.blocks.filter(b => b.id !== id) })),
        duplicateBlock: (id) => push('Duplicate block', doc => { const index = doc.blocks.findIndex(b => b.id === id); if (index < 0)
            return doc; const copy = { ...clone(doc.blocks[index]), id: uuid() }; doc.blocks.splice(index + 1, 0, copy); return doc; }),
        moveBlock: (activeId, overId) => push('Reorder block', doc => { const from = doc.blocks.findIndex(b => b.id === activeId), to = doc.blocks.findIndex(b => b.id === overId); if (from < 0 || to < 0 || from === to)
            return doc; const [item] = doc.blocks.splice(from, 1); doc.blocks.splice(to, 0, item); return doc; }),
        moveBy: (id, delta) => push(delta < 0 ? 'Move block up' : 'Move block down', doc => { const index = doc.blocks.findIndex(b => b.id === id), target = index + delta; if (index < 0 || target < 0 || target >= doc.blocks.length)
            return doc; [doc.blocks[index], doc.blocks[target]] = [doc.blocks[target], doc.blocks[index]]; return doc; }),
        undo: () => set(state => { const last = state.past.at(-1); if (!last)
            return state; return { document: clone(last.snapshot), past: state.past.slice(0, -1), future: [{ label: 'Redo', snapshot: clone(state.document), timestamp: Date.now() }, ...state.future].slice(0, 50), isDirty: true }; }),
        redo: () => set(state => { const next = state.future[0]; if (!next)
            return state; return { document: clone(next.snapshot), past: [...state.past, { label: 'Undo', snapshot: clone(state.document), timestamp: Date.now() }].slice(-50), future: state.future.slice(1), isDirty: true }; }),
        jumpToHistory: (pastIndex) => set(state => { if (pastIndex < 0 || pastIndex >= state.past.length)
            return state; const target = state.past[pastIndex]; const discarded = state.past.slice(pastIndex + 1); return { document: clone(target.snapshot), past: state.past.slice(0, pastIndex), future: [{ label: 'Restore current', snapshot: clone(state.document), timestamp: Date.now() }, ...discarded.slice().reverse(), ...state.future].slice(0, 50), isDirty: true }; }),
        importDocument: (document) => { const safe = normalize(document); set({ document: normalize({ ...safe, schemaVersion: 1, moduleId: uuid(), blocks: safe.blocks.map(block => ({ ...block, id: uuid() })) }), past: [], future: [], selectedBlockId: null, isDirty: false }); },
        loadDocument: (document) => set({ document: normalize(clone(document)), past: [], future: [], selectedBlockId: null, isDirty: false }),
    };
});

