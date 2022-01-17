/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import Sendbird, {chatReactHooksMultiply} from '@sendbird/chat-react-hooks';
import {UIKitThemeProvider} from '@sendbird/uikit-react-native';

const useMultiply = (a: number, b: number) => {
  const [number, setNumber] = useState(0);
  useEffect(() => {
    chatReactHooksMultiply(a, b).then(setNumber);
  }, [a, b]);

  return number;
};
const App = () => {
  const number = useMultiply(12, 23);
  return (
    <SafeAreaView style={{flex: 1}}>
      <UIKitThemeProvider appearance={'light'}>
        <Text>{'Hello world - ' + number}</Text>
        <Text>{Sendbird.getLogLevel()}</Text>
      </UIKitThemeProvider>
    </SafeAreaView>
  );
};

export default App;
