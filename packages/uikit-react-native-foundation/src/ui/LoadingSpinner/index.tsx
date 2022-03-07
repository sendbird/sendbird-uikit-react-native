import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

import useUIKitTheme from '../../theme/useUIKitTheme';
import Icon from '../Icon';

type Props = {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const LoadingSpinner: React.FC<Props> = ({ size = 24, color, style }) => {
  const { colors } = useUIKitTheme();
  return (
    <Rotate style={style}>
      <Icon icon={'spinner'} size={size} color={color ?? colors.primary} />
    </Rotate>
  );
};

const useLoopAnimated = (duration: number, useNativeDriver = true) => {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animated, { toValue: 1, duration, useNativeDriver, easing: Easing.inOut(Easing.linear) }),
      { resetBeforeIteration: true },
    ).start();

    return () => {
      animated.stopAnimation();
      animated.setValue(0);
    };
  }, []);

  return animated;
};

const Rotate: React.FC<{ style: StyleProp<ViewStyle> }> = ({ children, style }) => {
  const loop = useLoopAnimated(1000);
  const rotate = loop.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View style={[style, { transform: [{ rotate }] }]}>{children}</Animated.View>;
};

export default LoadingSpinner;
