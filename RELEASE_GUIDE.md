# Release Guide

This guide describes how to create and deploy a new release of the project.

## Step 1: Create a release branch

Create a branch for the new release. The branch name should follow the `release/X.Y.Z` format, where `X.Y.Z` represents the release version.

```bash
git checkout -b release/X.Y.Z
```

## Step 2: Write CHANGELOG_DRAFT.md

Record the changes for this release in the `CHANGELOG_DRAFT.md` file.

## Step 3: Commit and push changes

Commit the changes you've made and push the branch to the remote repository.

```bash
git add .
git commit -m "chore: update changelog draft"
git push origin release/X.Y.Z
```

## Step 4: Create a PR and ticket

Create a Pull Request for the newly pushed branch. The PR should be requested to the `main` branch.
And add a `/bot create ticket` comment to create a ticket in the project management tool.

## Step 5: Get the ticket approved

When the assignee approves the release ticket in Jira, Jira automation runs the `Release` workflow (`.github/workflows/release-workflow.yml`) on the release branch.

1. The workflow checks that the ticket is in `Releasing` and was created for this branch.
2. It uses `lerna` to bump the version and update the `CHANGELOG.md` files based on the commit history.
3. It publishes the packages to NPM, then pushes the version commit and tag and creates a GitHub release.
4. It approves and merges the release PR.
5. It moves the Jira ticket to `Released` and announces the release in Slack.

### If the release fails

Failures are posted to the release failure channel. Steps that already finished are skipped when the release runs again.

- **Before publishing**: the ticket goes back to `Conditional Release Approved`. To retry:
  1. Fix the cause.
  2. In Jira, move the ticket from `Conditional Release Approved` to `Releasing`. Moving it does not start the workflow by itself; it only allows the workflow to run again.
  3. Run the workflow again (see below).
- **After publishing**: the ticket stays in `Releasing`. Fix the cause and run the workflow again.
- **Merging the PR or updating the ticket**: the release still completes, and the failure channel asks you to merge the PR or move the ticket to `Released` manually.

To run the workflow again, click **Re-run jobs** on the failed run. If the fix is a commit to the release branch (for example, a fix to the workflow itself), start a new run from the Actions tab with **Run workflow**, selecting the release branch and entering the ticket key, because a re-run uses the original workflow file. Commits after the version bump may change only `.github/`.

If the approver chose `Conditional Release Approved` instead of `Release Approved`, the workflow does not start automatically. Move the ticket to `Releasing` and start a run with **Run workflow** in the same way.

### Releasing without Jira

If Jira is unavailable, a repository admin or maintainer can release from GitHub alone:

1. Open the Actions tab, select the `Release` workflow, and click **Run workflow**.
2. Select the release branch, check `skip_jira`, and enter the ticket key if there is one.

The workflow then neither checks nor updates the ticket, and the failure channel records who released without Jira. Update the ticket manually once Jira is back.
