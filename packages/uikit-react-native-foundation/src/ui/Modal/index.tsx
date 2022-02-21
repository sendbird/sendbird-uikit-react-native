import React from 'react';
import { ModalProps, Modal as RNModal, StyleProp, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';

type Props = { backgroundStyle?: StyleProp<ViewStyle>; onPressBackground?: () => void } & ModalProps;
const Modal: React.FC<Props> = ({ children, backgroundStyle, onPressBackground, ...props }) => {
  return (
    <RNModal
      transparent
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
      animationType={'fade'}
      {...props}
    >
      <TouchableWithoutFeedback onPress={onPressBackground}>
        <View style={[styles.background, backgroundStyle]}>{children}</View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = createStyleSheet({
  background: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
});

export default Modal;
