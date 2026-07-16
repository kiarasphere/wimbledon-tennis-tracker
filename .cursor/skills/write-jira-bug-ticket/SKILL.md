---
name: write-jira-bug-ticket
description: Investigate reported bugs, verify they exist, and create Jira Bug tickets in project TABT. Use when the user reports a bug, asks to file a Jira ticket for a bug, or wants a verified bug written to Jira.
---

# Write Jira Bug Ticket

File verified bugs in Jira project **TABT** (Tennis App Bug Tracking). Never create a ticket until the bug is confirmed.

For feature requests, use `write-jira-feature-ticket` instead.

## Workflow

```
Task Progress:
- [ ] Step 1: Investigate and verify the bug
- [ ] Step 2: If verified, write the Jira ticket
```

### Step 1: Investigate and verify

1. Clarify the report: expected vs actual behavior, where it happens (page/API), and how to reproduce.
2. Reproduce locally (or inspect code/logs) until you can confirm or reject the bug.
3. Capture evidence: steps, screenshots/errors, affected files or endpoints.
4. **If not reproducible**: tell the user what you tried and stop. Do not create a ticket.
5. **If verified**: proceed to Step 2.

### Step 2: Write the Jira ticket

1. Resolve Atlassian `cloudId` via `getAccessibleAtlassianResources`.
2. Confirm the project with `getVisibleJiraProjects` (search `TABT`). Use the project's **key** as `projectKey`.
3. Optionally search for duplicates with `searchJiraIssuesUsingJql` before creating.
4. Create the issue with `createJiraIssue`:
   - `projectKey`: **TABT**
   - `issueTypeName`: **Bug**
   - `summary` / `description`: follow the format below
   - `contentFormat`: `markdown`
   - `additional_fields`: priority and labels as appropriate
5. Return the issue key and URL to the user.

## Ticket format

### Summary

`[Area] Short description of the failure`

Examples:
- `[Wimbledon] Semifinalist profile links return 404`
- `[Player Profile] WTA player season endpoint always returns 404`
- `[Country Rankings] Standings not sorted by total points`

### Description template

Use this structure verbatim (fill in the placeholders):

```markdown
## Summary
One or two sentences describing the bug.

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
What should happen.

## Actual Behavior
What happens instead (include error messages, status codes, or UI symptoms).

## Environment
- App: Tennis Tracker (hardcoded data snapshot, 15 Jul 2026)
- Where found: local / staging / production
- Browser or client (if UI): ...
- Relevant endpoint or page: ...

## Evidence
- Logs, stack traces, or response snippets
- Related files or components (if known)

## Notes
Any investigation findings, suspected root cause, or related issues.
```

### Example ticket

**Summary:** `[Wimbledon] Semifinalist profile links return 404`

**Description:**

```markdown
## Summary
Wimbledon results link Arthur Fery and Jan-Lennard Struff to player profiles, but the backend only resolves players in `PLAYER_SEASONS` or the ATP top-20 list.

## Steps to Reproduce
1. Open `/results` (Wimbledon Results).
2. Click **Arthur Fery** or **Jan-Lennard Struff**.

## Expected Behavior
Player profile loads with available season/tournament data.

## Actual Behavior
Error state shows **"Player not found"** (`GET /api/players/36/season` → 404).

## Environment
- App: Tennis Tracker (hardcoded data snapshot, 15 Jul 2026)
- Where found: local
- Browser or client (if UI): Chrome
- Relevant endpoint or page: `/results` → `/players/36`

## Evidence
- `WIMBLEDON_RESULTS` includes player_ids 36 and 37.
- `get_player_season()` only checks `PLAYER_SEASONS` and `ATP_RANKINGS` (top 20).
- Related: `backend/app/tennis_data.py`, `frontend/src/pages/WimbledonResults.tsx`

## Notes
Parity gap — results page links players that the season endpoint cannot resolve.
```

## Rules

- Only create tickets for **verified** bugs.
- Use project **TABT** with issue type **Bug** — not New Feature (use `write-jira-feature-ticket` for enhancements).
- Prefer one issue per ticket; do not bundle unrelated failures.
- Show the user the draft summary/description before creating if they asked to review first; otherwise create after verification and share the result.
