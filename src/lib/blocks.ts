import { v4 as uuid } from 'uuid';
import type { Block, BlockType } from './types';
export interface BlockDefinition {
    type: BlockType;
    name: string;
    description: string;
    keywords: string[];
    create: () => Block;
}
const base = (type: BlockType, content: Record<string, unknown>): Block => ({
    id: uuid(), type, order: 0, content,
    settings: { isVisible: true, isLocked: false, customCss: '' },
});
export const blockRegistry: BlockDefinition[] = [
    { type: 'richText', name: 'Rich Text', description: 'Headings, lists, links and rich content', keywords: ['text', 'writing', 'article'], create: () => base('richText', { html: '<h2>New lesson</h2><p>Start writing...</p>' }) },
    { type: 'image', name: 'Image', description: 'Accessible image with caption and alt text', keywords: ['photo', 'media'], create: () => base('image', { src: '', alt: 'Describe this image', caption: '', alignment: 'center' }) },
    { type: 'video', name: 'Video Embed', description: 'YouTube or Vimeo learning video', keywords: ['youtube', 'vimeo', 'media'], create: () => base('video', { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Video lesson' }) },
    { type: 'mcqQuiz', name: 'Quiz (MCQ)', description: 'Multiple-choice question with scoring', keywords: ['quiz', 'question', 'test'], create: () => base('mcqQuiz', { question: 'What is a financial goal?', options: [{ text: 'A target for your money', isCorrect: true, explanation: '' }, { text: 'A type of loan', isCorrect: false, explanation: '' }], points: 10, allowMultiple: false, overallExplanation: 'Review the explanation and continue.', timeLimitSeconds: 0, attemptLimit: 1 }) },
    { type: 'trueFalseQuiz', name: 'Quiz (True/False)', description: 'Binary question and explanation', keywords: ['quiz', 'true', 'false'], create: () => base('trueFalseQuiz', { question: 'Compound interest earns interest on interest.', correct: true, explanation: 'Correct.', points: 10, timeLimitSeconds: 0, attemptLimit: 1 }) },
    { type: 'emiCalculator', name: 'EMI Calculator', description: 'Loan repayment calculator', keywords: ['calc', 'loan', 'emi'], create: () => base('emiCalculator', { principal: 500000, annualRate: 8.5, months: 240, tenureUnit: 'months' }) },
    { type: 'sipCalculator', name: 'SIP Calculator', description: 'Investment growth calculator', keywords: ['calc', 'investment', 'sip'], create: () => base('sipCalculator', { monthly: 5000, annualRate: 12, years: 10 }) },
    { type: 'compoundInterest', name: 'Compound Interest', description: 'Compounding growth calculator', keywords: ['calc', 'compound', 'interest'], create: () => base('compoundInterest', { principal: 100000, annualRate: 8, years: 10, frequency: 12 }) },
    { type: 'callout', name: 'Callout', description: 'Important information or tip', keywords: ['tip', 'warning', 'highlight'], create: () => base('callout', { variant: 'info', title: 'Key takeaway', html: '<p>Add an important financial insight.</p>' }) },
    { type: 'divider', name: 'Divider', description: 'Visual section separator', keywords: ['line', 'separator'], create: () => base('divider', { style: 'solid', spacing: 'normal' }) },
    { type: 'accordion', name: 'Accordion / FAQ', description: 'Expandable accessible sections', keywords: ['faq', 'accordion', 'questions'], create: () => base('accordion', { items: [{ title: 'What is budgeting?', body: 'Planning how to use your income.' }] }) },
    { type: 'progressTracker', name: 'Progress Tracker', description: 'Linear or branching learning progress', keywords: ['progress', 'steps'], create: () => base('progressTracker', { mode: 'linear', total: 5, current: 2, labels: ['Learn', 'Plan', 'Practice', 'Review', 'Complete'], branches: [] }) },
    { type: 'achievementBadge', name: 'Achievement Badge', description: 'Locked or unlocked learning badge', keywords: ['badge', 'achievement', 'reward'], create: () => base('achievementBadge', { icon: '🏆', title: 'Savings Starter', description: 'Created your first savings plan.', unlockCondition: 'Complete the first savings activity.', unlocked: true }) },
    { type: 'codeSnippet', name: 'Code Snippet', description: 'Syntax-style learning example', keywords: ['code', 'javascript', 'python', 'json', 'sql'], create: () => base('codeSnippet', { language: 'json', code: '{ "budget": 5000 }', lineNumbers: true }) },
    { type: 'conceptExplainer', name: 'Animated Concept Explainer', description: '3–10 step animated concept walkthrough', keywords: ['animation', 'steps', 'concept'], create: () => base('conceptExplainer', { title: 'How compound interest works', autoPlay: false, steps: [{ title: 'Invest', description: 'Start with a principal amount.' }, { title: 'Earn', description: 'Interest grows your balance.' }, { title: 'Reinvest', description: 'Future interest uses the larger balance.' }] }) },
    { type: 'scenarioSimulator', name: 'Scenario Simulator', description: 'Branching decision activity with consequences', keywords: ['scenario', 'simulation', 'decision', 'branching'], create: () => base('scenarioSimulator', { title: 'Choose your next move', context: 'You have an unexpected expense this month. What do you do?', options: [{ label: 'Use emergency savings', feedback: 'You protect your credit and avoid new debt.', score: 10 }, { label: 'Use a credit card', feedback: 'Flexible, but adds interest and repayment pressure.', score: 4 }, { label: 'Ignore the expense', feedback: 'Delaying essential expenses can create larger costs.', score: 0 }] }) },
    { type: 'flashcards', name: 'Flashcards', description: 'Flip-based recall practice for key concepts', keywords: ['cards', 'memory', 'recall', 'study'], create: () => base('flashcards', { title: 'Key terms', cards: [{ front: 'APR', back: 'Annual Percentage Rate.' }, { front: 'Emergency fund', back: 'Cash reserved for unexpected needs.' }, { front: 'Compound interest', back: 'Interest earned on principal plus accumulated interest.' }] }) },
    { type: 'knowledgeCheck', name: 'Knowledge Check', description: 'Lightweight confidence check without exam scoring', keywords: ['check', 'confidence', 'poll', 'reflection'], create: () => base('knowledgeCheck', { question: 'How confident are you applying this concept?', options: ['Not yet', 'Getting there', 'Confident', 'I can teach it'], correctIndex: 2, explanation: 'Use this check to identify where another example may help.' }) },
];
export const definitionFor = (type: BlockType) => blockRegistry.find((b) => b.type === type);
export const createBlock = (type: BlockType): Block => definitionFor(type)?.create() ?? blockRegistry[0].create();

