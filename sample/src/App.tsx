import { DarkTheme, DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import SendBird from 'sendbird';

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { createFilePickerServiceNative, useConnection } from '@sendbird/uikit-react-native-core';
import { DarkUIKitTheme, LightUIKitTheme } from '@sendbird/uikit-react-native-foundation';

import { APP_ID, USER_ID } from './env';
import useAppearance from './hooks/useAppearance';
import * as themeScreens from './screens/theme';
import * as uikitScreens from './screens/uikit-app';

Platform.OS === 'android' && StatusBar.setTranslucent(false);
const Stack = createNativeStackNavigator();
const sdkInstance = new SendBird({ appId: APP_ID });
const App = () => {
  const appearance = useAppearance();
  const isLightTheme = appearance === 'light';
  const filePicker = createFilePickerServiceNative(ImagePicker, Permissions);

  return (
    <SendbirdUIKitContainer
      chat={{ sdkInstance }}
      services={{ filePicker, notification: {} as any }}
      styles={{
        theme: isLightTheme ? LightUIKitTheme : DarkUIKitTheme,
        statusBarTranslucent: Platform.select({ ios: true, android: false }),
      }}
    >
      <NavigationContainer theme={isLightTheme ? DefaultTheme : DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen name={'Home'} component={HomeScreen} />
          <Stack.Screen name={'Storybook'} component={StorybookScreen} />
          {[...Object.entries(themeScreens), ...Object.entries(uikitScreens)].map(([name, screen]) => (
            <Stack.Screen key={name} name={name} component={screen} />
          ))}
        </Stack.Navigator>
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

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<{ navigate: (route: string) => void }>();
  const { connect } = useConnection();

  const onNavigateToApp = async () => {
    await connect(USER_ID);
    navigation.navigate('GroupChannelListScreen');
  };

  return (
    <SafeAreaView>
      <ScrollView style={{ paddingVertical: 12 }}>
        <TouchableOpacity style={styles.btn} onPress={onNavigateToApp}>
          <Text style={styles.btnTitle}>{'APP_Sample'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Storybook')}>
          <Text style={styles.btnTitle}>{'APP_Storybook'}</Text>
        </TouchableOpacity>

        {Object.entries(themeScreens).map(([name]) => {
          return (
            <TouchableOpacity key={name} style={styles.btn} onPress={() => navigation.navigate(name)}>
              <Text style={styles.btnTitle}>{'TEMPLATE_' + name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '90%',
    backgroundColor: '#68a8ff',
    alignSelf: 'center',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 12,
  },
  btnTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default App;
