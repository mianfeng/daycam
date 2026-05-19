# Architecture

Daycam is a personal daily photo capture tool implemented as a static browser
application.

## Current Shape

- `index.html` provides the DOM and static entrypoint.
- `src/app.js` owns camera access, capture presets, watermark rendering,
  File System Access API storage, reference photo loading, and MediaPipe pose
  alignment.
- `src/styles.css` owns visual layout and responsive behavior.
- `tools/serve_utf8.py` is the local development server.
- `vendor/mediapipe/` and `models/pose_landmarker_lite.task` are local runtime
  dependencies.

## Boundaries

- No backend exists.
- No build step exists.
- Runtime user data belongs in `daycam-data/`, not in source-controlled files.
- Temporary generated assets belong in `tmp/`, not in source-controlled files.
