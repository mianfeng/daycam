# Backend Guidelines

Daycam currently has no backend. It is a local static browser app served by a
small Python static server for development.

## Rules

- Do not add a backend service for ordinary Daycam features.
- Local data lives in the user-selected `daycam-data/` folder through browser
  File System Access API, not in a database.
- The only server-side code today is `tools/serve_utf8.py`, which exists to
  serve static files over localhost with correct UTF-8 behavior.
- If a future task explicitly adds a backend, document that architecture here
  before implementation.
