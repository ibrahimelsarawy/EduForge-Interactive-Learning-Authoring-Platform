# EduForge 4.0 Architecture

EduForge is split by responsibility so the editor, learner experience, document model, and product-suite features can evolve independently.

## UI boundaries

- `src/app/` — routes only; page files compose feature components.
- `src/components/editor/` — authoring shell and sortable editor UI.
- `src/components/block-editors/` — one editor module per content family.
- `src/components/preview/` — learner-facing block rendering.
- `src/components/workspace/` — overview, insights, publish workflow.
- `src/components/suite/` — AI copilot, analytics, collaboration, versions.
- `src/components/course-player.tsx` — published learner experience.
- `src/components/block-design-panel.tsx` — reusable visual design controls.

## Domain boundaries

- `src/lib/types.ts` — canonical TypeScript domain model.
- `src/lib/schema.ts` — runtime validation and import safety.
- `src/lib/blocks.ts` — block registry and factories.
- `src/lib/design.ts` — default and merged block design.
- `src/lib/document-io.ts` — portable import/export and ID regeneration.
- `src/lib/finance.ts` — calculator domain logic.
- `src/store/module-store.ts` — editor state, history, undo/redo, persistence operations.

## Product flow

`Workspace → Builder → Design → Preview → Publish → Published Course → Learner Completion`

The published course can be shared through `/courses/[slug]?data=...` for a self-contained demo payload, while local storage remains available as a fallback during development.

## Clean-code rules

1. Keep route files thin.
2. Keep block-specific editing logic inside `block-editors`.
3. Keep learner rendering separate from editing controls.
4. Keep calculations and validation out of React components.
5. Keep the TypeScript `BlockType` union synchronized with the Zod block registry.
6. Do not commit `node_modules`, `.next`, generated build metadata, or secrets.
