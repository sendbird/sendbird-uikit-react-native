import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { FilePickerService, GetTranslucent, NotificationService, RootStack, SendBirdInstance } from './factory';
import { Routes } from './hooks/useAppNavigation';
import useAppearance from './hooks/useAppearance';
import {
  GroupChannelScreen,
  GroupChannelTabs,
  HomeScreen,
  InviteMembersScreen,
  PaletteScreen,
  StorybookScreen,
  ThemeColorsScreen,
} from './screens';

const App = () => {
  const { scheme } = useAppearance();
  const isLightTheme = scheme === 'light';

  return (
    <SendbirdUIKitContainer
      chat={{ sdkInstance: SendBirdInstance }}
      services={{ filePicker: FilePickerService, notification: NotificationService }}
      styles={{
        defaultHeaderTitleAlign: 'left', //'center',
        theme: isLightTheme ? LightUIKitTheme : DarkUIKitTheme,
        statusBarTranslucent: GetTranslucent(),
      }}
    >
      <NavigationContainer theme={isLightTheme ? DefaultTheme : DarkTheme}>
        <RootStack.Navigator>
          <RootStack.Screen name={Routes.Home} component={HomeScreen} />
          {/*<RootStack.Screen name={Routes.Storybook} component={StorybookScreen} />*/}
          <RootStack.Screen name={Routes.ThemeColors} component={ThemeColorsScreen} />
          <RootStack.Screen name={Routes.Palette} component={PaletteScreen} />

          <RootStack.Screen
            options={{ headerShown: false }}
            name={Routes.GroupChannelTabs}
            component={GroupChannelTabs}
          />
          <RootStack.Screen name={Routes.GroupChannel} component={GroupChannelScreen} />
          <RootStack.Screen name={Routes.InviteMembers} component={InviteMembersScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </SendbirdUIKitContainer>
  );
};

export default App;
