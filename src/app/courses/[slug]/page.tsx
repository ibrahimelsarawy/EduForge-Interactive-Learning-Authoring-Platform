'use client';
import { useEffect, useState } from 'react';
import { CoursePlayer } from '@/components/course-player';
import type { ModuleDocument } from '@/lib/types';
export default function PublishedCoursePage() {
    const [doc, setDoc] = useState<ModuleDocument | undefined>();
    const [ready, setReady] = useState(false);
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const encoded = params.get('data');
            if (encoded) {
                const json = decodeURIComponent(escape(atob(encoded)));
                setDoc(JSON.parse(json) as ModuleDocument);
            }
            else {
                const raw = localStorage.getItem('eduforge-published-course') || localStorage.getItem('eduforge-showcase-document');
                if (raw)
                    setDoc(JSON.parse(raw) as ModuleDocument);
            }
        }
        catch { }
        setReady(true);
    }, []);
    if (!ready)
        return <div className="grid min-h-screen place-items-center bg-[#f5f7fb]"><div className="animate-pulse text-sm font-black text-slate-500">Loading published course…</div></div>;
    return <CoursePlayer initialDocument={doc}/>;
}

