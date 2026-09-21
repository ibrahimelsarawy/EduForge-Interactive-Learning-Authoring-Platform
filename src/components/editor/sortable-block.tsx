'use client';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, GripVertical, Lock, Plus, Trash2, Unlock } from 'lucide-react';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { blockRegistry } from '@/lib/blocks';
import { BlockForm } from '../block-form';
import { useModuleStore } from '@/store/module-store';
import type { Block } from '@/lib/types';
export function SortableBlock({ block }: {
    block: Block;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
    const selected = useModuleStore((s) => s.selectedBlockId);
    const select = useModuleStore((s) => s.selectBlock);
    const remove = useModuleStore((s) => s.deleteBlock);
    const addBlock = useModuleStore((s) => s.addBlock);
    const duplicate = useModuleStore((s) => s.duplicateBlock);
    const updateBlock = useModuleStore((s) => s.updateBlock);
    const moveBy = useModuleStore((s) => s.moveBy);
    const style = { transform: CSS.Transform.toString(transform), transition };
    const [showSettings, setShowSettings] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [toast, setToast] = useState('');
    const deleteBlock = () => { remove(block.id); setShowDeleteConfirm(false); setToast('Block deleted successfully'); window.setTimeout(() => setToast(''), 2600); };
    return (<motion.article ref={setNodeRef} style={style} layout {...attributes} className={`group rounded-xl border bg-white shadow-sm ${selected === block.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`} role="group" aria-label={`${block.type} block, position ${block.order + 1} of ${useModuleStore.getState().document.blocks.length}`} tabIndex={0} onKeyDown={(e) => { if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        moveBy(block.id, -1);
    } if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        moveBy(block.id, 1);
    } if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicate(block.id);
    } if (e.ctrlKey && e.key === 'Backspace') {
        e.preventDefault();
        remove(block.id);
    } }} onClick={() => select(block.id)}>
      <div role="toolbar" aria-label="Block actions" className="flex items-center gap-1 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
        <button aria-label="Drag block" className="cursor-grab rounded p-1 hover:bg-slate-200" {...listeners}><GripVertical size={16}/></button>
        <span className="text-xs font-semibold text-slate-500">{blockRegistry.find((b) => b.type === block.type)?.name}</span>
        <div className="ml-auto flex gap-1"><button aria-label="Add block above" title="Add block above (Ctrl+Shift+Enter)" onClick={(e) => { e.stopPropagation(); addBlock('richText', block.order); }} className="p-1"><Plus size={15}/></button><button aria-label="Add block below" title="Add block below (Ctrl+Enter)" onClick={(e) => { e.stopPropagation(); addBlock('richText', block.order + 1); }} className="p-1"><Plus size={15}/></button>
          <button aria-label="Move block up" onClick={(e) => { e.stopPropagation(); moveBy(block.id, -1); }} className="p-1"><ArrowUp size={15}/></button>
          <button aria-label="Move block down" onClick={(e) => { e.stopPropagation(); moveBy(block.id, 1); }} className="p-1"><ArrowDown size={15}/></button>
          <button aria-label="Duplicate block" onClick={(e) => { e.stopPropagation(); duplicate(block.id); }} className="p-1"><Copy size={15}/></button>
          <button aria-label="Toggle lock" onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { settings: { ...block.settings, isLocked: !block.settings.isLocked } }, 'Toggle block lock'); }} className="p-1">{block.settings.isLocked ? <Lock size={15}/> : <Unlock size={15}/>}</button>
          <button aria-label="Toggle visibility" onClick={(e) => { e.stopPropagation(); updateBlock(block.id, { settings: { ...block.settings, isVisible: !block.settings.isVisible } }, 'Toggle visibility'); }} className="p-1">{block.settings.isVisible ? <Eye size={15}/> : <EyeOff size={15}/>}</button>
          <button aria-label="Block settings" title="Block settings (Ctrl+/)" onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} className="p-1">⚙</button><button aria-label="Delete block" onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }} className="p-1 text-red-600"><Trash2 size={15}/></button>
        </div>
      </div>
      <div className="p-4"><BlockForm block={block}/>{showSettings ? <details open className="mt-4 rounded border p-3"><summary className="cursor-pointer font-semibold">Advanced</summary><label className="mt-3 block text-sm">Custom CSS<textarea className="input mt-1 min-h-24 font-mono" value={block.settings.customCss} onChange={(e) => updateBlock(block.id, { settings: { ...block.settings, customCss: e.target.value } }, 'Update custom CSS')}/></label></details> : null}</div>
      {showDeleteConfirm ? <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/40 p-4" role="presentation" onMouseDown={() => setShowDeleteConfirm(false)}>
        <motion.div initial={{ opacity: 0, scale: .96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 8 }} transition={{ duration: .16 }} role="dialog" aria-modal="true" aria-labelledby={`delete-title-${block.id}`} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash2 size={20}/></div>
          <h3 id={`delete-title-${block.id}`} className="text-lg font-bold text-slate-900">Delete this block?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">This will remove the block from your module. You can always bring it back with Undo.</p>
          <div className="mt-6 flex justify-end gap-3"><button className="btn" onClick={() => setShowDeleteConfirm(false)}>Keep block</button><button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700" onClick={deleteBlock}>Delete block</button></div>
        </motion.div>
      </div> : null}
      {toast ? <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} role="status" aria-live="polite" className="fixed bottom-6 right-6 z-[110] flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-2xl"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500">✓</span>{toast}<button className="ml-2 text-slate-300 hover:text-white" onClick={() => setToast('')} aria-label="Dismiss notification">×</button></motion.div> : null}
    </motion.article>);
}

