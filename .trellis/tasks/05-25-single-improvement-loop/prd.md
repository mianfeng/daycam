# Solidify Single-Improvement Loop

## Goal

Capture the user's iterative Daycam improvement prompt as durable local
project guidance, without duplicating existing Trellis rules for reading specs,
inspecting code, implementing changes, and running checks.

## Requirements

- Preserve the user's strict loop for app improvement work:
  analyze, justify, propose, ask permission, implement only after approval,
  verify, then wait for `continue` or `next`.
- Keep each iteration focused on exactly one highest-impact improvement.
- Use the user's priority order when selecting the one improvement:
  critical bug or logic flaw, performance bottleneck, UX/UI improvement,
  missing or weak core feature, then maintainability refactor.
- Record overlap with existing Trellis behavior so future agents do not
  duplicate workflow mechanics already covered elsewhere.
- Put project-specific behavior in local project files, not in the public
  `trellis-meta` skill or global Trellis installation.

## Acceptance Criteria

- [ ] A project-local spec documents the single-improvement loop.
- [ ] The project spec index links to the new guidance.
- [ ] A project-local skill exists for the Daycam improvement loop.
- [ ] The skill names what is already covered by Trellis and what the added
      prompt contributes.
- [ ] Basic file checks pass for touched Markdown and metadata files.

## Technical Approach

Add a project spec under `.trellis/spec/project/` for durable Trellis context,
then add a shared local skill under `.agents/skills/` for explicit invocation
in future sessions. Avoid editing `.agents/skills/trellis-meta` because it is a
generic Trellis customization skill, not a Daycam product workflow.

## Out of Scope

- Changing Daycam app behavior.
- Modifying global Codex skills or the Trellis npm installation.
- Changing the core Trellis task lifecycle.

## Technical Notes

- Existing overlap:
  `trellis-before-dev` already requires reading applicable specs before code.
  `trellis-check` already covers quality verification after code.
  Codex `trellis-research`, `trellis-implement`, and `trellis-check` agents
  already define research, implementation, and review responsibilities.
- Missing local convention:
  no existing project spec or local skill currently enforces "one improvement
  per loop" or the mandatory approval gate before implementation.
