import { DarkTheme, DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { DarkUIKitTheme, LightUIKitTheme, UIKitThemeProvider } from '@sendbird/uikit-react-native';

import StorybookUIRoot from '../storybook';
import useAppearance from './hooks/useAppearance';
import * as screens from './screens';

const screenMap = Object.entries(screens);
const Stack = createNativeStackNavigator();

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<{ navigate: (route: string) => void }>();
  return (
    <SafeAreaView>
      <ScrollView style={{ paddingVertical: 12 }}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Storybook')}>
          <Text style={styles.btnTitle}>{'Storybook'}</Text>
        </TouchableOpacity>
        {screenMap.map(([name]) => {
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
  return (
    <NavigationContainer theme={isLightTheme ? DefaultTheme : DarkTheme}>
      <UIKitThemeProvider theme={isLightTheme ? LightUIKitTheme : DarkUIKitTheme}>
        <Stack.Navigator>
          <Stack.Screen name={'Home'} component={HomeScreen} />
          <Stack.Screen name={'Storybook'} component={StorybookUIRoot} />

          {screenMap.map(([name, screen]) => {
            return <Stack.Screen key={name} name={name} component={screen} />;
          })}
        </Stack.Navigator>
      </UIKitThemeProvider>
    </NavigationContainer>
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
