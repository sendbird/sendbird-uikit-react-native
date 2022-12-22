import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, KeyboardEventName, LayoutAnimation, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type KeyboardEvents = {
  showEvent: KeyboardEventName;
  hideEvent: KeyboardEventName;
};

const getNextConfigFrom = (event: KeyboardEvent) => {
  return LayoutAnimation.create(event.duration, event.easing);
};

const { showEvent, hideEvent } = Platform.select<KeyboardEvents>({
  android: { showEvent: 'keyboardDidShow', hideEvent: 'keyboardDidHide' },
  default: { showEvent: 'keyboardWillShow', hideEvent: 'keyboardWillHide' },
});

const useKeyboardStatus = () => {
  const [keyboardStatus, setKeyboardStatus] = useState({ visible: false, height: 0, bottomSpace: 0 });
  const { bottom: bottomInset } = useSafeAreaInsets();

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener(showEvent, (event) => {
        const height = event.endCoordinates.height;
        const bottomSpace = Platform.select({ ios: height - bottomInset, default: 0 });

        Platform.OS === 'ios' && LayoutAnimation.configureNext(getNextConfigFrom(event));
        setKeyboardStatus({ visible: true, height, bottomSpace });
      }),

      Keyboard.addListener(hideEvent, (event) => {
        const height = 0;
        const bottomSpace = Platform.select({ default: height });

        Platform.OS === 'ios' && LayoutAnimation.configureNext(getNextConfigFrom(event));
        setKeyboardStatus({ visible: false, height, bottomSpace });
      }),
    ];
    return () => {
      subscriptions.forEach((it) => it.remove());
    };
  }, []);

  return keyboardStatus;
};

export default useKeyboardStatus;
