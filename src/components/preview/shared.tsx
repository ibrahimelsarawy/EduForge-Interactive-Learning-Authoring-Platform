'use client';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import type { ReactNode } from 'react';
import { downloadCsv } from '@/lib/csv';
import { formatINR } from '@/lib/finance';
export function Card({ title, children }: {
    title: string;
    children: ReactNode;
}) {
    return <section className="preview-card rounded-xl border p-5"><h3 className="mb-3 font-bold">{title}</h3>{children}</section>;
}
export function CalcInput({ label, value, onChange, min, max, step = 1 }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    min: number;
    max: number;
    step?: number;
}) {
    return <label>{label}<input className="input" aria-label={label} type="number" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}/><input className="mt-2 w-full" type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}/></label>;
}
export function Metric({ label, value }: {
    label: string;
    value: string;
}) {
    return <div className="rounded-lg bg-white p-3 shadow-sm"><span className="block text-xs opacity-60">{label}</span><strong className="text-lg">{value}</strong></div>;
}
export function Donut({ primary, secondary }: {
    primary: number;
    secondary: number;
}) {
    const total = Math.max(1, primary + secondary), p = primary / total * 100;
    return <motion.div initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4 h-28 w-28 rounded-full" style={{ background: `conic-gradient(#2563eb 0 ${p}%, #f59e0b ${p}% 100%)`, mask: 'radial-gradient(circle at center, transparent 45%, black 46%)' }}/>;
}
export function LineChart({ rows }: {
    rows: Array<{
        year: number;
        value: number;
    }>;
}) {
    const max = Math.max(...rows.map(r => r.value), 1), pts = rows.map((r, i) => `${(i / Math.max(1, rows.length - 1)) * 100},${100 - r.value / max * 100}`).join(' ');
    return <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-4 h-40 w-full rounded border"><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></svg>;
}
export { downloadCsv, formatINR, Download };

