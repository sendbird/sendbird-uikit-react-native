import { useEffect, useRef } from 'react';
import { AppState, AppStateEvent, AppStateStatus } from 'react-native';

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
