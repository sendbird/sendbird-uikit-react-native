import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import CameraRoll from '@react-native-community/cameraroll';
import RNFBMessaging from '@react-native-firebase/messaging';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import * as CreateThumbnail from 'react-native-create-thumbnail';
import * as DocumentPicker from 'react-native-document-picker';
import * as FileAccess from 'react-native-file-access';
import * as ImagePicker from 'react-native-image-picker';
import * as Permissions from 'react-native-permissions';
import Video from 'react-native-video';

import {
  SendbirdUIKitContainer,
  createGroupChannelCreateFragment,
  createGroupChannelFragment,
  createGroupChannelListFragment,
  createNativeClipboardService,
  createNativeFileService,
  createNativeMediaService,
  createNativeNotificationService,
  useConnection,
  useSendbirdChat,
} from '@sendbird/uikit-react-native';

/**
 * Implement platform service interfaces using native modules
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-4-implement-platform-service-interfaces-using-native-modules}
 * */
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
});
/** ------------------ **/

/**
 * Wrap your app in SendbirdUIKitContainer
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-5-wrap-your-app-in-sendbirduikitcontainer}
 * */
// TODO: APP_ID to string
const App = () => {
  return (
    <SendbirdUIKitContainer
      appId={APP_ID}
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
//TODO: import useSendbirdChat
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
        // Navigate to GroupChannel function.
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
        // Navigate to GroupChannelList function.
        navigation.navigate('GroupChannelList');
      }}
      onPressHeaderLeft={() => {
        // Go back to the previous screen.
        navigation.goBack();
      }}
      onPressHeaderRight={() => {
        // Navigate to GroupChannelSettings function.
        navigation.navigate('GroupChannelSettings', {
          serializedChannel: params.serializedChannel,
        });
      }}
    />
  );
};
/** ------------------ **/

/**
 * Register navigation library to the screen
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-8-register-navigation-library-to-the-screen}
 * */
// TODO: APP_ID to string
// TODO: import NavigationContainer
// TODO: remove import useConnection
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
      appId={APP_ID}
      chatOptions={{ localCacheStorage: AsyncStorage }}
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
/** ------------------ **/

/**
 * Connect to the Sendbird server
 * {@link https://sendbird.com/docs/uikit/v3/react-native/introduction/send-first-message#2-get-started-3-step-9-connect-to-the-sendbird-server}
 * */
// TODO: import useConnection
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
