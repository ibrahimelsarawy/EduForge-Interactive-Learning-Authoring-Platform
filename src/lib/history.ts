export interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}
export const HISTORY_LIMIT = 50;
export function commitHistory<T>(state: HistoryState<T>, next: T): HistoryState<T> { return { past: [...state.past, state.present].slice(-HISTORY_LIMIT), present: next, future: [] }; }
export function undoHistory<T>(state: HistoryState<T>): HistoryState<T> { const previous = state.past.at(-1); if (previous === undefined)
    return state; return { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future].slice(0, HISTORY_LIMIT) }; }
export function redoHistory<T>(state: HistoryState<T>): HistoryState<T> { const next = state.future[0]; if (next === undefined)
    return state; return { past: [...state.past, state.present].slice(-HISTORY_LIMIT), present: next, future: state.future.slice(1) }; }
export function restoreHistory<T>(state: HistoryState<T>, index: number): HistoryState<T> { if (index < 0 || index >= state.past.length)
    return state; const next = state.past[index]; return { past: state.past.slice(0, index), present: next, future: [state.present, ...state.past.slice(index + 1).reverse(), ...state.future].slice(0, HISTORY_LIMIT) }; }

