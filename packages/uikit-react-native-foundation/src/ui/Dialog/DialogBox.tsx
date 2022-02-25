import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = {
  style?: StyleProp<ViewStyle>;
};
const DialogBox: React.FC<Props> = ({ style, children }) => {
  const { colors } = useUIKitTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.ui.dialog.default.none.background }, style]}>
      {children}
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    width: 280,
    borderRadius: 4,
  },
});

export default DialogBox;
