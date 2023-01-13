# @sendbird/uikit-react-native

[![Platform React-Native](https://img.shields.io/badge/Platform-React--Native-orange.svg)](https://reactnative.dev/)
[![Language TypeScript](https://img.shields.io/badge/Language-TypeScript-orange.svg)](https://www.typescriptlang.org/)

> React-Native based UI kit based on sendbird javascript SDK

## Before getting started

This section shows the prerequisites you need to check to use Sendbird UIKit for React-Native.

### Requirements

- Nodejs 14 or newer
- Watchman
- JDK 11 or newer
- XCode
- Android Studio

More details, please see https://reactnative.dev/docs/environment-setup

<br/>

## Getting started

This section gives you information you need to get started with Sendbird UIKit for React-Native.

### Try the sample app

Our [sample app](/sample) has all the core features of Sendbird UIKit for React-Native.
Download the app from our GitHub repository to get an idea of what you can build with the actual UIKit before building your own project.

### Create a project

You can get started by creating a project. (highly recommended to use typescript)

```sh
npx react-native init ChatApp --template=react-native-template-typescript
```

### Install UIKit for React-Native

UIKit for React-Native can be installed through either `yarn` or `npm`

**Install dependencies**

```sh
npm install @sendbird/uikit-react-native \
            @sendbird/chat \
            date-fns \
            react-native-safe-area-context \
            @react-native-community/netinfo \
            @react-native-async-storage/async-storage
```

**Linking native modules**

```sh
npx pod-install
```

### Getting permissions

Client apps must acquire permission from users to get access to their media library and save files to their mobile storage.
Once the permission is granted, users can send images and videos to other users and save media files.

**Android**

Add the following permissions to your `android/app/src/main/AndroidManifest.xml` file.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.your.app">

    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

</manifest>
```

**iOS**

Add the following permission usage descriptions to your `info.plist` file.

| Key                                                 | Type   | Value                                                           |
| --------------------------------------------------- | ------ | --------------------------------------------------------------- |
| Privacy - Camera Usage Description                  | string | $(PRODUCT_NAME) would like to use your camera                   |
| Privacy - Media Library Usage Description           | string | $(PRODUCT_NAME) would like access to your photo library         |
| Privacy - Photo Library Usage Description           | string | $(PRODUCT_NAME) would like access to your photo library         |
| Privacy - Photo Library Additions Usage Description | string | $(PRODUCT_NAME) would like to save photos to your photo library |

> **NOTE**: If you use [react-native-permissions](https://github.com/zoontek/react-native-permissions#ios), you must update `Podfile` and run `pod install`
>
> ```ruby
> permissions_path = '../node_modules/react-native-permissions/ios'
> pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
> pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary"
> pod 'Permission-MediaLibrary', :path => "#{permissions_path}/MediaLibrary"
> pod 'Permission-PhotoLibraryAddOnly', :path => "#{permissions_path}/PhotoLibraryAddOnly"
> ```

<br/>

## Implementation guide

### Install a native modules

In order to use the APIs and features of the native module in the UIKit for React Native, you need to implement the platform service interfaces that Sendbird provides.
After implementing all the interfaces, you can set them as props of `SendbirdUIKitContainer` to use the native module features across Sendbird UIKit for React-Native.

```tsx
const App = () => {
  return (
    <SendbirdUIKitContainer
      appId={'APP_ID'}
      platformServices={{
        file: FileService,
        notification: NotificationService,
        clipboard: ClipboardService,
        media: MediaService,
      }}
    >
      {/* ... */}
    </SendbirdUIKitContainer>
  );
};
```

In order to implement the interfaces to your React Native app more easily, we provide various helper functions for each interface.

> **NOTE**: Helper function is not required! You can implement it with native modules you're using.
> More details about PlatformService interfaces, please see [here](https://sendbird.com/docs/uikit/v3/react-native/core-components/provider/platformserviceprovider)

**Using React Native CLI**

You can use `createNativeClipboardService`, `createNativeNotificationService`, `createNativeFileService` and `createNativeMediaService` helper functions with below native modules.

```sh
npm install react-native-video \
            react-native-permissions \
            react-native-file-access \
            react-native-image-picker \
            react-native-document-picker \
            react-native-create-thumbnail \
            @react-native-clipboard/clipboard \
            @react-native-camera-roll/camera-roll \
            @react-native-firebase/app \
            @react-native-firebase/messaging \
            @bam.tech/react-native-image-resizer

npx pod-install
```

```ts
import Clipboard from '@react-native-clipboard/clipboard';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFBMessaging from '@react-native-firebase/messaging';
import Video from 'react-native-video';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import * as CreateThumbnail from 'react-native-create-thumbnail';
import * as ImageResizer from '@bam.tech/react-native-image-resizer';

const NativeClipboardService = createNativeClipboardService(Clipboard);
const NativeNotificationService = createNativeNotificationService({
  messagingModule: RNFBMessaging,
  permissionModule: Permissions,
});
const NativeFileService = createNativeFileService({
  fsModule: FileAccess,
  permissionModule: Permissions,
  imagePickerModule: ImagePicker,
  mediaLibraryModule: CameraRoll,
  documentPickerModule: DocumentPicker,
});
const NativeMediaService = createNativeMediaService({
  VideoComponent: Video,
  thumbnailModule: CreateThumbnail,
  imageResizerModule: ImageResizer,
});
```

**Using Expo CLI**

You can use `createExpoClipboardService`, `createExpoNotificationService`, `createExpoFileService` and `createExpoMediaService` helper functions with below expo modules.

```sh
expo install expo-image-picker \
             expo-document-picker \
             expo-media-library \
             expo-file-system \
             expo-clipboard \
             expo-notifications \
             expo-av \
             expo-video-thumbnails \
             expo-image-manipulator
```

```ts
import * as ExpoClipboard from 'expo-clipboard';
import * as ExpoDocumentPicker from 'expo-document-picker';
import * as ExpoFS from 'expo-file-system';
import * as ExpoImagePicker from 'expo-image-picker';
import * as ExpoMediaLibrary from 'expo-media-library';
import * as ExpoNotifications from 'expo-notifications';
import * as ExpoAV from 'expo-av';
import * as ExpoVideoThumbnail from 'expo-video-thumbnails';
import * as ExpoImageManipulator from 'expo-image-manipulator';

const ExpoNotificationService = createExpoNotificationService(ExpoNotifications);
const ExpoClipboardService = createExpoClipboardService(ExpoClipboard);
const ExpoFileService = createExpoFileService({
  fsModule: ExpoFS,
  imagePickerModule: ExpoImagePicker,
  mediaLibraryModule: ExpoMediaLibrary,
  documentPickerModule: ExpoDocumentPicker,
});
const ExpoMediaService = createExpoMediaService({
  avModule: ExpoAV,
  thumbnailModule: ExpoVideoThumbnail,
  imageManipulator: ExpoImageManipulator,
  fsModule: ExpoFS,
})
```

### Local caching (optional)

You can implement Local caching easily.

```shell
npm i @react-native-async-storage/async-storage
npx pod-isntall
```

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';

const App = () => {
  return <SendbirdUIKitContainer chatOptions={{ localCacheStorage: AsyncStorage }}>{/* ... */}</SendbirdUIKitContainer>;
};
```

Or you can use storage you are using instead of `AsyncStorage` (e.g. [`react-native-mmkv`](https://github.com/mrousavy/react-native-mmkv))

```tsx
import { MMKV } from 'react-native-mmkv';

import { LocalCacheStorage, SendbirdUIKitContainer } from '@sendbird/uikit-react-native';

const mmkvStorage = new MMKV();
const localCacheStorage: LocalCacheStorage = {
  async getAllKeys() {
    return mmkvStorage.getAllKeys();
  },
  async setItem(key: string, value: string) {
    return mmkvStorage.set(key, value);
  },
  async getItem(key: string) {
    return mmkvStorage.getString(key) ?? null;
  },
  async removeItem(key: string) {
    return mmkvStorage.delete(key);
  },
};

const App = () => {
  return <SendbirdUIKitContainer chatOptions={{ localCacheStorage }}>{/* ... */}</SendbirdUIKitContainer>;
};
```

### Integration with navigation library

Now you can create a screen and integrate it with a navigation library like [`react-navigation`](https://reactnavigation.org/).
See more details on [here](https://st.sendbird.com/docs/uikit/v3/react-native/introduction/screen-navigation)

The example below shows how to integrate using `react-navigation`.

**Create a fragments and screens**

```tsx
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  createGroupChannelCreateFragment,
  createGroupChannelFragment,
  createGroupChannelListFragment,
} from '@sendbird/uikit-react-native';

const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelCreateFragment = createGroupChannelCreateFragment();
const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelListScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <GroupChannelListFragment
      onPressCreateChannel={(channelType) => {
        // Navigate to GroupChannelCreate key function.
        navigation.navigate('GroupChannelCreate', { channelType });
      }}
      onPressChannel={(channel) => {
        // Navigate to GroupChannel key function.
        navigation.navigate('GroupChannel', {
          serializedChannel: channel.serialize(),
        });
      }}
    />
  );
};

const GroupChannelCreateScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <GroupChannelCreateFragment
      onCreateChannel={async (channel) => {
        // Navigate to GroupChannel key function.
        navigation.replace('GroupChannel', {
          serializedChannel: channel.serialize(),
        });
      }}
      onPressHeaderLeft={() => {
        // Go back to the previous screen.
        navigation.goBack();
      }}
    />
  );
};

const GroupChannelScreen = () => {
  const navigation = useNavigation<any>();
  const { params } = useRoute<any>();

  const { sdk } = useSendbirdChat();
  const channel = sdk.GroupChannel.buildFromSerializedData(params.serializedChannel);

  return (
    <GroupChannelFragment
      channel={channel}
      onChannelDeleted={() => {
        // Navigate to GroupChannelList key function.
        navigation.navigate('GroupChannelList');
      }}
      onPressHeaderLeft={() => {
        // Go back to the previous screen.
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to GroupChannelSettings key function.
        navigation.navigate('GroupChannelSettings', {
          serializedChannel: params.serializedChannel,
        });
      }}
    />
  );
};
```

**Register screens to navigator**

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SendbirdUIKitContainer, useConnection, useSendbirdChat } from '@sendbird/uikit-react-native';

const RootStack = createNativeStackNavigator();
const SignInScreen = () => {
  const { connect } = useConnection();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Pressable
        style={{
          width: 120,
          height: 30,
          backgroundColor: '#742DDD',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => connect('USER_ID', { nickname: 'NICKNAME' })}
      >
        <Text>{'Sign in'}</Text>
      </Pressable>
    </View>
  );
};

const Navigation = () => {
  const { currentUser } = useSendbirdChat();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <RootStack.Screen name={'SignIn'} component={SignInScreen} />
        ) : (
          <>
            <RootStack.Screen name={'GroupChannelList'} component={GroupChannelListScreen} />
            <RootStack.Screen name={'GroupChannelCreate'} component={GroupChannelCreateScreen} />
            <RootStack.Screen name={'GroupChannel'} component={GroupChannelScreen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <SendbirdUIKitContainer
      appId={APP_ID}
      platformServices={{
        file: FileService,
        notification: NotificationService,
        clipboard: ClipboardService,
      }}
    >
      <Navigation />
    </SendbirdUIKitContainer>
  );
};
```

> You can use sendbird sdk using `useSendbirdChat()` hook, and you can connect or disconnect using `useConnection()` hook.
> for more details about hooks, please refer to our [docs](https://sendbird.com/docs/uikit/v3/react-native/core-components/hooks)
