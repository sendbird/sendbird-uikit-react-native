import React, { useEffect, useRef } from 'react';
import {
  ModalProps,
  Platform,
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
const Modal: React.FC<Props> = ({
  children,
  backgroundStyle,
  onPressBackground,
  onDismiss,
  visible = false,
  ...props
}) => {
  const { palette } = useUIKitTheme();

  useOnDismiss(visible, onDismiss);

  return (
    <RNModal
      transparent
      visible={visible}
      onDismiss={onDismiss}
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

// NOTE: onDismiss is supports iOS only
const useOnDismiss = (visible: boolean, onDismiss?: () => void) => {
  const prevVisibleState = useRef(false);
  useEffect(() => {
    if (Platform.OS === 'ios') return;
    if (prevVisibleState.current && !visible) onDismiss?.();
    prevVisibleState.current = visible;
  }, [visible]);
};

const styles = createStyleSheet({
  background: {
    flex: 1,
  },
});

export default Modal;
