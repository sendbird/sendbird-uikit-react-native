import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import { SendbirdUIKitContainer } from '@sendbird/uikit-react-native';
import { Button, HeaderStyleContextType, Text } from '@sendbird/uikit-react-native-foundation';

const Analytics = { logError: (_: unknown) => 0 };

/**
 * HeaderComponent
 * {@link https://sendbird.com/docs/uikit/v3/react-native/customization/overview#2-sendbirduikitcontainer-3-headercomponent}
 * */
// TODO: import useNavigation, useEffect, Pressable, SendbirdUIKitContainer, Button, Text, React
const UseReactNavigationHeader: HeaderStyleContextType['HeaderComponent'] = ({
  title,
  right,
  left,
  onPressLeft,
  onPressRight,
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerTitle: () => (typeof title === 'string' ? <Text subtitle2>{title}</Text> : title),
      headerLeft: () => <Pressable onPress={onPressLeft}>{left}</Pressable>,
      headerRight: () => <Pressable onPress={onPressRight}>{right}</Pressable>,
    });
  }, [title, right, left, onPressLeft, onPressRight]);

  return null;
};

const App = () => {
  //@ts-ignore
  return <SendbirdUIKitContainer styles={{ HeaderComponent: UseReactNavigationHeader }} />;
};
/** ------------------ **/

/**
 * ErrorBoundary
 * {@link https://sendbird.com/docs/uikit/v3/react-native/customization/overview#2-sendbirduikitcontainer-3-errorboundary}
 * */
const App2 = () => {
  return (
    //@ts-ignore
    <SendbirdUIKitContainer
      errorBoundary={{
        onError: ({ error }) => {
          Analytics.logError(error);
        },
        ErrorInfoComponent: ({ error, reset }) => {
          return (
            <View>
              <Text>{error.message}</Text>
              <Button onPress={reset}>{'reset uikit'}</Button>
            </View>
          );
        },
      }}
    />
  );
};
/** ------------------ **/
