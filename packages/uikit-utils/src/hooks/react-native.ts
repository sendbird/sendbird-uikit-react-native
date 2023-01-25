import { useEffect, useMemo, useRef } from 'react';
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
  return useMemo(() => {
    return edges.reduce((map, edge) => {
      const paddingKey = edgePaddingMap[edge];
      map[paddingKey] = safeAreaInsets[edge];
      return map;
    }, {} as { [key in EdgePaddingMap[T]]: EdgeInsets[T] });
  }, edges) as Result;
};

type AppStateListener = (status: AppStateStatus) => void;

export const useAppState = (type: AppStateEvent, listener: AppStateListener) => {
  const callbackRef = useRef<AppStateListener>(listener);
  callbackRef.current = listener;

  useEffect(() => {
    const eventListener = (state: AppStateStatus) => callbackRef.current(state);
    const subscriber = AppState.addEventListener(type, eventListener);

    return () => {
      // @ts-ignore
      if (subscriber?.remove) {
        subscriber.remove();
      }
      // @ts-ignore
      else if (AppState.removeEventListener) {
        // @ts-ignore
        AppState.removeEventListener(type, eventListener);
      }
    };
  }, []);
};
