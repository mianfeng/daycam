# Backend Quality Guidelines

No backend exists today. For `tools/serve_utf8.py`, keep behavior minimal:
serve the project directory over localhost with UTF-8 headers and avoid adding
application logic.

Any future backend proposal must first update the Trellis spec with the new
runtime, storage, and validation approach.
