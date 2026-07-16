---
name: implement-jira-ticket
description: Implement an existing Jira ticket end-to-end — fetch the issue, plan the work, build it, and transition status (In Progress → In Review). Use when the user asks to implement, build, work on, or pick up a Jira ticket/issue (by key, URL, or summary).
---

# Implement Jira Ticket

Take an **existing** Jira issue and ship it. Do not create tickets (use `write-jira-bug-ticket` for bugs or `write-jira-feature-ticket` for features). Always plan before coding; no approval gate — plan, then build.

Bug tickets often follow `.cursor/skills/write-jira-bug-ticket/SKILL.md` (Summary, Steps to Reproduce, Expected/Actual, Environment, Evidence, Notes). New Feature tickets follow `.cursor/skills/write-jira-feature-ticket/SKILL.md` (Summary, Problem/Opportunity, Proposed Solution, User Stories, Acceptance Criteria). Use whichever structure matches the issue type.

## Workflow

```
Task Progress:
- [ ] Step 1: Fetch and understand the ticket
- [ ] Step 2: Transition to In Progress
- [ ] Step 3: Plan the implementation
- [ ] Step 4: Build
- [ ] Step 5: Verify
- [ ] Step 6: Transition to In Review and comment
```

### Step 1: Fetch and understand the ticket

1. Resolve Atlassian `cloudId` via `getAccessibleAtlassianResources`.
2. Load the issue with `getJiraIssue` (`responseContentFormat: markdown`). Prefer fields: summary, description, status, issuetype, priority, labels, components, assignee.
3. If the user gave a URL or partial key, resolve to the issue key first (search with `searchJiraIssuesUsingJql` if needed). Default project: **TABT** (Tennis App Bug Tracking).
4. Extract: type (Bug / New Feature / Task / etc.), current status, requirements, acceptance criteria or repro steps, and any linked context in the description.

**If the ticket is unclear or blocked** (missing AC, contradictory requirements): ask the user before planning. Do not guess scope.

### Step 2: Transition to In Progress

1. Call `getTransitionsForJiraIssue` for the issue.
2. Pick the transition whose target status is **In Progress** (match by name, case-insensitive; also accept common aliases like "Start Progress").
3. Call `transitionJiraIssue` with that transition `id`.
4. If already In Progress, skip. If no matching transition, tell the user and continue without blocking.

### Step 3: Plan the implementation

**Always plan before writing code.** Share a short plan in the chat, then immediately proceed to build (do not wait for approval).

Plan should cover:

1. **Goal** — one sentence restating the ticket outcome.
2. **Approach** — files/modules to touch (`tennis_data.py`, `main.py`, `schemas.py`, pages, `api.ts`, styles).
3. **Steps** — ordered implementation checklist.
4. **Risks / edge cases** — hardcoded data gaps, ATP/WTA parity, 404 paths, regressions in tests.
5. **Done looks like** — how you will verify (tests, manual checks, endpoints).

For Bugs: map Expected vs Actual and Evidence to a root-cause hypothesis before coding.  
For New Features / Stories: map acceptance criteria to concrete code and data changes.

Respect project rules (API rate limits, single gateway client, one fetch per screen, etc.) in the plan.

### Step 4: Build

1. Implement exactly the planned scope — no drive-by refactors.
2. Follow existing repo patterns and the API rate-limit rules.
3. For data changes, edit `backend/app/tennis_data.py` and update backend tests.
4. Keep changes focused on the ticket.

### Step 5: Verify

1. Confirm the ticket's acceptance criteria or expected behavior.
2. Run relevant tests or exercise the affected UI/API locally when practical:

```bash
cd backend && .venv/bin/pytest
cd frontend && npm test && npm run lint
```

3. Fix issues you introduced before moving on.

### Step 6: Transition to In Review and comment

1. Call `getTransitionsForJiraIssue` again (available transitions change by status).
2. Transition to **In Review** (match by name, case-insensitive; also accept "Ready for Review", "Code Review", "In review").
3. If no matching transition, tell the user what statuses are available and leave the ticket in In Progress.
4. Add a comment with `addCommentToJiraIssue` (`contentFormat: markdown`):

```markdown
## Implementation complete

**Summary:** <one sentence>

**Changes:**
- <file or area>: <what changed>

**Verification:**
- <how it was checked>

**Notes:** <follow-ups or out-of-scope items, if any>
```

5. Return to the user: issue key, new status, brief what shipped, and the issue URL if known.

## Status transition rules

| When | Target status |
|------|----------------|
| Starting work (after fetch) | **In Progress** |
| Implementation + verification done | **In Review** |

- Always discover transition IDs via `getTransitionsForJiraIssue` — never hardcode IDs.
- Match on **target status name**, not transition name alone when both are present.
- Never transition to Done/Closed unless the user explicitly asks.

## Rules

- **Existing tickets only** — never call `createJiraIssue` in this skill.
- **Plan then build** — always write the plan first; do not wait for approval unless the user asked to review the plan.
- **One ticket at a time** unless the user lists multiple keys.
- Prefer the project **TABT** when disambiguating keys.
- If implementation is blocked mid-way, leave a Jira comment explaining the blocker; keep status **In Progress** (do not move to In Review).
- Do not commit or open a PR unless the user asks.
