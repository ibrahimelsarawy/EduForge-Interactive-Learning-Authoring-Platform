# EduForge Studio 3.0 — Product Showcase

EduForge is presented as a complete learning-authoring product, not only a lesson editor.

## Product surfaces

- **Studio Builder** — drag/drop authoring, rich content, calculators, assessments and interactive blocks.
- **AI Course Copilot** — deterministic demo generators for lessons, scenarios, flashcards and knowledge checks.
- **Learner Portal** — course map, progress, interactive learning moments and completion state.
- **Live Analytics** — completion, score, time-spent, trend and drop-off views.
- **Collaboration** — review comments, resolve workflow and reviewer handoff.
- **Version Control** — snapshots, release history and restore.
- **Publish Center** — preflight and showcase-link creation.
- **Showcase route** — `/showcase` presents the whole product experience as a portfolio demo.

## Shareable demo

From Publish Center, use **Copy showcase link**. The demo document is stored locally in the browser and the generated URL opens `/showcase?demo=1`. For a public internet URL, deploy the Next.js app to a hosting provider and share the deployed `/showcase` URL.

## Architecture

The new product surfaces are isolated in `src/components/product-suite.tsx` and the learner showcase has its own route at `src/app/showcase/page.tsx`. Existing builder, preview, store and domain logic remain reusable.
