# Single-Improvement Loop

Use this guide when the user asks for ongoing Daycam improvement, asks to
analyze the app, says `continue` / `next` after an improvement, or provides a
prompt that requests senior product and engineering judgment.

## What Existing Trellis Already Covers

- `trellis-start` and the workflow state identify task phase and routing.
- `trellis-before-dev` loads project specs before code changes.
- `trellis-brainstorm` captures unclear requirements into a task and PRD.
- `trellis-check` verifies changed code against specs, tests, and quality
  expectations.
- The Codex `trellis-research`, `trellis-implement`, and `trellis-check`
  agents already separate research, implementation, and review responsibilities.

Do not restate those mechanics in every response. Apply this guide only for the
product-improvement loop that decides what to work on next.

## Added Local Rule

Each iteration must identify exactly one highest-impact improvement. Do not
present a backlog or multiple recommendations unless the user explicitly asks
for options.

Select the one improvement using this priority order:

1. Critical bug or logic flaw.
2. Performance bottleneck.
3. UX/UI or user-experience improvement.
4. Missing or weak core feature.
5. Code quality or maintainability refactor.

## Required Interaction Loop

Before implementation, the agent must complete these steps:

1. **Analyze**: inspect real code, UI structure, architecture, data flow, or
   user flow. Name only one highest-impact improvement.
2. **Justify**: explain what the problem is, why it matters to users or system
   reliability, and what risk remains if it is not fixed.
3. **Propose**: describe the intended solution precisely. For bugs, include
   root cause and fix direction. For UI, compare current and target behavior.
   For code quality, state the refactor strategy.
4. **Ask permission**: stop and ask, exactly in substance:
   `Do you want me to implement this improvement?`

Do not provide code, diffs, or make files changes for the selected improvement
until the user clearly approves.

After approval:

5. **Implement**: make the focused change only. Explain file-level changes and
   dependency changes if any.
6. **Verify**: state how the change was tested, expected results, and important
   edge cases covered.

After the loop finishes, wait for the user. If the user says `continue` or
`next`, restart from **Analyze** and choose the next single best improvement.

## Practical Constraints

- Ground analysis in this repository's actual files and local runtime behavior.
- Keep the recommendation production-grade and directly actionable.
- Prefer user-visible or reliability-impacting work over abstract cleanup.
- For Daycam UI work, evaluate camera capture, local folder access, photo
  history, reference alignment, and responsive layout as real user flows.
- For documentation-only or Trellis-only changes, use file and git checks; app
  browser testing is optional unless app files changed.
