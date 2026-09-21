'use client';
import { useMemo } from 'react';
import type { Block, BlockDesign } from '@/lib/types';
import { useModuleStore } from '@/store/module-store';
import { defaultBlockDesign, mergeBlockDesign } from '@/lib/design';
const fonts = [
    ['Inter', 'Inter, ui-sans-serif, system-ui, sans-serif'],
    ['Georgia', 'Georgia, serif'],
    ['System', 'system-ui, sans-serif'],
    ['Mono', 'ui-monospace, SFMono-Regular, Menlo, monospace'],
];
const animations = [
    ['none', 'None'], ['fade', 'Fade in'], ['slideUp', 'Slide up'], ['slideLeft', 'Slide left'],
    ['scale', 'Scale in'], ['float', 'Float'], ['pulse', 'Pulse'],
] as const;
export function BlockDesignPanel({ block }: {
    block: Block;
}) {
    const updateBlock = useModuleStore(s => s.updateBlock);
    const design = useMemo(() => mergeBlockDesign(block.settings.design), [block.settings.design]);
    const set = (patch: Partial<BlockDesign>, label = 'Update block design') => updateBlock(block.id, { settings: { ...block.settings, design: { ...design, ...patch } } }, label);
    return (<details className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80" open>
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-black text-slate-800">
        <span className="mr-2 inline-flex rounded-lg bg-white px-2 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600 shadow-sm">Design</span>
        Full visual control
      </summary>
      <div className="grid gap-4 border-t border-slate-200 p-4">
        <section>
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Typography</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>Font family<select className="input" value={design.fontFamily} onChange={e => set({ fontFamily: e.target.value })}>{fonts.map(([label, value]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Text color<div className="flex gap-2"><input className="h-10 w-12 rounded-lg border bg-white p-1" type="color" value={design.textColor} onChange={e => set({ textColor: e.target.value })}/><input className="input" value={design.textColor} onChange={e => set({ textColor: e.target.value })}/></div></label>
            <label>Font size <span className="text-slate-400">{design.fontSize}px</span><input className="w-full" type="range" min="10" max="64" value={design.fontSize} onChange={e => set({ fontSize: Number(e.target.value) })}/></label>
            <label>Weight<select className="input" value={design.fontWeight} onChange={e => set({ fontWeight: Number(e.target.value) })}>{[400, 500, 600, 700, 800, 900].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
            <label>Line height <span className="text-slate-400">{design.lineHeight.toFixed(2)}</span><input className="w-full" type="range" min="1" max="2.2" step="0.05" value={design.lineHeight} onChange={e => set({ lineHeight: Number(e.target.value) })}/></label>
            <label>Letter spacing <span className="text-slate-400">{design.letterSpacing}px</span><input className="w-full" type="range" min="-1" max="8" step="0.5" value={design.letterSpacing} onChange={e => set({ letterSpacing: Number(e.target.value) })}/></label>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">{(['top', 'center', 'bottom'] as const).map(value => <button type="button" key={value} className={`btn justify-center ${design.verticalAlign === value ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`} onClick={() => set({ verticalAlign: value })}>V: {value}</button>)}</div><div className="mt-2 grid grid-cols-4 gap-2">
            {(['left', 'center', 'right', 'justify'] as const).map(value => <button type="button" key={value} className={`btn justify-center ${design.textAlign === value ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`} onClick={() => set({ textAlign: value })}>{value}</button>)}
          </div>
        </section>

        <section>
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Layout & surface</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>Width <span className="text-slate-400">{design.maxWidth}%</span><input className="w-full" type="range" min="30" max="100" value={design.maxWidth} onChange={e => set({ maxWidth: Number(e.target.value) })}/></label>
            <label>Opacity <span className="text-slate-400">{design.opacity}%</span><input className="w-full" type="range" min="20" max="100" value={design.opacity} onChange={e => set({ opacity: Number(e.target.value) })}/></label>
            <label>Background color<div className="flex gap-2"><input className="h-10 w-12 rounded-lg border bg-white p-1" type="color" value={design.backgroundColor === 'transparent' ? '#ffffff' : design.backgroundColor} onChange={e => set({ backgroundColor: e.target.value })}/><input className="input" value={design.backgroundColor} onChange={e => set({ backgroundColor: e.target.value })}/></div></label>
            <label>Gradient CSS<input className="input" placeholder="linear-gradient(135deg,#2563eb,#7c3aed)" value={design.backgroundGradient} onChange={e => set({ backgroundGradient: e.target.value })}/></label>
            <label>Padding <span className="text-slate-400">{design.padding}px</span><input className="w-full" type="range" min="0" max="64" value={design.padding} onChange={e => set({ padding: Number(e.target.value) })}/></label>
            <label>Radius <span className="text-slate-400">{design.borderRadius}px</span><input className="w-full" type="range" min="0" max="40" value={design.borderRadius} onChange={e => set({ borderRadius: Number(e.target.value) })}/></label>
            <label>Top margin <input className="input" type="number" min="0" max="120" value={design.marginTop} onChange={e => set({ marginTop: Number(e.target.value) })}/></label>
            <label>Bottom margin <input className="input" type="number" min="0" max="120" value={design.marginBottom} onChange={e => set({ marginBottom: Number(e.target.value) })}/></label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['none', 'soft', 'medium', 'large'] as const).map(value => <button type="button" key={value} className={`btn ${design.shadow === value ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`} onClick={() => set({ shadow: value })}>Shadow: {value}</button>)}
          </div>
        </section>

        <section>
          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Motion & interaction</div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label>Entrance animation<select className="input" value={design.animation} onChange={e => set({ animation: e.target.value as BlockDesign['animation'] })}>{animations.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Duration <span className="text-slate-400">{design.animationDuration}s</span><input className="w-full" type="range" min="0.1" max="2" step="0.05" value={design.animationDuration} onChange={e => set({ animationDuration: Number(e.target.value) })}/></label>
            <label>Delay <span className="text-slate-400">{design.animationDelay}s</span><input className="w-full" type="range" min="0" max="2" step="0.05" value={design.animationDelay} onChange={e => set({ animationDelay: Number(e.target.value) })}/></label>
            <label>Repeat<select className="input" value={design.animationRepeat} onChange={e => set({ animationRepeat: Number(e.target.value) })}><option value="0">Once</option><option value="1">2 times</option><option value="2">3 times</option><option value="-1">Infinite</option></select></label>
            <label>Hover scale <span className="text-slate-400">{design.hoverScale.toFixed(2)}×</span><input className="w-full" type="range" min="1" max="1.08" step="0.01" value={design.hoverScale} onChange={e => set({ hoverScale: Number(e.target.value) })}/></label>
            <label>Hover lift <span className="text-slate-400">{design.hoverLift}px</span><input className="w-full" type="range" min="0" max="16" value={design.hoverLift} onChange={e => set({ hoverLift: Number(e.target.value) })}/></label>
          </div>
          <p className="mt-2 text-xs text-slate-500">Animations are saved with the block and play in Preview, Showcase, and the published learner course.</p>
        </section>

        <button type="button" className="btn w-fit" onClick={() => set(defaultBlockDesign, 'Reset block design')}>Reset visual settings</button>
      </div>
    </details>);
}

