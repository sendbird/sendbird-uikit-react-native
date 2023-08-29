import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';

import useUIKitTheme from '../../theme/useUIKitTheme';
import Box from '../Box';

type Props = {
  current: number;
  total: number;
  trackColor?: string;
  barColor?: string;
  overlay?: ReactNode | undefined;
  style?: ViewStyle;
};
const ProgressBar = ({ current = 100, total = 100, trackColor, barColor, overlay, style }: Props) => {
  const { colors } = useUIKitTheme();

  const uiColors = {
    track: trackColor ?? colors.primary,
    bar: barColor ?? colors.onBackground01,
  };

  const progress = useRef(new Animated.Value(0)).current;
  const percent = current / total;

  useEffect(() => {
    if (Number.isNaN(percent)) return;

    const animation = Animated.timing(progress, {
      toValue: percent,
      duration: 100,
      useNativeDriver: false,
      easing: Easing.linear,
    });

    animation.start();
    return () => {
      animation.stop();
    };
  }, [percent]);

  const getInterpolate = () => {
    const width = style?.minWidth ?? style?.width ?? style?.maxWidth ?? '100%';
    return progress.interpolate({
      inputRange: [0, 1],
      outputRange: typeof width === 'number' ? [0, width] : ['0%', width],
      extrapolate: 'clamp',
    });
  };

  return (
    <Box
      height={36}
      flexDirection={'row'}
      backgroundColor={uiColors.track}
      alignItems={'center'}
      overflow={'hidden'}
      style={style}
    >
      <Animated.View
        style={{
          width: getInterpolate(),
          height: '100%',
          opacity: 0.38,
          backgroundColor: uiColors.bar,
        }}
      />
      <Box style={StyleSheet.absoluteFill}>{overlay}</Box>
    </Box>
  );
};

export default ProgressBar;
