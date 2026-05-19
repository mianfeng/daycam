# Component Guidelines

Daycam does not use React, Vue, Svelte, or custom web components. Treat
`index.html` as the component tree and `src/app.js` as the controller.

## DOM Conventions

- Reuse existing semantic regions and class names in `index.html` before adding
  new wrappers.
- Keep interactive elements reachable as named entries in the `elements` object
  in `src/app.js`.
- Prefer explicit button text and form labels in the HTML; avoid generating core
  controls entirely from JavaScript.
- When adding a new control, wire it in three places: HTML markup, CSS styling,
  and `src/app.js` event handling.

## UI Behavior

- Preserve the camera-first workflow: select data folder, start camera, preview,
  capture, confirm, then save.
- Preserve stable capture presets defined by `CAPTURE_PRESETS`.
- Keep watermark preview behavior synchronized with saved output behavior.
- Do not add marketing or landing sections; the first screen is the tool itself.
