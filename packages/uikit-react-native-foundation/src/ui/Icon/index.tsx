import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import IconAssets from '../../assets/icon';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type IconNames = keyof typeof IconAssets;
type SizeFactor = keyof typeof sizeStyles;

type Props = {
  icon: IconNames;
  color?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};
const Icon: ((props: Props) => JSX.Element) & { Assets: typeof IconAssets } = ({
  icon,
  color,
  size = 24,
  containerStyle,
  style,
}) => {
  const sizeStyle = sizeStyles[size as SizeFactor] ?? { width: size, height: size };
  const { colors } = useUIKitTheme();
  return (
    <View style={[containerStyle, containerStyles.container]}>
      <Image
        resizeMode={'contain'}
        source={IconAssets[icon]}
        style={[{ tintColor: color ?? colors.primary }, sizeStyle, style]}
      />
    </View>
  );
};

const containerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const sizeStyles = createStyleSheet({
  16: {
    width: 16,
    height: 16,
  },
  20: {
    width: 20,
    height: 20,
  },
  24: {
    width: 24,
    height: 24,
  },
  28: {
    width: 28,
    height: 28,
  },
  32: {
    width: 32,
    height: 32,
  },
});

Icon.Assets = IconAssets;
export default Icon;
