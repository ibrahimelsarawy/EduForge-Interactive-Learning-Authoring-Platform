export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type BlockAnimation = 'none' | 'fade' | 'slideUp' | 'slideLeft' | 'scale' | 'float' | 'pulse';
export interface BlockDesign {
    textAlign: 'left' | 'center' | 'right' | 'justify';
    verticalAlign: 'top' | 'center' | 'bottom';
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: number;
    textColor: string;
    backgroundColor: string;
    backgroundGradient: string;
    padding: number;
    marginTop: number;
    marginBottom: number;
    maxWidth: number;
    opacity: number;
    borderRadius: number;
    shadow: 'none' | 'soft' | 'medium' | 'large';
    animation: BlockAnimation;
    animationDuration: number;
    animationDelay: number;
    animationRepeat: number;
    hoverScale: number;
    hoverLift: number;
}
export type BlockType = 'richText' | 'image' | 'video' | 'mcqQuiz' | 'trueFalseQuiz' | 'emiCalculator' | 'sipCalculator' | 'compoundInterest' | 'callout' | 'divider' | 'accordion' | 'progressTracker' | 'achievementBadge' | 'codeSnippet' | 'conceptExplainer' | 'scenarioSimulator' | 'flashcards' | 'knowledgeCheck';
export interface Block {
    id: string;
    type: BlockType;
    order: number;
    content: Record<string, unknown>;
    settings: {
        isVisible: boolean;
        isLocked: boolean;
        customCss: string;
        design?: BlockDesign;
    };
}
export interface ModuleDocument {
    schemaVersion: number;
    moduleId: string;
    title: string;
    description: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
    };
    metadata: {
        estimatedDuration: number;
        difficulty: Difficulty;
        tags: string[];
        thumbnail: string;
    };
    blocks: Block[];
    quizConfig: {
        feedbackMode: 'immediate' | 'deferred';
        passingScore: number;
        showScoreOnCompletion: boolean;
    };
}
export interface HistoryEntry {
    label: string;
    snapshot: ModuleDocument;
    timestamp: number;
}

