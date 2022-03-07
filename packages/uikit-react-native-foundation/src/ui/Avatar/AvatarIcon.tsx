import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';
import Icon from '../Icon';

type Props = {
  icon: keyof typeof Icon.Assets;
  size?: number;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
};
const AvatarIcon: React.FC<Props> = ({ size = 56, icon, containerStyle, backgroundColor }) => {
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
