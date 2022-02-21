import React from 'react';
import { ModalProps, Modal as RNModal, StyleProp, View, ViewStyle } from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';

type Props = { backgroundStyle?: StyleProp<ViewStyle> } & ModalProps;
const Modal: React.FC<Props> = ({ children, backgroundStyle, ...props }) => {
  return (
    <RNModal {...props}>
      <View style={[styles.background, backgroundStyle]}>{children}</View>
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
