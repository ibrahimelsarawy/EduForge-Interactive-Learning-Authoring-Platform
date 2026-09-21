'use client';
import { useMemo } from 'react';
import { calculateCompound, calculateEMI, calculateSIP, emiSummary, formatINR } from '@/lib/finance';
import type { Block } from '@/lib/types';
import { useModuleStore } from '@/store/module-store';
import { num } from './helpers';
export function CalculatorEditor({ block, type }: {
    block: Block;
    type: 'emi' | 'sip' | 'compound';
}) { const update = useModuleStore(s => s.updateContent); const c = block.content; const set = (key: string, value: number) => update(block.id, { ...c, [key]: value }, 'Configure calculator'); const result = useMemo(() => type === 'emi' ? calculateEMI(num(c.principal, 0), num(c.annualRate, 0), num(c.months, 0)) : type === 'sip' ? calculateSIP(num(c.monthly, 0), num(c.annualRate, 0), num(c.years, 0)) : calculateCompound(num(c.principal, 0), num(c.annualRate, 0), num(c.years, 0), num(c.frequency, 12)), [c, type]); return <div className="grid gap-3 sm:grid-cols-2">{type !== 'sip' && <NumberInput label="Principal" value={num(c.principal, 100000)} min={10000} max={100000000} onChange={v => set('principal', v)}/>} {type === 'sip' && <NumberInput label="Monthly investment" value={num(c.monthly, 5000)} min={500} max={1000000} onChange={v => set('monthly', v)}/>}<NumberInput label="Annual return / rate %" value={num(c.annualRate, 8)} min={type === 'sip' ? 1 : 0} max={type === 'sip' ? 30 : 36} step={type === 'sip' ? 0.5 : 0.1} onChange={v => set('annualRate', v)}/>{type === 'emi' ? <NumberInput label="Tenure (months)" value={num(c.months, 240)} min={1} max={360} onChange={v => set('months', v)}/> : <NumberInput label="Years" value={num(c.years, 10)} min={1} max={type === 'sip' ? 40 : 100} onChange={v => set('years', v)}/>} {type === 'compound' && <label>Compounding<select className="input" value={num(c.frequency, 12)} onChange={e => set('frequency', Number(e.target.value))}>{[[12, 'Monthly'], [4, 'Quarterly'], [2, 'Half-yearly'], [1, 'Annually']].map(([v, l]) => <option value={v} key={String(v)}>{String(l)}</option>)}</select></label>}<div className="rounded-xl bg-blue-50 p-4"><div className="text-xs text-blue-700">Live result</div><strong className="text-xl">{formatINR(result)}</strong>{type === 'emi' ? <div className="mt-2 text-xs">Total interest: {formatINR(emiSummary(num(c.principal, 0), num(c.annualRate, 0), num(c.months, 0)).totalInterest)}</div> : null}</div></div>; }
function NumberInput({ label, value, onChange, step = 1, min, max }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    step?: number;
    min?: number;
    max?: number;
}) { return <label>{label}<input className="input" type="number" step={step} min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}/><input className="mt-2 w-full" type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}/></label>; }

