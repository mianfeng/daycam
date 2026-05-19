# Coding Style

Daycam uses plain JavaScript and CSS.

## JavaScript

- Keep constants near the top of `src/app.js`.
- Use descriptive names for DOM elements, settings groups, and async operations.
- Prefer small helpers when manipulating metadata, canvas output, or filesystem
  handles.
- Preserve existing async/await style for camera, model, and file operations.
- Show user-actionable errors for permission, camera, model, or storage failures.

## CSS

- Keep app styling in `src/styles.css`.
- Reuse existing CSS custom properties and layout patterns.
- Maintain responsive behavior for narrow and desktop viewports.
- Do not introduce a design system dependency for small UI changes.
