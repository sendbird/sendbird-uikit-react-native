import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

import { useIsFirstMount } from '@sendbird/uikit-utils';

import { MESSAGE_FOCUS_ANIMATION_DELAY, MESSAGE_SEARCH_SAFE_SCROLL_DELAY } from '../../constants';

const GroupChannelMessageFocusAnimation = (props: React.PropsWithChildren<{ focused: boolean }>) => {
  const isFirstMount = useIsFirstMount();
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.focused) {
      const delay = MESSAGE_FOCUS_ANIMATION_DELAY + (isFirstMount ? MESSAGE_SEARCH_SAFE_SCROLL_DELAY : 0);
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
      }, delay);
    }
  }, [props.focused]);

  return <Animated.View style={{ transform: [{ translateY }] }}>{props.children}</Animated.View>;
};

export default GroupChannelMessageFocusAnimation;
