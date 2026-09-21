import { createBlock } from './blocks';
import type { ModuleDocument } from './types';
export type TemplateId = 'budget-basics' | 'loan-planning' | 'investing-starter';
export const moduleTemplates: {
    id: TemplateId;
    name: string;
    description: string;
}[] = [
    { id: 'budget-basics', name: 'Budget Basics', description: 'Explain income, expenses and a simple savings plan.' },
    { id: 'loan-planning', name: 'Loan Planning', description: 'Teach EMI, repayment cost and responsible borrowing.' },
    { id: 'investing-starter', name: 'Investing Starter', description: 'Introduce SIP and compound-interest concepts.' },
];
export function createTemplate(id: TemplateId, base: ModuleDocument): ModuleDocument {
    const rich = (html: string) => { const b = createBlock('richText'); b.content = { html }; return b; };
    const common = { ...base, title: '', description: '', metadata: { ...base.metadata, tags: ['finance'] } };
    if (id === 'budget-basics')
        return { ...common, title: 'Budget Basics', description: 'Learn a practical framework for managing income, spending and savings.', blocks: [rich('<h2>Start with your money goals</h2><p>Understand where your money goes before making a plan.</p>'), createBlock('callout'), createBlock('progressTracker'), createBlock('mcqQuiz'), createBlock('achievementBadge')] };
    if (id === 'loan-planning')
        return { ...common, title: 'Loan Planning Essentials', description: 'Explore borrowing costs, EMI affordability and repayment trade-offs.', blocks: [rich('<h2>Borrow with a plan</h2><p>Compare repayments before committing to a loan.</p>'), createBlock('emiCalculator'), createBlock('callout'), createBlock('mcqQuiz'), createBlock('progressTracker')] };
    return { ...common, title: 'Investing Starter', description: 'Understand regular investing and how compounding can grow wealth over time.', blocks: [rich('<h2>Make compounding work for you</h2><p>Compare regular investing with long-term growth.</p>'), createBlock('sipCalculator'), createBlock('compoundInterest'), createBlock('conceptExplainer'), createBlock('mcqQuiz'), createBlock('achievementBadge')] };
}

