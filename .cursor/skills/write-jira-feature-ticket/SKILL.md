---
name: write-jira-feature-ticket
description: Capture and scope new feature requests, then create Jira New Feature tickets in project TABT. Use when the user asks for a feature, enhancement, or improvement to be filed in Jira, or wants a feature request written to Jira.
---

# Write Jira Feature Ticket

File scoped feature requests in Jira project **TABT** (Tennis App Bug Tracking). Never create a ticket until the request is clearly understood and scoped enough to implement or prioritize.

For defects, use `write-jira-bug-ticket` instead.

## Workflow

```
Task Progress:
- [ ] Step 1: Clarify and scope the feature
- [ ] Step 2: Write the Jira ticket
```

### Step 1: Clarify and scope

1. Clarify the request: who it helps, what problem it solves, where in the app it applies, and what success looks like.
2. Inspect the codebase when useful to note existing behavior, affected pages/APIs, and constraints (hardcoded data, rate limits, etc.).
3. Define acceptance criteria — concrete, testable outcomes the feature must meet.
4. **If too vague**: ask focused questions or propose a minimal scope and confirm with the user. Do not create a ticket until the request is actionable.
5. **If scoped**: proceed to Step 2.

### Step 2: Write the Jira ticket

1. Resolve Atlassian `cloudId` via `getAccessibleAtlassianResources`.
2. Confirm the project with `getVisibleJiraProjects` (search `TABT`). Use the project's **key** as `projectKey`.
3. Optionally search for duplicates with `searchJiraIssuesUsingJql` before creating.
4. Create the issue with `createJiraIssue`:
   - `projectKey`: **TABT**
   - `issueTypeName`: **New Feature**
   - `summary` / `description`: follow the format below
   - `contentFormat`: `markdown`
   - `additional_fields`: priority and labels as appropriate
5. Return the issue key and URL to the user.

## Ticket format

### Summary

`[Area] Short description of the capability`

Examples:
- `[Player Profile] Show head-to-head record vs top-10 opponents`
- `[Rankings] Filter ATP/WTA standings by country`
- `[Wimbledon] Add draw bracket visualization`

### Description template

Use this structure verbatim (fill in the placeholders):

```markdown
## Summary
One or two sentences describing the feature and the user value.

## Problem / Opportunity
What pain point or gap exists today, or what capability is missing.

## Proposed Solution
High-level description of what to build (UI, API, data changes).

## User Stories
- As a [user type], I want [capability] so that [benefit].
- ...

## Acceptance Criteria
- [ ] ...
- [ ] ...
- [ ] ...

## Environment / Scope
- App: Tennis Tracker (hardcoded data snapshot, 15 Jul 2026)
- Affected pages or endpoints: ...
- Data dependencies (if any): ...

## Out of Scope
What this ticket explicitly does not include (optional but recommended).

## Notes
Design ideas, related tickets, technical constraints, or open questions.
```

### Example ticket

**Summary:** `[Rankings] Filter ATP/WTA standings by country`

**Description:**

```markdown
## Summary
Let users filter the rankings page to show only players from a selected country, making it easier to compare national depth on the ATP and WTA tours.

## Problem / Opportunity
The rankings page lists all top players globally. Users interested in a single country (e.g. Spain, USA) must scan the full table manually. Country Rankings shows aggregated country totals but not individual filtered player lists.

## Proposed Solution
Add a country dropdown (or search) on `/rankings` that filters the displayed ATP and WTA tables client-side. Reuse country codes already present in ranking data. Persist the selected country in the URL query param (e.g. `?country=ESP`).

## User Stories
- As a fan, I want to filter rankings by country so that I can see where my country's players stand.
- As a user sharing a link, I want the country filter in the URL so that others see the same view.

## Acceptance Criteria
- [ ] Rankings page shows a country filter control for both ATP and WTA tabs.
- [ ] Selecting a country filters the table to players matching that country code.
- [ ] Clearing the filter restores the full list.
- [ ] Selected country is reflected in the URL and restored on page load.
- [ ] Empty state shown when no players match the selected country.

## Environment / Scope
- App: Tennis Tracker (hardcoded data snapshot, 15 Jul 2026)
- Affected pages or endpoints: `/rankings`, `GET /api/rankings/atp`, `GET /api/rankings/wta`
- Data dependencies: country field on ranking entries in `backend/app/tennis_data.py`

## Out of Scope
- Backend-side filtering or new API query parameters
- Country Rankings page changes

## Notes
Client-side filter is sufficient given static snapshot data. Consider reusing country list from Country Rankings if one exists.
```

## Rules

- Only create tickets for **clearly scoped** feature requests — not half-formed ideas without acceptance criteria.
- Use project **TABT** with issue type **New Feature** — not Bug.
- Prefer one feature per ticket; split large epics into separate tickets when possible.
- Show the user the draft summary/description before creating if they asked to review first; otherwise create after scoping and share the result.
