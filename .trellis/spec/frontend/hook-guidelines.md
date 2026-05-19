# Hook Guidelines

There are no framework hooks in Daycam. "Hook" means browser event listeners,
permission flows, and lifecycle functions in plain JavaScript.

## Event Rules

- Register listeners once during startup; avoid attaching duplicate listeners
  inside repeated actions such as capture or preview.
- Keep long-running camera, model, and file operations asynchronous.
- Check browser API availability before calling camera, canvas, or File System
  Access APIs.
- When adding events, name handlers for the user action they represent, not the
  element implementation detail.

## Browser Lifecycle

- Test permission-sensitive flows on `http://localhost:5173`, not `file://`.
- Chrome and Edge are the target browsers because Daycam relies on File System
  Access API directory read/write support.
- If media streams are stopped or replaced, release tracks to avoid leaving the
  camera active unexpectedly.
