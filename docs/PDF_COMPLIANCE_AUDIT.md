# PDF Compliance Audit

This release is an implementation pass against the supplied EduForge project specification. The audit tracks features that are implemented in code and deliberately distinguishes them from metrics that still require execution in a local/CI environment.

## Implemented in this release
- All 15 registry block types.
- TipTap rich text controls: bold, italic, underline, strikethrough, H1-H4, ordered/unordered lists, blockquote, code block, hyperlink.
- Image URL/upload validation, accepted formats, 5MB limit, alt text, caption, alignment and lazy loading.
- YouTube/Vimeo URL parsing, editor thumbnail state, 16:9 preview and play overlay.
- MCQ and true/false quiz configuration with single/multiple answer support, per-option and overall explanations, points, timer and one-submission behaviour.
- EMI, SIP and compound calculators with Indian number formatting, interactive preview inputs, charts, tables and CSV export.
- Accordion, progress tracker, badge, code snippet and concept explainer configuration/preview behaviour.
- Block toolbar actions, destructive-action confirmation, custom CSS advanced settings and keyboard shortcuts.
- 50-entry bounded history, branch pruning, 500ms batched content edits and clickable history entries.
- Responsive preview device toggles and independent, preview-scoped dark mode with explicit CSS isolation.
- JSON schema validation, import UUID regeneration and export validation.
- ARIA roles for editor blocks, block toolbars, slash listbox, device radiogroup, quizzes and progress.
- Per-block error boundaries.

## Requires execution verification
The PDF's coverage thresholds, Lighthouse scores and runtime budgets must be measured by CI or a local environment. This repository does not claim those metrics until `pnpm install`, type-check, tests, Playwright and Lighthouse runs have completed successfully.

## Follow-up hardening pass
- Dirty state and unsaved-change browser warning implemented.
- Import/export logic extracted into testable document I/O utilities.
- Newer unsupported schema versions fail with a clear error; legacy/invalid versions are normalized with a migration warning where safe.
- Import emits an explicit UUID-regeneration warning and reindexes block order.
- dnd-kit keyboard sorting uses `sortableKeyboardCoordinates`.
- Block group labels now announce `position N of Total`.
- Accordion supports ArrowUp, ArrowDown, Home and End navigation.
- Failed images render an accessible replacement placeholder.
- True/False quiz preview now honors timer and attempt-limit semantics.
- E2E suite now contains eight named end-to-end journeys.
- Verification metrics still require an executed CI run; this document intentionally does not claim unmeasured coverage, Lighthouse, bundle-size or runtime numbers.

### Product hardening enhancements (beyond baseline PDF requirements)
- Local draft autosave and recovery for accidental browser closure or interrupted sessions.
- Editorial readiness score to help non-technical creators identify common content and accessibility gaps before publishing.
- Reusable financial-learning templates to reduce authoring time for common module patterns.

## Final submission hardening
- Restored preview-only dark mode using scoped selectors so editor styling is never mutated by the preview theme.
- Back-to-Lesson, assessment, cards, inputs, tables and contrast-sensitive surfaces receive explicit dark-theme styling rather than relying on global theme inheritance.
- Added a GitHub Actions CI workflow for type-checking, tests and production build.
- Added a final verification checklist to prevent claiming unmeasured coverage or Lighthouse scores.
