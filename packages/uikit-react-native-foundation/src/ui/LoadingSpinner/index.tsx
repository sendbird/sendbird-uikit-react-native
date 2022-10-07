import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

import Icon from '../../components/Icon';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const LoadingSpinner = ({ size = 24, color, style }: Props) => {
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

const Rotate = ({ children, style }: React.PropsWithChildren<{ style: StyleProp<ViewStyle> }>) => {
  const loop = useLoopAnimated(1000);
  const rotate = loop.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return <Animated.View style={[style, { transform: [{ rotate }] }]}>{children}</Animated.View>;
};

export default LoadingSpinner;
