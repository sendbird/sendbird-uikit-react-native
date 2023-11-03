import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateEvent, AppStateStatus } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

type EdgePaddingMap = {
  left: 'paddingLeft';
  right: 'paddingRight';
  top: 'paddingTop';
  bottom: 'paddingBottom';
};
const edgePaddingMap: EdgePaddingMap = {
  left: 'paddingLeft',
  right: 'paddingRight',
  top: 'paddingTop',
  bottom: 'paddingBottom',
};

export const useSafeAreaPadding = <
  T extends keyof EdgeInsets,
  Result extends { [key in EdgePaddingMap[T]]: EdgeInsets[T] },
>(
  edges: T[],
): Result => {
  const safeAreaInsets = useSafeAreaInsets();
  return edges.reduce((map, edge) => {
    const paddingKey = edgePaddingMap[edge];
    map[paddingKey] = safeAreaInsets[edge];
    return map;
  }, {} as { [key in EdgePaddingMap[T]]: EdgeInsets[T] }) as Result;
};

type AppStateListener = (status: AppStateStatus) => void;

export const useAppState = (type: AppStateEvent, listener: AppStateListener) => {
  const callbackRef = useRef<AppStateListener>(listener);
  callbackRef.current = listener;

  useEffect(() => {
    const eventListener = (state: AppStateStatus) => callbackRef.current(state);
    const subscriber = AppState.addEventListener(type, eventListener);

    return () => {
      if (subscriber?.remove) subscriber.remove();
    };
  }, []);
};

/**
 * To display a new modal in React-Native, you should ensure that a new modal is opened only after the existing modal has been dismissed to avoid conflicts.
 * To achieve this, you can use a deferred onClose that can be awaited until the onDismiss is called.
 * */
export const useDeferredModalState = () => {
  const resolveRef = useRef<(value: void) => void>();
  const [visible, setVisible] = useState(false);

  return {
    onClose: () => {
      return new Promise<void>((resolve) => {
        resolveRef.current = resolve;
        setVisible(false);
      });
    },
    onDismiss: () => {
      resolveRef.current?.();
    },
    visible,
    setVisible,
  };
};
