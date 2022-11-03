# How to generate CI environment vars

## TODO

- [ ] Replace username, itc_team_id and specific_password to App Store Connect API Key

## Shared

- SENDBIRD_APP_ID
  - Your sendbird application id

## Android

- FASTLANE_ANDROID_SERVICE_ACCOUNT
  - Create service-account(firebase_app_distribution role) from google cloud console
  - Download JSON key file
  - Encode as a base64
    - `cat service-account.json | base64`
  - Save encoded text to environment
    - You can decode text like `echo "encoded-base64-text" | base64 --decode`
- FASTLANE_ANDROID_APP_ID
  - Open your firebase project settings > general
  - Find your android app (formatted like 1:xxxxxxxxxxxxxxxx)
  - Save app id to environment

## iOS

- FASTLANE_IOS_APPLE_ID
  - Your apple id(email)
- FASTLANE_IOS_TEAM_ID
  - You can find out from the ends of [apple developers](https://developer.apple.com/account) site url
- FASTLANE_IOS_ITC_TEAM_ID
  - iTunes connect team id, refer this [link](https://github.com/fastlane/fastlane/issues/4301#issuecomment-253461017)
- FASTLANE_IOS_MATCH_GIT_URL
  - URL should be starts with `git@` (ssh)
  - Save match git url to environment, you can find out from our github organization repos
  - Authorization with SSH
    - Open CircleCI Project settings > SSH Keys
    - Add User Key
- FASTLANE_IOS_MATCH_PASSWORD
  - You can find out password from Match Git repository description
- FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD
  - Open [apple id](https://appleid.apple.com/account/manage) site
  - Create Application Password
  - Save password to environment
