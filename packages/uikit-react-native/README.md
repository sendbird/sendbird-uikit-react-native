# @sendbird/uikit-react-native

[![Platform React-Native](https://img.shields.io/badge/Platform-React--Native-orange.svg)](https://reactnative.dev/)
[![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-orange.svg)](https://www.typescriptlang.org/)

> React-Native based UI kit based on sendbird javascript SDK

## Installation

Install uikit

```sh
npm i @sendbird/uikit-react-native
```

Install required dependencies

```sh
npm i sendbird date-fns react-native-safe-area-context
npx pod-install
```

### (Optional) Install native modules

#### Local caching

Install if you want to use local caching.

```shell
npm i @react-native-async-storage/async-storage @react-native-community/netinfo
npx pod-isntall
```

#### React-Native-CLI

Install if you want to use `createNativeClipboardService`, `createNativeNotificationService` and `createNativeFileService`.

```sh
npm i react-native-permissions \
            react-native-image-picker \
            react-native-document-picker \
            @react-native-community/cameraroll \
            react-native-file-access \
            @react-native-clipboard/clipboard \
            @react-native-firebase/messaging \
            @react-native-firebase/app

npx pod-isntall
```

#### Expo-CLI

Install if you want to use `createExpoClipboardService`, `createExpoNotificationService` and `createExpoFileService`.

```sh
expo install expo-image-picker \
             expo-document-picker \
             expo-media-library \
             expo-file-system \
             expo-clipboard \
             expo-notifications
```

## Getting Started

With Sendbird UIKit for React Native, we export these components: (See `src/index.ts`)

- SendbirdUIKitContainer - The context provider container that passes the data required for UIKit down to the child components
- useSendbirdChat - Hook to access `SendbirdChatContext`
- useConnection - Hook allows the Chat SDK to either connect or disconnect the user from the Sendbird server.

- createGroupChannelFragment - A function that builds a group channel screen
- createGroupChannelListFragment - A function that builds a group channel list screen
- createGroupChannelSettingsFragment - A function that builds a group channel settings screen
- createGroupChannelInviteFragment - A function that builds a group channel invite screen
- createGroupChannelMembersFragment - A function that builds a group channel members screen

- createNativeClipboardService - A function that create a basic clipboard service
- createNativeNotificationService - A function that create a basic notification service
- createNativeFileService - A function that create a basic file service

and many more...
