# Final Submission Checklist

## Required implementation coverage
- [x] 15 distinct block types
- [x] TipTap rich-text editing
- [x] EMI, SIP and compound-interest calculators
- [x] Interactive MCQ and True/False quizzes
- [x] Animated concept explainer, progress tracker and achievement badge
- [x] dnd-kit drag-and-drop and keyboard sorting
- [x] 50-step bounded undo/redo history
- [x] Live desktop, tablet and mobile preview
- [x] Preview-only dark mode with isolated theme styles
- [x] JSON import/export with schema validation
- [x] Exam mode and PDF/Word/Excel/JSON exam export
- [x] Confirmation modal and toast feedback for destructive actions
- [x] Local draft recovery and readiness checks
- [x] Unit/integration tests and Playwright journeys included
- [x] GitHub Actions verification workflow included

## Before repository transfer
Run locally and keep the terminal output/screenshots as evidence:

```bash
npm install
npm run type-check
npm test
npm run build
npm run test:e2e
```

Then run Lighthouse against the production build and record measured values. The repository must not claim 90% coverage or Lighthouse scores unless those commands actually produce the evidence.

## Important project constraints
Keep the repository private, disable forking/public discussions, restrict collaborators, enable branch protection and follow the required repository-transfer process.
