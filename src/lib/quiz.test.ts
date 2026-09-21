import { describe, expect, it } from 'vitest';
import { scoreQuiz } from './quiz';
const opts = [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }, { text: 'C', isCorrect: true }];
describe('quiz scoring', () => {
    it('scores exact multi-correct answer', () => expect(scoreQuiz(opts, [0, 2], { points: 10, partialCredit: false, attemptLimit: 1 }).score).toBe(10));
    it('rejects partial without partial credit', () => expect(scoreQuiz(opts, [0], { points: 10, partialCredit: false, attemptLimit: 1 }).score).toBe(0));
    it('gives partial credit', () => expect(scoreQuiz(opts, [0], { points: 10, partialCredit: true, attemptLimit: 1 }).score).toBe(5));
    it('penalizes wrong choices', () => expect(scoreQuiz(opts, [0, 1], { points: 10, partialCredit: true, attemptLimit: 1 }).score).toBe(0));
    it('deduplicates selections', () => expect(scoreQuiz(opts, [0, 0, 2], { points: 10, partialCredit: false, attemptLimit: 1 }).score).toBe(10));
});

