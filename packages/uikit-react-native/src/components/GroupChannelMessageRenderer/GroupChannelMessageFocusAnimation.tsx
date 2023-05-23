import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { MESSAGE_FOCUS_ANIMATION_DELAY, MESSAGE_SEARCH_SAFE_SCROLL_DELAY } from '../../constants';

const GroupChannelMessageFocusAnimation = (props: React.PropsWithChildren<{ focused: boolean }>) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.focused) {
      setTimeout(() => {
        Animated.sequence(
          [
            { toValue: -10, duration: 500 },
            { toValue: 0, duration: 100 },
            { toValue: -10, duration: 200 },
            { toValue: 0, duration: 100 },
          ].map((value) =>
            Animated.timing(translateY, { ...value, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          ),
        ).start();
      }, MESSAGE_SEARCH_SAFE_SCROLL_DELAY + MESSAGE_FOCUS_ANIMATION_DELAY);
    }
  }, [props.focused]);

  return <Animated.View style={{ transform: [{ translateY }] }}>{props.children}</Animated.View>;
};

export default GroupChannelMessageFocusAnimation;
