# Runtime and Browser

Daycam must run from a secure browser context: localhost for development or
HTTPS for hosted/mobile use.

## Local Server

Use:

```bat
conda run -n video python tools\serve_utf8.py 5173
```

Then open `http://localhost:5173`.

Do not validate behavior by double-clicking `index.html`; `file://` can block
camera access, directory access, or script/module loading.

Production mobile use opens the hosted HTTPS origin, currently
`https://daycam.enjyit.com`.

## Browser Support

- Target Chrome and Edge.
- Firefox and Safari are not primary targets because Daycam depends on complete
  File System Access API directory read/write behavior.
- Android Chrome/Edge use Google Drive mode instead of desktop local-folder
  mode.

## Assets

- Keep MediaPipe local. Do not replace local assets with CDN URLs.
- If assets need to be refreshed, use `tools/download_pose_assets.py` and review
  resulting files before committing.

## Scenario: Mobile Google Drive Storage

### 1. Scope / Trigger

- Trigger: mobile support adds OAuth, Google Picker, Drive REST API writes,
  IndexedDB retry storage, and a service worker shell.
- This is runtime integration, not just UI. Future changes must preserve the
  archive contract shared by desktop local-folder mode and mobile Drive mode.

### 2. Signatures

- Config global:
  ```js
  window.DAYCAM_GOOGLE_CONFIG = {
    apiKey: "browser API key",
    clientId: "web OAuth client id",
    appId: "Google Cloud project number"
  };
  ```
- Storage mode contract:
  ```js
  state.storageMode // "none" | "local" | "drive"
  ```
- Pending upload store:
  ```js
  indexedDB.open("daycam-pending-uploads", 1)
  objectStore("uploads", { keyPath: "id" })
  ```

### 3. Contracts

- Hosted origin: `https://daycam.enjyit.com` must be an OAuth Authorized
  JavaScript origin.
- OAuth scope for the personal/internal MVP:
  `https://www.googleapis.com/auth/drive`.
- Drive archive shape must match desktop:
  ```text
  daycam-data/
    metadata.json
    photos/YYYY/YYYY-MM-DD.jpg
    archive/YYYY/YYYY-MM-DD_HH-MM-SS.jpg
  ```
- `metadata.json` remains one photo record per `date`; mobile writes must
  read latest, upsert by date, and write back.
- Drive mode must not replace desktop local-folder mode.

### 4. Validation & Error Matrix

- Missing `apiKey` or `clientId` -> show actionable config error before OAuth.
- Picker canceled -> leave storage mode unchanged and report cancellation.
- Selected folder lacks `metadata.json`, `photos`, and `archive` -> warn before
  continuing.
- Upload fails -> persist the capture in IndexedDB with blob, intended paths,
  retry count, and last error.
- `metadata.json` modifiedTime changes between read and write -> stop with a
  visible conflict error instead of overwriting.
- `file://` origin -> show secure-context error; do not claim camera/storage is
  ready.

### 5. Good/Base/Bad Cases

- Good: desktop user selects a Google Drive for desktop-mounted `daycam-data`
  folder; local mode writes exactly as before.
- Base: mobile user opens the HTTPS origin, signs in, selects existing
  `daycam-data`, captures, uploads to Drive, and updates metadata.
- Bad: mobile user has no network during upload; the photo must remain in
  IndexedDB pending uploads and be visible as unsynced.

### 6. Tests Required

- Static syntax: `node --check src/app.js`, `node --check sw.js`, and
  `node --check src/google-config.js`.
- HTML/data sanity: verify no duplicate DOM ids and manifest JSON parses.
- Browser smoke: open desktop and mobile viewports from localhost/HTTPS and
  assert no page errors, storage controls render, and service worker registers.
- Manual OAuth/Drive validation after real config is filled: sign in, pick the
  existing folder, save a photo, verify Drive paths and `metadata.json`.
- Regression: local folder mode still saves and archives same-day replacement.

### 7. Wrong vs Correct

#### Wrong

```js
// Replaces desktop storage with Drive API for every browser.
state.storageMode = "drive";
```

#### Correct

```js
// Keep desktop local-folder mode and Drive mode as explicit user choices.
async function chooseDataFolder() {
  state.storageMode = "local";
}

async function connectGoogleDrive() {
  state.storageMode = "drive";
}
```
