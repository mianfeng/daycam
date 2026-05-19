# Git Workflow

Daycam is now a git repository.

## Commit Boundaries

- Keep Trellis workflow/config changes separate from app feature changes.
- Do not mix generated scratch assets or user photos into commits.
- Review `git status --short --ignored` when working near storage or temp paths.

## Ignored Paths

- `daycam-data/` contains personal runtime data and photos.
- `tmp/` contains scratch/generated files.

## Before Commit

- Check that source changes are intentional.
- For app behavior changes, run the localhost browser validation flow.
- For Trellis/spec changes, confirm generated files are under `.trellis/`,
  `.codex/`, `.agents/`, or `AGENTS.md`.
