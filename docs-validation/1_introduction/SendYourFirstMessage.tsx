import React from 'react';

/**
 * Implement platform service interfaces using native modules
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-4-implement-platform-service-interfaces-using-native-modules}
 * */
import {
  createNativeClipboardService,
  createNativeFileService,
  createNativeMediaService,
  createNativeNotificationService,
} from '@sendbird/uikit-react-native';

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

const ClipboardService = createNativeClipboardService(Clipboard);
const NotificationService = createNativeNotificationService({
  messagingModule: RNFBMessaging,
  permissionModule: Permissions,
});
const FileService = createNativeFileService({
  fsModule: FileAccess,
  permissionModule: Permissions,
  imagePickerModule: ImagePicker,
  mediaLibraryModule: CameraRoll,
  documentPickerModule: DocumentPicker,
});
const MediaService = createNativeMediaService({
  VideoComponent: Video,
  thumbnailModule: CreateThumbnail,
  imageResizerModule: ImageResizer,
});
/** ------------------ **/

/**
 * Wrap your app in SendbirdUIKitContainer
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-5-wrap-your-app-in-sendbirduikitcontainer}
 * */
import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  return (
    <SendbirdUIKitContainer
      appId={'APP_ID'}
      chatOptions={{ localCacheStorage: AsyncStorage }}
      platformServices={{
        file: FileService,
        notification: NotificationService,
        clipboard: ClipboardService,
        media: MediaService,
      }}
    >
      {/* Rest of your app */}
    </SendbirdUIKitContainer>
  );
};
/** ------------------ **/

/**
 * Create a fragment and module components
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-7-create-a-fragment-and-module-components}
 * */
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGroupChannel } from '@sendbird/uikit-chat-hooks';
import {
  useSendbirdChat,
  createGroupChannelListFragment,
  createGroupChannelCreateFragment,
  createGroupChannelFragment,
} from '@sendbird/uikit-react-native';

const GroupChannelListFragment = createGroupChannelListFragment();
const GroupChannelCreateFragment = createGroupChannelCreateFragment();
const GroupChannelFragment = createGroupChannelFragment();

const GroupChannelListScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <GroupChannelListFragment
      onPressCreateChannel={(channelType) => {
        // Navigate to GroupChannelCreate function.
        navigation.navigate('GroupChannelCreate', { channelType });
      }}
      onPressChannel={(channel) => {
        // Navigate to GroupChannel function.
        navigation.navigate('GroupChannel', { channelUrl: channel.url });
      }}
    />
  );
};

const GroupChannelCreateScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <GroupChannelCreateFragment
      onCreateChannel={async (channel) => {
        // Navigate to GroupChannel function.
        navigation.replace('GroupChannel', { channelUrl: channel.url });
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
  const { channel } = useGroupChannel(sdk, params.channelUrl);
  if (!channel) return null;

  return (
    <GroupChannelFragment
      channel={channel}
      onChannelDeleted={() => {
        // Navigate to GroupChannelList function.
        navigation.navigate('GroupChannelList');
      }}
      onPressHeaderLeft={() => {
        // Go back to the previous screen.
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to GroupChannelSettings function.
        navigation.navigate('GroupChannelSettings', { channelUrl: params.channelUrl });
      }}
    />
  );
};
/** ------------------ **/

/**
 * Register navigation library to the screen
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-8-register-navigation-library-to-the-screen}
 * */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator();
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

const App2 = () => {
  return (
    <SendbirdUIKitContainer
      appId={'APP_ID'}
      chatOptions={{ localCacheStorage: AsyncStorage }}
      platformServices={{
        file: FileService,
        notification: NotificationService,
        clipboard: ClipboardService,
        media: MediaService,
      }}
    >
      <Navigation />
    </SendbirdUIKitContainer>
  );
};
/** ------------------ **/

/**
 * Connect to the Sendbird server
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-9-connect-to-the-sendbird-server}
 * */
import { Pressable, Text, View } from 'react-native';
import { useConnection } from '@sendbird/uikit-react-native';

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
/** ------------------ **/
