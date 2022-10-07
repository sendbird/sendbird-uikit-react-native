import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type SwitchProps = React.PropsWithChildren<{
  trackColor?: string;
  thumbColor?: string;
  inactiveThumbColor?: string;
  inactiveTrackColor?: string;

  value: boolean;
  onChangeValue: (val: boolean) => void;
}>;
const Switch = ({
  value,
  onChangeValue,
  inactiveThumbColor,
  inactiveTrackColor,
  trackColor,
  thumbColor,
}: SwitchProps) => {
  const { select, palette, colors } = useUIKitTheme();
  const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(position, {
      toValue: value ? styles.thumbOn.left : styles.thumbOff.left,
      duration: 150,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [value]);

  const createInterpolate = <T extends string>(offValue: T, onValue: T) => {
    return position.interpolate({
      inputRange: [styles.thumbOff.left, styles.thumbOn.left],
      outputRange: [offValue, onValue],
      extrapolate: 'clamp',
    });
  };
  const _trackColor = createInterpolate(inactiveTrackColor ?? colors.onBackground04, trackColor ?? palette.primary200);
  const _thumbColor = createInterpolate(
    inactiveThumbColor ?? palette.background300,
    thumbColor ?? select({ light: palette.primary400, dark: palette.primary300 }),
  );

  return (
    <Pressable onPress={() => onChangeValue(!value)} style={[styles.container]}>
      <Animated.View style={[styles.track, { backgroundColor: _trackColor }]} />
      <Animated.View style={[styles.thumb, { backgroundColor: _thumbColor, transform: [{ translateX: position }] }]} />
    </Pressable>
  );
};

const OFFSET = { W: 20, H: 16 };
const styles = createStyleSheet({
  container: {
    width: OFFSET.W + OFFSET.H,
    height: OFFSET.H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: '100%',
    borderRadius: OFFSET.H / 2,
    position: 'absolute',
  },
  thumb: {
    width: OFFSET.W,
    height: OFFSET.W,
    borderRadius: OFFSET.W / 2,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: 'black',
        shadowRadius: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
      },
    }),
  },
  thumbOn: {
    left: OFFSET.H / 2,
  },
  thumbOff: {
    left: -OFFSET.H / 2,
  },
});

export default Switch;
