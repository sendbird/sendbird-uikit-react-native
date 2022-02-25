import React from 'react';
import {
  ModalProps,
  Modal as RNModal,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = { backgroundStyle?: StyleProp<ViewStyle>; onPressBackground?: () => void } & ModalProps;
const Modal: React.FC<Props> = ({ children, backgroundStyle, onPressBackground, ...props }) => {
  const { palette } = useUIKitTheme();
  return (
    <RNModal
      transparent
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
      animationType={'fade'}
      {...props}
    >
      <TouchableWithoutFeedback onPress={onPressBackground}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.onBackgroundLight03 }]} />
      </TouchableWithoutFeedback>
      <View pointerEvents={'box-none'} style={[styles.background, backgroundStyle]}>
        {children}
      </View>
    </RNModal>
  );
};

const styles = createStyleSheet({
  background: {
    flex: 1,
  },
});

export default Modal;
