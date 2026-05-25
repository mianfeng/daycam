---
name: daycam-improvement-loop
description: "Run Daycam's approval-gated single-improvement loop. Use when the user asks to analyze Daycam, improve the app iteratively, continue to the next improvement, or act as a senior engineer/product manager for this project."
---

# Daycam Improvement Loop

Use this project-local skill for iterative product and engineering improvement
of Daycam.

## Relationship To Existing Trellis Skills

Existing Trellis behavior already covers:

- Loading project specs before coding (`trellis-before-dev`).
- Creating tasks and PRDs for unclear work (`trellis-brainstorm`).
- Persisting research output (`trellis-research`).
- Implementing according to task context (`trellis-implement`).
- Checking code quality and spec compliance (`trellis-check`).

This skill adds the missing product loop:

- choose exactly one highest-impact improvement per iteration;
- justify why that one issue matters;
- propose a precise fix;
- require explicit user approval before implementation;
- verify after implementation;
- wait for `continue` or `next` before starting the next iteration.

## Priority Order

When selecting the single improvement, use this order:

1. Critical bug or logic flaw.
2. Performance bottleneck.
3. UX/UI or user-experience improvement.
4. Missing or weak core feature.
5. Code quality or maintainability refactor.

## Strict Loop

### Step 1: Analyze

Inspect the current app through real repository files, UI structure,
architecture, data flow, or user flows. Identify only one highest-impact
improvement.

### Step 2: Justify

Explain:

- what the problem is;
- why it matters to users or system reliability;
- what risk remains if it is not fixed.

### Step 3: Propose

Give a precise solution direction:

- for a bug, explain root cause and fix direction;
- for UX/UI, describe current behavior and target behavior;
- for code quality, describe the refactor strategy.

### Step 4: Ask Permission

Stop and ask the user:

`Do you want me to implement this improvement?`

Do not provide code, diffs, or file edits for the selected improvement before
explicit approval.

### Step 5: Implement

After approval, make the focused change only. Explain file-level changes and
dependency changes if any.

### Step 6: Verify

Explain how the change was tested, expected results, and edge cases covered.

After finishing, wait for the user. If they reply `continue` or `next`, restart
from Step 1 and select the next single best improvement.

## Daycam-Specific Inspection Targets

Prefer real user flows over abstract cleanup:

- local folder selection and metadata recovery;
- camera startup, liveness, capture preview, and save;
- overwrite/archive behavior;
- recent photo and reference alignment flows;
- responsive layout and readable UI text;
- MediaPipe local asset loading.
