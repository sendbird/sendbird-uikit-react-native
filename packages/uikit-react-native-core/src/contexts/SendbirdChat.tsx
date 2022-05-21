import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type Sendbird from 'sendbird';

import type { SendbirdChatSDK } from '@sendbird/uikit-utils';
import { useForceUpdate } from '@sendbird/uikit-utils';

type Props = {
  sdkInstance: SendbirdChatSDK;
  autoPushTokenRegistration: boolean;
};

type Context = {
  sdk: SendbirdChatSDK;
  autoPushTokenRegistration: boolean;

  currentUser?: Sendbird.User;
  setCurrentUser: React.Dispatch<React.SetStateAction<Sendbird.User | undefined>>;
};

export const SendbirdChatContext = React.createContext<Context | null>(null);
export const SendbirdChatProvider: React.FC<Props> = ({ children, sdkInstance, autoPushTokenRegistration }) => {
  const [currentUser, setCurrentUser] = useState<Sendbird.User>();
  const forceUpdate = useForceUpdate();
  const updateCurrentUser: Context['setCurrentUser'] = useCallback((user) => {
    // NOTE: Sendbird SDK handle User object is always same object, so force update after setCurrentUser
    setCurrentUser(user);
    forceUpdate();
  }, []);

  // FIXME: MessageCollection cannot sync messages when returning from the background to foreground.
  useEffect(() => {
    const listener = (status: AppStateStatus) => {
      // 'active' | 'background' | 'inactive' | 'unknown' | 'extension';
      if (status === 'active') sdkInstance.getConnectionState() === 'CLOSED' && sdkInstance.setForegroundState();
      else sdkInstance.getConnectionState() === 'OPEN' && sdkInstance.setBackgroundState();
    };
    listener(AppState.currentState);
    const subscriber = AppState.addEventListener('change', listener);
    return () => subscriber.remove();
  }, [sdkInstance]);

  const value = { sdk: sdkInstance, currentUser, setCurrentUser: updateCurrentUser, autoPushTokenRegistration };

  return <SendbirdChatContext.Provider value={value}>{children}</SendbirdChatContext.Provider>;
};

export const useSendbirdChat = () => {
  const value = useContext(SendbirdChatContext);
  if (!value) throw new Error('SendbirdChatContext is not provided');
  return value;
};
