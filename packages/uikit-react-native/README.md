# @sendbird/uikit-react-native

Sendbird UIKit for React-Native

## Installation

### Install uikit

```sh
npm install sendbird @sendbird/uikit-react-native
```

### Install dependencies

```sh
npm install date-fns react-native-safe-area-context
```

### (Optional) Install native modules

#### React-Native-CLI

Install if you want to use `createNativeClipboardService`, `createNativeNotificationService` and `createNativeFileService`

```sh
npm install react-native-permissions \
            react-native-image-picker \
            react-native-document-picker \
            @react-native-community/cameraroll \
            react-native-file-access \
            @react-native-clipboard/clipboard \
            @react-native-firebase/messaging @react-native-firebase/app \
            date-fns
```

#### Expo-CLI

Install if you want to use `createExpoClipboardService`, `createExpoNotificationService` and `createExpoFileService`

```sh
expo install expo-image-picker \
             expo-document-picker \
             expo-media-library \
             expo-file-system \
             expo-clipboard \
             expo-notifications \
             date-fns
```
