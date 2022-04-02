How to generate CI environment

## Shared

- SENDBIRD_APP_ID
  - Your sendbird application id

## Android

- FASTLANE_ANDROID_SERVICE_ACCOUNT
  - Create service-account(firebase_app_distribution role) from google cloud console
  - Download JSON key file
  - Decode as a base64
    - `cat service-account.json | base64 >> decoded.txt`
  - Save decoded text to environment
- FASTLANE_ANDROID_APP_ID
  - Open your firebase project settings > general
  - Find your android app (formatted like 1:xxxxxxxxxxxxxxxx)
  - Save app id to environment

## iOS

- FASTLANE_IOS_TEAM_ID
  - You can find out from the ends of [apple developers](https://developer.apple.com/account) site url
- FASTLANE_IOS_MATCH_GIT_URL
  - URL should be starts with https, not a ssh(git@~)
  - Save match git url to environment, you can find out from our github organization repos
- FASTLANE_IOS_MATCH_PASSWORD
  - You can find out password from Match Git repository description
- FASTLANE_IOS_MATCH_GIT_BASIC_AUTHORIZATION
  - Open [github developer settings](https://github.com/settings/tokens)
  - Create Personal access token with "repo" scope
  - Decode as a base64
    - `echo -n user-name:personal-access-token | base64`
  - (Optional) Testing
    - `curl -H "Authorization: basic <<decoded-text>>" https://api.github.com/repos/<<match-git-repo-owner>>/<<match-git-repo-name>>`
  - Save decoded text to environment
- FASTLANE_IOS_APPLE_ID & FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD
  - TODO: Replace to App Store Connect API Key
  - FASTLANE_IOS_APPLE_ID
    - Your apple id(email)
  - FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD
    - Open [apple id](https://appleid.apple.com/account/manage) site
    - Create Application Password
    - Save password to environment
