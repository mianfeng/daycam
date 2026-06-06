# Daycam

![Static Web](https://img.shields.io/badge/static-web-2aa7a1)
![Local First](https://img.shields.io/badge/local--first-storage-db543d)
![Chrome Edge](https://img.shields.io/badge/browser-Chrome%20%2F%20Edge-e3ae48)
![No Backend](https://img.shields.io/badge/backend-none-24211a)

Daycam is a local-first daily photo ritual tool for taking the same kind of picture every day.

It gives you a repeatable capture frame, timestamp watermark, review-before-save flow, recent-photo reference overlay, and pose alignment guide. The core promise is simple: open the camera, align yourself, take one daily photo, and keep the archive portable.

Daycam is currently a plain static web app. There is no backend, no database server, no account system, and no build step.

## Why Daycam

Most camera apps are optimized for one-off photos. Daycam is optimized for continuity.

- Standardized framing with `4:5`, `3:4`, `1:1`, and `9:16` capture presets.
- Timestamp watermark burned into the final JPEG, with configurable style, size, color, and position.
- Review-before-save workflow so a bad take never silently becomes today's record.
- Automatic archive handling when the same day is captured more than once.
- Recent-photo reference overlay for visual consistency across days.
- Local MediaPipe pose landmarks for alignment, without loading model assets from a CDN.
- Portable `daycam-data/` folder that can be copied, backed up, or synced independently.

## Current Status

Daycam is in active MVP development.

The desktop/local browser workflow is functional. The next product direction is Android mobile usage through an HTTPS/PWA deployment, so daily capture can continue even when the desktop computer is off.

Planned mobile deployment target:

```text
https://daycam.enjyit.com
```

The hosted site will contain only the Daycam app code and model assets. User photos stay in the selected local `daycam-data/` folder and can be synced to Google Drive manually or through external tooling.

## Quick Start

Run Daycam from a localhost server. Do not open `index.html` directly with `file://`.

```bat
conda run -n video python tools\serve_utf8.py 5173
```

Open Chrome or Edge:

```text
http://localhost:5173
```

Why localhost matters:

- Camera access requires a secure browser context.
- Directory read/write uses the File System Access API.
- Local model and WASM assets must be served with normal browser loading rules.
- The bundled UTF-8 server avoids garbled Chinese UI text on some systems.

## Data Model

On first use, choose or create a folder named `daycam-data`.

Daycam stores metadata, photos, and same-day overwrite archives inside that folder:

```text
daycam-data/
  metadata.json
  photos/
    2026/
      2026-04-27.jpg
  archive/
    2026/
      2026-04-27_10-30-21.jpg
```

`daycam-data/` is ignored by git and should never be committed.

## Capture Flow

1. Choose the `daycam-data` folder.
2. Start the camera.
3. Select aspect ratio, guide mode, camera, and watermark settings.
4. Align against the frame guide, pose landmarks, or recent-photo overlay.
5. Capture after the countdown.
6. Review the generated photo.
7. Save or retake.

If today's photo already exists, Daycam archives the old file before writing the new one.

## Browser Support

Recommended:

- Chrome on Windows/macOS/Linux
- Edge on Windows/macOS/Linux
- Android Chrome/Edge for the planned mobile MVP

Not primary targets:

- Firefox
- Safari
- iOS Chrome

The main blocker is complete user-selected directory read/write support through the File System Access API.

## Local Assets

Pose alignment uses local MediaPipe assets:

```text
vendor/mediapipe/
models/pose_landmarker_lite.task
```

Refresh them only when needed:

```bat
conda run -n video python tools\download_pose_assets.py
```

Keep these assets local. Daycam should not depend on CDN-hosted runtime model files.

## Deploying To Cloudflare Pages

The intended mobile distribution path is:

```text
GitHub repository -> Cloudflare Pages -> daycam.enjyit.com
```

Suggested Cloudflare Pages settings:

```text
Framework preset: None
Build command: None
Output directory: /
Custom domain: daycam.enjyit.com
```

Do not deploy `daycam-data/` or `tmp/`. They are local runtime folders and are already ignored by git.

## Privacy

Daycam is local-first by design.

- Daycam does not upload photos by itself.
- Daycam does not include analytics.
- Daycam does not require an account.
- The planned public HTTPS/PWA deployment serves the app, not user data.
- Google Drive is currently an external backup/sync location, not an integrated Daycam backend.

## Project Structure

```text
index.html                       Static entrypoint and DOM
src/app.js                       Camera, capture, watermark, storage, pose logic
src/styles.css                   Layout, responsive UI, visual design
tools/serve_utf8.py              Local UTF-8 static server
tools/download_pose_assets.py    MediaPipe/model asset refresh helper
vendor/mediapipe/                Local MediaPipe runtime bundle
models/pose_landmarker_lite.task Local pose model
daycam-data/                     User photos and metadata, ignored by git
tmp/                             Scratch output, ignored by git
```

## Roadmap

- Publish the app from GitHub through Cloudflare Pages.
- Attach `daycam.enjyit.com`.
- Add PWA metadata for Android install-to-home-screen.
- Improve Android touch layout and camera defaults.
- Add clearer mobile storage and browser support messaging.
- Keep Google Drive API integration out of the MVP until the local mobile workflow is stable.

## Troubleshooting

If buttons do nothing, make sure the page is opened from `localhost` or HTTPS, not `file://`.

If the camera will not start, close other apps that may be using the camera and try a lower preview resolution.

If folder selection is unavailable, use Chrome or Edge. Safari and Firefox do not currently provide the same complete directory read/write workflow.

If pose alignment fails to load, confirm that `vendor/mediapipe/` and `models/pose_landmarker_lite.task` exist locally.
