# Deployment for Sample App

## Platform

The Android sample app is distributed through Firebase distribution.

The iOS sample app is distributed through TestFlight.

## Trigger

Deployment can be easily initiated through GitHub Action workflows.

Click on [Actions > deployment trigger](https://github.com/sendbird/sendbird-uikit-react-native/actions/workflows/trigger-deploy.yml), then click "Run workflow" on the right-hand side, and provide the branch/platform/app version. This will trigger a build and deployment through CircleCI.

## Variants

- If you want to test a specific Chat SDK feature that has been published through UIKit, create a deployment branch and change the Chat SDK version in `package.json > resolutions`. Then proceed to deploy as usual.
- If you want to test an unpublished Chat SDK, copy/paste the binaries from the deployment branch to node_modules. Afterward, use [patch-package](https://github.com/ds300/patch-package) to apply a patch before deploying.

## ETC

- Deployment is facilitated using fastlane.
- For detailed fastlane environment variables required for deployment, refer to [.circleci/README.md](/.circleci/README.md).
- For a thorough understanding of the deployment workflow, consult [.circleci/config.yml](/.circleci/config.yml).
