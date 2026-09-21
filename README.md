# EduForge Interactive Financial Education Module Builder

A production-oriented internal visual editor for assembling interactive financial education modules without engineering involvement.

## Technology
- Next.js 14.2 + React 18 + TypeScript strict mode
- TipTap rich text editor
- Zustand
- Tailwind CSS
- Framer Motion
- dnd-kit
- Zod
- Vitest + Playwright

## Required capabilities implemented in the project structure
- 15 specified block types
- Block registry and default factories
- Rich text WYSIWYG controls
- EMI, SIP, and compound-interest calculations with Indian formatting
- Quiz scoring logic
- Drag-and-drop ordering
- Keyboard movement actions
- 50-entry undo/redo history boundary
- Desktop, tablet, and mobile preview modes
- Preview dark mode
- JSON validation, export, and import with fresh IDs
- Accessibility-oriented labels, focus handling, and keyboard actions
- Content creator guide and architecture documentation

## Local development
```bash
pnpm install
pnpm dev
```

## Quality checks
```bash
pnpm type-check
pnpm test
pnpm test:e2e
pnpm build
```

## Review note
The supplied brief mandates Vite 5+, but this repository uses Next.js at the project owner's explicit request. See `ARCHITECTURE.md` for the recorded architecture exception.

## Confidentiality
Keep this repository private and follow the submission protocol from the supplied project document.

## PDF compliance release
See `docs/PDF_COMPLIANCE_AUDIT.md` for the requirement-by-requirement implementation pass and the distinction between implemented features and metrics that still require execution verification.

## Published learner experience

EduForge is not only an authoring tool. Publishing a module stores the release locally and opens a learner-facing course player at:

`/courses/<moduleId>`

The learner route includes course navigation, progress, interactive scenarios, flashcards, knowledge checks, quizzes, animated transitions, and a completion state. Use **Publish & preview** in the Publish Center to see the final experience, then use **Copy course link** to share the route after deploying the app.


## Production baseline

- Next.js 15.5.24 (patched Maintenance LTS line)
- React 18.3.1
- TypeScript strict type checking
- Zod-backed document validation
- No build artifacts or dependency folders committed
