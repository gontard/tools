---
name: tool-workflow
description: Two-phase workflow for creating tools in this repository. Phase 1 (planning): create a PLAN.md in a new tool directory and open a PR for review. Phase 2 (implementation): execute an approved plan with one commit per step, update checkboxes, and open a PR. Use when asked to "plan a tool", "create a plan for", "implement the plan", or "execute the plan".
---

# Tool Workflow

Two-phase development process for tools. Each phase produces a separate PR.

## Phase 1: Planning

Create a self-contained plan executable by another agent without additional context.

### Process

1. Create branch: `git checkout -b plan/<tool-name>`
2. Create directory and plan:
   ```bash
   mkdir -p <tool-name>
   ```
3. Write `<tool-name>/PLAN.md` following the template below
4. Commit and open PR:
   ```bash
   git add .
   git commit -m "plan: <tool-name>"
   git push -u origin plan/<tool-name>
   gh pr create --title "plan: <tool-name>" --body "Planning phase for <tool-name> tool"
   ```

### PLAN.md Template

```markdown
# <Tool Name>

## Goal

<Clear description of what this tool does and why>

## Steps

- [ ] Step 1: <description>
- [ ] Step 2: <description>
- [ ] Step 3: <description>
...

## Acceptance Criteria

- <Criterion 1>
- <Criterion 2>
```

## Phase 2: Implementation

Execute an approved plan. The plan PR must be merged first.

### Process

1. Sync with main:
   ```bash
   git checkout main && git pull
   ```
2. Create feature branch: `git checkout -b feat/<tool-name>`
3. For each step in `<tool-name>/PLAN.md`:
   - Implement the step
   - Update checkbox: `- [ ]` → `- [x]`
   - Commit:
     ```bash
     git add .
     git commit -m "step N: <step description>"
     ```
4. Open PR:
   ```bash
   git push -u origin feat/<tool-name>
   gh pr create --title "feat: <tool-name>" --body "Implements plan from <tool-name>/PLAN.md"
   ```

### Commit Convention

- One commit per step
- Format: `step N: <description from PLAN.md>`
- Each commit must update the corresponding checkbox in PLAN.md
