import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, ViewStyle } from 'react-native';

import type { SendbirdUser } from '@sendbird/uikit-utils';

import Box from '../../components/Box';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Avatar from '../Avatar';

type Props = {
  typingUsers: SendbirdUser[];
  containerStyle?: StyleProp<ViewStyle>;
  maxAvatar?: number;
};

const TypingIndicatorBubble = ({ typingUsers, containerStyle, maxAvatar }: Props) => {
  const { select, palette, colors } = useUIKitTheme();

  if (typingUsers.length === 0) return null;

  return (
    <Box flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'} style={containerStyle}>
      <Avatar.Stack
        size={26}
        maxAvatar={maxAvatar}
        styles={{
          remainsTextColor: colors.onBackground02,
          remainsBackgroundColor: select({ light: palette.background100, dark: palette.background400 }),
        }}
        containerStyle={{ marginRight: 12 }}
      >
        {typingUsers.map((user, index) => (
          <Avatar key={index} uri={user.profileUrl} />
        ))}
      </Avatar.Stack>
      <TypingDots
        dotColor={select({ light: palette.background100, dark: palette.background400 })}
        backgroundColor={colors.onBackground02}
      />
    </Box>
  );
};

type TypingDotsProps = {
  dotColor: string;
  backgroundColor: string;
};
const TypingDots = ({ dotColor, backgroundColor }: TypingDotsProps) => {
  const animation = useRef(new Animated.Value(0)).current;
  const dots = matrix.map(([timeline, scale, opacity]) => [
    animation.interpolate({ inputRange: timeline, outputRange: scale, extrapolate: 'clamp' }),
    animation.interpolate({ inputRange: timeline, outputRange: opacity, extrapolate: 'clamp' }),
  ]);

  useEffect(() => {
    const animated = Animated.loop(
      Animated.timing(animation, { toValue: 1.4, duration: 1400, easing: Easing.linear, useNativeDriver: true }),
    );
    animated.start();
    return () => animated.reset();
  }, []);

  return (
    <Box
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'center'}
      borderRadius={16}
      paddingHorizontal={12}
      height={34}
      backgroundColor={dotColor}
    >
      {dots.map(([scale, opacity], index) => {
        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                marginRight: index === dots.length - 1 ? 0 : 6,
                opacity: opacity,
                transform: [{ scale: scale }],
                backgroundColor: backgroundColor,
              },
            ]}
          />
        );
      })}
    </Box>
  );
};

const matrix = [
  [
    [0.4, 0.7, 1.0],
    [1.0, 1.2, 1.0],
    [0.12, 0.38, 0.12],
  ],
  [
    [0.6, 0.9, 1.2],
    [1.0, 1.2, 1.0],
    [0.12, 0.38, 0.12],
  ],
  [
    [0.8, 1.1, 1.4],
    [1.0, 1.2, 1.0],
    [0.12, 0.38, 0.12],
  ],
];

const styles = createStyleSheet({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default TypingIndicatorBubble;
