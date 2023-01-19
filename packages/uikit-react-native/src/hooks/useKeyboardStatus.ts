import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, KeyboardEventName, LayoutAnimation, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NOOP } from '@sendbird/uikit-utils';

type KeyboardEvents = {
  showEvent: KeyboardEventName;
  hideEvent: KeyboardEventName;
};

let isLayoutAnimationConfigured = false;

const configureNextLayoutAnimation = (event: KeyboardEvent) => {
  if (isLayoutAnimationConfigured) return;
  const config = LayoutAnimation.create(event.duration, event.easing, LayoutAnimation.Properties.scaleY);
  isLayoutAnimationConfigured = true;
  const onEnd = () => (isLayoutAnimationConfigured = false);
  LayoutAnimation.configureNext(config, onEnd, onEnd);
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
        const nextLayoutAnimation = Platform.select({ ios: configureNextLayoutAnimation, default: NOOP });

        nextLayoutAnimation(event);
        setKeyboardStatus({ visible: true, height, bottomSpace });
      }),

      Keyboard.addListener(hideEvent, () => {
        const height = 0;
        const bottomSpace = Platform.select({ default: height });
        // const nextLayoutAnimation = Platform.select({ ios: configureNextLayoutAnimation, default: NOOP });

        // nextLayoutAnimation(event);
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
