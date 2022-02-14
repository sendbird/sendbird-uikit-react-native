import { DarkTheme, DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';

import { DarkUIKitTheme, LightUIKitTheme, SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { createFilePickerServiceNative, useConnection } from '@sendbird/uikit-react-native-core';

import StorybookUIRoot from '../stories';
import { APP_ID, USER_ID } from './env';
import useAppearance from './hooks/useAppearance';
import * as themeScreens from './screens/theme';
import * as uikitScreens from './screens/uikit-app';

const Stack = createNativeStackNavigator();

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<{ navigate: (route: string) => void }>();
  const { connect } = useConnection();
  return (
    <SafeAreaView>
      <ScrollView style={{ paddingVertical: 12 }}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Storybook')}>
          <Text style={styles.btnTitle}>{'Storybook'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            await connect(USER_ID);
            navigation.navigate('GroupChannelListScreen');
          }}
        >
          <Text style={styles.btnTitle}>{'UIKit App'}</Text>
        </TouchableOpacity>

        {Object.entries(themeScreens).map(([name]) => {
          return (
            <TouchableOpacity key={name} style={styles.btn} onPress={() => navigation.navigate(name)}>
              <Text style={styles.btnTitle}>{name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const App = () => {
  const appearance = useAppearance();
  const isLightTheme = appearance === 'light';
  const filePicker = createFilePickerServiceNative(ImagePicker, Permissions);

  return (
    <SendbirdUIKitContainer
      appId={APP_ID}
      services={{ filePicker, notification: {} as any }}
      theme={isLightTheme ? LightUIKitTheme : DarkUIKitTheme}
    >
      <NavigationContainer theme={isLightTheme ? DefaultTheme : DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen name={'Home'} component={HomeScreen} />
          <Stack.Screen name={'Storybook'} component={StorybookUIRoot} />

          {Object.entries(themeScreens).map(([name, screen]) => {
            return <Stack.Screen key={name} name={name} component={screen} />;
          })}
          {Object.entries(uikitScreens).map(([name, screen]) => {
            return <Stack.Screen key={name} name={name} component={screen} />;
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </SendbirdUIKitContainer>
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
