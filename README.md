# sendbird-uikit-react-native

[![Platform React-Native](https://img.shields.io/badge/Platform-React--Native-orange.svg)](https://reactnative.dev/)
[![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-orange.svg)](https://www.typescriptlang.org/)

> React-Native based UI kit based on sendbird javascript SDK

## Introduction

Sendbird UIKit for React-Native is a development kit with an user interface that enables an easy and fast integration of standard chat features into new or existing client apps.
This mono-repository the UIKit source code is consists as explained below.

- [**packages/uikit-react-native**](/packages/uikit-react-native) is where you can find the open source code. Check out [UIKit Open Source Guidelines](/OPENSOURCE_GUIDELINES.md) for more information regarding our stance on open source.
- [**sample**](/sample) is a chat app with UIKit’s core features in which you can see items such as push notifications, total unread message count and auto sign-in are demonstrated. When you sign in to the sample app, you will only see a list of channels rendered by the [GroupChannelListFragment](https://sendbird.com/docs/chat/uikit/v3/react-native/key-functions/list-channels) on the screen.
- [**packages/uikit-react-native-foundation**](/packages/uikit-react-native-foundation) is a UI package for `uikit-react-native`.
- [**packages/uikit-chat-hooks**](/packages/uikit-chat-hooks) is a react hooks package for `uikit-react-native`.
- [**packages/uikit-utils**](/packages/uikit-utils) is a utility package for `uikit-react-native`.

### More about Sendbird UIKit for React-Native

Find out more about Sendbird UIKit for React-Native at [UIKit for React Native doc](https://sendbird.com/docs/chat/uikit/v3/react-native/overview).
If you need any help in resolving any issues or have questions, visit [our community](https://community.sendbird.com).

<br/>

## Requirements

- Nodejs 18 or newer
- [yarn v1](https://classic.yarnpkg.com/en/docs/install)
- Watchman
- JDK 17 or newer
- XCode
- Android Studio

⚑ More details, please see https://reactnative.dev/docs/environment-setup <br/>
⚑ _we strongly recommend installing yarn using [corepack](https://nodejs.org/dist/latest/docs/api/corepack.html)_

<br/>

## Try the sample app

We are using sample app for development, you can check the sample app [here](/sample) and also check the UI components via storybook in the sample app.

### Installation

> Every script should be run on the root of the project.

**Install node modules**

```shell
yarn install
```

**Linking native modules of sample app**

```shell
yarn sample:pod-install
```

**Running sample app**

- Android

```shell
yarn sample:android
```

- iOS

```shell
yarn sample:ios
```

### Sample app using your data

Create a file to `sample/src/env.ts` and write the code below to the file you created.

```ts
export const APP_ID = '2D7B4CDB-932F-4082-9B09-A1153792DC8D';
```

If you would like to try the sample app specifically fit to your usage, you can do so by replacing the default sample app ID with yours, which you can obtain by creating your [Sendbird application from the dashboard](https://dashboard.sendbird.com/).

<br />

> **Note** Update Chat SDK version of sample app <br/>
> Edit `package.json` and change the version of `resolutions > @sendbird/chat` to the version you want to use.

### Trouble shooting

- Could not connect to development server on Android device
  - Run `adb reverse tcp:8081 tcp:8081`.
- Unable to resolve module `../version` from `packages/uikit-react-native/src/containers/SendbirdUIKitContainer.tsx`
  - Run `yarn workspace @sendbird/uikit-react-native generate-version` on the root of the project.
- `concurrently 'yarn start' 'react-native run-android'` does not working expected
  - Run `yarn start` and `npx react-native run-android` separately on the `sample` directory.

## Development

We tried development on macOS / Linux systems. You might encounter problems in running sample or scripts like `yarn build` in Windows machines.

### Creating a new key function files

Run the script and enter the key function name as a lower camel case like `groupChannel`, and then you can see the auto generated files in the `/packages/uikit-react-native/src/domain`

```shell
yarn workspace @sendbird/uikit-react-native run create-domain
```

### Managing repository

> **Note**
> We are using [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces) and [lerna](https://github.com/lerna/lerna) to maintain this monorepo

#### Patch package

If you need to patch some packages for the sample to work using `patch-package`

1. `npx patch-package package-name` > mark as comment `yarn-path` in `.yarnrc` file
2. OR `./node_modules/.bin/patch-package package-name` > just run

#### Package dependencies

See [yarn workspace](https://classic.yarnpkg.com/en/docs/cli/workspace)

```shell
# Add dependency to specific workspace package
yarn workspace @sendbird/package add package-name
# Remove dependency from specific workspace package
yarn workspace @sendbird/package remove package-name

# Add dependency to root
yarn -W add package-name
```

> **Warning** You should better install to root if you're trying to install native view modules.
> Sometimes native view module in the workspace is not hoisted, and it leads to `Tried to register two views` error on the sample app.

#### Bump version

See [lerna version](https://github.com/lerna/lerna/tree/main/commands/version)

```shell
lerna version {major|minor|patch} [--no-git-tag-version] [--no-private]

# or

yarn bump:{major|minor|patch}
```

#### Publish

See [lerna publish](https://github.com/lerna/lerna/tree/main/commands/publish)

<br/>

## Scripts

### Build

```shell
yarn build
```

### Test

```shell
# Unit test
yarn test

# Build test
yarn test:build
```

### Lint and Prettier

```shell
# Check formatting
yarn lint

# Fix formatting
yarn fix
```
