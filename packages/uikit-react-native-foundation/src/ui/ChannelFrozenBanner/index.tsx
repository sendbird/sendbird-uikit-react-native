import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = {
  style?: StyleProp<ViewStyle>;
  text?: string;
  textColor?: string;
  backgroundColor?: string;
};

const ChannelFrozenBanner = ({ text = 'Channel is frozen', backgroundColor, textColor, style }: Props) => {
  const { palette } = useUIKitTheme();

  return (
    <View
      pointerEvents={'none'}
      style={[styles.container, { backgroundColor: backgroundColor ?? palette.information }, style]}
    >
      <Text caption2 color={textColor ?? palette.onBackgroundLight01}>
        {text}
      </Text>
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 4,
  },
});

export default ChannelFrozenBanner;
