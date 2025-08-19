import Notifee from '@notifee/react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import { AppState } from 'react-native';

import { SendbirdUIKitContainer, TypingIndicatorType, useSendbirdChat } from '@sendbird/uikit-react-native';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { UIKitLocalConfigsContext } from './context/uikitLocalConfigs';
// import LogView from './components/LogView';
import { APP_ID } from './env';
import { GetTranslucent, RootStack, SetSendbirdSDK, platformServices } from './factory';
import { mmkv } from './factory/mmkv';
import useAppearance from './hooks/useAppearance';
import { Routes, navigationActions, navigationRef } from './libs/navigation';
import { notificationHandler } from './libs/notification';
import {
  ErrorInfoScreen,
  GroupChannelBannedUsersScreen,
  GroupChannelCreateScreen,
  GroupChannelInviteScreen,
  GroupChannelMembersScreen,
  GroupChannelModerationScreen,
  GroupChannelMutedMembersScreen,
  GroupChannelNotificationsScreen,
  GroupChannelOperatorsScreen,
  GroupChannelRegisterOperatorScreen,
  GroupChannelScreen,
  GroupChannelSettingsScreen,
  GroupChannelTabs,
  GroupChannelThreadScreen,
  HomeScreen,
  MessageSearchScreen,
  OpenChannelBannedUsersScreen,
  OpenChannelCreateScreen,
  OpenChannelLiveStreamScreen,
  OpenChannelModerationScreen,
  OpenChannelMutedParticipantsScreen,
  OpenChannelOperatorsScreen,
  OpenChannelParticipantsScreen,
  OpenChannelRegisterOperatorScreen,
  OpenChannelScreen,
  OpenChannelSettingsScreen,
  OpenChannelTabs,
  PaletteScreen,
  SignInScreen,
  StorybookScreen,
  ThemeColorsScreen,
  UIKitConfigsScreen,
} from './screens';
import FileViewerScreen from './screens/uikit/FileViewerScreen';
import { LogLevel } from '@sendbird/chat';
import { searchMessagesFromBlocks, findMessageById, findChildren } from './mmkvSendbirdMessageSearch';

const App = () => {
  const { localConfigs } = useContext(UIKitLocalConfigsContext);
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  const allKeys = mmkv.getAllKeys();
  //console.log('MMKV Keys:', allKeys);

  // const list = searchMessagesFromBlocks(mmkv, allKeys, {
  //   fromCreatedAt: 1748999000000,
  //   toCreatedAt: 1749000599999,
  //   //channelUrl: 'sendbird_group_channel_190372032_e6381bb65e31f97e21e4a7dfb386cf1625056db8',
  // });
  //console.log('list', list);

  // const message = findMessageById(mmkv, allKeys, 8193322113);
  // console.log('message', message);

// messageId로 단건
  //const one = findMessageById(mmkv, keys, 1234567890, 'sendbird_group_channel_...');


// 키별 값 확인
//   const key = "sendbird@A41EC43B-87A9-40CF-92C5-E178DD0477B1/star1.db/nest@sendbird@A41EC43B-87A9-40CF-92C5-E178DD0477B1/star1.db/Message/index.messageId.0";
//   console.log(`${key} = ${mmkv.getString(key)}`);
//
//   const key1 = "sendbird@A41EC43B-87A9-40CF-92C5-E178DD0477B1/Star1.db/sendbird:Star1@groupchannel/sendbird_group_channel_190372032_e6381bb65e31f97e21e4a7dfb386cf1625056db8/message/sync.meta.0";
//   console.log(`${key1} = ${mmkv.getString(key1)}`);
//
//   const key2 = "sendbird@A41EC43B-87A9-40CF-92C5-E178DD0477B1/Star1.db/sendbird:Star1@groupchannel/sendbird_group_channel_190372032_e6381bb65e31f97e21e4a7dfb386cf1625056db8/message/changelogs.meta.0";
//   console.log(`${key2} = ${mmkv.getString(key2)}`);

  //   const key = "sendbird@A41EC43B-87A9-40CF-92C5-E178DD0477B1/star1.db/nest@sendbird@A41EC43B-87A9-40CF-92C5-E178DD0477B1/star1.db/Message/block.2.173.0";
  // console.log(`${key} = ${mmkv.getString(key)}`);

  return (
    <SendbirdUIKitContainer
      appId={APP_ID}
      uikitOptions={{
        common: {
          enableUsingDefaultUserProfile: true,
        },
        groupChannel: {
          enableMention: true,
          typingIndicatorTypes: new Set([TypingIndicatorType.Text, TypingIndicatorType.Bubble]),
          replyType: localConfigs.replyType,
          threadReplySelectType: localConfigs.threadReplySelectType,
        },
        groupChannelList: {
          enableTypingIndicator: true,
          enableMessageReceiptStatus: true,
        },
        groupChannelSettings: {
          enableMessageSearch: true,
        },
      }}
      chatOptions={{
        localCacheEnabled: false,
        localCacheStorage: mmkv,
        onInitialized: SetSendbirdSDK,
        enableAutoPushTokenRegistration: true,
        logLevel: LogLevel.VERBOSE,
      }}
      platformServices={platformServices}
      styles={{
        defaultHeaderTitleAlign: 'left', //'center',
        theme: isLightTheme ? LightUIKitTheme : DarkUIKitTheme,
        statusBarTranslucent: GetTranslucent(),
      }}
      errorBoundary={{ ErrorInfoComponent: ErrorInfoScreen }}
      userProfile={{
        onCreateChannel: (channel) => {
          const params = { channelUrl: channel.url };

          if (channel.isGroupChannel()) {
            navigationActions.push(Routes.GroupChannel, params);
          }

          if (channel.isOpenChannel()) {
            navigationActions.push(Routes.OpenChannel, params);
          }
        },
      }}
    >
      <Navigations />
    </SendbirdUIKitContainer>
  );
};

const Navigations = () => {
  const { sdk, currentUser } = useSendbirdChat();
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  useEffect(() => {
    notificationHandler.startOnAppOpened();
    const unsubscribe = notificationHandler.startOnForeground();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const subscriber = AppState.addEventListener('change', async () => {
      const count = await sdk.groupChannel.getTotalUnreadMessageCount();
      Notifee.setBadgeCount(count);
    });
    return () => subscriber.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={isLightTheme ? DefaultTheme : DarkTheme}>
      {/*<LogView />*/}
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <RootStack.Screen name={Routes.SignIn} component={SignInScreen} />
        ) : (
          <>
            <RootStack.Screen name={Routes.Home} component={HomeScreen} />

            {/** Group channels **/}
            <RootStack.Group>
              <RootStack.Screen name={Routes.GroupChannelTabs} component={GroupChannelTabs} />
              <RootStack.Screen name={Routes.GroupChannel} component={GroupChannelScreen} />
              <RootStack.Group>
                <RootStack.Screen name={Routes.GroupChannelSettings} component={GroupChannelSettingsScreen} />
                <RootStack.Screen name={Routes.GroupChannelNotifications} component={GroupChannelNotificationsScreen} />
                <RootStack.Screen name={Routes.GroupChannelMembers} component={GroupChannelMembersScreen} />
                <RootStack.Screen name={Routes.GroupChannelModeration} component={GroupChannelModerationScreen} />
                <RootStack.Screen name={Routes.GroupChannelMutedMembers} component={GroupChannelMutedMembersScreen} />
                <RootStack.Screen name={Routes.GroupChannelBannedUsers} component={GroupChannelBannedUsersScreen} />
                <RootStack.Screen name={Routes.GroupChannelOperators} component={GroupChannelOperatorsScreen} />
                <RootStack.Screen
                  name={Routes.GroupChannelRegisterOperator}
                  component={GroupChannelRegisterOperatorScreen}
                />
                <RootStack.Screen name={Routes.GroupChannelThread} component={GroupChannelThreadScreen} />
              </RootStack.Group>
              <RootStack.Screen name={Routes.GroupChannelCreate} component={GroupChannelCreateScreen} />
              <RootStack.Screen name={Routes.GroupChannelInvite} component={GroupChannelInviteScreen} />
              <RootStack.Screen name={Routes.MessageSearch} component={MessageSearchScreen} />
            </RootStack.Group>

            {/** Open channels **/}
            <RootStack.Group>
              <RootStack.Screen name={Routes.OpenChannelTabs} component={OpenChannelTabs} />
              <RootStack.Screen name={Routes.OpenChannel} component={OpenChannelScreen} />
              <RootStack.Screen name={Routes.OpenChannelLiveStream} component={OpenChannelLiveStreamScreen} />
              <RootStack.Group>
                <RootStack.Screen name={Routes.OpenChannelSettings} component={OpenChannelSettingsScreen} />
                <RootStack.Screen name={Routes.OpenChannelParticipants} component={OpenChannelParticipantsScreen} />
                <RootStack.Screen name={Routes.OpenChannelModeration} component={OpenChannelModerationScreen} />
                <RootStack.Screen
                  name={Routes.OpenChannelMutedParticipants}
                  component={OpenChannelMutedParticipantsScreen}
                />
                <RootStack.Screen name={Routes.OpenChannelBannedUsers} component={OpenChannelBannedUsersScreen} />
                <RootStack.Screen name={Routes.OpenChannelOperators} component={OpenChannelOperatorsScreen} />
                <RootStack.Screen
                  name={Routes.OpenChannelRegisterOperator}
                  component={OpenChannelRegisterOperatorScreen}
                />
              </RootStack.Group>
              <RootStack.Screen name={Routes.OpenChannelCreate} component={OpenChannelCreateScreen} />
            </RootStack.Group>

            <RootStack.Group screenOptions={{ animation: 'slide_from_bottom', headerShown: false }}>
              <RootStack.Screen name={Routes.FileViewer} component={FileViewerScreen} />
            </RootStack.Group>

            <RootStack.Group screenOptions={{ headerShown: true }}>
              <RootStack.Screen name={Routes.UIKitConfigs} component={UIKitConfigsScreen} />
              <RootStack.Screen name={Routes.ThemeColors} component={ThemeColorsScreen} />
              <RootStack.Screen name={Routes.Palette} component={PaletteScreen} />
              <RootStack.Screen name={Routes.Storybook} component={StorybookScreen} />
            </RootStack.Group>
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

/**
 *
 * @example How to customize UIKit global navigation
 * ```
 * const ReactNavigationHeader: HeaderStyleContextType['HeaderComponent'] = ({
 *   title,
 *   right,
 *   left,
 *   onPressLeft,
 *   onPressRight,
 * }) => {
 *   const { navigation } = useAppNavigation();
 *   useEffect(() => {
 *     navigation.setOptions({
 *       headerShown: true,
 *       headerTitleAlign: 'center',
 *       headerBackVisible: false,
 *       headerTitle: () => (typeof title === 'string' ? <Text subtitle2>{title}</Text> : title),
 *       headerLeft: () => <Pressable onPress={onPressLeft}>{left}</Pressable>,
 *       headerRight: () => <Pressable onPress={onPressRight}>{right}</Pressable>,
 *     });
 *   }, [title, right, left, onPressLeft, onPressRight]);
 *   return null;
 * };
 *
 * const App = () => {
 *   return (
 *     <SendbirdUIKitContainer
 *       appId={APP_ID}
 *       styles={{ HeaderComponent: ReactNavigationHeader }}
 *     >
 *       <Navigations />
 *     </SendbirdUIKitContainer>
 *   );
 * };
 *
 * ```
 * */

/**
 * @example How to implement custom local cache storage
 * ```
 * import { MMKV } from 'react-native-mmkv';
 * import { LocalCacheStorage } from '@sendbird/uikit-react-native';
 *
 * const mmkvStorage = new MMKV();
 * const localCacheStorage: LocalCacheStorage = {
 *   async getAllKeys() {
 *     return mmkvStorage.getAllKeys();
 *   },
 *   async setItem(key: string, value: string) {
 *     return mmkvStorage.set(key, value);
 *   },
 *   async getItem(key: string) {
 *     return mmkvStorage.getString(key) ?? null;
 *   },
 *   async removeItem(key: string) {
 *     return mmkvStorage.delete(key);
 *   },
 * };
 *
 * const App = () => {
 *   return (
 *     <SendbirdUIKitContainer
 *       appId={APP_ID}
 *       chatOptions={{ localCacheStorage }}
 *     >
 *       <Navigations />
 *     </SendbirdUIKitContainer>
 *   );
 * };
 * ```
 * */

export default App;
