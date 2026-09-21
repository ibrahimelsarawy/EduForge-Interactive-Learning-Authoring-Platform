export const num = (v: unknown, fallback: number) => typeof v === 'number' && Number.isFinite(v) ? v : fallback;
export const str = (v: unknown, fallback = '') => typeof v === 'string' ? v : fallback;

