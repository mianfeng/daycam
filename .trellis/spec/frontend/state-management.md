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
