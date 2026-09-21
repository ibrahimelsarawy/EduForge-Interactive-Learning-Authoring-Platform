import type { Block, ModuleDocument } from './types';
export type ExamQuestion = {
    id: string;
    type: 'MCQ' | 'True / False';
    question: string;
    options: {
        text: string;
        isCorrect: boolean;
        explanation?: string;
    }[];
    points: number;
    explanation?: string;
};
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c] as string));
export function getExamQuestions(doc: ModuleDocument): ExamQuestion[] {
    return doc.blocks
        .filter((b: Block) => b.settings?.isVisible !== false && (b.type === 'mcqQuiz' || b.type === 'trueFalseQuiz'))
        .map((b: Block) => {
        const c = b.content as Record<string, unknown>;
        const raw = Array.isArray(c.options) ? c.options as Record<string, unknown>[] : [];
        let options = raw.map(o => ({ text: String(o.text ?? ''), isCorrect: Boolean(o.isCorrect), explanation: o.explanation ? String(o.explanation) : undefined }));
        if (b.type === 'trueFalseQuiz' && options.length === 0) {
            const correct = String(c.correctAnswer ?? c.answer ?? 'true').toLowerCase() === 'true';
            options = [{ text: 'True', isCorrect: correct, explanation: undefined }, { text: 'False', isCorrect: !correct, explanation: undefined }];
        }
        return { id: b.id, type: b.type === 'mcqQuiz' ? 'MCQ' : 'True / False', question: String(c.question ?? c.title ?? 'Untitled question'), options, points: Number(c.points ?? 1) || 1, explanation: c.explanation ? String(c.explanation) : undefined };
    });
}
export function examPayload(doc: ModuleDocument) {
    const questions = getExamQuestions(doc);
    return { schemaVersion: 1, exportType: 'EduForge Exam', examTitle: doc.title || 'Untitled Assessment', moduleId: doc.moduleId, exportedAt: new Date().toISOString(), passingScore: doc.quizConfig?.passingScore ?? 0, feedbackMode: doc.quizConfig?.feedbackMode ?? 'immediate', questions };
}
export function downloadText(filename: string, text: string, mime: string) {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
}
export function exportExamJson(doc: ModuleDocument) { downloadText('eduforge-exam.json', JSON.stringify(examPayload(doc), null, 2), 'application/json'); }
export function exportExamWord(doc: ModuleDocument) {
    const q = getExamQuestions(doc);
    const body = q.map((x, i) => `<h2>${i + 1}. ${escapeHtml(x.question)}</h2><ol type="A">${x.options.map(o => `<li>${escapeHtml(o.text)}</li>`).join('')}</ol><p>Answer: ______________________________</p>`).join('<hr/>');
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(doc.title)} - Exam</title><style>body{font-family:Arial,sans-serif;line-height:1.55;padding:32px}h1{margin-bottom:4px}h2{font-size:15pt;margin-top:24px}li{margin:8px 0}</style></head><body><h1>${escapeHtml(doc.title || 'Module Assessment')}</h1><p>Name: ____________________ &nbsp;&nbsp; Date: ____________</p>${body}</body></html>`;
    downloadText('eduforge-exam.doc', html, 'application/msword');
}
export function exportExamExcel(doc: ModuleDocument) {
    const rows = getExamQuestions(doc).map((q, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(q.type)}</td><td>${escapeHtml(q.question)}</td><td>${escapeHtml(q.options.map(o => o.text).join(' | '))}</td><td>${q.points}</td><td></td></tr>`).join('');
    const html = `<html><head><meta charset="utf-8"></head><body><table border="1"><thead><tr><th>#</th><th>Type</th><th>Question</th><th>Options</th><th>Points</th><th>Student Answer</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    downloadText('eduforge-exam.xls', html, 'application/vnd.ms-excel');
}
export function printExamPdf(doc: ModuleDocument, includeAnswers = false) {
    const q = getExamQuestions(doc);
    const questions = q.map((x, i) => `<section class="q"><h2>${i + 1}. ${escapeHtml(x.question)} <small>(${x.points} pt)</small></h2><ol type="A">${x.options.map(o => `<li>${escapeHtml(o.text)}${includeAnswers && o.isCorrect ? ' <strong class="answer">✓ Correct</strong>' : ''}</li>`).join('')}</ol>${includeAnswers && x.explanation ? `<p class="explanation"><strong>Explanation:</strong> ${escapeHtml(x.explanation)}</p>` : '<div class="space"></div>'}</section>`).join('');
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w)
        return;
    w.document.write(`<!doctype html><html><head><title>${escapeHtml(doc.title || 'Assessment')}</title><style>@page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#111;line-height:1.55}h1{font-size:24px;margin:0 0 8px}.meta{margin-bottom:24px;color:#555}.q{break-inside:avoid;border-bottom:1px solid #ddd;padding:14px 0}.q h2{font-size:16px}.answer{color:#15803d}.explanation{background:#f3f4f6;padding:10px;border-radius:8px}.space{height:38px;border-bottom:1px dotted #bbb}@media print{button{display:none}}</style></head><body><h1>${escapeHtml(doc.title || 'Module Assessment')}</h1><div class="meta">${includeAnswers ? 'Answer Key' : 'Student Version'} · Name: ____________________ · Date: ____________</div>${questions}<script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
}

