import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ViewStyle } from 'react-native';

import { NOOP } from '@sendbird/uikit-utils';

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
  const stopped = percent === 0;

  useEffect(() => {
    if (!Number.isNaN(percent)) {
      const animation = Animated.timing(progress, {
        toValue: stopped ? 0 : percent,
        duration: stopped ? 0 : 100,
        useNativeDriver: false,
        easing: Easing.linear,
      });

      animation.start();
      return () => animation.stop();
    }

    return NOOP;
  }, [percent]);

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
          position: 'absolute',
          width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }),
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
