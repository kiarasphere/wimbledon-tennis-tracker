---
name: implement-features
description: Implement an existing Jira New Feature ticket end-to-end — fetch the issue, map acceptance criteria, plan UX/API/data work, build it, and transition status (In Progress → In Review). Use when the user asks to implement, build, ship, or pick up a feature request, New Feature ticket, enhancement, or improvement (by key, URL, or summary). Prefer this over implement-jira-ticket for features.
---

# Implement Features

Take an **existing** Jira **New Feature** (or Story / Enhancement) issue and ship it. Expert at feature delivery — not bug fixes. Do not create tickets (use `write-jira-feature-ticket` for that). For Bug tickets, use `implement-jira-ticket` instead.

Always plan before coding; no approval gate — plan, then build.

Feature tickets typically follow `.cursor/skills/write-jira-feature-ticket/SKILL.md` (Summary, Problem/Opportunity, Proposed Solution, User Stories, Acceptance Criteria, Out of Scope). Treat that structure as the contract for what to build.

## Workflow

```
Task Progress:
- [ ] Step 1: Fetch and understand the feature ticket
- [ ] Step 2: Transition to In Progress
- [ ] Step 3: Plan the feature (AC → design → code)
- [ ] Step 4: Build
- [ ] Step 5: Verify against acceptance criteria
- [ ] Step 6: Transition to In Review and comment
```

### Step 1: Fetch and understand the feature ticket

1. Resolve Atlassian `cloudId` via `getAccessibleAtlassianResources`.
2. Load the issue with `getJiraIssue` (`responseContentFormat: markdown`). Prefer fields: summary, description, status, issuetype, priority, labels, components, assignee.
3. If the user gave a URL or partial key, resolve to the issue key first (search with `searchJiraIssuesUsingJql` if needed). Default project: **TABT** (Tennis App Bug Tracking). Prefer JQL that targets New Feature when disambiguating, e.g. `project = TABT AND issuetype = "New Feature" AND ...`.
4. Extract and normalize:
   - **Issue type** — expect New Feature / Story / Task. If the ticket is a **Bug**, stop and switch to `implement-jira-ticket` (or tell the user).
   - Current status, priority, labels.
   - **Problem / Opportunity** — why this exists.
   - **Proposed Solution** — intended approach (UI, API, data).
   - **User Stories** — who benefits and what they can do.
   - **Acceptance Criteria** — the checklist that defines done (required).
   - **Out of Scope** — do not implement these items.
   - Environment / Scope (pages, endpoints, data dependencies).

**If the ticket is unclear or blocked** (missing or vague AC, contradictory requirements, no proposed solution and no clear intent): ask the user before planning. Do not invent product scope. You may propose a minimal interpretation and confirm — do not code until AC are actionable.

### Step 2: Transition to In Progress

1. Call `getTransitionsForJiraIssue` for the issue.
2. Pick the transition whose target status is **In Progress** (match by name, case-insensitive; also accept common aliases like "Start Progress").
3. Call `transitionJiraIssue` with that transition `id`.
4. If already In Progress, skip. If no matching transition, tell the user and continue without blocking.

### Step 3: Plan the feature

**Always plan before writing code.** Share a short plan in the chat, then immediately proceed to build (do not wait for approval).

Plan should cover:

1. **Goal** — one sentence restating user value (from Summary / User Stories).
2. **Acceptance Criteria map** — each AC → concrete UI/API/data change (or test). Call out any AC that is ambiguous.
3. **Approach** — files/modules to touch (`tennis_data.py`, `main.py`, `schemas.py`, pages, components, `api.ts`, styles). Prefer extending existing patterns over new abstractions.
4. **UX / data notes** — empty states, loading/error, URL state, ATP/WTA parity, hardcoded snapshot constraints.
5. **Steps** — ordered implementation checklist (backend → API client → UI → tests is a good default).
6. **Out of scope** — explicitly list what you will not build (from the ticket + anything you are deferring).
7. **Risks / edge cases** — rate-limit rules, one-fetch-per-screen, missing snapshot fields, regressions.
8. **Done looks like** — how you will verify each AC (tests, manual checks, endpoints). Demo video only if the ticket asks for one.

Respect project rules (API rate limits, single gateway client, one fetch per screen, debounce lookups, etc.) in the plan.

### Step 4: Build

1. Implement exactly the planned scope — honor **Out of Scope**; no drive-by refactors or bonus features.
2. Follow existing repo patterns and the API rate-limit rules (lift fetches to route/page level; cache; no N+1 component fetches).
3. For data changes, edit `backend/app/tennis_data.py` and update backend tests / schemas / routes as needed.
4. For new API endpoints, add or update tests in `backend/tests/` (required).
5. For frontend behavior, add or update colocated tests when practical; keep UI consistent with the existing Tennis Tracker design system.
6. Keep changes focused on the feature ticket.

### Step 5: Verify against acceptance criteria

1. Walk the ticket's **Acceptance Criteria** one by one — each must pass or be explicitly blocked with a reason.
2. Run relevant tests or exercise the affected UI/API locally when practical:

```bash
cd backend && .venv/bin/pytest
cd frontend && npm test && npm run lint
```

3. Fix issues you introduced before moving on.
4. Optionally smoke-check the happy path in the running app (backend before frontend; see `run-dev-server`). Record a demo video only if the ticket or user asks for one.

### Step 6: Transition to In Review and comment

1. Call `getTransitionsForJiraIssue` again (available transitions change by status).
2. Transition to **In Review** (match by name, case-insensitive; also accept "Ready for Review", "Code Review", "In review").
3. If no matching transition, tell the user what statuses are available and leave the ticket in In Progress.
4. Add a comment with `addCommentToJiraIssue` (`contentFormat: markdown`):

```markdown
## Feature implementation complete

**Summary:** <one sentence of user-facing value>

**Acceptance criteria:**
- [x] <AC that passed>
- [ ] <AC not met — reason / follow-up>

**Changes:**
- <file or area>: <what changed>

**Verification:**
- <tests run / manual checks>

**Out of scope / follow-ups:** <deferred items, if any>
```

5. Return to the user: issue key, new status, brief what shipped (mapped to AC), and the issue URL if known.

## Status transition rules

| When | Target status |
|------|----------------|
| Starting work (after fetch) | **In Progress** |
| Implementation + verification done | **In Review** |

- Always discover transition IDs via `getTransitionsForJiraIssue` — never hardcode IDs.
- Match on **target status name**, not transition name alone when both are present.
- Never transition to Done/Closed unless the user explicitly asks.

## Feature-delivery expertise

- **AC is the contract** — implement and verify against Acceptance Criteria, not a vague reading of the summary.
- **User stories guide UX** — optimize for the stated user outcomes; keep empty/error states intentional.
- **Respect Out of Scope** — do not expand into adjacent features; file follow-ups only if the user asks.
- **Prefer vertical slices** — ship a thin end-to-end path (data → API → UI) that satisfies AC over partial infrastructure with no user-facing value.
- **Parity** — when a feature touches rankings, draws, or player views, consider ATP and WTA unless the ticket scopes one tour.
- **Static data** — Tennis Tracker uses a hardcoded snapshot (`tennis_data.py`); do not assume live APIs or network egress.

## Rules

- **Existing tickets only** — never call `createJiraIssue` in this skill.
- **Features only** — if the issue is a Bug, use `implement-jira-ticket` instead (that skill requires a demo video for bugs).
- **Plan then build** — always write the plan first; do not wait for approval unless the user asked to review the plan.
- **One ticket at a time** unless the user lists multiple keys.
- Prefer the project **TABT** when disambiguating keys.
- If implementation is blocked mid-way, leave a Jira comment explaining the blocker; keep status **In Progress** (do not move to In Review).
- Do not commit or open a PR unless the user asks (or the environment/task explicitly requires it).
- Demo video is **not** required for features unless the ticket or user requests one.
