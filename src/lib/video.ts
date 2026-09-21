export type VideoProvider = 'youtube' | 'vimeo';
export interface ParsedVideo {
    provider: VideoProvider;
    id: string;
    embedUrl: string;
    thumbnailUrl: string;
}
export function parseVideoUrl(raw: string): ParsedVideo | null {
    try {
        const url = new URL(raw.trim());
        const host = url.hostname.replace(/^www\./, '').toLowerCase();
        if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be') {
            const id = host === 'youtu.be' ? url.pathname.split('/').filter(Boolean)[0] : url.searchParams.get('v') || url.pathname.split('/').filter(Boolean).at(-1);
            if (!id)
                return null;
            return { provider: 'youtube', id, embedUrl: `https://www.youtube.com/embed/${id}`, thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg` };
        }
        if (host === 'vimeo.com' || host === 'player.vimeo.com') {
            const id = url.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part));
            if (!id)
                return null;
            return { provider: 'vimeo', id, embedUrl: `https://player.vimeo.com/video/${id}`, thumbnailUrl: '' };
        }
        return null;
    }
    catch {
        return null;
    }
}

