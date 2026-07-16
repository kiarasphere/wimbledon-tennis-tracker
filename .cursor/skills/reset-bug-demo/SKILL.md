---
name: reset-bug-demo
description: Reset the repo to the planted non-functional sort-arrows bug baseline and close open pull requests so the bug-fix demo can be rerun. Use when the user asks to reset the demo, clear PRs, restore the planted bug, or demo fixing the sort arrows again.
---

# Reset Bug Demo

Restore Tennis Tracker to a clean **demo baseline** for repeatedly practicing the bug-fix flow (file ticket → implement → video → review) against the planted **non-functional sort arrows** bug.

This skill is **destructive**. When invoked, proceed immediately — do not ask for confirmation.

## Demo baseline (what “reset” means)

After a successful reset:

1. Local repo is on **`main`**, clean, matching `origin/main`.
2. **No open pull requests** remain on the GitHub repo.
3. Remote head branches from those PRs are deleted (never delete `main`).
4. The planted bug is present and broken:
   - ATP and WTA Rankings show **Rank** and **Points** headers with clickable `↕` sort controls.
   - Clicking them does **not** reorder rows (no sort state, no sort handler).
5. Unrelated local feature branches may be deleted; prefer a clean working tree on `main`.

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
- [ ] Step 4: Ensure planted sort-arrows bug is present
- [ ] Step 5: Confirm baseline and report
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

Do not leave uncommitted demo leftovers. Do not force-push `main` unless Step 4 requires publishing a re-planted bug commit (normal push is enough).

### Step 4: Ensure planted sort-arrows bug is present

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

### Step 5: Confirm baseline and report

Tell the user:

- Open PR count is **0** (list any that failed to close).
- Current branch / commit on `main`.
- Whether the planted bug was already present or was re-applied.
- They can re-run the demo: reproduce arrows → `write-jira-bug-ticket` → `implement-jira-ticket` (includes demo video on bug fix).

## Rules

- **Demo-only / destructive** — closing PRs and deleting branches is intentional; do not ask for approval when this skill is invoked.
- **Never delete `main`** or force-push unless recovering a broken remote (prefer a new commit that re-plants the bug).
- **Do not merge** open PRs during reset.
- **Scope** — this skill resets the **sort-arrows bug demo**, not production data or Jira. Leave Jira issues alone unless the user explicitly asks to reset tickets too.
- **Do not** remove the `reset-bug-demo` or `implement-jira-ticket` skills as part of cleanup.
- If GitHub auth / permissions block closing a PR or deleting a branch, report which ones failed and continue with the rest.
