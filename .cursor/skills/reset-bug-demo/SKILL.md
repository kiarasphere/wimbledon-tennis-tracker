---
name: reset-bug-demo
description: Reset the repo to the planted non-functional sort-arrows bug baseline, close open pull requests, and clear related Jira demo tickets so the bug-fix demo can be rerun. Use when the user asks to reset the demo, clear PRs, restore the planted bug, clear demo Jira tickets, or demo fixing the sort arrows again.
---

# Reset Bug Demo

Restore Tennis Tracker to a clean **demo baseline** for repeatedly practicing the bug-fix flow (file ticket → implement → video → review) against the planted **non-functional sort arrows** bug.

This skill is **destructive**. When invoked, proceed immediately — do not ask for confirmation.

## Demo baseline (what “reset” means)

After a successful reset:

1. Local repo is on **`main`**, clean, matching `origin/main`.
2. **No open pull requests** remain on the GitHub repo.
3. Remote head branches from those PRs are deleted (never delete `main`).
4. Related **TABT** sort-arrows demo Bug tickets are cleared (deleted when possible, otherwise closed/cancelled).
5. The planted bug is present and broken:
   - ATP and WTA Rankings show **Rank** and **Points** headers with clickable `↕` sort controls.
   - Clicking them does **not** reorder rows (no sort state, no sort handler).
6. Unrelated local feature branches may be deleted; prefer a clean working tree on `main`.

## Planted bug reference

| Area | Expected state |
|------|----------------|
| `StandingsColumn` | Optional `sortable?: boolean` |
| `StandingsTable` header | If `sortable`, render a `<button className="sortable-header">` with label + `↕` (`aria-hidden`); **no** `onClick` that sorts |
| ATP / WTA columns | `sortable: true` on Rank (`position`) and Points (`points`) |
| Sorting logic | **Absent** — no `useState` sort direction, no row reorder by column |

If a previous demo **fixed** sorting (handler, state, or reordered rows), strip that fix and restore the non-functional controls above, then commit and push to `main`.

## Workflow

```
Task Progress:
- [ ] Step 1: Close all open pull requests
- [ ] Step 2: Delete PR head branches (remote + local)
- [ ] Step 3: Hard-reset local repo to origin/main
- [ ] Step 4: Clear related Jira demo tickets
- [ ] Step 5: Ensure planted sort-arrows bug is present
- [ ] Step 6: Confirm baseline and report
```

### Step 1: Close all open pull requests

1. List open PRs (`gh pr list --state open` or equivalent).
2. For each open PR, close it (prefer `ManagePullRequest` `set_pr_status` with `status: "closed"`, or `gh pr close <n>`).
3. Do **not** merge PRs as part of reset.
4. If there are no open PRs, continue.

### Step 2: Delete PR head branches

1. For each PR closed in Step 1, note `headRefName`.
2. Delete the remote branch if it still exists and is not `main`:

```bash
git push origin --delete <branch-name>
```

3. Delete matching local branches if present (`git branch -D <branch-name>`), except the branch you are currently on — switch to `main` first if needed.
4. Ignore errors when a branch was already deleted by GitHub on PR close.
5. Optionally prune: `git fetch origin --prune`.

### Step 3: Hard-reset local repo to origin/main

```bash
git checkout main
git fetch origin main
git reset --hard origin/main
git clean -fd
```

Do not leave uncommitted demo leftovers. Do not force-push `main` unless Step 5 requires publishing a re-planted bug commit (normal push is enough).

### Step 4: Clear related Jira demo tickets

Clear **TABT** Bug tickets created for this sort-arrows demo so the next run can file a fresh ticket via `write-jira-bug-ticket`.

1. Resolve Atlassian `cloudId` via `getAccessibleAtlassianResources` (authenticate first if required).
2. Search with `searchJiraIssuesUsingJql` for demo Bugs, e.g.:

```
project = TABT AND issuetype = Bug AND (
  summary ~ "sort" OR summary ~ "sortable" OR summary ~ "sort arrow"
  OR text ~ "sortable-header" OR text ~ "sort arrows" OR text ~ "↕"
) ORDER BY updated DESC
```

   Broaden or narrow the JQL if needed so you catch tickets about Rank/Points header sort controls that do not reorder rows. Prefer Bugs clearly about this planted demo; do **not** mass-close unrelated TABT work.
3. For each matching issue (any status, including Done — demo cleanup should remove leftovers):
   - **Prefer delete** if a delete-issue tool or API is available and permitted.
   - **Otherwise close** the ticket:
     1. `getTransitionsForJiraIssue` for the issue key.
     2. Transition to a terminal status: prefer **Cancelled** / **Canceled** / **Won't Do** if available; else **Done**.
     3. Optionally `addCommentToJiraIssue` noting it was closed by `reset-bug-demo` for demo reset.
4. If Atlassian auth/permissions block cleanup, report which keys failed and continue with the rest of the reset.
5. If no matching tickets are found, continue (nothing to clear).

Do **not** delete or close unrelated TABT issues (features, other bugs, tickets outside this demo theme).

### Step 5: Ensure planted sort-arrows bug is present

1. Inspect:
   - `frontend/src/components/StandingsTable.tsx`
   - `frontend/src/pages/AtpRankings.tsx`
   - `frontend/src/pages/WtaRankings.tsx`
   - `frontend/src/App.css` (`.sortable-header`, `.sort-arrows`)
2. **If the bug is already planted and non-functional** (matches the reference table): do nothing.
3. **If sorting was implemented or arrows are missing**: restore the planted bug exactly as in the reference table (non-functional buttons + ATP/WTA `sortable: true` + CSS). Keep the change minimal — do not reintroduce a working sorter.
4. If you changed code:
   - Commit on `main` with a clear message (e.g. `Re-plant non-functional sort arrows for bug demo`).
   - Push: `git push origin main`.
5. Quick sanity check (optional): Rank/Points headers render sort buttons; there is no sort `onClick` / sort state that mutates `rows` order.

### Step 6: Confirm baseline and report

Tell the user:

- Open PR count is **0** (list any that failed to close).
- Jira demo tickets cleared (keys deleted or closed/cancelled; list failures).
- Current branch / commit on `main`.
- Whether the planted bug was already present or was re-applied.
- They can re-run the demo: reproduce arrows → `write-jira-bug-ticket` → `implement-jira-ticket` (includes demo video on bug fix).

## Rules

- **Demo-only / destructive** — closing PRs, deleting branches, and clearing matching Jira demo tickets is intentional; do not ask for approval when this skill is invoked.
- **Never delete `main`** or force-push unless recovering a broken remote (prefer a new commit that re-plants the bug).
- **Do not merge** open PRs during reset.
- **Jira scope** — only clear **TABT** Bugs related to the sort-arrows demo; leave unrelated Jira work alone.
- **Do not** remove the `reset-bug-demo` or `implement-jira-ticket` skills as part of cleanup.
- If GitHub or Atlassian auth / permissions block an action, report which items failed and continue with the rest.
