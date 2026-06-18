# brainstorm: mobile support

## Goal

Extend Daycam so it can be used from mobile devices for the daily photo capture workflow, while preserving the existing archive shape as much as practical and writing new mobile captures directly to Google Drive.

The underlying user need is continuity after graduation: the desktop computer may no longer be powered on every day, but the daily photo habit still needs to continue from a mobile device. Travel and outdoor use are key scenarios, so capture should work when the user is away from the desktop environment and may have weak network connectivity or limited time to manage files.

## What I Already Know

- The user wants to expand Daycam so mobile devices can use it.
- The motivating scenario is that after graduation the desktop computer may be off, so the app cannot depend on a desktop-local `localhost` server for daily use.
- Travel/outdoor use is a primary scenario for mobile support.
- Daycam is currently a static browser app with no build step and no backend.
- The app runs from `localhost` and targets Chrome or Edge.
- Core runtime files are `index.html`, `src/app.js`, and `src/styles.css`.
- Current capture flow depends on `getUserMedia()`, canvas export, local MediaPipe assets, and File System Access API directory handles.
- Current data model stores `metadata.json`, `photos/`, and `archive/` inside a user-selected `daycam-data` folder.
- The user's current photo data is in Google Drive.
- The existing desktop workflow uses a Google Drive for desktop-mounted `daycam-data` folder at `G:\我的云端硬盘\daycam-data`, containing `.tmp.driveupload/`, `archive/`, `photos/`, and `metadata.json`.
- In the current desktop workflow, Daycam writes through the browser File System Access API into that local mounted folder; Google Drive for desktop performs the cloud sync. Daycam does not currently call the Google Drive API directly.
- The user has `0000999.xyz`, currently used for two existing web pages including one subdomain.
- The user has `enjyit.com`, currently mainly used for email, with DNS apparently managed on Cloudflare.
- The selected Daycam domain is `daycam.enjyit.com`.
- The selected access model is public access; no Cloudflare Access gate for the MVP.
- The local repository currently has no configured Git remote.
- The selected deployment path is GitHub repository -> Cloudflare Pages -> `daycam.enjyit.com`.
- GitHub CLI (`gh`) is not installed locally, so repository creation should happen through GitHub web UI or another available GitHub connector.
- The GitHub repository is `https://github.com/mianfeng/daycam.git`.
- The local `master` branch has been pushed to `origin/master`.
- The existing CSS has responsive breakpoints, but mobile support needs browser capability and storage decisions, not only layout changes.
- `index.html` currently contains a duplicated `cameraResolutionSelect` control, which should be cleaned up during related UI work.
- The selected storage direction is direct Google Drive archive integration on mobile, not local-phone-folder-first. It should target the same logical `daycam-data` archive that desktop already syncs through Google Drive for desktop.

## Assumptions (Temporary)

- "Mobile support" means real use on a phone browser, not only making a narrow desktop window look acceptable.
- The mobile workflow should be able to run without the desktop computer being powered on.
- Travel use should prioritize quick capture, direct Google Drive archival, and a clear failure/retry path when network is weak.
- The first mobile MVP should keep Daycam as a browser app unless the user explicitly wants native packaging.
- Preserving the existing Google Drive-backed photo archive may be important.

## Open Questions

- None for product scope. Requirements are ready for final user confirmation before implementation.

## Requirements (Evolving)

- Mobile users can open Daycam on a supported mobile browser and complete the daily capture flow.
- Mobile users can complete daily capture without depending on a desktop-local server being online.
- Mobile users can capture during travel or outdoor use without assuming stable network connectivity at capture time.
- The first mobile target is Android Chrome/Edge.
- The app should be made available from an HTTPS static page / installable PWA path so it does not rely on a desktop-local server.
- The user has a domain and wants to attach Daycam to that domain.
- A subdomain on Cloudflare is the likely hosting shape; this should avoid changing existing email DNS records.
- The selected subdomain is `daycam.enjyit.com`.
- `daycam.enjyit.com` will be publicly accessible for the MVP. The hosted app contains code/assets only, not user photos.
- Cloudflare Pages should deploy from a GitHub repository, not direct/manual uploads.
- GitHub remote is configured as `origin` at `https://github.com/mianfeng/daycam.git`.
- Existing data currently lives in a Google Drive-backed `daycam-data` folder, so the mobile plan must define how new phone captures write into that same archive shape.
- The mobile MVP should sign in with Google and upload new captures directly to the existing Google Drive-backed `daycam-data` archive.
- Direct Google Drive upload requires a clear policy for auth, target folder selection, metadata updates, upload retry, and conflict handling.
- On first mobile setup, the user should select the existing `daycam-data` folder through Google Picker; Daycam should store the selected Drive folder id for subsequent sessions.
- The app should validate that the selected folder looks like a Daycam archive, including expected entries such as `photos/`, `archive/`, or `metadata.json`, and warn if not.
- Mobile metadata writes should use a read-latest-then-merge-then-write-back flow for `metadata.json`.
- The user expects personal single-user usage and does not expect desktop and mobile to write simultaneously.
- Even though simultaneous writes are not expected, the mobile write path should use lightweight conflict protection such as checking the Drive file version or modified time before overwriting `metadata.json`.
- Google OAuth should be configured as a personal/internal testing app for the user's own Google account rather than a public app for arbitrary users.
- The mobile MVP should request the broad Google Drive scope `https://www.googleapis.com/auth/drive` so it can read and write the existing `daycam-data` archive.
- The broad Drive scope is acceptable only because the MVP is a personal/internal testing app for the user's own account.
- The first implementation slice should be the full mobile capture-to-Drive loop, not only a Drive connectivity proof or UI-only pass.
- The MVP flow is: sign in with Google, choose existing `daycam-data`, capture photo, upload to `photos/`, merge/update `metadata.json`, and queue failed uploads locally for automatic retry.
- If Google Drive upload fails because of weak/no network, the mobile MVP should keep the capture in a local pending-upload queue and retry automatically later.
- The UI must clearly show when a capture is saved locally but not yet uploaded to Google Drive.
- The pending-upload queue should use IndexedDB to persist photo blobs, capture metadata, retry status, and last error across page reloads or mobile browser restarts.
- The mobile MVP should include a basic PWA shell so a previously opened Daycam page can reopen, preserve the IndexedDB queue, and retry uploads when online again.
- Full offline-first app behavior is out of scope: first load still requires network, and complete offline operation for every MediaPipe/model asset is not required for MVP.
- The UI should keep the existing desktop storage path ("choose local `daycam-data` folder") and add a separate mobile storage path ("connect Google Drive").
- Desktop Chrome/Edge users should be able to continue using the Google Drive for desktop-mounted folder without switching to the Drive API.
- Mobile users should use Google Drive API integration because mobile browsers do not have the desktop-mounted `G:` Drive folder.
- Mobile same-day replacement should preserve the existing desktop behavior: archive the previous `photos/YYYY/YYYY-MM-DD.jpg` to `archive/YYYY/YYYY-MM-DD_HH-MM-SS.jpg`, then write the new daily photo.
- The production mobile URL should be the HTTPS hosted Daycam URL, confirmed as `https://daycam.enjyit.com`.
- `https://daycam.enjyit.com` must be configured in Google OAuth authorized JavaScript origins for the Drive integration.
- Google Drive app installation on mobile is useful as an auxiliary verification/recovery tool, but it does not replace browser-side Drive API integration because mobile browsers do not get a Google Drive for desktop-style mounted folder.
- Google API configuration should use a `src/google-config.js` template that the user fills with the real OAuth client id and API key for deployment.
- The OAuth client id and browser API key are not backend secrets, but they must be restricted in Google Cloud to the Daycam origin and needed APIs.
- Desktop `localhost` development URLs are not reusable as mobile production URLs because `localhost` on a phone refers to the phone itself, not the desktop computer.
- The UI must be touch-friendly and readable on phone-sized screens.
- The app must clearly explain unsupported mobile browser/storage combinations.

## Acceptance Criteria (Evolving)

- [ ] On the selected mobile target, the camera can start and preview correctly.
- [ ] The primary capture, review, retake, and save actions remain usable with touch.
- [ ] New mobile captures are uploaded to the selected Google Drive archive target.
- [ ] First mobile setup lets the user choose the existing `daycam-data` folder through Google Picker.
- [ ] The selected Drive folder id is remembered for later mobile sessions.
- [ ] When upload fails, the capture remains in a visible pending-upload queue and can be retried automatically.
- [ ] Pending uploads persist in IndexedDB across page reloads and browser restarts until uploaded or explicitly removed.
- [ ] After the app has been opened once, the basic PWA shell can reopen the Daycam page and keep pending-upload queue access available.
- [ ] The app retries pending uploads when browser/network conditions allow.
- [ ] Desktop folder mode still works through the existing File System Access API path.
- [ ] Mobile Drive mode is visually distinct from desktop folder mode so the user can tell where photos are being saved.
- [ ] Mobile same-day retake archives the previous daily photo before replacing it, matching the existing desktop behavior.
- [ ] The app documents that mobile production use should open the HTTPS hosted URL, while `localhost` remains a desktop development URL.
- [ ] Mobile save updates `metadata.json` by reading the current Drive copy, merging the new capture, and writing it back.
- [ ] The app warns or stops rather than silently overwriting `metadata.json` if it detects that the Drive copy changed during the save.
- [ ] Google OAuth setup works for the user's own account in testing mode without requiring public app verification for MVP.
- [ ] The OAuth request uses `https://www.googleapis.com/auth/drive` and the app explains that this is a personal/internal MVP permission choice.
- [ ] A phone user can complete the full flow from Google sign-in through successful Drive archive update.
- [ ] Google API config is loaded from `src/google-config.js`, with documentation for filling client id / API key and restricting them to `https://daycam.enjyit.com`.
- [ ] Storage behavior is explicit and does not silently lose photos.

## MVP Implementation Slice

- Selected slice: complete mobile photo-to-Google-Drive loop.
- Include Google sign-in, Google Picker folder selection, archive validation, photo upload, `metadata.json` merge/write-back, visible sync status, local pending-upload queue, and automatic retry.
- Include a basic PWA manifest/service-worker shell for reopenability and retry continuity.
- Preserve existing desktop local-folder mode and add mobile Drive mode instead of replacing desktop storage with Drive API.
- Match desktop same-day retake behavior by archiving the previous daily photo before replacing it.
- Exclude UI-only mobile polish that does not support the capture-to-Drive loop unless it is necessary for the flow to be usable.
- Exclude complete offline-first behavior, first-load-without-network, and exhaustive MediaPipe/model asset offline caching.

## Final Requirements Summary

### Goal

Enable Daycam mobile use from `https://daycam.enjyit.com` for travel/outdoor daily capture, writing new mobile captures into the existing Google Drive-backed `daycam-data` archive while preserving the current desktop workflow.

### In Scope

- Keep desktop local-folder mode unchanged for Chrome/Edge users who select the Google Drive for desktop-mounted `daycam-data` folder.
- Add a distinct mobile Google Drive mode for Android Chrome/Edge.
- Use Google sign-in in personal/internal testing mode with the user's account as an allowed tester.
- Request `https://www.googleapis.com/auth/drive` for MVP because the app must write an existing archive.
- Use Google Picker to select the existing `daycam-data` folder and remember its folder id.
- Validate that the selected folder looks like a Daycam archive.
- Capture a photo on mobile, upload it to `photos/YYYY/YYYY-MM-DD.jpg`, archive same-day replacements under `archive/YYYY/`, and update `metadata.json`.
- On upload failure, persist the photo and intended metadata change in IndexedDB, show pending/synced status, and retry later.
- Add a basic PWA shell so an already-opened Daycam can reopen and preserve pending uploads.
- Provide a `src/google-config.js` template for OAuth client id and browser API key.

### Out of Scope

- Native Android/iOS packaging.
- Public multi-user Google OAuth app verification.
- Replacing the desktop local-folder workflow with Drive API.
- Full offline-first support, first-load-without-network, and exhaustive MediaPipe/model asset offline caching.
- General cloud sync beyond the selected Google Drive archive integration.

## Technical Approach

- Introduce a storage-mode abstraction around the existing archive operations so desktop local-folder mode and mobile Drive mode share the same archive semantics.
- Keep the existing metadata schema and photo path conventions.
- Add a Drive client module for OAuth, Picker, folder validation, file lookup/create/update, same-day archive copy/move, and metadata conflict checks.
- Add an IndexedDB queue module for failed mobile saves.
- Add UI state for storage mode, Google Drive connection, sync status, and pending uploads.
- Add basic PWA manifest/service worker files for reopenability and retry continuity.

## Decision (ADR-lite)

**Context**: Mobile travel use cannot rely on the desktop `localhost` server or Google Drive for desktop's mounted `G:` folder.

**Decision**: Keep Daycam as a static web app. Desktop keeps local-folder storage. Mobile adds a Google Drive API storage mode that writes to the existing `daycam-data` archive selected through Google Picker.

**Consequences**: The MVP gains OAuth, Drive API, IndexedDB, and PWA complexity, but preserves the existing archive format and desktop workflow. Permission scope is intentionally broad for the personal/internal MVP and must not be presented as a public multi-user product permission model.

## Implementation Plan

- PR1: Storage boundary and config
  - Introduce `src/google-config.js` template.
  - Extract archive path/metadata helpers so local and Drive modes can reuse them.
  - Keep existing desktop behavior passing.
- PR2: Google Drive connection
  - Load Google Identity/Picker libraries.
  - Sign in, request Drive scope, select `daycam-data`, validate archive shape, and remember folder id.
- PR3: Drive save path
  - Upload captured photo to `photos/YYYY/YYYY-MM-DD.jpg`.
  - Archive same-day replacement.
  - Read/merge/write `metadata.json` with version/modified-time conflict guard.
- PR4: Pending queue and retry
  - Store failed saves in IndexedDB with blob, intended paths, metadata record, retry count, and last error.
  - Show pending/synced UI and retry when online or when the user opens the app.
- PR5: PWA and mobile polish
  - Add manifest/service worker for reopenability.
  - Make mobile storage controls touch-friendly and clearly separate desktop folder mode from Drive mode.
  - Update README with setup, supported browsers, OAuth config, and known limitations.
- [ ] Existing desktop Chrome/Edge behavior still works.
- [ ] README documents supported mobile browsers and known limitations.

## Definition of Done (Team Quality Bar)

- Tests or browser validation added/updated where appropriate.
- Lint/type checks or equivalent file checks pass for this no-build project.
- Browser smoke test through `tools/serve_utf8.py` is completed where feasible.
- Docs updated if support matrix or runtime behavior changes.
- Rollback path is documented because direct Google Drive integration increases runtime and configuration complexity.

## Out of Scope (Explicit)

- Native mobile app packaging is out of scope unless selected as the target approach.
- General-purpose cloud sync and server-side photo storage are out of scope, but Google sign-in and direct Google Drive upload are in scope for the mobile MVP.
- Replacing local MediaPipe assets with CDN-hosted assets is out of scope.

## Technical Notes

- Relevant specs read:
  - `.trellis/spec/project/architecture.md`
  - `.trellis/spec/project/runtime-browser.md`
  - `.trellis/spec/frontend/directory-structure.md`
  - `.trellis/spec/project/testing.md`
- Code inspection notes:
  - `src/app.js` currently writes today's photo to `photos/YYYY/YYYY-MM-DD.jpg`.
  - Replacing an existing same-day photo archives the previous file to `archive/YYYY/YYYY-MM-DD_HH-MM-SS.jpg`.
  - `metadata.json` stores `version`, `createdAt`, `updatedAt`, `settings`, and `photos[]`.
  - Photo records are upserted by `date`, then sorted by date.
  - Mobile Drive writes should preserve these paths and record shapes for desktop compatibility.
- Research reference:
  - `research/mobile-browser-capabilities.md`
  - `research/google-drive-picker-oauth.md`

## Hosting Options

### Hosting A: Cloudflare Pages + Custom Domain (Recommended)

- Serve Daycam from a custom domain or subdomain with HTTPS.
- Keep photos and `daycam-data` out of the hosted site.
- Good fit if the domain DNS is already on Cloudflare or can be moved there.
- Recommended shape: use a subdomain such as `daycam.enjyit.com` or `daycam.0000999.xyz`, not an apex/root domain.
- If using `enjyit.com`, add only the Daycam subdomain record and avoid touching existing email MX/TXT records.
- Status: selected domain is `daycam.enjyit.com`.
- Status: public access selected for MVP; no access gate.
- Official docs: https://developers.cloudflare.com/pages/configuration/custom-domains/

### Hosting B: GitHub Pages + Custom Domain

- Serve Daycam from GitHub Pages with a custom domain and HTTPS.
- Simpler if the repository is already on GitHub and public hosting is acceptable.
- Official docs: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

### Hosting C: Private Static Host / NAS With HTTPS

- Serve Daycam from private infrastructure using the user's domain.
- Keeps hosting private but creates more operations work around TLS, availability, and deployment.

## Storage Options

### Storage A: Local Phone Folder First

- Android chooses/writes a local `daycam-data` folder.
- User manually uploads, syncs, or copies that folder to Google Drive later.
- Keeps MVP small and avoids OAuth/API complexity.
- Risk: backup depends on user habit or external sync tooling.
- Status: rejected for MVP; user prefers direct Google Drive upload.

### Storage B: Direct Google Drive Upload (Selected)

- Daycam signs in with Google and uploads photos/metadata to a selected Drive folder.
- The selected folder is chosen through Google Picker during setup, not auto-created or guessed by name.
- Better matches the user's existing cloud archive.
- Requires Google Cloud OAuth client, Drive scopes, upload code, folder mapping, local pending queue, retries, and conflict policy.
- Risk: materially larger scope than mobile UI support.
- Status: selected for MVP.

### Upload Failure Policy

- Selected behavior: if direct Google Drive upload fails, store the capture in a local pending-upload queue and retry automatically later.
- A queued capture counts as protected from immediate loss, but not fully archived until Drive upload succeeds.
- The app must expose pending/synced status so the user can see whether travel captures reached Google Drive.
- Queue storage: IndexedDB stores the photo blob, capture record, intended Drive paths, retry status, retry count, and last error.
- Rejected alternatives: in-memory queue is too fragile for travel use; manual download fallback is not an automatic retry flow.

### Metadata Write Policy

- Selected behavior: mobile saves read the latest `metadata.json` from Drive, merge the new capture record, then write the file back.
- Assumption: Daycam is a personal single-user tool, and desktop/mobile concurrent writes are not expected.
- Guardrail: use a Drive version/modified-time check so an unexpected concurrent edit causes a visible conflict instead of silent overwrite.

### Same-Day Retake Policy

- Selected behavior: mobile mode follows desktop behavior for same-day replacement.
- If `photos/YYYY/YYYY-MM-DD.jpg` already exists, move or copy the old file to `archive/YYYY/YYYY-MM-DD_HH-MM-SS.jpg` before writing the new daily photo.
- `metadata.json` remains one photo record per date, updated by date upsert.

### URL Policy

- Production mobile use should open the HTTPS hosted Daycam URL, confirmed as `https://daycam.enjyit.com`.
- `https://daycam.enjyit.com` must be configured in Google OAuth authorized JavaScript origins for the Drive integration.
- Desktop `localhost` remains a development URL and should not be treated as a mobile production URL.
- For temporary LAN testing, a phone may access a desktop dev server by LAN IP only if browser security, camera permissions, and OAuth authorized origins allow it; this is not the target production path.

### Google Drive Mobile App Role

- The Google Drive mobile app can help verify that uploads reached the expected `daycam-data` archive and can serve as a manual recovery tool.
- It is not the primary write path for Daycam mobile because the browser app cannot rely on a Google Drive for desktop-style mounted folder on phones.

### Google API Configuration Policy

- Selected behavior: provide a `src/google-config.js` template for the user to fill with the OAuth client id and browser API key.
- The values are not treated as backend secrets in this static app, but Google Cloud restrictions must limit them to the Daycam origin and required APIs.
- Avoid hardcoding Google API configuration directly into `src/app.js`.

### OAuth Audience Policy

- Selected behavior: configure Google OAuth for personal/internal testing with the user's own Google account as an allowed tester.
- Public Google OAuth app verification is out of scope for MVP.
- This keeps the mobile Drive integration focused on personal use rather than making Daycam a public multi-user Google Drive client.

### OAuth Scope Options

#### Scope A: Broad Drive Scope (Recommended MVP)

- Request `https://www.googleapis.com/auth/drive`.
- Simpler for writing into an existing `daycam-data` archive because Daycam can read/update `metadata.json` and create files under existing Drive folders.
- Trade-off: broad permission to the user's Drive, acceptable only because MVP is a personal/internal testing app.
- Status: selected for MVP.

#### Scope B: Narrow Drive File Scope

- Request `https://www.googleapis.com/auth/drive.file`.
- Better least-privilege posture, but may not be enough for an existing archive unless the setup flow grants access to every relevant existing file/folder Daycam must touch.
- Trade-off: more complex setup and higher risk of confusing access failures.
- Status: rejected for MVP.

### Storage C: Hybrid Local + Drive Export Button

- Keep local folder as the reliable capture target.
- Add an explicit export/upload action to move new files to Google Drive.
- Middle ground, but still needs Drive integration if automated inside Daycam.
- Status: out of scope for MVP.

## Feasible Approaches

### Approach A: Android Chrome/Edge Mobile Web (Recommended)

- Keep Daycam as a static browser app.
- Preserve the `daycam-data` directory workflow where the mobile browser supports it.
- Improve phone layout, touch controls, camera defaults, and mobile support messaging.
- Add an HTTPS static/PWA distribution path so Android can launch Daycam without the desktop being online.
- Trade-off: iPhone remains unsupported or limited for full local-folder workflow.
- Status: selected for MVP.

### Approach B: Broad Mobile Web With Alternate Export

- Keep static browser app.
- Add a fallback path for browsers without directory handles, such as manual photo download/export or in-browser temporary storage plus export.
- Trade-off: more code and product complexity; data portability becomes more manual.

### Approach C: Native Wrapper Later

- Treat mobile as a future native wrapper project around the current web core.
- Use platform storage/camera APIs through the wrapper.
- Trade-off: significantly larger scope and likely introduces build tooling, packaging, and platform-specific maintenance.
