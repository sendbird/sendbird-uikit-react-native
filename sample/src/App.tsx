import Notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';

import { SendbirdUIKitContainer, useSendbirdChat } from '@sendbird/uikit-react-native';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';

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
import { Routes, navigationRef } from './libs/navigation';
import { onForegroundAndroid, onForegroundIOS } from './libs/notification';
import {
  ErrorInfoScreen,
  GroupChannelCreateScreen,
  GroupChannelInviteScreen,
  GroupChannelMembersScreen,
  GroupChannelScreen,
  GroupChannelSettingsScreen,
  GroupChannelTabs,
  HomeScreen,
  PaletteScreen,
  SignInScreen,
  StorybookScreen,
  ThemeColorsScreen,
} from './screens';
import FileViewerScreen from './screens/uikit-app/FileViewerScreen';

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
    >
      <Navigations />
    </SendbirdUIKitContainer>
  );
};

const Navigations = () => {
  const { currentUser } = useSendbirdChat();
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  useEffect(() => {
    Notifee.setBadgeCount(0);
    const unsubscribes = [onForegroundAndroid(), onForegroundIOS()];
    return () => {
      unsubscribes.forEach((fn) => fn());
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={isLightTheme ? DefaultTheme : DarkTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <RootStack.Screen name={Routes.SignIn} component={SignInScreen} />
        ) : (
          <>
            <RootStack.Screen name={Routes.Home} component={HomeScreen} />

            <RootStack.Screen name={Routes.GroupChannelTabs} component={GroupChannelTabs} />
            <RootStack.Screen name={Routes.GroupChannel} component={GroupChannelScreen} />
            <RootStack.Screen name={Routes.GroupChannelSettings} component={GroupChannelSettingsScreen} />
            <RootStack.Screen name={Routes.GroupChannelCreate} component={GroupChannelCreateScreen} />
            <RootStack.Screen name={Routes.GroupChannelInvite} component={GroupChannelInviteScreen} />
            <RootStack.Screen name={Routes.GroupChannelMembers} component={GroupChannelMembersScreen} />

            <RootStack.Group screenOptions={{ presentation: 'transparentModal', headerShown: false }}>
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
