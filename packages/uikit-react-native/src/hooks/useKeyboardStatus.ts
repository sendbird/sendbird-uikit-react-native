import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

const useKeyboardStatus = () => {
  const [keyboardStatus, setKeyboardStatus] = useState({ visible: false, height: 0 });

  useEffect(() => {
    const subscriptions = [
      Keyboard.addListener(Platform.select({ android: 'keyboardDidShow', default: 'keyboardWillShow' }), (e) =>
        setKeyboardStatus({ visible: true, height: e.endCoordinates.height }),
      ),
      Keyboard.addListener(Platform.select({ android: 'keyboardDidHide', default: 'keyboardWillHide' }), () =>
        setKeyboardStatus({ visible: false, height: 0 }),
      ),
    ];
    return () => {
      subscriptions.forEach((it) => it.remove());
    };
  }, []);

  return keyboardStatus;
};

export default useKeyboardStatus;
