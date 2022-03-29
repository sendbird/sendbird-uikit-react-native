import Notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { useSendbirdChat } from '@sendbird/uikit-react-native-core/src/contexts/SendbirdChat';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import { Logger, isSendbirdNotification, parseSendbirdNotification } from '@sendbird/uikit-utils';

import {
  ClipboardService,
  FileService,
  GetTranslucent,
  NotificationService,
  RootStack,
  SendBirdInstance,
} from './factory';
import useAppearance from './hooks/useAppearance';
import { Routes, navigationRef } from './libs/navigation';
import { onNotificationEvent } from './libs/notification';
import {
  GroupChannelCreateScreen,
  GroupChannelInfoScreen,
  GroupChannelInviteScreen,
  GroupChannelScreen,
  GroupChannelTabs,
  HomeScreen,
  PaletteScreen,
  SignInScreen,
  ThemeColorsScreen,
} from './screens';

const App = () => {
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  return (
    <SendbirdUIKitContainer
      chat={{ sdkInstance: SendBirdInstance }}
      services={{ file: FileService, notification: NotificationService, clipboard: ClipboardService }}
      styles={{
        defaultHeaderTitleAlign: 'left', //'center',
        theme: isLightTheme ? LightUIKitTheme : DarkUIKitTheme,
        statusBarTranslucent: GetTranslucent(),
      }}
    >
      <Navigations />
    </SendbirdUIKitContainer>
  );
};

const Navigations = () => {
  const { currentUser, sdk } = useSendbirdChat();
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  useEffect(() => {
    const unsubscribes = [
      messaging().onMessage((message) => {
        Logger.log('onMessage');
        if (isSendbirdNotification(message.data)) {
          sdk.markAsDelivered(parseSendbirdNotification(message.data).channel.channel_url);
        }
      }),
      Notifee.onForegroundEvent(onNotificationEvent),
    ];

    return () => {
      unsubscribes.forEach((fn) => fn());
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={isLightTheme ? DefaultTheme : DarkTheme}>
      <RootStack.Navigator>
        {!currentUser ? (
          <RootStack.Screen options={{ headerShown: false }} name={Routes.SignIn} component={SignInScreen} />
        ) : (
          <>
            <RootStack.Screen options={{ headerShown: false }} name={Routes.Home} component={HomeScreen} />

            <RootStack.Screen
              options={{ headerShown: false }}
              name={Routes.GroupChannelTabs}
              component={GroupChannelTabs}
            />
            <RootStack.Screen name={Routes.GroupChannel} component={GroupChannelScreen} />
            <RootStack.Screen name={Routes.GroupChannelInfo} component={GroupChannelInfoScreen} />
            <RootStack.Screen name={Routes.GroupChannelCreate} component={GroupChannelCreateScreen} />
            <RootStack.Screen name={Routes.GroupChannelInvite} component={GroupChannelInviteScreen} />

            <RootStack.Screen name={Routes.ThemeColors} component={ThemeColorsScreen} />
            <RootStack.Screen name={Routes.Palette} component={PaletteScreen} />
            {/*<RootStack.Screen name={Routes.Storybook} component={StorybookScreen} />*/}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
