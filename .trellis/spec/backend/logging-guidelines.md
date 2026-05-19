# Logging Guidelines

Daycam has no structured backend logging.

Use browser console logging sparingly for diagnostics during development. Do not
leave noisy logs in normal capture, save, or pose detection loops. Prefer clear
UI status/error messages for user-actionable failures.
