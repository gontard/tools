---
name: tool-workflow
description: Two-phase workflow for creating tools. Phase 1: create PLAN.md and open PR for review. Phase 2: implement approved plan with one commit per step. Use when asked to "plan a tool", "create a plan for", "implement the plan", or "execute the plan".
---

# Tool Workflow

Two-phase development process. Each phase produces a separate PR.

## Phase 1: Planning

Create a self-contained plan executable by another agent without additional context.

### Process

1. Create branch: `git checkout -b plan/<tool-name>`
2. Create directory: `mkdir -p <tool-name>`
3. Write `<tool-name>/PLAN.md` following the template below
4. Commit: `git add . && git commit -m "plan: <tool-name>"`
5. Push and open PR:
   ```bash
   git push -u origin plan/<tool-name>
   gh pr create --draft --title "plan: <tool-name>" --body "Planning phase for <tool-name>"
   ```

### PLAN.md Template

```markdown
# <Tool Name>

## Goal

<One paragraph: what this tool does, why it exists, who it's for>

## Architecture

- **Type**: Single HTML / Frontend + Backend
- **Stack**: <technologies with brief rationale>
- **Files**:
  ```
  <tool-name>/
  ├── file1
  └── file2
  ```

## Steps

- [ ] Step 1: <specific deliverable>
- [ ] Step 2: <specific deliverable>
- [ ] Step N: <specific deliverable>

## Specifications

<Tool-specific technical details>

### For Frontend Tools
- Page sections and components
- Key styling (colors, layout approach)
- JavaScript behavior

### For Backend Tools
- API endpoints with request/response format
- Error handling
- Dependencies

## Testing

- <Test case 1: input → expected output>
- <Test case 2: edge case handling>

## Acceptance Criteria

- [ ] <Measurable criterion 1>
- [ ] <Measurable criterion 2>
```

### Planning Guidelines

1. **Be specific**: Each step should produce a concrete deliverable
2. **Be complete**: Plan should be executable without external context
3. **Include specs**: Enough detail to implement without guessing
4. **Define done**: Clear, testable acceptance criteria

## Phase 2: Implementation

Execute an approved plan. The plan PR must be merged first.

### Process

1. Sync with main: `git checkout main && git pull`
2. Create feature branch: `git checkout -b feat/<tool-name>`
3. For each step in PLAN.md:
   - Implement the step
   - Update checkbox: `- [ ]` → `- [x]`
   - Commit: `git add . && git commit -m "step N: <description>"`
4. Push and open PR:
   ```bash
   git push -u origin feat/<tool-name>
   gh pr create --draft --title "feat: <tool-name>" --body "Implements <tool-name>/PLAN.md"
   ```

### Commit Convention

- One commit per step
- Format: `step N: <description from PLAN.md>`
- Each commit updates the corresponding checkbox
