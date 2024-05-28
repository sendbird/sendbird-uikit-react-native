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

## Step 5: Run the publish-package workflow

Execute the `publish-package` workflow in GitHub Actions. This workflow is defined in the `.github/workflows/publish-package.yml` file.

1. workflow uses `lerna` to update the `changelog.md` file based on the commit history and creates a GitHub release.
2. The workflow also publishes the package to NPM.
3. If all the steps are completed successfully, the PR is approved by the bot.
