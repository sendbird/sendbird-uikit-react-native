import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon from '../../components/Icon';
import Text from '../../components/Text';
import createStyleSheet from '../../styles/createStyleSheet';
import useUIKitTheme from '../../theme/useUIKitTheme';

type ToastType = 'normal' | 'error' | 'success';
type Context = { show(text: string, type?: ToastType): void };

const ToastContext = createContext<Context | null>(null);

type Props = React.PropsWithChildren<{
  top?: number;
  bottom?: number;
  visible: boolean;
  type: ToastType;
  children: string;
}>;

const useOpacity = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const transition = (value: number) => {
    Animated.timing(opacity, { toValue: value, duration: 500, useNativeDriver: true }).start();
  };

  return {
    opacity,
    show: () => transition(1),
    hide: () => transition(0),
  };
};

const Toast = ({ visible, type, children, top, bottom }: Props) => {
  const { colors, select, palette } = useUIKitTheme();
  const { opacity, show, hide } = useOpacity();

  const color = useMemo(() => {
    if (type === 'error') {
      return select({ dark: palette.error300, light: palette.error200 });
    }
    if (type === 'success') {
      return select({ dark: palette.secondary300, light: palette.secondary200 });
    }
    return 'transparent';
  }, [type, select]);

  const backgroundColor = useMemo(() => {
    return select({ light: 'rgba(0,0,0,0.64)', dark: 'rgba(255,255,255,0.64)' });
  }, [select]);

  useEffect(() => {
    visible ? show() : hide();
  }, [visible]);

  return (
    <Animated.View pointerEvents={'none'} style={[styles.toast, { opacity, top, bottom, backgroundColor }]}>
      {type !== 'normal' && (
        <Icon icon={type === 'success' ? 'done' : 'error'} color={color} containerStyle={styles.icon} />
      )}
      <Text color={colors.onBackgroundReverse01} body3 numberOfLines={2} style={styles.text}>
        {children}
      </Text>
    </Animated.View>
  );
};

const VISIBLE_MS = 3000;
export const ToastProvider = ({
  children,
  dismissTimeout = VISIBLE_MS,
}: React.PropsWithChildren<{ dismissTimeout?: number }>) => {
  const [state, setState] = useState({ visible: false, type: 'error' as ToastType, text: '' });
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (!state.visible) return;

    const hideTimeout = setTimeout(() => {
      setState((prev) => ({ ...prev, visible: false }));
    }, dismissTimeout);
    return () => clearTimeout(hideTimeout);
  });

  return (
    <ToastContext.Provider value={{ show: (text, type = 'normal') => text && setState({ text, type, visible: true }) }}>
      {children}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : undefined}
        keyboardVerticalOffset={-bottom}
        pointerEvents={'none'}
      >
        <Toast type={state.type} visible={state.visible} bottom={bottom + styles.toastPosition.bottom}>
          {state.text}
        </Toast>
      </KeyboardAvoidingView>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('ToastContext is not provided, wrap your app with ToastProvider');
  return context;
};

const styles = createStyleSheet({
  toast: {
    position: 'absolute',
    height: 48,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 24,
    flexDirection: 'row',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    maxWidth: 240,
    paddingHorizontal: 4,
  },
  toastPosition: {
    bottom: 60,
  },
});

export default Toast;
