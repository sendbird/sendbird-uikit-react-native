import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = {
  style?: StyleProp<ViewStyle>;
  space?: number;
};

const Divider = ({ style, space }: Props) => {
  const { colors } = useUIKitTheme();
  return (
    <View style={[style, styles.divider, { paddingHorizontal: space }]}>
      <View style={[styles.inner, { backgroundColor: colors.onBackground04 }]} />
    </View>
  );
};

const styles = createStyleSheet({
  divider: {
    width: '100%',
    height: 1,
  },
  inner: {
    width: '100%',
    height: '100%',
  },
});

export default Divider;
