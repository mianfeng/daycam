# Quality Guidelines

Daycam changes should keep the app usable as a local camera tool, not just pass
static inspection.

## Code Standards

- Keep code plain JavaScript and CSS; do not introduce build-only syntax.
- Preserve UTF-8 text handling. Use `tools/serve_utf8.py` for local serving.
- Keep MediaPipe imports and model paths local: `vendor/mediapipe/vision_bundle.mjs`,
  `vendor/mediapipe/wasm/`, and `models/pose_landmarker_lite.task`.
- Keep camera, canvas, and file-system errors visible to the user with
  actionable messages.
- Maintain responsive layout at mobile and desktop widths.

## Validation

- Run `conda run -n video python tools\serve_utf8.py 5173`.
- Open `http://localhost:5173` in Chrome or Edge.
- Confirm the page loads without missing local asset errors.
- For camera/storage changes, test folder selection, camera startup, capture
  preview, save, overwrite/archive behavior, and recent/reference photo loading.

## Forbidden Patterns

- Do not load MediaPipe from a remote CDN.
- Do not require `file://` usage.
- Do not commit `daycam-data/` or `tmp/`.
- Do not add a package manager lockfile or build pipeline for routine UI changes.
