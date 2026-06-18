# Daycam

![Static Web](https://img.shields.io/badge/static-web-2aa7a1)
![Local First](https://img.shields.io/badge/local--first-storage-db543d)
![Chrome Edge](https://img.shields.io/badge/browser-Chrome%20%2F%20Edge-e3ae48)
![No Backend](https://img.shields.io/badge/backend-none-24211a)

Daycam is a personal daily photo ritual tool for taking the same kind of picture every day.

It gives you a repeatable capture frame, timestamp watermark, review-before-save flow, recent-photo reference overlay, and pose alignment guide. The core promise is simple: open the camera, align yourself, take one daily photo, and keep the archive portable.

Daycam is currently a plain static web app. There is no backend, no database server, and no build step.

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

The hosted site contains only the Daycam app code and model assets. On desktop, user photos stay in the selected local `daycam-data/` folder. On mobile, Daycam can sign in to Google Drive and write to the existing Google Drive-backed `daycam-data/` archive.

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

## Storage Modes

Daycam has two storage modes:

- **Local folder mode**: desktop Chrome/Edge users choose a writable `daycam-data/` folder through the File System Access API. This keeps the existing Google Drive for desktop workflow working when `daycam-data/` is inside the mounted Google Drive folder.
- **Google Drive mode**: mobile users open `https://daycam.enjyit.com`, sign in with Google, choose the existing `daycam-data` folder through Google Picker, and save through the Google Drive API.

Google Drive mode preserves the same archive shape:

```text
daycam-data/
  metadata.json
  photos/YYYY/YYYY-MM-DD.jpg
  archive/YYYY/YYYY-MM-DD_HH-MM-SS.jpg
```

If mobile upload fails, Daycam stores the captured JPEG and intended metadata update in IndexedDB and shows it as pending until retry succeeds.

## Browser Support

Recommended:

- Chrome on Windows/macOS/Linux
- Edge on Windows/macOS/Linux
- Android Chrome/Edge for the mobile Google Drive workflow

Not primary targets:

- Firefox
- Safari
- iOS Chrome

The main blocker for desktop-style local folder mode is complete user-selected directory read/write support through the File System Access API. Mobile uses Google Drive mode instead.

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

## Google Drive Setup

Mobile Google Drive mode requires a Google Cloud project configured for personal/internal testing.

1. Enable the Google Drive API and Google Picker API.
2. Create an OAuth client for a web application.
3. Add `https://daycam.enjyit.com` to Authorized JavaScript origins.
4. Add your own Google account as an OAuth test user.
5. Create or restrict a browser API key for the Picker API.
6. Fill `src/google-config.js`:

```js
window.DAYCAM_GOOGLE_CONFIG = {
  apiKey: "YOUR_BROWSER_API_KEY",
  clientId: "YOUR_WEB_OAUTH_CLIENT_ID",
  appId: "YOUR_GOOGLE_CLOUD_PROJECT_NUMBER"
};
```

The OAuth client id and browser API key are not backend secrets in this static app, but they should be restricted in Google Cloud to the Daycam origin and required APIs. The MVP requests `https://www.googleapis.com/auth/drive` because it writes to an existing Drive archive.

## Privacy

Daycam keeps user data outside the hosted site.

- Desktop local folder mode does not upload photos by itself.
- Mobile Google Drive mode uploads photos only after the user signs in and selects a Drive folder.
- Daycam does not include analytics.
- Daycam does not have its own account system.
- The planned public HTTPS/PWA deployment serves the app, not user data.
- Google Drive is used as a personal archive target for the mobile workflow.

## Project Structure

```text
index.html                       Static entrypoint and DOM
assets/                          Favicon and web app icon assets
src/app.js                       Camera, capture, watermark, storage, pose logic
src/google-config.js             Google API configuration template
src/styles.css                   Layout, responsive UI, visual design
sw.js                            Basic PWA shell cache
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
- Harden Google Drive setup and retry behavior after real mobile testing.
- Improve Android touch layout and camera defaults based on phone screenshots.
- Consider narrower Google Drive scopes if the app ever moves beyond personal/internal use.

## Troubleshooting

If buttons do nothing, make sure the page is opened from `localhost` or HTTPS, not `file://`.

If the camera will not start, close other apps that may be using the camera and try a lower preview resolution.

If folder selection is unavailable, use Chrome or Edge. Safari and Firefox do not currently provide the same complete directory read/write workflow.

If pose alignment fails to load, confirm that `vendor/mediapipe/` and `models/pose_landmarker_lite.task` exist locally.
