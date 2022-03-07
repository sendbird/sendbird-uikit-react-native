import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import SendBird from 'sendbird';

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { createFilePickerServiceNative } from '@sendbird/uikit-react-native-core';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';
import type { SendbirdChatSDK } from '@sendbird/uikit-utils';

import { APP_ID } from './env';
import { Routes } from './hooks/useAppNavigation';
import useAppearance from './hooks/useAppearance';
import { GroupChannelTabs, HomeScreen, InviteMembersScreen, PaletteScreen, ThemeColorsScreen } from './screens';

Platform.OS === 'android' && StatusBar.setTranslucent(true);
const sdkInstance = new SendBird({ appId: APP_ID }) as SendbirdChatSDK;
const filePicker = createFilePickerServiceNative(ImagePicker, Permissions);
const RootStack = createNativeStackNavigator();

const App = () => {
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  return (
    <SendbirdUIKitContainer
      chat={{ sdkInstance }}
      services={{ filePicker, notification: {} as any }}
      styles={{
        theme: isLightTheme ? LightUIKitTheme : DarkUIKitTheme,
        statusBarTranslucent: Platform.select({ ios: true, android: true }),
      }}
    >
      <NavigationContainer theme={isLightTheme ? DefaultTheme : DarkTheme}>
        <RootStack.Navigator>
          <RootStack.Screen name={Routes.Home} component={HomeScreen} />
          <RootStack.Screen name={Routes.Storybook} component={StorybookScreen} />
          <RootStack.Screen name={Routes.ThemeColors} component={ThemeColorsScreen} />
          <RootStack.Screen name={Routes.Palette} component={PaletteScreen} />

          <RootStack.Screen
            options={{ headerShown: false }}
            name={Routes.GroupChannelTabs}
            component={GroupChannelTabs}
          />
          <RootStack.Screen name={Routes.InviteMembers} component={InviteMembersScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SendbirdUIKitContainer>
  );
};

const StorybookScreen = () => {
  const [screen, setScreen] = useState<JSX.Element | null>(null);
  useEffect(() => {
    const StorybookUI = require('../stories').default;
    setScreen(<StorybookUI />);
  }, []);
  return <>{screen}</>;
};

export default App;
