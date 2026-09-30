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

1. The workflow uses `lerna` to bump the version and update the `CHANGELOG.md` files based on the commit history.
2. It publishes the packages to NPM, then pushes the version commit and tag and creates a GitHub release.
3. It approves and merges the release PR.
4. It moves the Jira ticket to `Released` and announces the release in Slack.

If a step fails before publishing, the ticket goes back to `Conditional Release Approved` and a failure message is posted to the release failure channel. Fix the cause and approve the ticket again; steps that already finished are skipped.
If a step fails after publishing, the ticket stays in `Releasing`. Fix the cause and re-run the workflow.
If the release PR cannot be merged or the Jira ticket cannot be moved to `Released`, the release still completes and the failure channel asks you to merge the PR or update the ticket manually.
