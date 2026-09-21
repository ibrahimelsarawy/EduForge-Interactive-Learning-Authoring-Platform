export interface QuizOption {
    text: string;
    isCorrect: boolean;
    explanation?: string;
}
export interface QuizConfig {
    points: number;
    partialCredit: boolean;
    attemptLimit: number | 'unlimited';
}
export interface QuizResult {
    isCorrect: boolean;
    score: number;
    selected: number[];
    correct: number[];
}
export function scoreQuiz(options: QuizOption[], selected: number[], config: QuizConfig): QuizResult {
    const correct = options.map((o, i) => o.isCorrect ? i : -1).filter((i) => i >= 0);
    const unique = [...new Set(selected)].filter((i) => Number.isInteger(i) && i >= 0 && i < options.length).sort((a, b) => a - b);
    const exact = unique.length === correct.length && unique.every((v, i) => v === correct[i]);
    if (exact)
        return { isCorrect: true, score: config.points, selected: unique, correct };
    if (!config.partialCredit || correct.length === 0)
        return { isCorrect: false, score: 0, selected: unique, correct };
    const hits = unique.filter((i) => correct.includes(i)).length;
    const wrong = unique.filter((i) => !correct.includes(i)).length;
    const score = Math.max(0, Math.round(config.points * (hits / correct.length) - config.points * (wrong / correct.length)));
    return { isCorrect: false, score, selected: unique, correct };
}

