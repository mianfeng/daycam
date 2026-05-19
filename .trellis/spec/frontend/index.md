# Daycam Frontend Guidelines

Daycam is a no-build static browser app. The runtime entrypoint is `index.html`,
with behavior in `src/app.js` and styling in `src/styles.css`.

## Guides

| Guide | Purpose | Status |
|-------|---------|--------|
| [Directory Structure](./directory-structure.md) | Where app, assets, models, and scripts live | Filled |
| [Component Guidelines](./component-guidelines.md) | DOM and UI patterns for this vanilla JS app | Filled |
| [Hook Guidelines](./hook-guidelines.md) | No framework hooks; event/listener conventions | Filled |
| [State Management](./state-management.md) | Settings, metadata, and in-memory runtime state | Filled |
| [Quality Guidelines](./quality-guidelines.md) | Browser validation and implementation rules | Filled |
| [Type Safety](./type-safety.md) | Plain JavaScript conventions and data-shape discipline | Filled |

## Runtime Rules

- Do not add a bundler, package manager, framework, or build step unless the
  task explicitly asks for that migration.
- Do not open `index.html` directly with `file://`; camera and directory
  permissions must be tested through localhost.
- Use `conda run -n video python tools\serve_utf8.py 5173`, then open
  `http://localhost:5173` in Chrome or Edge.
- Keep MediaPipe assets local: `vendor/mediapipe/` and
  `models/pose_landmarker_lite.task`.
