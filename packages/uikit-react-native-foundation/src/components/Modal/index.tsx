import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  ModalProps,
  PanResponder,
  Platform,
  Pressable,
  Modal as RNModal,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

import createStyleSheet from '../../styles/createStyleSheet';
import useHeaderStyle from '../../styles/useHeaderStyle';
import useUIKitTheme from '../../theme/useUIKitTheme';

type ModalAnimationType = 'slide' | 'slide-no-gesture' | 'fade';
type Props = {
  type?: ModalAnimationType;
  onClose: () => void;
  backgroundStyle?: StyleProp<ViewStyle>;
  disableBackgroundClose?: boolean;
  enableKeyboardAvoid?: boolean;
} & Omit<ModalProps, 'animationType' | 'onRequestClose'>;

/**
 * Modal Open: Triggered by Modal.props.visible state changed to true
 * - visible true -> modalVisible true -> animation start
 *
 * Modal Close: Triggered by Modal.props.onClose() call
 * - Modal.props.onClose() -> visible false -> animation start -> modalVisible false
 * */
const Modal = ({
  children,
  onClose,
  backgroundStyle,
  onDismiss,
  type = 'fade',
  visible = false,
  disableBackgroundClose = false,
  enableKeyboardAvoid = false,
  statusBarTranslucent,
  ...props
}: Props) => {
  const { palette } = useUIKitTheme();
  const { content, backdrop, showTransition, hideTransition } = useModalAnimation(type);
  const panResponder = useModalPanResponder(type, content.translateY, showTransition, onClose);
  const { topInset } = useHeaderStyle();

  const [modalVisible, setModalVisible] = useState(false);
  const showAction = () => setModalVisible(true);
  const hideAction = () => hideTransition(() => setModalVisible(false));

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (visible) showAction();
    else hideAction();
  }, [visible]);

  useOnDismiss(modalVisible, onDismiss);

  return (
    <RNModal
      statusBarTranslucent={statusBarTranslucent}
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
      <TouchableWithoutFeedback onPress={disableBackgroundClose ? undefined : onClose}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: backdrop.opacity, backgroundColor: palette.onBackgroundLight03 }]}
        />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        // NOTE: This is trick for Android.
        //  When orientation is changed on Android, the offset that to avoid soft-keyboard is not updated normally.
        key={`${width}-${height}`}
        enabled={enableKeyboardAvoid}
        style={styles.background}
        behavior={Platform.select({ ios: 'padding', default: 'height' })}
        pointerEvents={'box-none'}
        keyboardVerticalOffset={enableKeyboardAvoid && statusBarTranslucent ? -topInset : 0}
      >
        <Animated.View
          style={[
            styles.background,
            backgroundStyle,
            { opacity: content.opacity, transform: [{ translateY: content.translateY }] },
          ]}
          pointerEvents={'box-none'}
          {...panResponder.panHandlers}
        >
          <Pressable
          // NOTE: https://github.com/facebook/react-native/issues/14295
          //  Due to 'Pressable', the width of the children must be explicitly specified as a number.
          >
            {children}
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const isHideGesture = (distanceY: number, velocityY: number) => {
  return distanceY > 125 || (distanceY > 0 && velocityY > 0.1);
};
const useModalPanResponder = (
  type: ModalAnimationType,
  translateY: Animated.Value,
  show: () => void,
  hide: () => void,
) => {
  if (type === 'fade' || type === 'slide-no-gesture') return { panHandlers: {} };
  return React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dy }) => dy > 8,
      // @ts-ignore
      onPanResponderGrant: () => translateY.setOffset(translateY.__getValue()),
      onPanResponderMove: (_, { dy }) => dy >= 0 && translateY.setValue(dy), // Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
      onPanResponderRelease: (_, { dy, vy }) => {
        if (isHideGesture(dy, vy)) hide();
        else show();
      },
    }),
  ).current;
};

const useModalAnimation = (type: ModalAnimationType) => {
  const initialY = type === 'fade' ? 0 : Dimensions.get('window').height;
  const baseAnimBackground = useRef(new Animated.Value(0)).current;
  const baseAnimContent = useRef(new Animated.Value(initialY)).current;

  const content = {
    opacity: baseAnimBackground.interpolate({
      inputRange: [0, 1],
      outputRange: [type === 'fade' ? 0 : 1, 1],
    }),
    translateY: baseAnimContent,
  };
  const backdrop = {
    opacity: baseAnimBackground.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  const createTransition = (toValue: 0 | 1) => {
    const config = { duration: 250, useNativeDriver: false };
    return Animated.parallel([
      Animated.timing(baseAnimBackground, { toValue, ...config }),
      Animated.timing(baseAnimContent, { toValue: toValue === 0 ? initialY : 0, ...config }),
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
