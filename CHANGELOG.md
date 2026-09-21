# Changelog

## 1.1.0 - PDF Compliance Pass
- Expanded the editor to address the detailed block, calculator, accessibility, history and preview requirements from the supplied specification.
- Added video parsing, CSV export, lightweight preview sanitisation and per-block error boundaries.
- Expanded block forms and preview interactivity for all fifteen block types.
- Added PDF compliance audit documentation and clarified that coverage/performance claims require executed verification.

## Compliance hardening follow-up
- Added a dirty-state indicator and browser-level unsaved-change warning.
- Export now marks the current document clean only after serialization succeeds.
- Added portable document I/O utilities with schema compatibility checks, UUID regeneration warnings and pretty JSON serialization.
- Added keyboard-aware dnd-kit sorting coordinates.
- Updated block ARIA labels to include total position context.
- Added accessible accordion arrow/Home/End keyboard navigation.
- Added a visible broken-image placeholder instead of silently hiding failed images.
- Extended true/false preview with timer and retry/attempt-limit behavior.
- Expanded Playwright coverage from one smoke test to eight user journeys.
- Added import/export and validation edge-case unit tests.

## Enhancement Pass
- Added local browser draft recovery with debounced autosave.
- Added explicit Save Draft control for recovery workflows.
- Added module readiness scoring covering structure, metadata, accessibility, assessment, interactivity and completion cues.
- Added three financial education starter templates: Budget Basics, Loan Planning, and Investing Starter.
- Added quality-report unit tests and template-driven module generation.

## Exam export
- Added an in-app Export Exam menu with PDF (student/answer-key), Word, Excel, and JSON exports.
- Student PDF hides correct answers; answer-key PDF can include answers and explanations.
