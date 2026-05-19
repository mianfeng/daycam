# Directory Structure Guidelines

Daycam is intentionally small and flat. Prefer extending the existing files over
introducing new layers.

## Current Structure

```text
index.html                       # Static entrypoint and DOM structure
src/app.js                       # Camera, capture, watermark, storage, and pose logic
src/styles.css                   # All application styling
tools/serve_utf8.py              # Local UTF-8 static server
tools/download_pose_assets.py    # Asset refresh helper for local MediaPipe files
vendor/mediapipe/                # Local MediaPipe JS/WASM bundle
models/pose_landmarker_lite.task # Local pose model
daycam-data/                     # User-selected runtime data, ignored by git
tmp/                             # Scratch/generated files, ignored by git
```

## Placement Rules

- Put browser behavior in `src/app.js`; do not create framework-style component
  directories for small changes.
- Put global styles in `src/styles.css`; keep selectors aligned with the
  classes already present in `index.html`.
- Put operational scripts under `tools/`.
- Keep downloaded runtime dependencies under `vendor/` or `models`, not CDN
  URLs.
- Never commit personal photos or scratch output from `daycam-data/` or `tmp/`.
