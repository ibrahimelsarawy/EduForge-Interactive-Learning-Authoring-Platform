'use client';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Download, History, Plus, Redo2, Search, Undo2, Upload } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { blockRegistry } from '@/lib/blocks';
import { useModuleStore } from '@/store/module-store';
import type { Block } from '@/lib/types';
import { BlockForm } from '../block-form';
import { prepareImport, serializeForExport } from '@/lib/document-io';
import { SortableBlock } from './sortable-block';
export function Editor() {
    const doc = useModuleStore((s) => s.document);
    const addBlock = useModuleStore((s) => s.addBlock);
    const moveBlock = useModuleStore((s) => s.moveBlock);
    const undo = useModuleStore((s) => s.undo);
    const redo = useModuleStore((s) => s.redo);
    const past = useModuleStore((s) => s.past);
    const future = useModuleStore((s) => s.future);
    const jumpToHistory = useModuleStore((s) => s.jumpToHistory);
    const importDocument = useModuleStore((s) => s.importDocument);
    const markClean = useModuleStore((s) => s.markClean);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const [query, setQuery] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const slashRef = useRef<HTMLInputElement>(null);
    const filtered = useMemo(() => blockRegistry.filter((b) => { const q = query.replace(/^\//, '').toLowerCase().trim(); return !q || [b.name, b.description, ...b.keywords].join(' ').toLowerCase().includes(q); }), [query]);
    useEffect(() => { const onKey = (e: KeyboardEvent) => { const tag = (e.target as HTMLElement)?.tagName; const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'; if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
    } if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') || (e.ctrlKey && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        redo();
    } if (!typing && e.key === '/') {
        e.preventDefault();
        slashRef.current?.focus();
        setQuery('/');
        setActiveIndex(0);
    } if (!typing && e.ctrlKey && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        const selected = useModuleStore.getState().selectedBlockId;
        const index = selected ? useModuleStore.getState().document.blocks.findIndex(b => b.id === selected) : 0;
        addBlock('richText', Math.max(0, index));
    } if (!typing && e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        const selected = useModuleStore.getState().selectedBlockId;
        const index = selected ? useModuleStore.getState().document.blocks.findIndex(b => b.id === selected) + 1 : useModuleStore.getState().document.blocks.length;
        addBlock('richText', index);
    } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [undo, redo, addBlock]);
    const exportJson = () => {
        let serialized: string;
        try {
            serialized = serializeForExport(doc);
        }
        catch (error) {
            alert(error instanceof Error ? error.message : 'Export validation failed.');
            return;
        }
        const blob = new Blob([serialized], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        markClean();
    };
    const importJson = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        try {
            const parsed = JSON.parse(await file.text());
            const prepared = prepareImport(parsed);
            importDocument(prepared.document);
            if (prepared.warnings.length)
                alert(prepared.warnings.join('\n'));
        }
        catch (error) {
            alert(error instanceof Error ? error.message : 'Invalid JSON');
        }
        event.target.value = '';
    };
    const onDragEnd = ({ active, over }: DragEndEvent) => { if (over && active.id !== over.id)
        moveBlock(String(active.id), String(over.id)); };
    return <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
    <div className="shrink-0 flex flex-wrap items-center gap-2 border-b bg-white p-3">
      <button onClick={undo} disabled={!past.length} className="btn" aria-label="Undo"><Undo2 size={16}/> Undo</button>
      <button onClick={redo} disabled={!future.length} className="btn" aria-label="Redo"><Redo2 size={16}/> Redo</button>
      <button onClick={exportJson} className="btn"><Download size={16}/> Export JSON</button><button onClick={() => setShowHistory(!showHistory)} className="btn"><History size={16}/> History</button>
      <label className="btn cursor-pointer"><Upload size={16}/> Import JSON<input className="hidden" type="file" accept=".json,application/json" onChange={importJson}/></label>
      <span className="ml-auto text-xs text-slate-500">{doc.blocks.length}/200 blocks • {past.length}/50 history</span>
    </div>
    {showHistory ? <div role="log" aria-label="Undo/redo history" className="max-h-56 shrink-0 overflow-y-auto border-b bg-slate-50 px-5 py-3 text-sm"><strong>History</strong><ol className="mt-2 grid gap-1 md:grid-cols-2">{past.slice().reverse().map((entry, i) => { const idx = past.length - 1 - i; return <li key={`${entry.timestamp}-${i}`}><button onClick={() => jumpToHistory(idx)} className="w-full rounded bg-white px-2 py-1 text-left shadow-sm hover:bg-blue-50">{entry.label}</button></li>; })}{past.length === 0 ? <li className="text-slate-500">No edits yet.</li> : null}</ol></div> : null}
    <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto p-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="h-fit rounded-xl border bg-white p-3 shadow-sm lg:sticky lg:top-0">
        <h2 className="mb-3 font-bold">Add a block</h2><label className="relative mb-2 block"><Search className="absolute left-2 top-2.5 text-slate-400" size={15}/><input ref={slashRef} role="combobox" aria-expanded={query.length > 0} aria-controls="slash-options" aria-activedescendant={filtered[activeIndex] ? `slash-${filtered[activeIndex].type}` : undefined} aria-label="Slash command search" className="input pl-8" placeholder="Type / to search" value={query} onKeyDown={(e) => { if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(i => Math.min(filtered.length - 1, i + 1));
    } if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(i => Math.max(0, i - 1));
    } if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        addBlock(filtered[activeIndex].type);
        setQuery('');
    } if (e.key === 'Escape') {
        setQuery('');
    } }} onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}/></label>
        <div id="slash-options" role="listbox" aria-label="Block palette" className="space-y-1">{filtered.map((b, i) => <button id={`slash-${b.type}`} aria-selected={i === activeIndex} role="option" key={b.type} onClick={() => { addBlock(b.type); setQuery(''); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-blue-50"><strong>{b.name}</strong><span className="block text-xs text-slate-500">{b.description}</span></button>)}{filtered.length === 0 ? <p className="p-3 text-sm text-slate-500">No matching block.</p> : null}</div>
      </aside>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={doc.blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <main className="space-y-4">{doc.blocks.map((block) => <SortableBlock key={block.id} block={block}/>)}</main>
        </SortableContext>
      </DndContext>
    </div>
  </section>;
}

