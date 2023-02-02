import Notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { AppState } from 'react-native';

import { SendbirdUIKitContainer, useSendbirdChat } from '@sendbird/uikit-react-native';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';

// import LogView from './components/LogView';
import { APP_ID } from './env';
import {
  ClipboardService,
  FileService,
  GetTranslucent,
  MediaService,
  NotificationService,
  RootStack,
  SetSendbirdSDK,
} from './factory';
import useAppearance from './hooks/useAppearance';
import { Routes, navigationActions, navigationRef } from './libs/navigation';
import { onForegroundAndroid, onForegroundIOS } from './libs/notification';
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
  HomeScreen,
  OpenChannelParticipantsScreen,
  OpenChannelScreen,
  OpenChannelTabs,
  PaletteScreen,
  SignInScreen,
  StorybookScreen,
  ThemeColorsScreen,
} from './screens';
import FileViewerScreen from './screens/uikit/FileViewerScreen';

const App = () => {
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  return (
    <SendbirdUIKitContainer
      appId={APP_ID}
      chatOptions={{
        localCacheStorage: AsyncStorage,
        onInitialized: SetSendbirdSDK,
        enableAutoPushTokenRegistration: true,
        enableChannelListTypingIndicator: true,
        enableChannelListMessageReceiptStatus: true,
        enableUserMention: true,
      }}
      platformServices={{
        file: FileService,
        notification: NotificationService,
        clipboard: ClipboardService,
        media: MediaService,
      }}
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
    const unsubscribes = [onForegroundAndroid(), onForegroundIOS()];
    return () => {
      unsubscribes.forEach((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const { remove } = AppState.addEventListener('change', async () => {
      const count = await sdk.groupChannel.getTotalUnreadMessageCount();
      Notifee.setBadgeCount(count);
    });
    return () => remove();
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
                <RootStack.Group>
                  <RootStack.Screen name={Routes.GroupChannelOperators} component={GroupChannelOperatorsScreen} />
                  <RootStack.Screen
                    name={Routes.GroupChannelRegisterOperator}
                    component={GroupChannelRegisterOperatorScreen}
                  />
                </RootStack.Group>
              </RootStack.Group>
              <RootStack.Screen name={Routes.GroupChannelCreate} component={GroupChannelCreateScreen} />
              <RootStack.Screen name={Routes.GroupChannelInvite} component={GroupChannelInviteScreen} />
            </RootStack.Group>

            {/** Open channels **/}
            <RootStack.Group>
              <RootStack.Screen name={Routes.OpenChannelTabs} component={OpenChannelTabs} />
              <RootStack.Screen name={Routes.OpenChannel} component={OpenChannelScreen} />
              <RootStack.Group>
                <RootStack.Screen name={Routes.OpenChannelParticipants} component={OpenChannelParticipantsScreen} />
              </RootStack.Group>
            </RootStack.Group>

            <RootStack.Group screenOptions={{ animation: 'slide_from_bottom', headerShown: false }}>
              <RootStack.Screen name={Routes.FileViewer} component={FileViewerScreen} />
            </RootStack.Group>

            <RootStack.Group screenOptions={{ headerShown: true }}>
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
 * const UseReactNavigationHeader: HeaderStyleContextType['HeaderComponent'] = ({
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
 *       styles={{
 *         HeaderComponent: UseReactNavigationHeader,
 *       }}
 *     >
 *       <Navigations />
 *     </SendbirdUIKitContainer>
 *   );
 * };
 *
 * ```
 * */

export default App;
