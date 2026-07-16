---
name: identify-debt
description: Audit the Tennis Tracker repo for tech debt, correctness issues, and potential bugs across backend and frontend. Use when the user asks to identify debt, find tech debt, hunt bugs, review code health, audit the codebase, or run identify-debt.
---

# Identify Debt

Scan this repository for **tech debt**, **correctness issues**, and **potential bugs**. Report findings only — do not fix unless the user asks.

## Scope

Tennis Tracker is a two-process app:

| Area | Path | Stack |
|------|------|--------|
| Backend | `backend/` | FastAPI, hardcoded data in `tennis_data.py` |
| Frontend | `frontend/` | Vite/React, Vitest, proxies `/api` → `:8000` |
| Agent rules | `.cursor/rules/`, `AGENTS.md` | Rate limits, testing, React architecture |

Default: whole repo. If the user names a path, PR, or feature, narrow to that.

## Workflow

```
Task Progress:
- [ ] Step 1: Orient (structure, recent changes, known constraints)
- [ ] Step 2: Static scan (debt + bug patterns)
- [ ] Step 3: Run checks when cheap (lint/tests/typecheck)
- [ ] Step 4: Report findings (severity-ranked)
```

### Step 1: Orient

1. Skim `README.md`, `AGENTS.md`, and `.cursor/rules/` for hard constraints.
2. Note recent churn (`git log --oneline -20`, `git status`) — debt often clusters in active files.
3. Map entry points: `backend/app/main.py`, `backend/app/tennis_data.py`, `frontend/src/api.ts`, pages under `frontend/src/pages/`.

### Step 2: Static scan

Search and read code for the categories below. Prefer evidence (file + line or symbol) over speculation.

#### Correctness / potential bugs

- Unhandled or swallowed errors; broad `except` / empty catch
- Wrong HTTP status mapping (e.g. missing player → 404, malformed IDs)
- Stale data assumptions — hardcoded snapshot dated 15 Jul 2026; inconsistent scores or rankings across endpoints
- Race conditions: overlapping fetches, missing abort/cancel on navigation or debounce
- Null/undefined gaps in API response shaping vs what the UI assumes
- Off-by-one / sorting / country aggregation mistakes (ATP vs WTA, points totals)
- Broken links between pages (e.g. Wimbledon results → player profiles, WTA rankings without profile links)
- Frontend calling `fetch` outside `frontend/src/api.ts` (violates rate-limit gateway)
- Invalid tennis scores in hardcoded data (e.g. impossible set scores)

#### Tech debt

- Missing or weak tests for new/changed pages, components, or API routes (see `.cursor/rules/backend-testing.mdc`, `frontend-tests-required.mdc`)
- Duplicated fetch/transform logic that should be shared — or premature abstractions (see `react-simple-architecture.mdc`)
- Dead code, unused exports, commented-out blocks, TODO/FIXME/HACK without owners
- Oversized components/modules; mixed concerns (UI + networking + domain in one file)
- Inconsistent patterns across sibling pages (loading/error/retry, types, fixtures)
- Docs/rules that contradict the code (e.g. stale F1/OpenF1 references in skills or rules)
- Legacy CSS class names from the F1 app (`driver-*`, `telemetry-*`) still in use

#### Project-specific hotspots

- **Hardcoded data coverage**: only 3 ATP players have full season profiles; WTA profiles return 404; semifinalists linked from results may 404
- **ATP vs WTA parity**: rankings, profiles, country standings, and Wimbledon results skew men's-only
- **Data consistency**: country rankings sort order, point totals vs ATP aggregation, final match set scores vs headline
- **Rate limits**: 3 req/s, 30 req/min — N+1 calls, per-component fetches, undebounced search, aggressive polling (less critical with hardcoded data, still flag violations)
- **Proxy dependency**: frontend assumes backend on `:8000`; note fragile local-dev assumptions if relevant
- **UI polish**: negative point deltas styled as gains, mobile table column hiding, missing 404 route

### Step 3: Run checks (when available)

Run what exists; do not invent a CI matrix. Typical:

```bash
# Frontend
cd frontend && npm run lint && npm test && npm run build

# Backend (venv required)
cd backend && .venv/bin/pytest
```

Treat failures as findings. If a tool is missing, note that as debt — do not spend the audit installing large toolchains unless the user asks.

### Step 4: Report

Use this format. Rank by severity. Cap noise: merge duplicates; skip pure style nits unless they hide bugs.

```markdown
# Debt & bug audit

**Scope:** [whole repo | path/PR]
**Summary:** [1–2 sentences]

## Critical
- **[Area] Title** — why it matters
  - Evidence: `path/to/file` (symbol or behavior)
  - Risk: [bug | outage | data wrong | security]
  - Suggested fix: [one line; do not implement]

## High
- ...

## Medium
- ...

## Low / cleanup
- ...

## Healthy signals (optional)
- Brief list of things that look solid, so the report is balanced
```

Severity guide:

| Level | Meaning |
|-------|---------|
| Critical | Likely user-facing bug, data corruption, or hard outage path |
| High | Probable bug or debt that will bite soon (missing tests on critical paths, rate-limit violations) |
| Medium | Maintainability or latent risk |
| Low | Cleanup, consistency, docs drift |

## Rules of engagement

- **Read-only by default** — no refactors, no tickets, no commits unless asked.
- **Evidence required** — every finding cites a file/symbol or a failing command.
- **No speculative CVE essays** — only concrete issues in this codebase.
- **Respect architecture rules** — flag clever abstractions and per-widget fetches; do not recommend new frameworks.
- **Offer next steps** only at the end (e.g. file Jira bugs via `write-jira-bug-ticket`, features via `write-jira-feature-ticket`, or fix top N) — do not start them unprompted.

## Anti-patterns for this skill

- Dumping a giant file tree with no prioritized findings
- Relitigating product taste ("I'd use Redux") without a concrete problem
- Filing Jira tickets or opening PRs as part of the audit
- Treating missing live API data as a bug — this app intentionally uses hardcoded snapshots
