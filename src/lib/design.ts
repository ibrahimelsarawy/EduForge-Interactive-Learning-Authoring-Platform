import type { BlockDesign } from './types';
export const defaultBlockDesign: BlockDesign = {
    textAlign: 'left', verticalAlign: 'top', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontSize: 16, fontWeight: 500,
    lineHeight: 1.55, letterSpacing: 0, textColor: '#0f172a', backgroundColor: 'transparent', backgroundGradient: '',
    padding: 0, marginTop: 0, marginBottom: 0, maxWidth: 100, opacity: 100, borderRadius: 16, shadow: 'none',
    animation: 'none', animationDuration: 0.45, animationDelay: 0, animationRepeat: 0, hoverScale: 1, hoverLift: 0,
};
export const mergeBlockDesign = (value: unknown): BlockDesign => ({
    ...defaultBlockDesign,
    ...(value && typeof value === 'object' ? value as Partial<BlockDesign> : {}),
});

