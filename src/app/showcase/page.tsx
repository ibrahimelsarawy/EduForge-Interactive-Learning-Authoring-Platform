'use client';
import { useEffect, useState } from 'react';
import { ShowcaseHub } from '@/components/product-suite';
import { useModuleStore } from '@/store/module-store';
import type { ModuleDocument } from '@/lib/types';
export default function ShowcasePage() {
    const load = useModuleStore(s => s.loadDocument);
    const [ready, setReady] = useState(false);
    useEffect(() => { try {
        const raw = localStorage.getItem('eduforge-showcase-document');
        if (raw)
            load(JSON.parse(raw) as ModuleDocument);
    }
    catch { }
    finally {
        setReady(true);
    } }, [load]);
    if (!ready)
        return <div className="grid min-h-screen place-items-center bg-slate-950 text-white"><div className="animate-pulse font-black">Loading EduForge experience…</div></div>;
    return <ShowcaseHub onBack={() => window.location.href = '/'}/>;
}

