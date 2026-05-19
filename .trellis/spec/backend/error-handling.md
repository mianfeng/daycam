# Error Handling Guidelines

There is no backend error boundary. User-facing failures happen in the browser.

For Daycam work, handle errors close to the browser API call that can fail:
camera permissions, directory selection, file reads/writes, canvas export, and
pose model loading. Show actionable messages in the UI instead of failing
silently.
