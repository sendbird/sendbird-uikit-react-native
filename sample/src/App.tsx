/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import React from 'react';
import { SafeAreaView, Text } from 'react-native';

import { DarkUIKitTheme, UIKitThemeProvider } from '@sendbird/uikit-react-native';

const App = () => {
  return (
    <UIKitThemeProvider value={DarkUIKitTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text>{'Hello world - '}</Text>
      </SafeAreaView>
    </UIKitThemeProvider>
  );
};

export default App;
