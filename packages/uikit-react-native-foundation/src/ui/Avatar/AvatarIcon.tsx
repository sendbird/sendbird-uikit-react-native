import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import Icon from '../../components/Icon';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = {
  icon: keyof typeof Icon.Assets;
  size?: number;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
};
const AvatarIcon = ({ size = 56, icon, containerStyle, backgroundColor }: Props) => {
  const { colors, palette } = useUIKitTheme();
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor ?? palette.background300,
        },
        containerStyle,
      ]}
    >
      <Icon icon={icon} size={size / 2} color={colors.onBackgroundReverse01} />
    </View>
  );
};
const styles = createStyleSheet({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default AvatarIcon;
