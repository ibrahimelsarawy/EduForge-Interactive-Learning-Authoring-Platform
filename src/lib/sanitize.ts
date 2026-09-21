/** Lightweight allow-list for preview content. Editor HTML is not trusted at render boundaries. */
export function sanitizeRichHtml(input: string): string {
    if (typeof input !== 'string')
        return '';
    return input
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/javascript:/gi, '');
}

