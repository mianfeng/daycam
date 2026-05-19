# Testing

Daycam validation is browser-centered because the important behavior depends on
camera permissions, canvas export, local model loading, and directory access.

## Standard Check

```bat
conda run -n video python tools\serve_utf8.py 5173
```

Open:

```text
http://localhost:5173
```

Use Chrome or Edge.

## What To Verify

- Page loads through localhost, not `file://`.
- No key local asset is missing: `vendor/mediapipe/`, `vendor/mediapipe/wasm/`,
  and `models/pose_landmarker_lite.task`.
- Data folder selection works through File System Access API.
- Camera starts and can be stopped or replaced cleanly.
- Capture creates a preview before saving.
- Saving writes to `photos/` and repeat captures archive the previous photo.
- Reference photo and recent photo loading still work after storage changes.

For documentation-only Trellis changes, run file and git checks; browser testing
is still useful but not required if app files are untouched.
