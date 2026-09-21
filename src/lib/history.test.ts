import { describe, expect, it } from 'vitest';
import { commitHistory, HISTORY_LIMIT, redoHistory, undoHistory, type HistoryState } from './history';
const base: HistoryState<number> = { past: [], present: 0, future: [] };
describe('history', () => {
    it('undoes', () => expect(undoHistory(commitHistory(base, 1)).present).toBe(0));
    it('redoes', () => expect(redoHistory(undoHistory(commitHistory(base, 1))).present).toBe(1));
    it('prunes branch', () => { let s = commitHistory(commitHistory(base, 1), 2); s = undoHistory(s); s = commitHistory(s, 3); expect(s.future).toHaveLength(0); });
    it('caps circular buffer at 50', () => { let s = base; for (let i = 1; i <= 51; i++)
        s = commitHistory(s, i); expect(s.past).toHaveLength(HISTORY_LIMIT); expect(s.past[0]).toBe(1); });
    it('does nothing when no undo', () => expect(undoHistory(base)).toEqual(base));
});

