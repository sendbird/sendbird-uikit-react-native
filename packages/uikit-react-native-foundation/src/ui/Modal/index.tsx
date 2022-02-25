import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ModalProps,
  PanResponder,
  Platform,
  Pressable,
  Modal as RNModal,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type Props = { type?: 'slide' | 'fade'; onClose: () => void; backgroundStyle?: StyleProp<ViewStyle> } & Omit<
  ModalProps,
  'animationType' | 'onRequestClose'
>;

/**
 * Modal Open: Triggered by Modal.props.visible state changed to true
 * - visible true -> modalVisible true -> animation start
 *
 * Modal Close: Triggered by Modal.props.onClose() call
 * - Modal.props.onClose() -> visible false -> animation start -> modalVisible false
 * */
const Modal: React.FC<Props> = ({
  children,
  onClose,
  backgroundStyle,
  onDismiss,
  type = 'fade',
  visible = false,
  ...props
}) => {
  const { palette } = useUIKitTheme();
  const { content, backdrop, showTransition, hideTransition } = useModalAnimation(type);
  const panResponder = useModalPanResponder(type, content.translateY, showTransition, onClose);

  const [modalVisible, setModalVisible] = useState(false);
  const showAction = () => setModalVisible(true);
  const hideAction = () => hideTransition(() => setModalVisible(false));

  useEffect(() => {
    if (visible) showAction();
    else hideAction();
  }, [visible]);

  useOnDismiss(modalVisible, onDismiss);

  return (
    <RNModal
      transparent
      hardwareAccelerated
      visible={modalVisible}
      onRequestClose={onClose}
      onShow={() => showTransition()}
      onDismiss={onDismiss}
      supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}
      animationType={'none'}
      {...props}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: backdrop.opacity, backgroundColor: palette.onBackgroundLight03 }]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.background,
          backgroundStyle,
          { opacity: content.opacity, transform: [{ translateY: content.translateY }] },
        ]}
        pointerEvents={'box-none'}
        {...panResponder.panHandlers}
      >
        {/* NOTE: https://github.com/facebook/react-native/issues/14295 */}
        <Pressable>{children}</Pressable>
      </Animated.View>
    </RNModal>
  );
};

const useModalPanResponder = (
  type: 'slide' | 'fade',
  translateY: Animated.Value,
  show: () => void,
  hide: () => void,
) => {
  if (type === 'fade') return { panHandlers: {} };
  return React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dy }) => dy > 8,
      // @ts-ignore
      onPanResponderGrant: () => translateY.setOffset(translateY.__getValue()),
      onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, { dy, vy }) => {
        const isHideGesture = dy > 125 || (dy > 0 && vy > 0.1);
        if (isHideGesture) hide();
        else show();
      },
    }),
  ).current;
};

const useModalAnimation = (type: 'slide' | 'fade') => {
  const initialY = type === 'slide' ? Dimensions.get('window').height : 0;
  const baseAnimationVal = useRef(new Animated.Value(0)).current;
  const baseTranslateVal = useRef(new Animated.Value(initialY)).current;

  const content = {
    opacity: baseAnimationVal.interpolate({
      inputRange: [0, 1],
      outputRange: [type === 'slide' ? 1 : 0, 1],
    }),
    translateY: baseTranslateVal,
  };
  const backdrop = {
    opacity: baseAnimationVal.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  const createTransition = (toValue: 0 | 1) => {
    const config = { duration: 250, useNativeDriver: false };
    return Animated.parallel([
      Animated.timing(baseAnimationVal, { toValue, ...config }),
      Animated.timing(baseTranslateVal, { toValue: toValue === 0 ? initialY : 0, ...config }),
    ]).start;
  };
  return {
    content,
    backdrop,
    showTransition: createTransition(1),
    hideTransition: createTransition(0),
  };
};

// NOTE: onDismiss is supports iOS only
const useOnDismiss = (visible: boolean, onDismiss?: () => void) => {
  const prevVisible = usePrevProp(visible);
  useEffect(() => {
    if (Platform.OS === 'ios') return;
    if (prevVisible && !visible) onDismiss?.();
  }, [prevVisible, visible]);
};

const usePrevProp = <T,>(prop: T) => {
  const prev = useRef(prop);
  const curr = useRef(prop);
  useEffect(() => {
    prev.current = curr.current;
    curr.current = prop;
  });
  return prev.current;
};

const styles = createStyleSheet({
  background: { flex: 1 },
});

export default Modal;
