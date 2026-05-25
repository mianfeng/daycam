# State Management Guidelines

Daycam uses plain JavaScript objects and browser-held state. There is no state
library and no backend server state.

## Current State Shapes

- `DEFAULT_SETTINGS` defines persisted user preferences for capture, watermark,
  overlay, and reference photo selection.
- `CAPTURE_PRESETS`, `WATERMARK_SIZES`, and camera constraint presets are static
  configuration constants.
- `daycam-data/metadata.json` stores portable runtime metadata alongside saved
  photos.
- In-memory state in `src/app.js` tracks active streams, selected directory
  handles, current preview, reference photo, and pose detection state.

## Rules

- Add defaults to `DEFAULT_SETTINGS` when a user setting must persist.
- Preserve backward compatibility when reading `metadata.json`; older data
  folders may not have new fields.
- Do not store personal photo data in git-tracked files.
- Keep UI state and saved metadata separate: UI-only toggles should not be
  persisted unless the behavior is useful across sessions.

## Setting Side Effects

Persisted settings must not restart camera capture by default. Compare the
previous normalized settings with the next normalized settings, then trigger
runtime side effects only for the fields that require them.

Good:

```js
const previousSettings = getSettings();
const nextSettings = normalizeSettings(readSettingsFromUi());
const shouldRestartCamera = hasCameraInputChanged(previousSettings, nextSettings);

state.metadata.settings = nextSettings;
await writeMetadata();

if (shouldRestartCamera && state.stream && !state.cameraStarting) {
  startCamera();
}
```

Bad:

```js
state.metadata.settings = readSettingsFromUi();
await writeMetadata();
startCamera();
```

Only camera input changes, such as selected device or preview resolution, should
restart the active stream. Visual settings such as watermark style, guide mode,
overlay opacity, or output aspect ratio should update UI and metadata without
interrupting the camera.
